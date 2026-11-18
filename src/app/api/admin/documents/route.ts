import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("case_documents")
    .select("*")
    .order("uploaded_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const formData = await request.formData();

  const file = formData.get("file") as File | null;
  const dossier_ref = String(formData.get("dossier_ref") || "");
  const title = String(formData.get("title") || "");
  const category = String(formData.get("category") || "pleading");

  if (!file || !dossier_ref || !title) {
    return NextResponse.json({ error: "Missing file, dossier_ref, or title" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storage_path = `${dossier_ref}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("case-documents")
    .upload(storage_path, file, { contentType: file.type || "application/octet-stream" });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("case_documents")
    .insert({
      dossier_ref,
      title,
      category,
      file_name: file.name,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
      storage_path,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}

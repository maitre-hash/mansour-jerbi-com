import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const year = new Date().getFullYear();
  const reference =
    body.reference || `DOS-${year}-${String(Math.floor(100 + Math.random() * 900))}`;

  const { data, error } = await supabase
    .from("dossiers")
    .insert({
      reference,
      client_id: body.client_id || null,
      client_name: body.client_name,
      title: body.title,
      practice_area: body.practice_area,
      court: body.court,
      opposing_party: body.opposing_party || "",
      status: body.status || "open",
      notes: body.notes || "",
      opened_on: body.opened_on || new Date().toISOString().slice(0, 10),
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing dossier id" }, { status: 400 });

  const { data, error } = await supabase
    .from("dossiers")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

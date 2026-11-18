import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const {
    full_name,
    national_id_or_tax = "",
    phone,
    email = "",
    city = "Ras Jebel, Bizerte",
    preferred_locale = "fr",
    confidential_notes = "",
  } = body;

  if (!full_name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      full_name,
      national_id_or_tax,
      phone,
      email,
      city,
      preferred_locale,
      confidential_notes,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}

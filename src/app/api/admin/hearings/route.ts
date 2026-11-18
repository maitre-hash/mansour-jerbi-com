import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("hearings")
    .select("*")
    .order("scheduled_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const { data, error } = await supabase
    .from("hearings")
    .insert({
      dossier_id: body.dossier_id || null,
      dossier_ref: body.dossier_ref,
      hearing_type: body.hearing_type || "audience",
      court: body.court,
      chamber: body.chamber || "",
      scheduled_at: body.scheduled_at,
      action_required: body.action_required,
      priority: body.priority || "normal",
      completed: false,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const { id, completed } = body;
  const { data, error } = await supabase
    .from("hearings")
    .update({ completed: Boolean(completed) })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

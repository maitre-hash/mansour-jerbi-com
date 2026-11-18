import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `RDV-${year}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      client_name,
      phone,
      email = "",
      preferred_locale = "fr",
      practice_area,
      consultation_mode = "in_office",
      preferred_date,
      preferred_slot,
      subject,
    } = body;

    if (!client_name || !phone || !practice_area || !preferred_date || !preferred_slot || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking_ref = generateBookingRef();
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("appointments").insert({
      booking_ref,
      client_name: String(client_name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      preferred_locale,
      practice_area,
      consultation_mode,
      preferred_date,
      preferred_slot,
      subject: String(subject).trim(),
      status: "pending",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, booking_ref }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, status, preferred_date, preferred_slot, internal_notes } = body;
  if (!id) return NextResponse.json({ error: "Missing appointment id" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (preferred_date) updates.preferred_date = preferred_date;
  if (preferred_slot) updates.preferred_slot = preferred_slot;
  if (typeof internal_notes === "string") updates.internal_notes = internal_notes;

  const { data, error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

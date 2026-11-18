import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();

  const year = new Date().getFullYear();
  const invoice_number =
    body.invoice_number || `HON-${year}-${String(Math.floor(100 + Math.random() * 900))}`;

  const amount_ht = Number(body.amount_ht || 0);
  const vat_rate = Number(body.vat_rate ?? 19);
  const stamp_duty = Number(body.stamp_duty ?? 1.0);
  const amount_ttc = Number((amount_ht * (1 + vat_rate / 100) + stamp_duty).toFixed(3));
  const amount_paid = Number(body.amount_paid || 0);
  const status =
    amount_paid >= amount_ttc ? "paid" : amount_paid > 0 ? "partial" : "unpaid";

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      invoice_number,
      dossier_ref: body.dossier_ref || "",
      client_name: body.client_name,
      description: body.description,
      amount_ht,
      vat_rate,
      stamp_duty,
      amount_ttc,
      amount_paid,
      status,
      issued_on: body.issued_on || new Date().toISOString().slice(0, 10),
      due_on: body.due_on || null,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await request.json();
  const { id, amount_paid, amount_ttc } = body;

  const paid = Number(amount_paid || 0);
  const total = Number(amount_ttc || 0);
  const status = paid >= total ? "paid" : paid > 0 ? "partial" : "unpaid";

  const { data, error } = await supabase
    .from("invoices")
    .update({ amount_paid: paid, status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

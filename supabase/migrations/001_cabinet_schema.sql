-- ============================================================================
-- Cabinet Maître Mansour Jerbi (mansour-jerbi.com)
-- Supabase PostgreSQL Schema, Row-Level Security (RLS) & Storage Policies
-- Run in Supabase SQL Editor or via `supabase db push`
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Clients Directory
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  national_id_or_tax text default '',          -- CIN or Matricule Fiscal
  phone text not null,
  email text default '',
  city text default 'Ras Jebel, Bizerte',
  preferred_locale text default 'fr' check (preferred_locale in ('fr', 'ar', 'en')),
  confidential_notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Legal Cases / Dossiers
create table if not exists public.dossiers (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,              -- e.g. DOS-2026-001
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  title text not null,
  practice_area text not null,
  court text not null,                         -- e.g. Tribunal de Première Instance de Bizerte
  opposing_party text default '',
  status text not null default 'open' check (status in ('open', 'instruction', 'pleading', 'deliberation', 'closed')),
  notes text default '',
  opened_on date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Online & Walk-in Appointments / Consultations
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique,            -- e.g. RDV-2026-4821
  client_name text not null,
  phone text not null,
  email text default '',
  preferred_locale text not null default 'fr' check (preferred_locale in ('fr', 'ar', 'en')),
  practice_area text not null,
  consultation_mode text not null default 'in_office' check (consultation_mode in ('in_office', 'phone_video', 'urgent')),
  preferred_date date not null,
  preferred_slot text not null,
  subject text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled')),
  internal_notes text default '',
  created_at timestamptz not null default now()
);

-- 4. Court Hearings (Audiences) & Procedural Deadlines
create table if not exists public.hearings (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references public.dossiers(id) on delete cascade,
  dossier_ref text not null,
  hearing_type text not null default 'audience' check (hearing_type in ('audience', 'deadline', 'expertise', 'signature')),
  court text not null,
  chamber text default '',
  scheduled_at timestamptz not null,
  action_required text not null,
  priority text not null default 'normal' check (priority in ('normal', 'high', 'urgent')),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- 5. Case Document Vault (linked to Supabase Storage bucket `case-documents`)
create table if not exists public.case_documents (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references public.dossiers(id) on delete cascade,
  dossier_ref text not null,
  title text not null,
  category text not null default 'pleading' check (category in ('pleading', 'contract', 'judgment', 'identity', 'evidence', 'correspondence')),
  file_name text not null,
  mime_type text not null default 'application/pdf',
  size_bytes bigint not null default 0,
  storage_path text not null,
  uploaded_at timestamptz not null default now()
);

-- 6. Billing & Honoraires (TND — Tunisian Dinar, TVA 19%, Timbre Fiscal)
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,         -- e.g. HON-2026-014
  dossier_id uuid references public.dossiers(id) on delete set null,
  dossier_ref text default '',
  client_name text not null,
  description text not null,
  amount_ht numeric(12, 3) not null,           -- TND has 3 decimal places (millimes)
  vat_rate numeric(5, 2) not null default 19.00,
  stamp_duty numeric(6, 3) not null default 1.000,
  amount_ttc numeric(12, 3) not null,
  amount_paid numeric(12, 3) not null default 0.000,
  status text not null default 'unpaid' check (status in ('unpaid', 'partial', 'paid')),
  issued_on date not null default current_date,
  due_on date,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) on all tables
alter table public.clients enable row level security;
alter table public.dossiers enable row level security;
alter table public.appointments enable row level security;
alter table public.hearings enable row level security;
alter table public.case_documents enable row level security;
alter table public.invoices enable row level security;

-- Public visitors can ONLY insert appointment requests (cannot read others' bookings)
create policy "Public can submit appointment requests"
  on public.appointments
  for insert
  to anon
  with check (status = 'pending');

-- Authenticated staff (Supabase Auth users in the Cabinet) get full access
create policy "Cabinet staff full access on clients"
  on public.clients for all to authenticated using (true) with check (true);

create policy "Cabinet staff full access on dossiers"
  on public.dossiers for all to authenticated using (true) with check (true);

create policy "Cabinet staff full access on appointments"
  on public.appointments for all to authenticated using (true) with check (true);

create policy "Cabinet staff full access on hearings"
  on public.hearings for all to authenticated using (true) with check (true);

create policy "Cabinet staff full access on case_documents"
  on public.case_documents for all to authenticated using (true) with check (true);

create policy "Cabinet staff full access on invoices"
  on public.invoices for all to authenticated using (true) with check (true);

-- Private Storage Bucket for Legal Documents
insert into storage.buckets (id, name, public)
values ('case-documents', 'case-documents', false)
on conflict (id) do nothing;

create policy "Cabinet staff can manage case documents in storage"
  on storage.objects for all to authenticated
  using (bucket_id = 'case-documents')
  with check (bucket_id = 'case-documents');

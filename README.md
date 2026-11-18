# Cabinet Maître Mansour Jerbi — `mansour-jerbi.com`

Full-stack trilingual website (**Français · العربية RTL · English**), Law Office Back-Office Portal (`/admin`), and future AI Avatar architecture built with **Next.js 15 (App Router + TypeScript)** and **Supabase (PostgreSQL + Auth + Storage)** for deployment on **Vercel**.

---

## 1. Included Capabilities

### Public Website (`/`)
- **Trilingual Switcher (`FR` / `العربية` / `EN`)** with full right-to-left (`dir="rtl"`) layout and BiDi phone/reference isolation.
- **Firm Overview & Bar Credentials**: Presentation of Maître Mansour Jerbi (Avenue Habib Bourguiba, 7070 Ras Jebel, Bizerte, Tunisia).
- **6 Legal Practice Areas**: Civil, Real Estate & Land Registry (CPF), Commercial & Corporate, Family & Inheritance (including Expatriates/TRE), Criminal Defense, and Labor/Administrative Law.
- **Online Consultation Booking**: Submits directly into the `appointments` database table and returns a unique `RDV-YYYY-XXXX` reference.
- **Legal Insights & Client FAQ**: Tunisian-law briefing notes + interactive FAQ accordion.
- **Direct Contact & Maps**: One-click landline, mobile, WhatsApp, email, and Google Maps directions.
- **Future AI Avatar Slot (`AvatarDrawer` + `/api/avatar/session`)**: Ready-to-wire floating assistant with an isolated server-side session token endpoint so API keys never touch browser code.

### Law Office Back-Office (`/admin`)
- **Protected by Supabase Auth** (`src/middleware.ts` + PostgreSQL Row-Level Security).
- **Appointments & Consultations**: Confirm, reschedule, or close online website requests.
- **Client Directory**: Contact records, CIN / Matricule Fiscal, and confidential notes.
- **Dossiers / Case Tracking**: Reference codes (`DOS-YYYY-XXX`), Tunisian courts, opposing party, and procedural status.
- **Court Hearings (`Rôle d'Audiences`)**: Upcoming court dates, chambers, required filings, and completion tracking.
- **Case Document Vault**: Uploads PDFs/scans per dossier into the private Supabase Storage bucket `case-documents`.
- **Billing & Honoraires (`TND`)**: Calculates Tunisian Dinar (`3` decimals), TVA (`19%`), and `Droit de Timbre Fiscal` (`1.000 TND`) with a one-click printable **Note d'Honoraires**.

---

## 2. Going Live on Vercel + Supabase (`mansour-jerbi.com`)

### Step A — Set up Supabase (5 minutes)
1. Create a new project at https://supabase.com/dashboard (choose **EU Central / Frankfurt** or **EU West / Paris** for lowest latency to Tunisia).
2. Open **SQL Editor** → paste the contents of `supabase/migrations/001_cabinet_schema.sql` → click **Run**.
3. Open **Authentication → Users** → click **Add User → Create New User** to create Maître Mansour Jerbi's admin login (`email` + `password`).
4. Open **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step B — Deploy to Vercel (3 minutes)
1. Push this folder to a private GitHub repository.
2. Import the repository at https://vercel.com/new.
3. Add the environment variables from `.env.example` (`NEXT_PUBLIC_SITE_URL=https://mansour-jerbi.com`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Click **Deploy**.

### Step C — Connect `mansour-jerbi.com` DNS
In **Vercel → Project → Settings → Domains**, add `mansour-jerbi.com` and `www.mansour-jerbi.com`, then set these records at your domain registrar:

| Type | Host / Name | Value |
| :--- | :--- | :--- |
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Vercel automatically provisions and renews the HTTPS SSL certificate.

---

## 3. Customizing Firm Content
Edit `src/config/cabinet.ts` to update phone numbers, office hours, biography paragraphs, practice areas, or articles across French, Arabic, and English in one place.

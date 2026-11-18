import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { CABINET_CONTACT, DICTIONARIES } from "../src/config/cabinetData.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const CSS_PATH = path.join(ROOT_DIR, "src", "app", "globals.css");
const PORT = Number(process.env.PORT || 3400);

// Initialize SQLite database mirroring Supabase PostgreSQL schema
const db = new DatabaseSync(path.join(DATA_DIR, "cabinet.sqlite"));
db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    national_id_or_tax TEXT DEFAULT '',
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    city TEXT DEFAULT 'Ras Jebel, Bizerte',
    preferred_locale TEXT DEFAULT 'fr',
    confidential_notes TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dossiers (
    id TEXT PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    client_id TEXT,
    client_name TEXT NOT NULL,
    title TEXT NOT NULL,
    practice_area TEXT NOT NULL,
    court TEXT NOT NULL,
    opposing_party TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open',
    notes TEXT DEFAULT '',
    opened_on TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    booking_ref TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    preferred_locale TEXT NOT NULL DEFAULT 'fr',
    practice_area TEXT NOT NULL,
    consultation_mode TEXT NOT NULL DEFAULT 'in_office',
    preferred_date TEXT NOT NULL,
    preferred_slot TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    internal_notes TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS hearings (
    id TEXT PRIMARY KEY,
    dossier_id TEXT,
    dossier_ref TEXT NOT NULL,
    hearing_type TEXT NOT NULL DEFAULT 'audience',
    court TEXT NOT NULL,
    chamber TEXT DEFAULT '',
    scheduled_at TEXT NOT NULL,
    action_required TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS case_documents (
    id TEXT PRIMARY KEY,
    dossier_ref TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'pleading',
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    size_bytes INTEGER NOT NULL DEFAULT 0,
    storage_path TEXT NOT NULL,
    uploaded_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT NOT NULL UNIQUE,
    dossier_ref TEXT DEFAULT '',
    client_name TEXT NOT NULL,
    description TEXT NOT NULL,
    amount_ht REAL NOT NULL,
    vat_rate REAL NOT NULL DEFAULT 19.0,
    stamp_duty REAL NOT NULL DEFAULT 1.0,
    amount_ttc REAL NOT NULL,
    amount_paid REAL NOT NULL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'unpaid',
    issued_on TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

// Seed realistic initial records if empty
const existingClients = db.prepare("SELECT COUNT(*) AS cnt FROM clients").get();
if (existingClients.cnt === 0) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO clients (id, full_name, national_id_or_tax, phone, email, city, preferred_locale, confidential_notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "Société Méditerranée Agro SARL",
    "MF 1482910/A/M/000",
    "+216 72 440 118",
    "direction@med-agro.tn",
    "Bizerte",
    "fr",
    "Contrat annuel de conseil commercial et recouvrement.",
    now
  );
  db.prepare(
    `INSERT INTO clients (id, full_name, national_id_or_tax, phone, email, city, preferred_locale, confidential_notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "Karim Ben Salah (Résident à Paris)",
    "CIN 07419283",
    "+33 6 42 18 90 11",
    "k.bensalah@example.fr",
    "Paris / Ras Jebel",
    "fr",
    "Sortie d'indivision successorale et immatriculation foncière à Ras Jebel.",
    now
  );

  db.prepare(
    `INSERT INTO dossiers (id, reference, client_name, title, practice_area, court, opposing_party, status, notes, opened_on, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "DOS-2026-101",
    "Karim Ben Salah",
    "Immatriculation & partage terrain agricole Ras Jebel",
    "Droit Foncier & Immobilier",
    "Tribunal Immobilier — Bizerte / Tunis",
    "Consorts Ben Salah",
    "instruction",
    "Plan topographique déposé, attente rapport d'expertise foncière.",
    "2026-10-04",
    now
  );
  db.prepare(
    `INSERT INTO dossiers (id, reference, client_name, title, practice_area, court, opposing_party, status, notes, opened_on, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "DOS-2026-102",
    "Société Méditerranée Agro SARL",
    "Recouvrement créance commerciale & injonction de payer",
    "Droit Commercial & Sociétés",
    "Tribunal de Première Instance de Bizerte",
    "STE Nord Distribution",
    "pleading",
    "Mise en demeure notifiée par huissier notaire; conclusions prêtes.",
    "2026-10-22",
    now
  );

  db.prepare(
    `INSERT INTO appointments (id, booking_ref, client_name, phone, email, preferred_locale, practice_area, consultation_mode, preferred_date, preferred_slot, subject, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "RDV-2026-4812",
    "Sami Trabelsi",
    "+216 98 612 340",
    "sami.trabelsi@example.com",
    "fr",
    "Droit Foncier & Immobilier",
    "in_office",
    "2026-11-23",
    "10:00",
    "Vérification juridique d'une promesse de vente d'un lotissement à Ras Jebel.",
    "pending",
    now
  );
  db.prepare(
    `INSERT INTO appointments (id, booking_ref, client_name, phone, email, preferred_locale, practice_area, consultation_mode, preferred_date, preferred_slot, subject, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "RDV-2026-4819",
    "أميرة الغربي (Amira Gharbi)",
    "+216 55 309 811",
    "amira.g@example.com",
    "ar",
    "الأحوال الشخصية والأسرة والميراث",
    "phone_video",
    "2026-11-24",
    "14:30",
    "استشارة عن بُعد حول إجراءات إكساء حكم أجنبي بالصيغة التنفيذية بتونس.",
    "confirmed",
    now
  );

  db.prepare(
    `INSERT INTO hearings (id, dossier_ref, hearing_type, court, chamber, scheduled_at, action_required, priority, completed, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "DOS-2026-102",
    "audience",
    "Tribunal de Première Instance de Bizerte",
    "Chambre Commerciale",
    "2026-11-25T09:30",
    "Dépôt des conclusions récapitulatives et pièces justificatives de livraison",
    "high",
    0,
    now
  );
  db.prepare(
    `INSERT INTO hearings (id, dossier_ref, hearing_type, court, chamber, scheduled_at, action_required, priority, completed, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "DOS-2026-101",
    "expertise",
    "Tribunal Immobilier — Bizerte / Tunis",
    "Juge Rapporteur",
    "2026-12-02T10:00",
    "Transport sur les lieux avec l'expert géomètre à Ras Jebel",
    "normal",
    0,
    now
  );

  db.prepare(
    `INSERT INTO case_documents (id, dossier_ref, title, category, file_name, mime_type, size_bytes, storage_path, uploaded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "DOS-2026-101",
    "Certificat de propriété CPF & Plan topographique",
    "evidence",
    "certificat_cpf_ras_jebel.pdf",
    "application/pdf",
    248900,
    "seed/certificat_cpf_ras_jebel.pdf",
    now
  );

  db.prepare(
    `INSERT INTO invoices (id, invoice_number, dossier_ref, client_name, description, amount_ht, vat_rate, stamp_duty, amount_ttc, amount_paid, status, issued_on, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "HON-2026-041",
    "DOS-2026-102",
    "Société Méditerranée Agro SARL",
    "Honoraires de constitution et procédure d'injonction de payer",
    1200.0,
    19.0,
    1.0,
    1429.0,
    1429.0,
    "paid",
    "2026-10-25",
    now
  );
  db.prepare(
    `INSERT INTO invoices (id, invoice_number, dossier_ref, client_name, description, amount_ht, vat_rate, stamp_duty, amount_ttc, amount_paid, status, issued_on, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    crypto.randomUUID(),
    "HON-2026-042",
    "DOS-2026-101",
    "Karim Ben Salah",
    "Provision sur honoraires — Requête d'immatriculation foncière et suivi d'expertise",
    1500.0,
    19.0,
    1.0,
    1786.0,
    800.0,
    "partial",
    "2026-11-05",
    now
  );
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx > 0) {
      out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
    }
  });
  return out;
}

function isStaffAuthenticated(req) {
  const cookies = parseCookies(req);
  return cookies.cabinet_staff === "authenticated";
}

function renderPublicHtml() {
  const bootstrapJson = JSON.stringify({ CABINET_CONTACT, DICTIONARIES }).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cabinet Maître Mansour Jerbi | Avocat — Ras Jebel, Bizerte, Tunisie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/globals.css" />
</head>
<body>
  <div id="app"></div>
  <script id="cabinet-data" type="application/json">${bootstrapJson}</script>
  <script type="module">
    const { CABINET_CONTACT, DICTIONARIES } = JSON.parse(document.getElementById("cabinet-data").textContent);
    const state = {
      locale: localStorage.getItem("mj_locale") || "fr",
      openFaq: 0,
      activeArticle: null,
      avatarOpen: false,
      avatarReply: null,
      avatarStatus: null,
      bookingRef: null,
      bookingError: null,
      submitting: false,
    };

    function escapeHtml(str) {
      return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function formatDate(iso, locale) {
      const bcp = locale === "ar" ? "ar-TN" : locale === "fr" ? "fr-TN" : "en-GB";
      return new Intl.DateTimeFormat(bcp, { year: "numeric", month: "short", day: "numeric" }).format(new Date(iso));
    }

    function render() {
      const t = DICTIONARIES[state.locale];
      document.documentElement.lang = state.locale;
      document.documentElement.dir = t.dir;

      const app = document.getElementById("app");
      app.innerHTML = \`
        <div dir="\${t.dir}">
          <div class="topbar">
            <div class="container topbar-inner">
              <span>⚖️ \${escapeHtml(t.barBadge)}</span>
              <div style="display:flex;gap:1.25rem;flex-wrap:wrap;">
                <span>📍 \${escapeHtml(CABINET_CONTACT.address[state.locale])}</span>
                <a href="tel:+21672447544" class="ltr-inline">\${escapeHtml(CABINET_CONTACT.phoneLandline)}</a>
              </div>
            </div>
          </div>

          <header class="site-header">
            <div class="container header-inner">
              <a href="#" class="brand">
                <div class="monogram">MJ</div>
                <div>
                  <span class="brand-title">\${escapeHtml(t.attorneyName)}</span>
                  <span class="brand-subtitle">\${escapeHtml(t.cabinetTitle)}</span>
                </div>
              </a>

              <nav class="nav-links">
                <a href="#about" class="nav-link">\${escapeHtml(t.nav.about)}</a>
                <a href="#practices" class="nav-link">\${escapeHtml(t.nav.practices)}</a>
                <a href="#insights" class="nav-link">\${escapeHtml(t.nav.insights)}</a>
                <a href="#faq" class="nav-link">\${escapeHtml(t.nav.faq)}</a>
                <a href="#contact" class="nav-link">\${escapeHtml(t.nav.contact)}</a>
              </nav>

              <div class="header-actions">
                <div class="lang-switcher">
                  \${["fr", "ar", "en"].map((code) => \`
                    <button type="button" data-lang="\${code}" class="lang-btn \${state.locale === code ? "active" : ""}">
                      \${code === "ar" ? "العربية" : code.toUpperCase()}
                    </button>
                  \`).join("")}
                </div>
                <a href="#booking" class="btn btn-gold btn-sm">\${escapeHtml(t.nav.bookCta)}</a>
                <a href="/admin" class="btn btn-outline-light btn-sm">\${escapeHtml(t.nav.staffPortal)}</a>
              </div>
            </div>
          </header>

          <section class="hero">
            <div class="container hero-grid">
              <div>
                <span class="eyebrow">\${escapeHtml(t.hero.eyebrow)}</span>
                <h1>\${escapeHtml(t.hero.headline)}</h1>
                <p class="hero-lead">\${escapeHtml(t.hero.subheadline)}</p>
                <div class="hero-cta-row">
                  <a href="#booking" class="btn btn-gold">\${escapeHtml(t.hero.primaryCta)}</a>
                  <a href="#practices" class="btn btn-outline-light">\${escapeHtml(t.hero.secondaryCta)}</a>
                </div>
                <div class="pillars-row">
                  \${t.hero.pillars.map((p) => \`
                    <div>
                      <span class="pillar-label">\${escapeHtml(p.label)}</span>
                      <span class="pillar-value">\${escapeHtml(p.value)}</span>
                    </div>
                  \`).join("")}
                </div>
              </div>

              <div class="crest-card">
                <div class="crest-seal">⚖️</div>
                <h2 style="color:#fff;font-size:1.65rem;margin-bottom:0.35rem;">\${escapeHtml(t.attorneyName)}</h2>
                <p style="color:var(--gold-400);margin-top:0;font-weight:600;">\${escapeHtml(t.cabinetTitle)}</p>
                <p style="color:rgba(255,255,255,0.82);font-size:0.94rem;">\${escapeHtml(CABINET_CONTACT.address[state.locale])}</p>
                <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:1rem;margin-top:1rem;display:grid;gap:0.45rem;font-size:0.9rem;">
                  <div>☎ <span class="ltr-inline">\${escapeHtml(CABINET_CONTACT.phoneLandline)}</span></div>
                  <div>📱 <span class="ltr-inline">\${escapeHtml(CABINET_CONTACT.phoneMobile)}</span></div>
                  <div>✉ <span class="ltr-inline">\${escapeHtml(CABINET_CONTACT.email)}</span></div>
                </div>
              </div>
            </div>
          </section>

          <section id="about" class="section">
            <div class="container two-col">
              <div>
                <span class="section-tag">\${escapeHtml(t.about.sectionTag)}</span>
                <h2 style="font-size:2.2rem;color:var(--navy-900);">\${escapeHtml(t.about.heading)}</h2>
                \${t.about.paragraphs.map((p) => \`<p style="color:var(--ink-700);font-size:1.02rem;">\${escapeHtml(p)}</p>\`).join("")}
                <div class="three-grid" style="margin-top:2rem;">
                  \${t.about.values.map((v) => \`
                    <div class="card" style="padding:1.25rem;">
                      <h3 style="font-size:1.1rem;color:var(--navy-900);margin-bottom:0.4rem;">\${escapeHtml(v.title)}</h3>
                      <p style="margin:0;font-size:0.88rem;color:var(--ink-700);">\${escapeHtml(v.text)}</p>
                    </div>
                  \`).join("")}
                </div>
              </div>
              <div class="card card-accent">
                <h3 style="font-size:1.35rem;color:var(--navy-900);margin-bottom:1.1rem;">\${escapeHtml(t.about.credentialsTitle)}</h3>
                <ul class="check-list">
                  \${t.about.credentials.map((c) => \`<li>\${escapeHtml(c)}</li>\`).join("")}
                </ul>
              </div>
            </div>
          </section>

          <section id="practices" class="section section-alt">
            <div class="container">
              <div class="section-header">
                <span class="section-tag">\${escapeHtml(t.practicesSection.sectionTag)}</span>
                <h2>\${escapeHtml(t.practicesSection.heading)}</h2>
                <p>\${escapeHtml(t.practicesSection.intro)}</p>
              </div>
              <div class="three-grid">
                \${t.practicesSection.items.map((area) => \`
                  <article class="card card-accent">
                    <div class="practice-icon">\${area.icon}</div>
                    <h3 style="font-size:1.3rem;color:var(--navy-900);margin-bottom:0.45rem;">\${escapeHtml(area.title)}</h3>
                    <p style="color:var(--ink-700);font-size:0.92rem;margin-bottom:1rem;">\${escapeHtml(area.summary)}</p>
                    <ul class="check-list">
                      \${area.bullets.map((b) => \`<li>\${escapeHtml(b)}</li>\`).join("")}
                    </ul>
                  </article>
                \`).join("")}
              </div>
            </div>
          </section>

          <section id="booking" class="section">
            <div class="container two-col">
              <div>
                <span class="section-tag">\${escapeHtml(t.booking.sectionTag)}</span>
                <h2 style="font-size:2.2rem;color:var(--navy-900);">\${escapeHtml(t.booking.heading)}</h2>
                <p style="color:var(--ink-700);margin-bottom:1.5rem;">\${escapeHtml(t.booking.subtitle)}</p>
                <div class="card" style="background:var(--ivory-100);">
                  <h3 style="font-size:1.15rem;margin-bottom:0.6rem;">\${escapeHtml(t.contactSection.hoursTitle)}</h3>
                  \${t.contactSection.hoursLines.map((l) => \`<div style="font-size:0.93rem;color:var(--ink-700);">\${escapeHtml(l)}</div>\`).join("")}
                  <hr style="border:none;border-top:1px solid var(--border-subtle);margin:1rem 0;" />
                  <p style="margin:0;font-size:0.86rem;color:var(--ink-500);">🔒 \${escapeHtml(t.booking.fields.confidentialityNote)}</p>
                </div>
              </div>

              <div class="card card-accent">
                \${state.bookingRef ? \`
                  <div style="text-align:center;padding:1.5rem 0.5rem;">
                    <div style="font-size:2.4rem;margin-bottom:0.5rem;">✅</div>
                    <h3 style="font-size:1.45rem;color:var(--navy-900);">\${escapeHtml(t.booking.confirmationTitle)}</h3>
                    <p style="color:var(--ink-700);">\${escapeHtml(t.booking.confirmationText)}</p>
                    <div class="ltr-inline" style="background:var(--gold-100);border:1px solid var(--gold-500);padding:0.65rem 1.25rem;border-radius:var(--radius-sm);font-weight:700;font-size:1.15rem;color:var(--navy-900);margin-bottom:1.25rem;">
                      \${escapeHtml(state.bookingRef)}
                    </div>
                    <div>
                      <button type="button" id="reset-booking-btn" class="btn btn-ghost btn-sm">Nouvelle demande</button>
                      <a href="/admin" class="btn btn-navy btn-sm" style="margin-inline-start:0.5rem;">Voir dans l'Espace Cabinet →</a>
                    </div>
                  </div>
                \` : \`
                  <form id="booking-form" class="form-grid">
                    <div class="field">
                      <label>\${escapeHtml(t.booking.fields.name)} *</label>
                      <input name="client_name" required />
                    </div>
                    <div class="field">
                      <label>\${escapeHtml(t.booking.fields.phone)} *</label>
                      <input name="phone" dir="ltr" placeholder="+216 ..." required />
                    </div>
                    <div class="field">
                      <label>\${escapeHtml(t.booking.fields.email)}</label>
                      <input name="email" type="email" dir="ltr" />
                    </div>
                    <div class="field">
                      <label>\${escapeHtml(t.booking.fields.practice)} *</label>
                      <select name="practice_area">
                        \${t.practicesSection.items.map((i) => \`<option value="\${escapeHtml(i.title)}">\${escapeHtml(i.title)}</option>\`).join("")}
                      </select>
                    </div>
                    <div class="field form-full">
                      <label>\${escapeHtml(t.booking.fields.mode)} *</label>
                      <select name="consultation_mode">
                        <option value="in_office">\${escapeHtml(t.booking.fields.modes.in_office)}</option>
                        <option value="phone_video">\${escapeHtml(t.booking.fields.modes.phone_video)}</option>
                        <option value="urgent">\${escapeHtml(t.booking.fields.modes.urgent)}</option>
                      </select>
                    </div>
                    <div class="field">
                      <label>\${escapeHtml(t.booking.fields.date)} *</label>
                      <input name="preferred_date" type="date" required value="2026-11-26" />
                    </div>
                    <div class="field">
                      <label>\${escapeHtml(t.booking.fields.slot)} *</label>
                      <select name="preferred_slot">
                        \${CABINET_CONTACT.timeSlots.map((s) => \`<option value="\${s}">\${s}</option>\`).join("")}
                      </select>
                    </div>
                    <div class="field form-full">
                      <label>\${escapeHtml(t.booking.fields.subject)} *</label>
                      <textarea name="subject" rows="4" required placeholder="\${escapeHtml(t.booking.fields.subjectPlaceholder)}"></textarea>
                    </div>
                    \${state.bookingError ? \`<div class="form-full" style="color:var(--danger);font-size:0.88rem;">\${escapeHtml(state.bookingError)}</div>\` : ""}
                    <div class="form-full">
                      <button type="submit" class="btn btn-gold" style="width:100%;">\${escapeHtml(t.booking.fields.submit)}</button>
                    </div>
                  </form>
                \`}
              </div>
            </div>
          </section>

          <section id="insights" class="section section-alt">
            <div class="container">
              <div class="section-header">
                <span class="section-tag">\${escapeHtml(t.insightsSection.sectionTag)}</span>
                <h2>\${escapeHtml(t.insightsSection.heading)}</h2>
                <p>\${escapeHtml(t.insightsSection.subtitle)}</p>
              </div>
              <div class="three-grid">
                \${t.insightsSection.articles.map((art, idx) => \`
                  <article class="card" style="display:flex;flex-direction:column;">
                    <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--gold-600);font-weight:600;margin-bottom:0.55rem;">
                      <span>\${escapeHtml(art.category)}</span>
                      <span>\${escapeHtml(formatDate(art.publishedIso, state.locale))}</span>
                    </div>
                    <h3 style="font-size:1.22rem;color:var(--navy-900);margin-bottom:0.6rem;">\${escapeHtml(art.title)}</h3>
                    <p style="color:var(--ink-700);font-size:0.92rem;flex-grow:1;">\${escapeHtml(art.excerpt)}</p>
                    <button type="button" data-article="\${idx}" class="btn btn-ghost btn-sm" style="align-self:flex-start;margin-top:0.75rem;">
                      \${escapeHtml(t.insightsSection.readMore)} →
                    </button>
                  </article>
                \`).join("")}
              </div>
            </div>
          </section>

          <section id="faq" class="section">
            <div class="container" style="max-width:860px;">
              <div class="section-header">
                <span class="section-tag">\${escapeHtml(t.faqSection.sectionTag)}</span>
                <h2>\${escapeHtml(t.faqSection.heading)}</h2>
              </div>
              <div class="faq-list">
                \${t.faqSection.items.map((item, idx) => \`
                  <div class="faq-item">
                    <button type="button" data-faq="\${idx}" class="faq-trigger">
                      <span>\${escapeHtml(item.question)}</span>
                      <span style="color:var(--gold-600);font-size:1.2rem;">\${state.openFaq === idx ? "−" : "+"}</span>
                    </button>
                    \${state.openFaq === idx ? \`<div class="faq-answer">\${escapeHtml(item.answer)}</div>\` : ""}
                  </div>
                \`).join("")}
              </div>
            </div>
          </section>

          <section id="contact" class="section section-alt">
            <div class="container two-col">
              <div>
                <span class="section-tag">\${escapeHtml(t.contactSection.sectionTag)}</span>
                <h2 style="font-size:2.1rem;color:var(--navy-900);">\${escapeHtml(t.contactSection.heading)}</h2>
                <p style="font-size:1.05rem;color:var(--ink-700);">📍 \${escapeHtml(CABINET_CONTACT.address[state.locale])}</p>
                <div style="display:grid;gap:0.85rem;margin-block:1.5rem;">
                  <div class="card" style="padding:1rem 1.25rem;">
                    <strong>\${escapeHtml(t.contactSection.phoneLabel)}: </strong>
                    <a href="tel:+21672447544" class="ltr-inline">\${escapeHtml(CABINET_CONTACT.phoneLandline)}</a>
                  </div>
                  <div class="card" style="padding:1rem 1.25rem;">
                    <strong>\${escapeHtml(t.contactSection.mobileLabel)}: </strong>
                    <a href="tel:+21698317712" class="ltr-inline">\${escapeHtml(CABINET_CONTACT.phoneMobile)}</a>
                  </div>
                  <div class="card" style="padding:1rem 1.25rem;">
                    <strong>\${escapeHtml(t.contactSection.emailLabel)}: </strong>
                    <a href="mailto:\${escapeHtml(CABINET_CONTACT.email)}" class="ltr-inline">\${escapeHtml(CABINET_CONTACT.email)}</a>
                  </div>
                </div>
                <div style="display:flex;gap:0.85rem;flex-wrap:wrap;">
                  <a href="https://wa.me/\${CABINET_CONTACT.whatsappE164}" target="_blank" rel="noreferrer" class="btn btn-gold">
                    💬 \${escapeHtml(t.contactSection.whatsappLabel)}
                  </a>
                  <a href="\${CABINET_CONTACT.mapsQueryUrl}" target="_blank" rel="noreferrer" class="btn btn-navy">
                    🗺️ \${escapeHtml(t.contactSection.mapButton)}
                  </a>
                </div>
              </div>

              <div class="card card-accent">
                <h3 style="font-size:1.25rem;margin-bottom:0.75rem;">\${escapeHtml(t.contactSection.hoursTitle)}</h3>
                \${t.contactSection.hoursLines.map((l) => \`<p style="margin:0.35rem 0;color:var(--ink-700);">\${escapeHtml(l)}</p>\`).join("")}
                <div style="margin-top:1.25rem;border-radius:var(--radius-sm);background:linear-gradient(145deg,var(--navy-900),var(--navy-800));color:#fff;padding:1.5rem;">
                  <div style="color:var(--gold-400);font-size:0.8rem;font-weight:600;">7070 — RAS JEBEL, BIZERTE</div>
                  <div style="font-size:1.1rem;font-weight:600;margin-top:0.25rem;">\${escapeHtml(CABINET_CONTACT.address[state.locale])}</div>
                  <div style="font-size:0.84rem;color:rgba(255,255,255,0.75);margin-top:0.5rem;">
                    Tribunal de Première Instance de Bizerte · Justice Cantonale de Ras Jebel · Cour d'Appel de Bizerte
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer class="site-footer">
            <div class="container" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
              <div>
                <strong style="color:#fff;">\${escapeHtml(t.attorneyName)}</strong>
                <div>\${escapeHtml(t.footer.rights)}</div>
              </div>
              <div style="max-width:520px;">\${escapeHtml(t.footer.ethicsNote)}</div>
            </div>
          </footer>

          \${state.activeArticle !== null ? (() => {
            const art = t.insightsSection.articles[state.activeArticle];
            return \`
              <div class="modal-backdrop" id="close-article-backdrop">
                <div class="modal-card" dir="\${t.dir}">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="section-tag" style="margin:0;">\${escapeHtml(art.category)}</span>
                    <button type="button" id="close-article-btn" class="btn btn-ghost btn-sm">✕</button>
                  </div>
                  <h2 style="margin-top:0.65rem;color:var(--navy-900);">\${escapeHtml(art.title)}</h2>
                  \${art.body.map((p) => \`<p style="color:var(--ink-700);">\${escapeHtml(p)}</p>\`).join("")}
                </div>
              </div>
            \`;
          })() : ""}

          <button type="button" id="open-avatar-btn" class="avatar-fab no-print">
            <span class="pulse-dot"></span>
            <span>\${escapeHtml(t.avatar.fabLabel)}</span>
          </button>

          \${state.avatarOpen ? \`
            <div class="drawer-backdrop no-print" id="close-avatar-backdrop">
              <aside class="drawer-panel" dir="\${t.dir}" id="avatar-panel-inner">
                <div style="padding:1.25rem 1.5rem;background:var(--navy-950);color:#fff;display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <span style="font-size:0.72rem;color:var(--gold-400);text-transform:uppercase;">\${escapeHtml(t.avatar.badge)}</span>
                    <h3 style="margin:0.2rem 0 0;color:#fff;font-size:1.2rem;">\${escapeHtml(t.avatar.drawerTitle)}</h3>
                  </div>
                  <button type="button" id="close-avatar-btn" class="btn btn-outline-light btn-sm">✕</button>
                </div>
                <div style="padding:1.4rem;display:grid;gap:1.1rem;">
                  <div class="avatar-stage">
                    <div class="avatar-silhouette">⚖️</div>
                    <div style="font-weight:600;font-size:0.95rem;margin-bottom:0.25rem;">\${escapeHtml(t.attorneyName)}</div>
                    <div style="font-size:0.78rem;color:var(--gold-400);">\${escapeHtml(state.avatarStatus || t.avatar.stageStatus)}</div>
                  </div>
                  <p style="margin:0;font-size:0.9rem;color:var(--ink-700);">\${escapeHtml(t.avatar.stageCaption)}</p>
                  <div style="display:grid;gap:0.6rem;">
                    \${t.avatar.quickPrompts.map((q, idx) => \`
                      <button type="button" data-prompt="\${idx}" class="btn btn-ghost" style="justify-content:flex-start;text-align:start;">
                        \${escapeHtml(q.label)}
                      </button>
                    \`).join("")}
                  </div>
                  \${state.avatarReply ? \`
                    <div class="card" style="background:var(--ivory-100);padding:1rem 1.15rem;border-inline-start:3px solid var(--gold-500);">
                      <p style="margin:0;font-size:0.92rem;">\${escapeHtml(state.avatarReply)}</p>
                    </div>
                  \` : ""}
                  <button type="button" id="avatar-book-jump" class="btn btn-gold">\${escapeHtml(t.avatar.bookRedirect)}</button>
                  <p style="margin:0;font-size:0.76rem;color:var(--ink-500);">\${escapeHtml(t.avatar.disclaimer)}</p>
                </div>
              </aside>
            </div>
          \` : ""}
        </div>
      \`;

      document.querySelectorAll("[data-lang]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.locale = btn.getAttribute("data-lang");
          localStorage.setItem("mj_locale", state.locale);
          state.avatarReply = null;
          render();
        });
      });

      document.querySelectorAll("[data-faq]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = Number(btn.getAttribute("data-faq"));
          state.openFaq = state.openFaq === i ? null : i;
          render();
        });
      });

      document.querySelectorAll("[data-article]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.activeArticle = Number(btn.getAttribute("data-article"));
          render();
        });
      });

      document.getElementById("close-article-btn")?.addEventListener("click", () => {
        state.activeArticle = null;
        render();
      });
      document.getElementById("close-article-backdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "close-article-backdrop") {
          state.activeArticle = null;
          render();
        }
      });

      document.getElementById("open-avatar-btn")?.addEventListener("click", async () => {
        state.avatarOpen = true;
        render();
        try {
          const r = await fetch("/api/avatar/session", { method: "POST" });
          const d = await r.json();
          state.avatarStatus = d.enabled ? "Live (" + d.provider + ")" : "Standby — Hook /api/avatar/session prêt";
          render();
        } catch {}
      });
      document.getElementById("close-avatar-btn")?.addEventListener("click", () => {
        state.avatarOpen = false;
        render();
      });
      document.getElementById("close-avatar-backdrop")?.addEventListener("click", (e) => {
        if (e.target.id === "close-avatar-backdrop") {
          state.avatarOpen = false;
          render();
        }
      });
      document.querySelectorAll("[data-prompt]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-prompt"));
          state.avatarReply = DICTIONARIES[state.locale].avatar.quickPrompts[idx].reply;
          render();
        });
      });
      document.getElementById("avatar-book-jump")?.addEventListener("click", () => {
        state.avatarOpen = false;
        render();
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
      });

      document.getElementById("reset-booking-btn")?.addEventListener("click", () => {
        state.bookingRef = null;
        render();
      });

      document.getElementById("booking-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = Object.fromEntries(fd.entries());
        payload.preferred_locale = state.locale;
        const r = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await r.json();
        if (!r.ok) {
          state.bookingError = data.error || "Erreur";
        } else {
          state.bookingRef = data.booking_ref;
          state.bookingError = null;
        }
        render();
      });
    }

    render();
  </script>
</body>
</html>`;
}

function renderAdminLoginHtml() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Connexion Espace Cabinet — Maître Mansour Jerbi</title>
  <link rel="stylesheet" href="/globals.css" />
</head>
<body>
  <div style="min-height:100vh;display:grid;place-items:center;background:linear-gradient(155deg,var(--navy-950),var(--navy-800));padding:1.5rem;">
    <form id="login-form" class="card card-accent" style="width:min(430px,100%);">
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div class="monogram" style="margin:0 auto 0.75rem;">MJ</div>
        <h1 style="font-size:1.6rem;margin-bottom:0.2rem;">Espace Cabinet</h1>
        <p style="margin:0;font-size:0.86rem;color:var(--ink-500);">Back-Office Juridique — Cabinet Maître Mansour Jerbi</p>
      </div>
      <div style="background:var(--gold-100);border:1px solid var(--gold-400);border-radius:var(--radius-sm);padding:0.75rem 0.9rem;font-size:0.82rem;margin-bottom:1rem;">
        <strong>Mode Aperçu Interactif :</strong> Identifiants pré-remplis pour tester l'administration avant déploiement Supabase Auth.
      </div>
      <div style="display:grid;gap:0.95rem;">
        <div class="field">
          <label>Courriel professionnel</label>
          <input name="email" type="email" value="maitremansourjerbi@gmail.com" required />
        </div>
        <div class="field">
          <label>Mot de passe</label>
          <input name="password" type="password" value="cabinet-demo-2026" required />
        </div>
        <button type="submit" class="btn btn-gold">Accéder au Back-Office →</button>
        <a href="/" style="text-align:center;font-size:0.85rem;color:var(--ink-500);">← Retour au site public</a>
      </div>
    </form>
  </div>
  <script>
    document.getElementById("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (r.ok) location.href = "/admin";
    });
  </script>
</body>
</html>`;
}

function renderAdminPortalHtml() {
  const courtsJson = JSON.stringify({
    courts: CABINET_CONTACT.tunisianCourts,
    contact: CABINET_CONTACT,
  }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Back-Office Juridique — Cabinet Maître Mansour Jerbi</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/globals.css" />
</head>
<body>
  <div id="admin-app"></div>
  <script id="courts-data" type="application/json">${courtsJson}</script>
  <script type="module">
    const { courts, contact } = JSON.parse(document.getElementById("courts-data").textContent);
    const state = {
      tab: "overview",
      appointments: [],
      clients: [],
      dossiers: [],
      hearings: [],
      documents: [],
      invoices: [],
      printInvoice: null,
    };

    function esc(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function fmtTND(n) {
      return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", minimumFractionDigits: 3 }).format(Number(n || 0));
    }

    async function loadAll() {
      const [a, c, d, h, doc, inv] = await Promise.all([
        fetch("/api/appointments").then((r) => r.json()),
        fetch("/api/admin/clients").then((r) => r.json()),
        fetch("/api/admin/dossiers").then((r) => r.json()),
        fetch("/api/admin/hearings").then((r) => r.json()),
        fetch("/api/admin/documents").then((r) => r.json()),
        fetch("/api/admin/invoices").then((r) => r.json()),
      ]);
      state.appointments = a.items || [];
      state.clients = c.items || [];
      state.dossiers = d.items || [];
      state.hearings = h.items || [];
      state.documents = doc.items || [];
      state.invoices = inv.items || [];
      render();
    }

    function render() {
      const root = document.getElementById("admin-app");
      if (state.printInvoice) {
        const inv = state.printInvoice;
        const tva = (Number(inv.amount_ht) * Number(inv.vat_rate)) / 100;
        root.innerHTML = \`
          <div style="max-width:780px;margin:2rem auto;padding:2.5rem;background:#fff;border:1px solid #cbd5e1;">
            <div class="no-print" style="display:flex;justify-content:space-between;margin-bottom:1.5rem;">
              <button type="button" id="back-portal-btn" class="btn btn-ghost btn-sm">← Retour au Back-Office</button>
              <button type="button" id="print-now-btn" class="btn btn-gold btn-sm">🖨️ Imprimer / Enregistrer PDF</button>
            </div>
            <div style="display:flex;justify-content:space-between;border-bottom:2px solid var(--navy-900);padding-bottom:1rem;">
              <div>
                <h2 style="margin:0;">Cabinet Maître Mansour Jerbi</h2>
                <div>Avocat auprès des Tribunaux — Ordre National des Avocats de Tunisie</div>
                <div>\${esc(contact.address.fr)}</div>
                <div>Tél : \${esc(contact.phoneLandline)} · Mobile : \${esc(contact.phoneMobile)}</div>
              </div>
              <div style="text-align:end;">
                <h3 style="margin:0;">NOTE D'HONORAIRES</h3>
                <div><strong>N° :</strong> \${esc(inv.invoice_number)}</div>
                <div><strong>Date :</strong> \${esc(inv.issued_on)}</div>
                \${inv.dossier_ref ? \`<div><strong>Dossier :</strong> \${esc(inv.dossier_ref)}</div>\` : ""}
              </div>
            </div>
            <div style="margin-block:1.5rem;"><strong>Client :</strong> \${esc(inv.client_name)}</div>
            <table class="data-table" style="margin-bottom:1.5rem;">
              <thead><tr><th>Désignation des prestations juridiques</th><th>Montant</th></tr></thead>
              <tbody>
                <tr><td>\${esc(inv.description)}</td><td>\${fmtTND(inv.amount_ht)}</td></tr>
                <tr><td>TVA (\${esc(inv.vat_rate)}%)</td><td>\${fmtTND(tva)}</td></tr>
                <tr><td>Droit de Timbre Fiscal</td><td>\${fmtTND(inv.stamp_duty)}</td></tr>
                <tr><th>Total TTC</th><th>\${fmtTND(inv.amount_ttc)}</th></tr>
                <tr><td>Montant réglé</td><td>\${fmtTND(inv.amount_paid)}</td></tr>
                <tr><th>Reste à payer</th><th>\${fmtTND(Math.max(0, Number(inv.amount_ttc) - Number(inv.amount_paid)))}</th></tr>
              </tbody>
            </table>
            <p style="font-size:0.85rem;color:var(--ink-500);">Signature & Cachet du Cabinet Maître Mansour Jerbi</p>
          </div>
        \`;
        document.getElementById("back-portal-btn").onclick = () => { state.printInvoice = null; render(); };
        document.getElementById("print-now-btn").onclick = () => window.print();
        return;
      }

      const pendingCount = state.appointments.filter((a) => a.status === "pending").length;
      const activeDossiers = state.dossiers.filter((d) => d.status !== "closed").length;
      const openHearings = state.hearings.filter((h) => !h.completed).length;
      const outstandingTND = state.invoices.reduce((s, i) => s + Math.max(0, Number(i.amount_ttc) - Number(i.amount_paid)), 0);

      root.innerHTML = \`
        <div class="admin-shell">
          <aside class="admin-sidebar no-print">
            <div style="padding:0.5rem 0.6rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.12);margin-bottom:0.5rem;">
              <div style="color:var(--gold-400);font-size:0.74rem;font-weight:700;">BACK-OFFICE JURIDIQUE</div>
              <div style="font-weight:700;font-size:1.08rem;">Cabinet M. Jerbi</div>
            </div>
            <button type="button" data-tab="overview" class="admin-nav-btn \${state.tab === "overview" ? "active" : ""}"><span>📊 Vue d'ensemble</span></button>
            <button type="button" data-tab="appointments" class="admin-nav-btn \${state.tab === "appointments" ? "active" : ""}">
              <span>📅 Rendez-vous</span>\${pendingCount ? \`<span class="badge badge-warning">\${pendingCount}</span>\` : ""}
            </button>
            <button type="button" data-tab="clients" class="admin-nav-btn \${state.tab === "clients" ? "active" : ""}">
              <span>👥 Annuaire Clients</span><span class="badge badge-neutral">\${state.clients.length}</span>
            </button>
            <button type="button" data-tab="dossiers" class="admin-nav-btn \${state.tab === "dossiers" ? "active" : ""}">
              <span>⚖️ Dossiers & Affaires</span><span class="badge badge-neutral">\${activeDossiers}</span>
            </button>
            <button type="button" data-tab="hearings" class="admin-nav-btn \${state.tab === "hearings" ? "active" : ""}">
              <span>🏛️ Rôle d'Audiences</span><span class="badge badge-neutral">\${openHearings}</span>
            </button>
            <button type="button" data-tab="documents" class="admin-nav-btn \${state.tab === "documents" ? "active" : ""}">
              <span>📁 Pièces & Documents</span><span class="badge badge-neutral">\${state.documents.length}</span>
            </button>
            <button type="button" data-tab="invoices" class="admin-nav-btn \${state.tab === "invoices" ? "active" : ""}">
              <span>💳 Honoraires (TND)</span>
            </button>
            <div style="margin-top:auto;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.12);display:grid;gap:0.35rem;">
              <a href="/" class="admin-nav-btn">🌐 Retour au site public</a>
              <button type="button" id="logout-btn" class="admin-nav-btn">🔒 Déconnexion</button>
            </div>
          </aside>

          <main class="admin-main">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.35rem;flex-wrap:wrap;gap:0.75rem;">
              <div>
                <h1 style="margin:0;font-size:1.75rem;color:var(--navy-900);">Gestion du Cabinet — Maître Mansour Jerbi</h1>
                <div style="font-size:0.86rem;color:var(--ink-500);">Ras Jebel, Bizerte · Rendez-vous en ligne, Dossiers, Rôle d'audiences & Facturation TND</div>
              </div>
            </div>

            <div class="kpi-grid">
              <div class="kpi-card"><div style="font-size:0.8rem;color:var(--ink-500);">RDV en ligne en attente</div><div class="kpi-value">\${pendingCount}</div></div>
              <div class="kpi-card"><div style="font-size:0.8rem;color:var(--ink-500);">Dossiers actifs</div><div class="kpi-value">\${activeDossiers}</div></div>
              <div class="kpi-card"><div style="font-size:0.8rem;color:var(--ink-500);">Audiences & Échéances</div><div class="kpi-value">\${openHearings}</div></div>
              <div class="kpi-card"><div style="font-size:0.8rem;color:var(--ink-500);">Honoraires à recouvrer</div><div class="kpi-value">\${fmtTND(outstandingTND)}</div></div>
            </div>

            \${state.tab === "overview" || state.tab === "appointments" ? \`
              <section style="margin-bottom:2rem;">
                <h2 style="font-size:1.35rem;margin-bottom:0.75rem;">📅 Demandes de Rendez-vous & Consultations</h2>
                <table class="data-table">
                  <thead><tr><th>Réf</th><th>Client & Téléphone</th><th>Domaine / Mode</th><th>Date & Créneau</th><th>Objet</th><th>Statut</th><th>Actions</th></tr></thead>
                  <tbody>
                    \${state.appointments.map((a) => \`
                      <tr>
                        <td><strong>\${esc(a.booking_ref)}</strong></td>
                        <td><div>\${esc(a.client_name)}</div><div style="font-size:0.78rem;color:var(--ink-500);">\${esc(a.phone)}</div></td>
                        <td><div>\${esc(a.practice_area)}</div><div style="font-size:0.75rem;color:var(--ink-500);">\${esc(a.consultation_mode)}</div></td>
                        <td>\${esc(a.preferred_date)} · \${esc(a.preferred_slot)}</td>
                        <td style="max-width:260px;">\${esc(a.subject)}</td>
                        <td><span class="badge \${a.status === "confirmed" ? "badge-success" : a.status === "pending" ? "badge-warning" : "badge-neutral"}">\${esc(a.status)}</span></td>
                        <td style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                          <button type="button" data-appt-confirm="\${a.id}" class="btn btn-gold btn-sm">Confirmer</button>
                          <button type="button" data-appt-done="\${a.id}" class="btn btn-ghost btn-sm">Clôturer</button>
                        </td>
                      </tr>
                    \`).join("")}
                  </tbody>
                </table>
              </section>
            \` : ""}

            \${state.tab === "overview" ? \`
              <section class="two-col">
                <div>
                  <h2 style="font-size:1.3rem;margin-bottom:0.75rem;">🏛️ Prochaines Audiences au Rôle</h2>
                  <table class="data-table">
                    <thead><tr><th>Date</th><th>Dossier</th><th>Juridiction</th><th>Diligence</th></tr></thead>
                    <tbody>
                      \${state.hearings.slice(0, 5).map((h) => \`
                        <tr>
                          <td>\${esc(h.scheduled_at.replace("T", " "))}</td>
                          <td><strong>\${esc(h.dossier_ref)}</strong></td>
                          <td>\${esc(h.court)}</td>
                          <td>\${esc(h.action_required)}</td>
                        </tr>
                      \`).join("")}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 style="font-size:1.3rem;margin-bottom:0.75rem;">⚖️ Dossiers Récents</h2>
                  <table class="data-table">
                    <thead><tr><th>Réf</th><th>Affaire</th><th>Statut</th></tr></thead>
                    <tbody>
                      \${state.dossiers.slice(0, 5).map((d) => \`
                        <tr>
                          <td><strong>\${esc(d.reference)}</strong></td>
                          <td><div>\${esc(d.title)}</div><div style="font-size:0.76rem;color:var(--ink-500);">\${esc(d.client_name)}</div></td>
                          <td><span class="badge badge-warning">\${esc(d.status)}</span></td>
                        </tr>
                      \`).join("")}
                    </tbody>
                  </table>
                </div>
              </section>
            \` : ""}

            \${state.tab === "clients" ? \`
              <section class="two-col">
                <div>
                  <h2>👥 Annuaire des Clients</h2>
                  <table class="data-table">
                    <thead><tr><th>Client</th><th>CIN / Matricule Fiscal</th><th>Téléphone</th><th>Ville</th></tr></thead>
                    <tbody>
                      \${state.clients.map((c) => \`
                        <tr>
                          <td><strong>\${esc(c.full_name)}</strong><div style="font-size:0.78rem;color:var(--ink-500);">\${esc(c.confidential_notes)}</div></td>
                          <td>\${esc(c.national_id_or_tax || "—")}</td>
                          <td>\${esc(c.phone)}</td>
                          <td>\${esc(c.city)}</td>
                        </tr>
                      \`).join("")}
                    </tbody>
                  </table>
                </div>
                <form id="new-client-form" class="card">
                  <h3>Nouvelle Fiche Client</h3>
                  <div style="display:grid;gap:0.8rem;">
                    <div class="field"><label>Nom complet / Société *</label><input name="full_name" required /></div>
                    <div class="field"><label>CIN ou Matricule Fiscal</label><input name="national_id_or_tax" /></div>
                    <div class="field"><label>Téléphone *</label><input name="phone" required /></div>
                    <div class="field"><label>Email</label><input name="email" type="email" /></div>
                    <div class="field"><label>Ville</label><input name="city" value="Ras Jebel, Bizerte" /></div>
                    <div class="field"><label>Notes confidentielles</label><textarea name="confidential_notes" rows="2"></textarea></div>
                    <button type="submit" class="btn btn-navy">Enregistrer le client</button>
                  </div>
                </form>
              </section>
            \` : ""}

            \${state.tab === "dossiers" ? \`
              <section class="two-col">
                <div>
                  <h2>⚖️ Dossiers & Contentieux</h2>
                  <table class="data-table">
                    <thead><tr><th>Réf</th><th>Intitulé & Parties</th><th>Juridiction</th><th>Statut</th></tr></thead>
                    <tbody>
                      \${state.dossiers.map((d) => \`
                        <tr>
                          <td><strong>\${esc(d.reference)}</strong></td>
                          <td>
                            <div><strong>\${esc(d.title)}</strong></div>
                            <div style="font-size:0.78rem;color:var(--ink-500);">\${esc(d.client_name)} \${d.opposing_party ? "c/ " + esc(d.opposing_party) : ""}</div>
                            \${d.notes ? \`<div style="font-size:0.76rem;color:var(--ink-700);margin-top:0.2rem;">\${esc(d.notes)}</div>\` : ""}
                          </td>
                          <td>\${esc(d.court)}</td>
                          <td><span class="badge badge-warning">\${esc(d.status)}</span></td>
                        </tr>
                      \`).join("")}
                    </tbody>
                  </table>
                </div>
                <form id="new-dossier-form" class="card">
                  <h3>Ouvrir un Nouveau Dossier</h3>
                  <div style="display:grid;gap:0.8rem;">
                    <div class="field"><label>Client *</label><input name="client_name" required /></div>
                    <div class="field"><label>Intitulé de l'affaire *</label><input name="title" required /></div>
                    <div class="field"><label>Domaine *</label><input name="practice_area" value="Droit Foncier & Immobilier" required /></div>
                    <div class="field">
                      <label>Juridiction *</label>
                      <select name="court">\${courts.map((ct) => \`<option value="\${esc(ct)}">\${esc(ct)}</option>\`).join("")}</select>
                    </div>
                    <div class="field"><label>Partie adverse</label><input name="opposing_party" /></div>
                    <div class="field"><label>Notes procédurales</label><textarea name="notes" rows="2"></textarea></div>
                    <button type="submit" class="btn btn-navy">Créer le dossier</button>
                  </div>
                </form>
              </section>
            \` : ""}

            \${state.tab === "hearings" ? \`
              <section class="two-col">
                <div>
                  <h2>🏛️ Rôle d'Audiences & Échéances</h2>
                  <table class="data-table">
                    <thead><tr><th>Date & Heure</th><th>Dossier</th><th>Juridiction</th><th>Diligence</th><th>Action</th></tr></thead>
                    <tbody>
                      \${state.hearings.map((h) => \`
                        <tr>
                          <td>\${esc(h.scheduled_at.replace("T", " "))}</td>
                          <td><strong>\${esc(h.dossier_ref)}</strong></td>
                          <td>\${esc(h.court)} \${h.chamber ? "(" + esc(h.chamber) + ")" : ""}</td>
                          <td>\${esc(h.action_required)}</td>
                          <td>
                            <button type="button" data-hearing="\${h.id}" data-done="\${h.completed ? 0 : 1}" class="btn btn-sm \${h.completed ? "btn-ghost" : "btn-gold"}">
                              \${h.completed ? "✓ Effectué" : "Marquer fait"}
                            </button>
                          </td>
                        </tr>
                      \`).join("")}
                    </tbody>
                  </table>
                </div>
                <form id="new-hearing-form" class="card">
                  <h3>Inscrire une Audience / Échéance</h3>
                  <div style="display:grid;gap:0.8rem;">
                    <div class="field"><label>Réf. Dossier *</label><input name="dossier_ref" value="DOS-2026-101" required /></div>
                    <div class="field">
                      <label>Juridiction *</label>
                      <select name="court">\${courts.map((ct) => \`<option value="\${esc(ct)}">\${esc(ct)}</option>\`).join("")}</select>
                    </div>
                    <div class="field"><label>Chambre</label><input name="chamber" placeholder="Chambre Civile" /></div>
                    <div class="field"><label>Date & Heure *</label><input name="scheduled_at" type="datetime-local" value="2026-12-05T09:30" required /></div>
                    <div class="field"><label>Diligence / Conclusions *</label><input name="action_required" required /></div>
                    <button type="submit" class="btn btn-navy">Ajouter au rôle</button>
                  </div>
                </form>
              </section>
            \` : ""}

            \${state.tab === "documents" ? \`
              <section class="two-col">
                <div>
                  <h2>📁 Coffre-fort des Pièces de Dossiers</h2>
                  <table class="data-table">
                    <thead><tr><th>Dossier</th><th>Titre de la pièce</th><th>Catégorie</th><th>Fichier</th></tr></thead>
                    <tbody>
                      \${state.documents.map((doc) => \`
                        <tr>
                          <td><strong>\${esc(doc.dossier_ref)}</strong></td>
                          <td>\${esc(doc.title)}</td>
                          <td><span class="badge badge-neutral">\${esc(doc.category)}</span></td>
                          <td>\${esc(doc.file_name)}</td>
                        </tr>
                      \`).join("")}
                    </tbody>
                  </table>
                </div>
                <form id="new-doc-form" class="card">
                  <h3>Verser une Pièce au Dossier</h3>
                  <div style="display:grid;gap:0.8rem;">
                    <div class="field"><label>Réf. Dossier *</label><input name="dossier_ref" value="DOS-2026-101" required /></div>
                    <div class="field"><label>Intitulé de la pièce *</label><input name="title" placeholder="Conclusions / Contrat / Jugement" required /></div>
                    <div class="field">
                      <label>Catégorie</label>
                      <select name="category">
                        <option value="pleading">Requête / Conclusions</option>
                        <option value="contract">Contrat / Acte</option>
                        <option value="judgment">Jugement / Arrêt</option>
                        <option value="evidence">Pièce justificative</option>
                      </select>
                    </div>
                    <div class="field"><label>Nom du fichier *</label><input name="file_name" placeholder="conclusions_bizerte.pdf" required /></div>
                    <button type="submit" class="btn btn-navy">Enregistrer la pièce</button>
                  </div>
                </form>
              </section>
            \` : ""}

            \${state.tab === "invoices" ? \`
              <section class="two-col">
                <div>
                  <h2>💳 Facturation & Notes d'Honoraires (TND)</h2>
                  <table class="data-table">
                    <thead><tr><th>N° Note</th><th>Client & Dossier</th><th>Total TTC</th><th>Réglé</th><th>Statut</th><th>Actions</th></tr></thead>
                    <tbody>
                      \${state.invoices.map((inv, idx) => \`
                        <tr>
                          <td><strong>\${esc(inv.invoice_number)}</strong></td>
                          <td><div>\${esc(inv.client_name)}</div><div style="font-size:0.76rem;color:var(--ink-500);">\${esc(inv.dossier_ref)}</div></td>
                          <td>\${fmtTND(inv.amount_ttc)}</td>
                          <td>\${fmtTND(inv.amount_paid)}</td>
                          <td><span class="badge \${inv.status === "paid" ? "badge-success" : "badge-warning"}">\${esc(inv.status)}</span></td>
                          <td style="display:flex;gap:0.4rem;">
                            <button type="button" data-print-inv="\${idx}" class="btn btn-ghost btn-sm">🖨️ Note</button>
                            \${inv.status !== "paid" ? \`<button type="button" data-pay-inv="\${idx}" class="btn btn-gold btn-sm">Encaisser</button>\` : ""}
                          </td>
                        </tr>
                      \`).join("")}
                    </tbody>
                  </table>
                </div>
                <form id="new-invoice-form" class="card">
                  <h3>Émettre une Note d'Honoraires</h3>
                  <div style="display:grid;gap:0.8rem;">
                    <div class="field"><label>Client *</label><input name="client_name" required /></div>
                    <div class="field"><label>Réf. Dossier</label><input name="dossier_ref" value="DOS-2026-101" /></div>
                    <div class="field"><label>Désignation *</label><input name="description" value="Provision sur honoraires de procédure" required /></div>
                    <div class="field"><label>Montant HT (TND) *</label><input name="amount_ht" type="number" step="0.001" value="800.000" required /></div>
                    <div class="field"><label>TVA (%)</label><input name="vat_rate" type="number" step="0.01" value="19" /></div>
                    <div class="field"><label>Timbre Fiscal (TND)</label><input name="stamp_duty" type="number" step="0.001" value="1.000" /></div>
                    <button type="submit" class="btn btn-navy">Générer la note TTC</button>
                  </div>
                </form>
              </section>
            \` : ""}
          </main>
        </div>
      \`;

      document.querySelectorAll("[data-tab]").forEach((b) => {
        b.onclick = () => { state.tab = b.getAttribute("data-tab"); render(); };
      });

      document.getElementById("logout-btn")?.addEventListener("click", async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        location.href = "/admin/login";
      });

      document.querySelectorAll("[data-appt-confirm]").forEach((b) => {
        b.onclick = async () => {
          await fetch("/api/appointments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: b.getAttribute("data-appt-confirm"), status: "confirmed" }),
          });
          loadAll();
        };
      });
      document.querySelectorAll("[data-appt-done]").forEach((b) => {
        b.onclick = async () => {
          await fetch("/api/appointments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: b.getAttribute("data-appt-done"), status: "completed" }),
          });
          loadAll();
        };
      });

      document.getElementById("new-client-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(fd.entries())),
        });
        loadAll();
      });

      document.getElementById("new-dossier-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await fetch("/api/admin/dossiers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(fd.entries())),
        });
        loadAll();
      });

      document.getElementById("new-hearing-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await fetch("/api/admin/hearings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(fd.entries())),
        });
        loadAll();
      });

      document.querySelectorAll("[data-hearing]").forEach((b) => {
        b.onclick = async () => {
          await fetch("/api/admin/hearings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: b.getAttribute("data-hearing"),
              completed: Number(b.getAttribute("data-done")) === 1,
            }),
          });
          loadAll();
        };
      });

      document.getElementById("new-doc-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await fetch("/api/admin/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(fd.entries())),
        });
        loadAll();
      });

      document.getElementById("new-invoice-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await fetch("/api/admin/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(fd.entries())),
        });
        loadAll();
      });

      document.querySelectorAll("[data-print-inv]").forEach((b) => {
        b.onclick = () => {
          state.printInvoice = state.invoices[Number(b.getAttribute("data-print-inv"))];
          render();
        };
      });

      document.querySelectorAll("[data-pay-inv]").forEach((b) => {
        b.onclick = async () => {
          const inv = state.invoices[Number(b.getAttribute("data-pay-inv"))];
          await fetch("/api/admin/invoices", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: inv.id, amount_paid: inv.amount_ttc, amount_ttc: inv.amount_ttc }),
          });
          loadAll();
        };
      });
    }

    loadAll();
  </script>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/globals.css") {
    res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
    res.end(fs.readFileSync(CSS_PATH, "utf8"));
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderPublicHtml());
    return;
  }

  if (req.method === "GET" && url.pathname === "/admin/login") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderAdminLoginHtml());
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/login") {
    await readJsonBody(req);
    sendJson(
      res,
      200,
      { ok: true },
      { "Set-Cookie": "cabinet_staff=authenticated; Path=/; HttpOnly; SameSite=Lax" }
    );
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/logout") {
    sendJson(
      res,
      200,
      { ok: true },
      { "Set-Cookie": "cabinet_staff=; Path=/; Max-Age=0" }
    );
    return;
  }

  if (req.method === "GET" && url.pathname === "/admin") {
    if (!isStaffAuthenticated(req)) {
      res.writeHead(302, { Location: "/admin/login" });
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderAdminPortalHtml());
    return;
  }

  // Public + Admin Appointments API
  if (url.pathname === "/api/appointments") {
    if (req.method === "POST") {
      const b = await readJsonBody(req);
      const booking_ref = `RDV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      db.prepare(
        `INSERT INTO appointments (id, booking_ref, client_name, phone, email, preferred_locale, practice_area, consultation_mode, preferred_date, preferred_slot, subject, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
      ).run(
        crypto.randomUUID(),
        booking_ref,
        String(b.client_name || "").trim(),
        String(b.phone || "").trim(),
        String(b.email || "").trim(),
        b.preferred_locale || "fr",
        b.practice_area || "Droit Civil",
        b.consultation_mode || "in_office",
        b.preferred_date || "2026-11-26",
        b.preferred_slot || "09:00",
        String(b.subject || "").trim(),
        new Date().toISOString()
      );
      sendJson(res, 201, { ok: true, booking_ref });
      return;
    }
    if (!isStaffAuthenticated(req)) return sendJson(res, 401, { error: "Unauthorized" });
    if (req.method === "GET") {
      const items = db.prepare("SELECT * FROM appointments ORDER BY created_at DESC").all();
      return sendJson(res, 200, { items });
    }
    if (req.method === "PATCH") {
      const b = await readJsonBody(req);
      db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(b.status, b.id);
      return sendJson(res, 200, { ok: true });
    }
  }

  // Avatar Future Session Endpoint
  if (req.method === "POST" && url.pathname === "/api/avatar/session") {
    return sendJson(res, 200, {
      enabled: false,
      provider: "disabled",
      sessionToken: null,
      personaName: "Cabinet Maître Mansour Jerbi — Intake Assistant",
    });
  }

  // Admin Protected APIs
  if (url.pathname.startsWith("/api/admin/")) {
    if (!isStaffAuthenticated(req)) return sendJson(res, 401, { error: "Unauthorized" });

    if (url.pathname === "/api/admin/clients") {
      if (req.method === "GET") {
        return sendJson(res, 200, {
          items: db.prepare("SELECT * FROM clients ORDER BY created_at DESC").all(),
        });
      }
      if (req.method === "POST") {
        const b = await readJsonBody(req);
        db.prepare(
          `INSERT INTO clients (id, full_name, national_id_or_tax, phone, email, city, confidential_notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          crypto.randomUUID(),
          b.full_name,
          b.national_id_or_tax || "",
          b.phone,
          b.email || "",
          b.city || "Ras Jebel, Bizerte",
          b.confidential_notes || "",
          new Date().toISOString()
        );
        return sendJson(res, 201, { ok: true });
      }
    }

    if (url.pathname === "/api/admin/dossiers") {
      if (req.method === "GET") {
        return sendJson(res, 200, {
          items: db.prepare("SELECT * FROM dossiers ORDER BY created_at DESC").all(),
        });
      }
      if (req.method === "POST") {
        const b = await readJsonBody(req);
        const ref = `DOS-${new Date().getFullYear()}-${Math.floor(105 + Math.random() * 890)}`;
        db.prepare(
          `INSERT INTO dossiers (id, reference, client_name, title, practice_area, court, opposing_party, status, notes, opened_on, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)`
        ).run(
          crypto.randomUUID(),
          ref,
          b.client_name,
          b.title,
          b.practice_area,
          b.court,
          b.opposing_party || "",
          b.notes || "",
          new Date().toISOString().slice(0, 10),
          new Date().toISOString()
        );
        return sendJson(res, 201, { ok: true, reference: ref });
      }
    }

    if (url.pathname === "/api/admin/hearings") {
      if (req.method === "GET") {
        return sendJson(res, 200, {
          items: db.prepare("SELECT * FROM hearings ORDER BY scheduled_at ASC").all(),
        });
      }
      if (req.method === "POST") {
        const b = await readJsonBody(req);
        db.prepare(
          `INSERT INTO hearings (id, dossier_ref, hearing_type, court, chamber, scheduled_at, action_required, priority, completed, created_at)
           VALUES (?, ?, 'audience', ?, ?, ?, ?, 'normal', 0, ?)`
        ).run(
          crypto.randomUUID(),
          b.dossier_ref,
          b.court,
          b.chamber || "",
          b.scheduled_at,
          b.action_required,
          new Date().toISOString()
        );
        return sendJson(res, 201, { ok: true });
      }
      if (req.method === "PATCH") {
        const b = await readJsonBody(req);
        db.prepare("UPDATE hearings SET completed = ? WHERE id = ?").run(b.completed ? 1 : 0, b.id);
        return sendJson(res, 200, { ok: true });
      }
    }

    if (url.pathname === "/api/admin/documents") {
      if (req.method === "GET") {
        return sendJson(res, 200, {
          items: db.prepare("SELECT * FROM case_documents ORDER BY uploaded_at DESC").all(),
        });
      }
      if (req.method === "POST") {
        const b = await readJsonBody(req);
        const fname = b.file_name || "piece_dossier.pdf";
        db.prepare(
          `INSERT INTO case_documents (id, dossier_ref, title, category, file_name, mime_type, size_bytes, storage_path, uploaded_at)
           VALUES (?, ?, ?, ?, ?, 'application/pdf', 120000, ?, ?)`
        ).run(
          crypto.randomUUID(),
          b.dossier_ref,
          b.title,
          b.category || "pleading",
          fname,
          `${b.dossier_ref}/${fname}`,
          new Date().toISOString()
        );
        return sendJson(res, 201, { ok: true });
      }
    }

    if (url.pathname === "/api/admin/invoices") {
      if (req.method === "GET") {
        return sendJson(res, 200, {
          items: db.prepare("SELECT * FROM invoices ORDER BY created_at DESC").all(),
        });
      }
      if (req.method === "POST") {
        const b = await readJsonBody(req);
        const invNum = `HON-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`;
        const ht = Number(b.amount_ht || 0);
        const vat = Number(b.vat_rate ?? 19);
        const stamp = Number(b.stamp_duty ?? 1.0);
        const ttc = Number((ht * (1 + vat / 100) + stamp).toFixed(3));
        db.prepare(
          `INSERT INTO invoices (id, invoice_number, dossier_ref, client_name, description, amount_ht, vat_rate, stamp_duty, amount_ttc, amount_paid, status, issued_on, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'unpaid', ?, ?)`
        ).run(
          crypto.randomUUID(),
          invNum,
          b.dossier_ref || "",
          b.client_name,
          b.description,
          ht,
          vat,
          stamp,
          ttc,
          new Date().toISOString().slice(0, 10),
          new Date().toISOString()
        );
        return sendJson(res, 201, { ok: true });
      }
      if (req.method === "PATCH") {
        const b = await readJsonBody(req);
        const paid = Number(b.amount_paid || 0);
        const total = Number(b.amount_ttc || 0);
        const st = paid >= total ? "paid" : paid > 0 ? "partial" : "unpaid";
        db.prepare("UPDATE invoices SET amount_paid = ?, status = ? WHERE id = ?").run(paid, st, b.id);
        return sendJson(res, 200, { ok: true });
      }
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Cabinet Mansour Jerbi preview server listening on http://0.0.0.0:${PORT}`);
});

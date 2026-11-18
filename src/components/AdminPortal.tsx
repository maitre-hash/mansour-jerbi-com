"use client";

import React, { useEffect, useState } from "react";
import { CABINET_CONTACT, formatCurrencyTND } from "@/config/cabinet";
import type {
  Appointment,
  CaseDocument,
  Client,
  Dossier,
  Hearing,
  Invoice,
} from "@/lib/types";

type AdminTab =
  | "overview"
  | "appointments"
  | "clients"
  | "dossiers"
  | "hearings"
  | "documents"
  | "invoices";

export function AdminPortal() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  async function refreshAll() {
    const [a, c, d, h, doc, inv] = await Promise.all([
      fetch("/api/appointments").then((r) => (r.ok ? r.json() : { items: [] })),
      fetch("/api/admin/clients").then((r) => (r.ok ? r.json() : { items: [] })),
      fetch("/api/admin/dossiers").then((r) => (r.ok ? r.json() : { items: [] })),
      fetch("/api/admin/hearings").then((r) => (r.ok ? r.json() : { items: [] })),
      fetch("/api/admin/documents").then((r) => (r.ok ? r.json() : { items: [] })),
      fetch("/api/admin/invoices").then((r) => (r.ok ? r.json() : { items: [] })),
    ]);
    setAppointments(a.items || []);
    setClients(c.items || []);
    setDossiers(d.items || []);
    setHearings(h.items || []);
    setDocuments(doc.items || []);
    setInvoices(inv.items || []);
  }

  useEffect(() => {
    refreshAll();
  }, []);

  async function updateAppointmentStatus(id: string, status: Appointment["status"]) {
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    refreshAll();
  }

  async function createClientRecord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    e.currentTarget.reset();
    refreshAll();
  }

  async function createDossierRecord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/admin/dossiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    e.currentTarget.reset();
    refreshAll();
  }

  async function createHearingRecord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/admin/hearings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    e.currentTarget.reset();
    refreshAll();
  }

  async function toggleHearing(id: string, completed: boolean) {
    await fetch("/api/admin/hearings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed }),
    });
    refreshAll();
  }

  async function uploadCaseDocument(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/admin/documents", {
      method: "POST",
      body: fd,
    });
    e.currentTarget.reset();
    refreshAll();
  }

  async function createInvoiceRecord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    e.currentTarget.reset();
    refreshAll();
  }

  async function markInvoicePaid(inv: Invoice) {
    await fetch("/api/admin/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: inv.id,
        amount_paid: inv.amount_ttc,
        amount_ttc: inv.amount_ttc,
      }),
    });
    refreshAll();
  }

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const activeDossiers = dossiers.filter((d) => d.status !== "closed").length;
  const openHearings = hearings.filter((h) => !h.completed).length;
  const outstandingTND = invoices.reduce(
    (sum, i) => sum + Math.max(0, Number(i.amount_ttc) - Number(i.amount_paid)),
    0
  );

  if (printInvoice) {
    return (
      <div style={{ maxWidth: "780px", margin: "2rem auto", padding: "2.5rem", background: "#fff", border: "1px solid #cbd5e1" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPrintInvoice(null)}>
            ← Retour au portail
          </button>
          <button type="button" className="btn btn-gold btn-sm" onClick={() => window.print()}>
            🖨️ Imprimer / Enregistrer PDF
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid var(--navy-900)", paddingBottom: "1rem" }}>
          <div>
            <h2 style={{ margin: 0 }}>Cabinet Maître Mansour Jerbi</h2>
            <div>Avocat auprès des Tribunaux</div>
            <div>{CABINET_CONTACT.address.fr}</div>
            <div>Tél : {CABINET_CONTACT.phoneLandline} / {CABINET_CONTACT.phoneMobile}</div>
          </div>
          <div style={{ textAlign: "end" }}>
            <h3 style={{ margin: 0 }}>NOTE D&apos;HONORAIRES</h3>
            <div><strong>N° :</strong> {printInvoice.invoice_number}</div>
            <div><strong>Date :</strong> {printInvoice.issued_on}</div>
            {printInvoice.dossier_ref && <div><strong>Dossier :</strong> {printInvoice.dossier_ref}</div>}
          </div>
        </div>
        <div style={{ marginBlock: "1.5rem" }}>
          <strong>Client :</strong> {printInvoice.client_name}
        </div>
        <table className="data-table" style={{ marginBottom: "1.5rem" }}>
          <thead>
            <tr>
              <th>Désignation des prestations juridiques</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{printInvoice.description}</td>
              <td>{formatCurrencyTND(Number(printInvoice.amount_ht), "fr")}</td>
            </tr>
            <tr>
              <td>TVA ({printInvoice.vat_rate}%)</td>
              <td>{formatCurrencyTND((Number(printInvoice.amount_ht) * Number(printInvoice.vat_rate)) / 100, "fr")}</td>
            </tr>
            <tr>
              <td>Droit de Timbre Fiscal</td>
              <td>{formatCurrencyTND(Number(printInvoice.stamp_duty), "fr")}</td>
            </tr>
            <tr>
              <th>Total TTC</th>
              <th>{formatCurrencyTND(Number(printInvoice.amount_ttc), "fr")}</th>
            </tr>
            <tr>
              <td>Montant réglé</td>
              <td>{formatCurrencyTND(Number(printInvoice.amount_paid), "fr")}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-500)" }}>
          Arrêtée la présente note d&apos;honoraires à la somme de {formatCurrencyTND(Number(printInvoice.amount_ttc), "fr")}.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar no-print">
        <div style={{ padding: "0.5rem 0.6rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.12)", marginBottom: "0.5rem" }}>
          <div style={{ color: "var(--gold-400)", fontSize: "0.75rem", fontWeight: 700 }}>
            BACK-OFFICE JURIDIQUE
          </div>
          <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Cabinet M. Jerbi</div>
        </div>

        <button type="button" className={`admin-nav-btn ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
          <span>📊 Vue d&apos;ensemble</span>
        </button>
        <button type="button" className={`admin-nav-btn ${tab === "appointments" ? "active" : ""}`} onClick={() => setTab("appointments")}>
          <span>📅 Rendez-vous</span>
          {pendingCount > 0 && <span className="badge badge-warning">{pendingCount}</span>}
        </button>
        <button type="button" className={`admin-nav-btn ${tab === "clients" ? "active" : ""}`} onClick={() => setTab("clients")}>
          <span>👥 Annuaire Clients</span>
          <span className="badge badge-neutral">{clients.length}</span>
        </button>
        <button type="button" className={`admin-nav-btn ${tab === "dossiers" ? "active" : ""}`} onClick={() => setTab("dossiers")}>
          <span>⚖️ Dossiers & Affaires</span>
          <span className="badge badge-neutral">{activeDossiers}</span>
        </button>
        <button type="button" className={`admin-nav-btn ${tab === "hearings" ? "active" : ""}`} onClick={() => setTab("hearings")}>
          <span>🏛️ Rôle d&apos;Audiences</span>
          <span className="badge badge-neutral">{openHearings}</span>
        </button>
        <button type="button" className={`admin-nav-btn ${tab === "documents" ? "active" : ""}`} onClick={() => setTab("documents")}>
          <span>📁 Pièces & Documents</span>
        </button>
        <button type="button" className={`admin-nav-btn ${tab === "invoices" ? "active" : ""}`} onClick={() => setTab("invoices")}>
          <span>💳 Honoraires (TND)</span>
        </button>

        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <a href="/" className="admin-nav-btn">
            🌐 Voir le site public
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div style={{ fontSize: "0.8rem", color: "var(--ink-500)" }}>Demandes de RDV en attente</div>
            <div className="kpi-value">{pendingCount}</div>
          </div>
          <div className="kpi-card">
            <div style={{ fontSize: "0.8rem", color: "var(--ink-500)" }}>Dossiers actifs</div>
            <div className="kpi-value">{activeDossiers}</div>
          </div>
          <div className="kpi-card">
            <div style={{ fontSize: "0.8rem", color: "var(--ink-500)" }}>Audiences & Échéances à venir</div>
            <div className="kpi-value">{openHearings}</div>
          </div>
          <div className="kpi-card">
            <div style={{ fontSize: "0.8rem", color: "var(--ink-500)" }}>Solde Honoraires à recouvrer</div>
            <div className="kpi-value">{formatCurrencyTND(outstandingTND, "fr")}</div>
          </div>
        </div>

        {(tab === "overview" || tab === "appointments") && (
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.45rem", marginBottom: "0.85rem" }}>
              Demandes de Rendez-vous & Consultations
            </h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Réf</th>
                  <th>Client & Contact</th>
                  <th>Domaine / Mode</th>
                  <th>Créneau souhaité</th>
                  <th>Objet</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.booking_ref}</strong></td>
                    <td>
                      <div>{a.client_name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--ink-500)" }}>{a.phone}</div>
                    </td>
                    <td>
                      <div>{a.practice_area}</div>
                      <div style={{ fontSize: "0.76rem", color: "var(--ink-500)" }}>{a.consultation_mode}</div>
                    </td>
                    <td>{a.preferred_date} · {a.preferred_slot}</td>
                    <td style={{ maxWidth: "260px" }}>{a.subject}</td>
                    <td>
                      <span className={`badge ${a.status === "confirmed" ? "badge-success" : a.status === "pending" ? "badge-warning" : "badge-neutral"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      <button type="button" className="btn btn-gold btn-sm" onClick={() => updateAppointmentStatus(a.id, "confirmed")}>
                        Confirmer
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => updateAppointmentStatus(a.id, "completed")}>
                        Clôturer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === "clients" && (
          <section className="two-col">
            <div>
              <h2>Annuaire des Clients</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nom / Raison sociale</th>
                    <th>CIN / MF</th>
                    <th>Téléphone</th>
                    <th>Ville</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.full_name}</strong>
                        {c.confidential_notes && (
                          <div style={{ fontSize: "0.78rem", color: "var(--ink-500)" }}>{c.confidential_notes}</div>
                        )}
                      </td>
                      <td>{c.national_id_or_tax || "—"}</td>
                      <td>{c.phone}</td>
                      <td>{c.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={createClientRecord} className="card">
              <h3>Nouvelle Fiche Client</h3>
              <div style={{ display: "grid", gap: "0.85rem" }}>
                <div className="field"><label>Nom complet / Société *</label><input name="full_name" required /></div>
                <div className="field"><label>CIN ou Matricule Fiscal</label><input name="national_id_or_tax" /></div>
                <div className="field"><label>Téléphone *</label><input name="phone" required /></div>
                <div className="field"><label>Email</label><input name="email" type="email" /></div>
                <div className="field"><label>Ville</label><input name="city" defaultValue="Ras Jebel, Bizerte" /></div>
                <div className="field"><label>Notes confidentielles</label><textarea name="confidential_notes" rows={3} /></div>
                <button type="submit" className="btn btn-navy">Enregistrer le client</button>
              </div>
            </form>
          </section>
        )}

        {tab === "dossiers" && (
          <section className="two-col">
            <div>
              <h2>Suivi des Dossiers Juridiques</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Intitulé & Client</th>
                    <th>Juridiction</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {dossiers.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.reference}</strong></td>
                      <td>
                        <div><strong>{d.title}</strong></div>
                        <div style={{ fontSize: "0.8rem", color: "var(--ink-500)" }}>
                          Client : {d.client_name} {d.opposing_party ? `· c/ ${d.opposing_party}` : ""}
                        </div>
                      </td>
                      <td>{d.court}</td>
                      <td><span className="badge badge-warning">{d.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={createDossierRecord} className="card">
              <h3>Ouvrir un Nouveau Dossier</h3>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                <div className="field"><label>Client *</label><input name="client_name" required /></div>
                <div className="field"><label>Intitulé de l&apos;affaire *</label><input name="title" required /></div>
                <div className="field"><label>Domaine *</label><input name="practice_area" defaultValue="Droit Foncier & Immobilier" required /></div>
                <div className="field">
                  <label>Juridiction *</label>
                  <select name="court">
                    {CABINET_CONTACT.tunisianCourts.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
                <div className="field"><label>Partie adverse</label><input name="opposing_party" /></div>
                <div className="field"><label>Notes procédurales</label><textarea name="notes" rows={2} /></div>
                <button type="submit" className="btn btn-navy">Créer le dossier</button>
              </div>
            </form>
          </section>
        )}

        {tab === "hearings" && (
          <section className="two-col">
            <div>
              <h2>Rôle d&apos;Audiences & Échéances Procédurales</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Dossier</th>
                    <th>Tribunal / Chambre</th>
                    <th>Diligence requise</th>
                    <th>État</th>
                  </tr>
                </thead>
                <tbody>
                  {hearings.map((h) => (
                    <tr key={h.id}>
                      <td>{h.scheduled_at.slice(0, 16).replace("T", " ")}</td>
                      <td><strong>{h.dossier_ref}</strong></td>
                      <td>{h.court} {h.chamber ? `(${h.chamber})` : ""}</td>
                      <td>{h.action_required}</td>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-sm ${h.completed ? "btn-ghost" : "btn-gold"}`}
                          onClick={() => toggleHearing(h.id, !h.completed)}
                        >
                          {h.completed ? "✓ Effectué" : "Marquer fait"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={createHearingRecord} className="card">
              <h3>Planifier une Audience / Échéance</h3>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                <div className="field"><label>Réf. Dossier *</label><input name="dossier_ref" placeholder="DOS-2026-..." required /></div>
                <div className="field">
                  <label>Juridiction *</label>
                  <select name="court">
                    {CABINET_CONTACT.tunisianCourts.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
                <div className="field"><label>Chambre</label><input name="chamber" placeholder="Chambre Civile / Foncière" /></div>
                <div className="field"><label>Date & Heure *</label><input name="scheduled_at" type="datetime-local" required /></div>
                <div className="field"><label>Diligence / Conclusions *</label><input name="action_required" required /></div>
                <button type="submit" className="btn btn-navy">Ajouter au rôle</button>
              </div>
            </form>
          </section>
        )}

        {tab === "documents" && (
          <section className="two-col">
            <div>
              <h2>Coffre-fort des Pièces de Dossiers</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Dossier</th>
                    <th>Intitulé de la pièce</th>
                    <th>Catégorie</th>
                    <th>Fichier</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td><strong>{doc.dossier_ref}</strong></td>
                      <td>{doc.title}</td>
                      <td><span className="badge badge-neutral">{doc.category}</span></td>
                      <td>{doc.file_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={uploadCaseDocument} className="card">
              <h3>Verser une Pièce au Dossier</h3>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                <div className="field"><label>Réf. Dossier *</label><input name="dossier_ref" placeholder="DOS-2026-001" required /></div>
                <div className="field"><label>Titre de la pièce *</label><input name="title" placeholder="Certificat de propriété CPF" required /></div>
                <div className="field">
                  <label>Catégorie</label>
                  <select name="category">
                    <option value="pleading">Requête / Conclusions</option>
                    <option value="contract">Contrat / Acte</option>
                    <option value="judgment">Jugement / Arrêt</option>
                    <option value="evidence">Pièce justificative</option>
                  </select>
                </div>
                <div className="field"><label>Fichier (PDF, Image, Scan) *</label><input name="file" type="file" required /></div>
                <button type="submit" className="btn btn-navy">Téléverser la pièce</button>
              </div>
            </form>
          </section>
        )}

        {tab === "invoices" && (
          <section className="two-col">
            <div>
              <h2>Facturation & Notes d&apos;Honoraires (TND)</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>N° Note</th>
                    <th>Client & Dossier</th>
                    <th>Total TTC</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td><strong>{inv.invoice_number}</strong></td>
                      <td>
                        <div>{inv.client_name}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--ink-500)" }}>{inv.dossier_ref}</div>
                      </td>
                      <td>{formatCurrencyTND(Number(inv.amount_ttc), "fr")}</td>
                      <td>
                        <span className={`badge ${inv.status === "paid" ? "badge-success" : "badge-warning"}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: "0.4rem" }}>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPrintInvoice(inv)}>
                          🖨️ Note
                        </button>
                        {inv.status !== "paid" && (
                          <button type="button" className="btn btn-gold btn-sm" onClick={() => markInvoicePaid(inv)}>
                            Encaisser
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={createInvoiceRecord} className="card">
              <h3>Émettre une Note d&apos;Honoraires</h3>
              <div style={{ display: "grid", gap: "0.8rem" }}>
                <div className="field"><label>Client *</label><input name="client_name" required /></div>
                <div className="field"><label>Réf. Dossier</label><input name="dossier_ref" placeholder="DOS-2026-001" /></div>
                <div className="field"><label>Désignation *</label><input name="description" placeholder="Provision sur honoraires de procédure" required /></div>
                <div className="field"><label>Montant HT (TND) *</label><input name="amount_ht" type="number" step="0.001" defaultValue="800.000" required /></div>
                <div className="field"><label>TVA (%)</label><input name="vat_rate" type="number" step="0.01" defaultValue="19" /></div>
                <div className="field"><label>Timbre Fiscal (TND)</label><input name="stamp_duty" type="number" step="0.001" defaultValue="1.000" /></div>
                <button type="submit" className="btn btn-navy">Générer la note TTC</button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

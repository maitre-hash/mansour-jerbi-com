"use client";

import React, { useEffect, useState } from "react";
import {
  CABINET_CONTACT,
  DICTIONARIES,
  formatLocalizedDate,
  type InsightArticle,
} from "@/config/cabinet";
import type { ConsultationMode, Locale } from "@/lib/types";
import { AvatarDrawer } from "@/components/AvatarDrawer";

export function PublicSite() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [mode, setMode] = useState<ConsultationMode>("in_office");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredSlot, setPreferredSlot] = useState(CABINET_CONTACT.timeSlots[0]);
  const [subject, setSubject] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const t = DICTIONARIES[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = t.dir;
    if (!practiceArea && t.practicesSection.items[0]) {
      setPracticeArea(t.practicesSection.items[0].title);
    }
  }, [locale, t, practiceArea]);

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setBookingError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName,
          phone,
          email,
          preferred_locale: locale,
          practice_area: practiceArea || t.practicesSection.items[0].title,
          consultation_mode: mode,
          preferred_date: preferredDate,
          preferred_slot: preferredSlot,
          subject,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || "Request failed");
      } else {
        setBookingRef(data.booking_ref);
        setClientName("");
        setPhone("");
        setEmail("");
        setSubject("");
      }
    } catch {
      setBookingError("Network error while submitting request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div dir={t.dir}>
      {/* Top Bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <span>⚖️ {t.barBadge}</span>
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            <span>📍 {CABINET_CONTACT.address[locale]}</span>
            <a href={`tel:${CABINET_CONTACT.phoneLandline.replace(/\s+/g, "")}`} className="ltr-inline">
              {CABINET_CONTACT.phoneLandline}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="site-header">
        <div className="container header-inner">
                 <a href="#" className="brand">
            <div className="monogram">
              <img src="/profile.jpg" alt={t.attorneyName} />
            </div>
            <div>
              <span className="brand-title">{t.attorneyName}</span>
              <span className="brand-subtitle">{t.cabinetTitle}</span>
            </div>
          </a>
          <nav className="nav-links">
            <a href="#about" className="nav-link">{t.nav.about}</a>
            <a href="#practices" className="nav-link">{t.nav.practices}</a>
            <a href="#insights" className="nav-link">{t.nav.insights}</a>
            <a href="#faq" className="nav-link">{t.nav.faq}</a>
            <a href="#contact" className="nav-link">{t.nav.contact}</a>
          </nav>

          <div className="header-actions">
            <div className="lang-switcher" role="group" aria-label="Language switcher">
              {(["fr", "ar", "en"] as Locale[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`lang-btn ${locale === code ? "active" : ""}`}
                  onClick={() => {
                    setLocale(code);
                    setPracticeArea(DICTIONARIES[code].practicesSection.items[0].title);
                  }}
                >
                  {code === "ar" ? "العربية" : code.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="#booking" className="btn btn-gold btn-sm">
              {t.nav.bookCta}
            </a>
            <a href="/admin" className="btn btn-outline-light btn-sm">
              {t.nav.staffPortal}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1>{t.hero.headline}</h1>
            <p className="hero-lead">{t.hero.subheadline}</p>

            <div className="hero-cta-row">
              <a href="#booking" className="btn btn-gold">
                {t.hero.primaryCta}
              </a>
              <a href="#practices" className="btn btn-outline-light">
                {t.hero.secondaryCta}
              </a>
            </div>

            <div className="pillars-row">
              {t.hero.pillars.map((p, idx) => (
                <div key={idx}>
                  <span className="pillar-label">{p.label}</span>
                  <span className="pillar-value">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="crest-card">
            <div className="crest-seal">⚖️</div>
            <h2 style={{ color: "#fff", fontSize: "1.65rem", marginBottom: "0.35rem" }}>
              {t.attorneyName}
            </h2>
            <p style={{ color: "var(--gold-400)", marginTop: 0, fontWeight: 600 }}>
              {t.cabinetTitle}
            </p>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.94rem" }}>
              {CABINET_CONTACT.address[locale]}
            </p>
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.15)",
                paddingTop: "1rem",
                marginTop: "1rem",
                display: "grid",
                gap: "0.45rem",
                fontSize: "0.9rem",
              }}
            >
              <div>
                ☎ <span className="ltr-inline">{CABINET_CONTACT.phoneLandline}</span>
              </div>
              <div>
                📱 <span className="ltr-inline">{CABINET_CONTACT.phoneMobile}</span>
              </div>
              <div>
                ✉ <span className="ltr-inline">{CABINET_CONTACT.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Credentials Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="two-col">
            <div>
              <span className="section-tag">{t.about.sectionTag}</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--navy-900)" }}>
                {t.about.heading}
              </h2>
              {t.about.paragraphs.map((p, i) => (
                <p key={i} style={{ color: "var(--ink-700)", fontSize: "1.02rem" }}>
                  {p}
                </p>
              ))}

              <div className="three-grid" style={{ marginTop: "2rem" }}>
                {t.about.values.map((v, idx) => (
                  <div key={idx} className="card" style={{ padding: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--navy-900)", marginBottom: "0.4rem" }}>
                      {v.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--ink-700)" }}>
                      {v.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-accent">
              <h3 style={{ fontSize: "1.35rem", color: "var(--navy-900)", marginBottom: "1.1rem" }}>
                {t.about.credentialsTitle}
              </h3>
              <ul className="check-list">
                {t.about.credentials.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section id="practices" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t.practicesSection.sectionTag}</span>
            <h2>{t.practicesSection.heading}</h2>
            <p>{t.practicesSection.intro}</p>
          </div>

          <div className="three-grid">
            {t.practicesSection.items.map((area) => (
              <article key={area.id} className="card card-accent">
                <div className="practice-icon" aria-hidden="true">
                  {area.icon}
                </div>
                <h3 style={{ fontSize: "1.3rem", color: "var(--navy-900)", marginBottom: "0.45rem" }}>
                  {area.title}
                </h3>
                <p style={{ color: "var(--ink-700)", fontSize: "0.92rem", marginBottom: "1rem" }}>
                  {area.summary}
                </p>
                <ul className="check-list">
                  {area.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Online Appointment Booking Section */}
      <section id="booking" className="section">
        <div className="container">
          <div className="two-col">
            <div>
              <span className="section-tag">{t.booking.sectionTag}</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--navy-900)" }}>
                {t.booking.heading}
              </h2>
              <p style={{ color: "var(--ink-700)", marginBottom: "1.5rem" }}>
                {t.booking.subtitle}
              </p>

              <div className="card" style={{ background: "var(--ivory-100)" }}>
                <h3 style={{ fontSize: "1.15rem", marginBottom: "0.6rem" }}>
                  {t.contactSection.hoursTitle}
                </h3>
                {t.contactSection.hoursLines.map((line, idx) => (
                  <div key={idx} style={{ fontSize: "0.93rem", color: "var(--ink-700)" }}>
                    {line}
                  </div>
                ))}
                <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "1rem 0" }} />
                <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--ink-500)" }}>
                  🔒 {t.booking.fields.confidentialityNote}
                </p>
              </div>
            </div>

            <div className="card card-accent">
              {bookingRef ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
                  <div style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>✅</div>
                  <h3 style={{ fontSize: "1.45rem", color: "var(--navy-900)" }}>
                    {t.booking.confirmationTitle}
                  </h3>
                  <p style={{ color: "var(--ink-700)" }}>{t.booking.confirmationText}</p>
                  <div
                    className="ltr-inline"
                    style={{
                      background: "var(--gold-100)",
                      border: "1px solid var(--gold-500)",
                      padding: "0.65rem 1.25rem",
                      borderRadius: "var(--radius-sm)",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: "var(--navy-900)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {bookingRef}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setBookingRef(null)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="form-grid">
                  <div className="field">
                    <label>{t.booking.fields.name} *</label>
                    <input
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.booking.fields.phone} *</label>
                    <input
                      required
                      dir="ltr"
                      placeholder="+216 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.booking.fields.email}</label>
                    <input
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.booking.fields.practice} *</label>
                    <select
                      value={practiceArea}
                      onChange={(e) => setPracticeArea(e.target.value)}
                    >
                      {t.practicesSection.items.map((item) => (
                        <option key={item.id} value={item.title}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field form-full">
                    <label>{t.booking.fields.mode} *</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as ConsultationMode)}
                    >
                      <option value="in_office">{t.booking.fields.modes.in_office}</option>
                      <option value="phone_video">{t.booking.fields.modes.phone_video}</option>
                      <option value="urgent">{t.booking.fields.modes.urgent}</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>{t.booking.fields.date} *</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.booking.fields.slot} *</label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                    >
                      {CABINET_CONTACT.timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field form-full">
                    <label>{t.booking.fields.subject} *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder={t.booking.fields.subjectPlaceholder}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  {bookingError && (
                    <div className="form-full" style={{ color: "var(--danger)", fontSize: "0.88rem" }}>
                      {bookingError}
                    </div>
                  )}
                  <div className="form-full">
                    <button type="submit" disabled={submitting} className="btn btn-gold" style={{ width: "100%" }}>
                      {submitting ? "..." : t.booking.fields.submit}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Insights & Publications Section */}
      <section id="insights" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t.insightsSection.sectionTag}</span>
            <h2>{t.insightsSection.heading}</h2>
            <p>{t.insightsSection.subtitle}</p>
          </div>

          <div className="three-grid">
            {t.insightsSection.articles.map((art) => (
              <article key={art.slug} className="card" style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.78rem",
                    color: "var(--gold-600)",
                    fontWeight: 600,
                    marginBottom: "0.55rem",
                  }}
                >
                  <span>{art.category}</span>
                  <span>{formatLocalizedDate(art.publishedIso, locale)}</span>
                </div>
                <h3 style={{ fontSize: "1.22rem", color: "var(--navy-900)", marginBottom: "0.6rem" }}>
                  {art.title}
                </h3>
                <p style={{ color: "var(--ink-700)", fontSize: "0.92rem", flexGrow: 1 }}>
                  {art.excerpt}
                </p>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ alignSelf: "flex-start", marginTop: "0.75rem" }}
                  onClick={() => setActiveArticle(art)}
                >
                  {t.insightsSection.readMore} →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="section-header">
            <span className="section-tag">{t.faqSection.sectionTag}</span>
            <h2>{t.faqSection.heading}</h2>
          </div>

          <div className="faq-list">
            {t.faqSection.items.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="faq-item">
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span style={{ color: "var(--gold-600)", fontSize: "1.2rem" }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && <div className="faq-answer">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact & Office Location Section */}
      <section id="contact" className="section section-alt">
        <div className="container">
          <div className="two-col">
            <div>
              <span className="section-tag">{t.contactSection.sectionTag}</span>
              <h2 style={{ fontSize: "2.1rem", color: "var(--navy-900)" }}>
                {t.contactSection.heading}
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--ink-700)" }}>
                📍 {CABINET_CONTACT.address[locale]}
              </p>

              <div style={{ display: "grid", gap: "0.85rem", marginBlock: "1.5rem" }}>
                <div className="card" style={{ padding: "1rem 1.25rem" }}>
                  <strong>{t.contactSection.phoneLabel}: </strong>
                  <a
                    href={`tel:${CABINET_CONTACT.phoneLandline.replace(/\s+/g, "")}`}
                    className="ltr-inline"
                  >
                    {CABINET_CONTACT.phoneLandline}
                  </a>
                </div>
                <div className="card" style={{ padding: "1rem 1.25rem" }}>
                  <strong>{t.contactSection.mobileLabel}: </strong>
                  <a
                    href={`tel:${CABINET_CONTACT.phoneMobile.replace(/\s+/g, "")}`}
                    className="ltr-inline"
                  >
                    {CABINET_CONTACT.phoneMobile}
                  </a>
                </div>
                <div className="card" style={{ padding: "1rem 1.25rem" }}>
                  <strong>{t.contactSection.emailLabel}: </strong>
                  <a href={`mailto:${CABINET_CONTACT.email}`} className="ltr-inline">
                    {CABINET_CONTACT.email}
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
                <a
                  href={`https://wa.me/${CABINET_CONTACT.whatsappE164}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-gold"
                >
                  💬 {t.contactSection.whatsappLabel}
                </a>
                <a
                  href={CABINET_CONTACT.mapsQueryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-navy"
                >
                  🗺️ {t.contactSection.mapButton}
                </a>
              </div>
            </div>

            <div className="card card-accent">
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
                {t.contactSection.hoursTitle}
              </h3>
              {t.contactSection.hoursLines.map((line, i) => (
                <p key={i} style={{ margin: "0.35rem 0", color: "var(--ink-700)" }}>
                  {line}
                </p>
              ))}
              <div
                style={{
                  marginTop: "1.25rem",
                  borderRadius: "var(--radius-sm)",
                  background: "linear-gradient(145deg, var(--navy-900), var(--navy-800))",
                  color: "#fff",
                  padding: "1.5rem",
                }}
              >
                <div style={{ color: "var(--gold-400)", fontSize: "0.8rem", fontWeight: 600 }}>
                  7070 — RAS JEBEL, BIZERTE
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "0.25rem" }}>
                  {CABINET_CONTACT.address[locale]}
                </div>
                <div style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.75)", marginTop: "0.5rem" }}>
                  Tribunal de Première Instance de Bizerte · Justice Cantonale de Ras Jebel · Cour d&apos;Appel de Bizerte
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <strong style={{ color: "#fff" }}>{t.attorneyName}</strong>
            <div>{t.footer.rights}</div>
          </div>
          <div style={{ maxWidth: "520px" }}>{t.footer.ethicsNote}</div>
        </div>
      </footer>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="modal-backdrop" onClick={() => setActiveArticle(null)}>
          <div className="modal-card" dir={t.dir} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-tag" style={{ margin: 0 }}>
                {activeArticle.category}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setActiveArticle(null)}
              >
                ✕
              </button>
            </div>
            <h2 style={{ marginTop: "0.65rem", color: "var(--navy-900)" }}>
              {activeArticle.title}
            </h2>
            {activeArticle.body.map((para, idx) => (
              <p key={idx} style={{ color: "var(--ink-700)" }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Future AI Avatar Assistant Launcher & Drawer */}
      <AvatarDrawer
        t={t}
        onJumpToBooking={() => {
          document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

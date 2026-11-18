"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(155deg, var(--navy-950), var(--navy-800))",
        padding: "1.5rem",
      }}
    >
      <form onSubmit={handleLogin} className="card card-accent" style={{ width: "min(420px, 100%)" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div className="monogram" style={{ margin: "0 auto 0.75rem" }}>
            MJ
          </div>
          <h1 style={{ fontSize: "1.55rem", marginBottom: "0.2rem" }}>Espace Cabinet</h1>
          <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--ink-500)" }}>
            Accès réservé — Cabinet Maître Mansour Jerbi
          </p>
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div className="field">
            <label>Courriel professionnel</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div style={{ color: "var(--danger)", fontSize: "0.86rem" }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn btn-gold">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <a href="/" style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--ink-500)" }}>
            ← Retour au site public
          </a>
        </div>
      </form>
    </div>
  );
}

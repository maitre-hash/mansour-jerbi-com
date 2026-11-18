"use client";

import React, { useState } from "react";
import type { Dictionary } from "@/config/cabinet";

interface AvatarDrawerProps {
  t: Dictionary;
  onJumpToBooking: () => void;
}

export function AvatarDrawer({ t, onJumpToBooking }: AvatarDrawerProps) {
  const [open, setOpen] = useState(false);
  const [selectedReply, setSelectedReply] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);

  async function checkAvatarEndpoint() {
    try {
      const res = await fetch("/api/avatar/session", { method: "POST" });
      const data = await res.json();
      setSessionStatus(
        data.enabled
          ? `Live (${data.provider})`
          : "Standby — Server hook /api/avatar/session ready"
      );
    } catch {
      setSessionStatus("Standby");
    }
  }

  return (
    <>
      <button
        type="button"
        className="avatar-fab no-print"
        onClick={() => {
          setOpen(true);
          checkAvatarEndpoint();
        }}
      >
        <span className="pulse-dot" aria-hidden="true" />
        <span>{t.avatar.fabLabel}</span>
      </button>

      {open && (
        <div className="drawer-backdrop no-print" onClick={() => setOpen(false)}>
          <aside
            className="drawer-panel"
            dir={t.dir}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                background: "var(--navy-950)",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--gold-400)",
                    textTransform: "uppercase",
                  }}
                >
                  {t.avatar.badge}
                </span>
                <h3 style={{ margin: "0.2rem 0 0", color: "#fff", fontSize: "1.2rem" }}>
                  {t.avatar.drawerTitle}
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "1.4rem", display: "grid", gap: "1.1rem" }}>
              {/* Reserved WebRTC Video / 3D Canvas Stage for Future Interactive Avatar */}
              <div className="avatar-stage" id="cabinet-avatar-mount">
                <div className="avatar-silhouette">⚖️</div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                  {t.attorneyName}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--gold-400)" }}>
                  {sessionStatus || t.avatar.stageStatus}
                </div>
              </div>

              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--ink-700)" }}>
                {t.avatar.stageCaption}
              </p>

              <div style={{ display: "grid", gap: "0.6rem" }}>
                {t.avatar.quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-ghost"
                    style={{ justifyContent: "flex-start", textAlign: "start" }}
                    onClick={() => setSelectedReply(item.reply)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {selectedReply && (
                <div
                  className="card"
                  style={{
                    background: "var(--ivory-100)",
                    padding: "1rem 1.15rem",
                    borderInlineStart: "3px solid var(--gold-500)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.92rem" }}>{selectedReply}</p>
                </div>
              )}

              <button
                type="button"
                className="btn btn-gold"
                onClick={() => {
                  setOpen(false);
                  onJumpToBooking();
                }}
              >
                {t.avatar.bookRedirect}
              </button>

              <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--ink-500)" }}>
                {t.avatar.disclaimer}
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

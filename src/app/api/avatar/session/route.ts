import { NextResponse } from "next/server";
import type { AvatarSessionResponse } from "@/lib/types";

/**
 * Server-side token exchange route for the future AI Avatar widget.
 * Keeps AVATAR_API_KEY strictly on the server (never exposed to browser JS).
 * Compatible with HeyGen Interactive Avatar, Tavus, LiveKit, or Gemini Live WebRTC.
 */
export async function POST() {
  const provider = process.env.AVATAR_PROVIDER || "disabled";
  const apiKey = process.env.AVATAR_API_KEY || "";

  const payload: AvatarSessionResponse = {
    enabled: provider !== "disabled" && Boolean(apiKey),
    provider,
    sessionToken: null,
    personaName: "Cabinet Maître Mansour Jerbi — Intake Assistant",
    disclaimer: {
      fr: "Information générale d'accueil uniquement — ne remplace pas une consultation juridique.",
      ar: "معلومات توجيهية عامة فقط ولا تُعدّ استشارة قانونية مخصّصة.",
      en: "General intake orientation only — does not constitute formal legal advice.",
    },
  };

  // When AVATAR_PROVIDER and AVATAR_API_KEY are configured in Vercel environment variables,
  // exchange the server key for a short-lived ephemeral WebRTC session token here.
  return NextResponse.json(payload);
}

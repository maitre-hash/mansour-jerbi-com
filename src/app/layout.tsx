import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cabinet Maître Mansour Jerbi | Avocat — Ras Jebel, Bizerte, Tunisie",
  description:
    "Cabinet d'Avocat et Conseil Juridique de Maître Mansour Jerbi à Ras Jebel (Bizerte, Tunisie). Droit civil, foncier, commercial, famille, pénal et accompagnement des Tunisiens à l'étranger.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mansour-jerbi.com"),
  openGraph: {
    title: "Cabinet Maître Mansour Jerbi — Avocat auprès des Tribunaux",
    description:
      "Conseil juridique, rédaction d'actes et représentation devant les juridictions tunisiennes (Français · العربية · English).",
    url: "https://mansour-jerbi.com",
    siteName: "Cabinet Maître Mansour Jerbi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

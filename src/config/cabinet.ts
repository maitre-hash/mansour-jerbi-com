import type { Locale } from "@/lib/types";

import {
  CABINET_CONTACT as RAW_CABINET_CONTACT,
  DICTIONARIES as RAW_DICTIONARIES,
} from "./cabinetData.mjs";

export const CABINET_CONTACT = RAW_CABINET_CONTACT;
export function formatCurrencyTND(amount: number, locale: Locale): string {
  const bcp47 = locale === "ar" ? "ar-TN" : locale === "fr" ? "fr-TN" : "en-US";
  return new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}

export function formatLocalizedDate(isoDate: string, locale: Locale): string {
  const bcp47 = locale === "ar" ? "ar-TN" : locale === "fr" ? "fr-TN" : "en-GB";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat(bcp47, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export interface PracticeAreaItem {
  id: string;
  icon: string;
  title: string;
  summary: string;
  bullets: string[];
}

export interface InsightArticle {
  slug: string;
  category: string;
  publishedIso: string;
  readMinutes: number;
  title: string;
  excerpt: string;
  body: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Dictionary {
  dir: "ltr" | "rtl";
  langLabel: string;
  barBadge: string;
  attorneyName: string;
  cabinetTitle: string;
  nav: {
    about: string;
    practices: string;
    insights: string;
    faq: string;
    contact: string;
    bookCta: string;
    staffPortal: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    pillars: { label: string; value: string }[];
  };
  about: {
    sectionTag: string;
    heading: string;
    paragraphs: string[];
    credentialsTitle: string;
    credentials: string[];
    values: { title: string; text: string }[];
  };
  practicesSection: {
    sectionTag: string;
    heading: string;
    intro: string;
    items: PracticeAreaItem[];
  };
  booking: {
    sectionTag: string;
    heading: string;
    subtitle: string;
    fields: {
      name: string;
      phone: string;
      email: string;
      practice: string;
      mode: string;
      modes: Record<"in_office" | "phone_video" | "urgent", string>;
      date: string;
      slot: string;
      subject: string;
      subjectPlaceholder: string;
      submit: string;
      confidentialityNote: string;
    };
    confirmationTitle: string;
    confirmationText: string;
  };
  insightsSection: {
    sectionTag: string;
    heading: string;
    subtitle: string;
    readMore: string;
    articles: InsightArticle[];
  };
  faqSection: {
    sectionTag: string;
    heading: string;
    items: FaqItem[];
  };
  contactSection: {
    sectionTag: string;
    heading: string;
    hoursTitle: string;
    hoursLines: string[];
    phoneLabel: string;
    mobileLabel: string;
    whatsappLabel: string;
    emailLabel: string;
    mapButton: string;
  };
  avatar: {
    fabLabel: string;
    badge: string;
    drawerTitle: string;
    drawerSubtitle: string;
    stageStatus: string;
    stageCaption: string;
    disclaimer: string;
    quickPrompts: { label: string; reply: string }[];
    bookRedirect: string;
  };
  footer: {
    rights: string;
    ethicsNote: string;
  };
}


export const DICTIONARIES = RAW_DICTIONARIES as Record<Locale, Dictionary>;

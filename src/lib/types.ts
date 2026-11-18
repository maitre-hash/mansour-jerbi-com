export type Locale = "fr" | "ar" | "en";

export type ConsultationMode = "in_office" | "phone_video" | "urgent";
export type AppointmentStatus = "pending" | "confirmed" | "rescheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  booking_ref: string;
  client_name: string;
  phone: string;
  email: string;
  preferred_locale: Locale;
  practice_area: string;
  consultation_mode: ConsultationMode;
  preferred_date: string;
  preferred_slot: string;
  subject: string;
  status: AppointmentStatus;
  internal_notes: string;
  created_at: string;
}

export interface Client {
  id: string;
  full_name: string;
  national_id_or_tax: string;
  phone: string;
  email: string;
  city: string;
  preferred_locale: Locale;
  confidential_notes: string;
  created_at: string;
}

export type DossierStatus = "open" | "instruction" | "pleading" | "deliberation" | "closed";

export interface Dossier {
  id: string;
  reference: string;
  client_id?: string | null;
  client_name: string;
  title: string;
  practice_area: string;
  court: string;
  opposing_party: string;
  status: DossierStatus;
  notes: string;
  opened_on: string;
  created_at: string;
}

export type HearingType = "audience" | "deadline" | "expertise" | "signature";
export type PriorityLevel = "normal" | "high" | "urgent";

export interface Hearing {
  id: string;
  dossier_id?: string | null;
  dossier_ref: string;
  hearing_type: HearingType;
  court: string;
  chamber: string;
  scheduled_at: string;
  action_required: string;
  priority: PriorityLevel;
  completed: boolean;
  created_at: string;
}

export type DocumentCategory =
  | "pleading"
  | "contract"
  | "judgment"
  | "identity"
  | "evidence"
  | "correspondence";

export interface CaseDocument {
  id: string;
  dossier_id?: string | null;
  dossier_ref: string;
  title: string;
  category: DocumentCategory;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  uploaded_at: string;
}

export type InvoiceStatus = "unpaid" | "partial" | "paid";

export interface Invoice {
  id: string;
  invoice_number: string;
  dossier_id?: string | null;
  dossier_ref: string;
  client_name: string;
  description: string;
  amount_ht: number;
  vat_rate: number;
  stamp_duty: number;
  amount_ttc: number;
  amount_paid: number;
  status: InvoiceStatus;
  issued_on: string;
  due_on?: string | null;
  created_at: string;
}

export interface AvatarSessionResponse {
  enabled: boolean;
  provider: string;
  sessionToken: string | null;
  personaName: string;
  disclaimer: Record<Locale, string>;
}

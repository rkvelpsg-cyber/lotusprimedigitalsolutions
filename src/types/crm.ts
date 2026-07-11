// ─────────────────────────────────────────────────────────────
// CRM TypeScript Types — mirroring the Supabase schema
// ─────────────────────────────────────────────────────────────

export type UserRole = "admin" | "manager" | "agent";
export type ContactStatus = "active" | "inactive";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "unqualified"
  | "converted";
export type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type EmailStatus = "draft" | "sent" | "received" | "failed";
export type LeadSource =
  | "website"
  | "referral"
  | "social_media"
  | "cold_call"
  | "email"
  | "event"
  | "other";
export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "500+";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  size: CompanySize | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  annual_revenue: number | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // joined
  contacts?: Contact[];
  deals?: Deal[];
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  company_id: string | null;
  status: ContactStatus;
  source: LeadSource | null;
  description: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // joined
  company?: Company | null;
  assignee?: Profile | null;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  source: LeadSource | null;
  status: LeadStatus;
  estimated_value: number | null;
  description: string | null;
  assigned_to: string | null;
  created_by: string | null;
  converted_at: string | null;
  converted_contact_id: string | null;
  created_at: string;
  updated_at: string;
  // joined
  assignee?: Profile | null;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  contact_id: string | null;
  company_id: string | null;
  expected_close_date: string | null;
  actual_close_date: string | null;
  description: string | null;
  loss_reason: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // joined
  contact?: Contact | null;
  company?: Company | null;
  assignee?: Profile | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  contact_id: string | null;
  deal_id: string | null;
  company_id: string | null;
  lead_id: string | null;
  assigned_to: string | null;
  created_by: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  contact?: Contact | null;
  deal?: Deal | null;
  assignee?: Profile | null;
}

export interface Note {
  id: string;
  content: string;
  contact_id: string | null;
  deal_id: string | null;
  company_id: string | null;
  lead_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile | null;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string | null;
  entity_type: string | null;
  entity_id: string | null;
  contact_id: string | null;
  deal_id: string | null;
  company_id: string | null;
  lead_id: string | null;
  created_by: string | null;
  created_at: string;
  author?: Profile | null;
}

export interface Email {
  id: string;
  subject: string;
  body: string | null;
  from_email: string;
  to_email: string;
  cc: string | null;
  status: EmailStatus;
  contact_id: string | null;
  deal_id: string | null;
  lead_id: string | null;
  sent_at: string | null;
  created_by: string | null;
  created_at: string;
  contact?: Contact | null;
}

// ── Insert types (omit auto-generated fields) ──────────────
export type InsertLead = Omit<
  Lead,
  "id" | "created_at" | "updated_at" | "assignee"
>;
export type InsertContact = Omit<
  Contact,
  "id" | "created_at" | "updated_at" | "company" | "assignee"
>;
export type InsertCompany = Omit<
  Company,
  "id" | "created_at" | "updated_at" | "contacts" | "deals"
>;
export type InsertDeal = Omit<
  Deal,
  "id" | "created_at" | "updated_at" | "contact" | "company" | "assignee"
>;
export type InsertTask = Omit<
  Task,
  "id" | "created_at" | "updated_at" | "contact" | "deal" | "assignee"
>;
export type InsertNote = Omit<
  Note,
  "id" | "created_at" | "updated_at" | "author"
>;
export type InsertEmail = Omit<Email, "id" | "created_at" | "contact">;

// ── Dashboard stats ────────────────────────────────────────
export interface CRMStats {
  totalLeads: number;
  totalContacts: number;
  totalCompanies: number;
  openDealsValue: number;
  openDealsCount: number;
  wonDealsValue: number;
  tasksDueToday: number;
  tasksOverdue: number;
}

// ── Kanban column ──────────────────────────────────────────
export interface KanbanColumn {
  stage: DealStage;
  label: string;
  color: string;
  probability: number;
  deals: Deal[];
}

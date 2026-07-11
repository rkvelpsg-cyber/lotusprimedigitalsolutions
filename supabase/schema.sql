-- ================================================================
-- Lotus Prime CRM – Supabase Tables
-- Safe to run multiple times. Drops existing policies before recreating.
-- HOW TO RUN:
--   1. Go to https://supabase.com/dashboard/project/jianxpdkfsuxgngpoqmd/sql/new
--   2. Paste this entire file and click "Run"
-- ================================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES (auto-created from auth.users) ─────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name  TEXT,
  email      TEXT,
  role       TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin','manager','agent')),
  phone      TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── COMPANIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.companies (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT NOT NULL,
  website        TEXT,
  industry       TEXT,
  size           TEXT CHECK (size IN ('1-10','11-50','51-200','201-500','500+')),
  phone          TEXT,
  email          TEXT,
  address        TEXT,
  city           TEXT,
  state          TEXT,
  country        TEXT DEFAULT 'India',
  annual_revenue DECIMAL(15,2),
  description    TEXT,
  created_by     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CONTACTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contacts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  title       TEXT,
  company_id  UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  source      TEXT CHECK (source IN ('website','referral','social_media','cold_call','email','event','other')),
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LEADS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name           TEXT NOT NULL,
  last_name            TEXT NOT NULL,
  email                TEXT,
  phone                TEXT,
  company              TEXT,
  title                TEXT,
  source               TEXT CHECK (source IN ('website','referral','social_media','cold_call','email','event','other')),
  status               TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','unqualified','converted')),
  estimated_value      DECIMAL(12,2),
  description          TEXT,
  assigned_to          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  converted_at         TIMESTAMPTZ,
  converted_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DEALS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.deals (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title               TEXT NOT NULL,
  value               DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'INR',
  stage               TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead','qualified','proposal','negotiation','won','lost')),
  probability         INTEGER DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
  contact_id          UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  company_id          UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  expected_close_date DATE,
  actual_close_date   DATE,
  description         TEXT,
  loss_reason         TEXT,
  assigned_to         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TASKS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  due_date     TIMESTAMPTZ,
  priority     TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  contact_id   UUID REFERENCES public.contacts(id)  ON DELETE SET NULL,
  deal_id      UUID REFERENCES public.deals(id)     ON DELETE SET NULL,
  company_id   UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  lead_id      UUID REFERENCES public.leads(id)     ON DELETE SET NULL,
  assigned_to  UUID REFERENCES public.profiles(id)  ON DELETE SET NULL,
  created_by   UUID REFERENCES public.profiles(id)  ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── NOTES ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content    TEXT NOT NULL,
  contact_id UUID REFERENCES public.contacts(id)  ON DELETE CASCADE,
  deal_id    UUID REFERENCES public.deals(id)     ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  lead_id    UUID REFERENCES public.leads(id)     ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id)  ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ACTIVITIES (audit log) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activities (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN (
                'lead_created','lead_updated','lead_converted',
                'contact_created','contact_updated',
                'company_created','company_updated',
                'deal_created','deal_stage_changed','deal_won','deal_lost',
                'task_created','task_completed',
                'note_added','email_sent','call_logged','meeting_logged')),
  title       TEXT NOT NULL,
  description TEXT,
  entity_type TEXT CHECK (entity_type IN ('lead','contact','company','deal','task')),
  entity_id   UUID,
  contact_id  UUID REFERENCES public.contacts(id)  ON DELETE SET NULL,
  deal_id     UUID REFERENCES public.deals(id)     ON DELETE SET NULL,
  company_id  UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  lead_id     UUID REFERENCES public.leads(id)     ON DELETE SET NULL,
  created_by  UUID REFERENCES public.profiles(id)  ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── EMAILS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emails (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject    TEXT NOT NULL,
  body       TEXT,
  from_email TEXT NOT NULL,
  to_email   TEXT NOT NULL,
  cc         TEXT,
  status     TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','received','failed')),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  deal_id    UUID REFERENCES public.deals(id)    ON DELETE SET NULL,
  lead_id    UUID REFERENCES public.leads(id)    ON DELETE SET NULL,
  sent_at    TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_contacts_company   ON public.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned  ON public.contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status       ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned     ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage        ON public.deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_assigned     ON public.deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status       ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due          ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned     ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_activities_entity  ON public.activities(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON public.activities(created_at DESC);

-- ─── updated_at TRIGGER FUNCTION ─────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at   ON public.profiles;
DROP TRIGGER IF EXISTS trg_companies_updated_at  ON public.companies;
DROP TRIGGER IF EXISTS trg_contacts_updated_at   ON public.contacts;
DROP TRIGGER IF EXISTS trg_leads_updated_at      ON public.leads;
DROP TRIGGER IF EXISTS trg_deals_updated_at      ON public.deals;
DROP TRIGGER IF EXISTS trg_tasks_updated_at      ON public.tasks;
DROP TRIGGER IF EXISTS trg_notes_updated_at      ON public.notes;

CREATE TRIGGER trg_profiles_updated_at   BEFORE UPDATE ON public.profiles   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_companies_updated_at  BEFORE UPDATE ON public.companies  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_contacts_updated_at   BEFORE UPDATE ON public.contacts   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_leads_updated_at      BEFORE UPDATE ON public.leads      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_deals_updated_at      BEFORE UPDATE ON public.deals      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_tasks_updated_at      BEFORE UPDATE ON public.tasks      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_notes_updated_at      BEFORE UPDATE ON public.notes      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── AUTO-CREATE PROFILE ON SIGN-UP ──────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails     ENABLE ROW LEVEL SECURITY;

-- Drop all policies first so this script is safe to re-run
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

DROP POLICY IF EXISTS "companies_select" ON public.companies;
DROP POLICY IF EXISTS "companies_insert" ON public.companies;
DROP POLICY IF EXISTS "companies_update" ON public.companies;
DROP POLICY IF EXISTS "companies_delete" ON public.companies;

DROP POLICY IF EXISTS "contacts_select" ON public.contacts;
DROP POLICY IF EXISTS "contacts_insert" ON public.contacts;
DROP POLICY IF EXISTS "contacts_update" ON public.contacts;
DROP POLICY IF EXISTS "contacts_delete" ON public.contacts;

DROP POLICY IF EXISTS "leads_select" ON public.leads;
DROP POLICY IF EXISTS "leads_insert" ON public.leads;
DROP POLICY IF EXISTS "leads_update" ON public.leads;
DROP POLICY IF EXISTS "leads_delete" ON public.leads;

DROP POLICY IF EXISTS "deals_select" ON public.deals;
DROP POLICY IF EXISTS "deals_insert" ON public.deals;
DROP POLICY IF EXISTS "deals_update" ON public.deals;
DROP POLICY IF EXISTS "deals_delete" ON public.deals;

DROP POLICY IF EXISTS "tasks_select" ON public.tasks;
DROP POLICY IF EXISTS "tasks_insert" ON public.tasks;
DROP POLICY IF EXISTS "tasks_update" ON public.tasks;
DROP POLICY IF EXISTS "tasks_delete" ON public.tasks;

DROP POLICY IF EXISTS "notes_select" ON public.notes;
DROP POLICY IF EXISTS "notes_insert" ON public.notes;
DROP POLICY IF EXISTS "notes_update" ON public.notes;
DROP POLICY IF EXISTS "notes_delete" ON public.notes;

DROP POLICY IF EXISTS "activities_select" ON public.activities;
DROP POLICY IF EXISTS "activities_insert" ON public.activities;

DROP POLICY IF EXISTS "emails_select" ON public.emails;
DROP POLICY IF EXISTS "emails_insert" ON public.emails;
DROP POLICY IF EXISTS "emails_update" ON public.emails;
DROP POLICY IF EXISTS "emails_delete" ON public.emails;

-- profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- companies
CREATE POLICY "companies_select" ON public.companies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "companies_insert" ON public.companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "companies_update" ON public.companies FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "companies_delete" ON public.companies FOR DELETE USING (auth.role() = 'authenticated');

-- contacts
CREATE POLICY "contacts_select" ON public.contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "contacts_insert" ON public.contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "contacts_update" ON public.contacts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "contacts_delete" ON public.contacts FOR DELETE USING (auth.role() = 'authenticated');

-- leads
CREATE POLICY "leads_select" ON public.leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "leads_insert" ON public.leads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "leads_update" ON public.leads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "leads_delete" ON public.leads FOR DELETE USING (auth.role() = 'authenticated');

-- deals
CREATE POLICY "deals_select" ON public.deals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "deals_insert" ON public.deals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "deals_update" ON public.deals FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "deals_delete" ON public.deals FOR DELETE USING (auth.role() = 'authenticated');

-- tasks
CREATE POLICY "tasks_select" ON public.tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "tasks_insert" ON public.tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "tasks_update" ON public.tasks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "tasks_delete" ON public.tasks FOR DELETE USING (auth.role() = 'authenticated');

-- notes
CREATE POLICY "notes_select" ON public.notes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "notes_insert" ON public.notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "notes_update" ON public.notes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "notes_delete" ON public.notes FOR DELETE USING (auth.role() = 'authenticated');

-- activities
CREATE POLICY "activities_select" ON public.activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "activities_insert" ON public.activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- emails
CREATE POLICY "emails_select" ON public.emails FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "emails_insert" ON public.emails FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "emails_update" ON public.emails FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "emails_delete" ON public.emails FOR DELETE USING (auth.role() = 'authenticated');

-- ─── BACKFILL: create profiles for any existing auth users ───
-- Creates a profile for users who signed up before the trigger existed.
INSERT INTO public.profiles (id, email, full_name)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email,'@',1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

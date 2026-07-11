-- ================================================================
-- Lotus Prime Employee Portal – Supabase Tables
-- HOW TO RUN:
--   1. Go to https://supabase.com/dashboard/project/jianxpdkfsuxgngpoqmd/sql/new
--   2. Paste this entire file and click "Run"
-- ================================================================

-- ─── EMPLOYEES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employees (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  employee_id  TEXT UNIQUE NOT NULL,
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  role         TEXT NOT NULL,
  department   TEXT NOT NULL,
  manager_id   UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  status       TEXT DEFAULT 'active' CHECK (status IN ('active','on-leave','inactive')),
  joined_date  DATE,
  salary       DECIMAL(12,2),
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PROJECTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_projects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  client      TEXT,
  status      TEXT DEFAULT 'on-track' CHECK (status IN ('on-track','at-risk','behind','completed','cancelled')),
  progress    INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget      DECIMAL(15,2),
  start_date  DATE,
  due_date    DATE,
  description TEXT,
  created_by  UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PROJECT MEMBERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_project_members (
  project_id  UUID REFERENCES public.emp_projects(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id)   ON DELETE CASCADE,
  role        TEXT DEFAULT 'member',
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, employee_id)
);

-- ─── TASKS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_tasks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  project_id  UUID REFERENCES public.emp_projects(id)  ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.employees(id)     ON DELETE SET NULL,
  priority    TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status      TEXT DEFAULT 'To Do'  CHECK (status IN ('To Do','In Progress','Blocked','Review','Completed')),
  due_date    DATE,
  comments    INTEGER DEFAULT 0,
  attachments INTEGER DEFAULT 0,
  created_by  UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TIMESHEETS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_timesheets (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id)    ON DELETE CASCADE,
  project_id  UUID REFERENCES public.emp_projects(id) ON DELETE SET NULL,
  work_date   DATE NOT NULL,
  hours       DECIMAL(4,2) DEFAULT 0,
  notes       TEXT,
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected')),
  week_start  DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ATTENDANCE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_attendance (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id  UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  work_date    DATE NOT NULL,
  punch_in     TIMESTAMPTZ,
  punch_out    TIMESTAMPTZ,
  hours_worked DECIMAL(4,2),
  work_type    TEXT DEFAULT 'office' CHECK (work_type IN ('office','remote','hybrid')),
  status       TEXT DEFAULT 'present' CHECK (status IN ('present','absent','leave','holiday')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employee_id, work_date)
);

-- ─── LEAVE BALANCE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_leave_balance (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type  TEXT NOT NULL,
  total       INTEGER NOT NULL DEFAULT 0,
  used        INTEGER DEFAULT 0,
  pending     INTEGER DEFAULT 0,
  year        INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER,
  UNIQUE (employee_id, leave_type, year)
);

-- ─── LEAVE REQUESTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_leaves (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type  TEXT NOT NULL,
  from_date   DATE NOT NULL,
  to_date     DATE NOT NULL,
  days        INTEGER NOT NULL,
  reason      TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── MEETINGS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_meetings (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  date       DATE NOT NULL,
  time       TIME NOT NULL,
  duration   TEXT,
  type       TEXT DEFAULT 'team' CHECK (type IN ('team','client','1on1','all-hands')),
  organizer  UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  meet_link  TEXT,
  notes      TEXT,
  status     TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','upcoming','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── MEETING ATTENDEES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_meeting_attendees (
  meeting_id  UUID REFERENCES public.emp_meetings(id)  ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id)     ON DELETE CASCADE,
  status      TEXT DEFAULT 'invited' CHECK (status IN ('invited','accepted','declined')),
  PRIMARY KEY (meeting_id, employee_id)
);

-- ─── MEETING ACTION ITEMS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_meeting_actions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id  UUID REFERENCES public.emp_meetings(id)  ON DELETE CASCADE,
  action      TEXT NOT NULL,
  assigned_to UUID REFERENCES public.employees(id)     ON DELETE SET NULL,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DOCUMENTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_documents (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('hr','salary','project','training','other')),
  file_url    TEXT,
  file_size   TEXT,
  file_type   TEXT,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  type        TEXT DEFAULT 'default' CHECK (type IN ('warning','success','info','default')),
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLIENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_clients (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT NOT NULL,
  contact_person TEXT,
  email          TEXT,
  phone          TEXT,
  total_value    DECIMAL(15,2),
  status         TEXT DEFAULT 'active' CHECK (status IN ('active','prospect','inactive')),
  created_by     UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PERFORMANCE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_performance (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id         UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  period              TEXT NOT NULL,
  overall_score       INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  task_completion     INTEGER CHECK (task_completion >= 0 AND task_completion <= 100),
  code_quality        INTEGER CHECK (code_quality >= 0 AND code_quality <= 100),
  collaboration       INTEGER CHECK (collaboration >= 0 AND collaboration <= 100),
  attendance          INTEGER CHECK (attendance >= 0 AND attendance <= 100),
  client_satisfaction INTEGER CHECK (client_satisfaction >= 0 AND client_satisfaction <= 100),
  reviewer_id         UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  review_date         DATE,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LEARNING / COURSES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emp_courses (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  provider   TEXT,
  category   TEXT,
  duration   TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emp_course_progress (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id  UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES public.emp_courses(id) ON DELETE CASCADE,
  progress     INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date     DATE,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employee_id, course_id)
);

-- ─── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_emp_tasks_assigned   ON public.emp_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_emp_tasks_project    ON public.emp_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_emp_tasks_status     ON public.emp_tasks(status);
CREATE INDEX IF NOT EXISTS idx_emp_timesheets_emp   ON public.emp_timesheets(employee_id, work_date);
CREATE INDEX IF NOT EXISTS idx_emp_attendance_emp   ON public.emp_attendance(employee_id, work_date);
CREATE INDEX IF NOT EXISTS idx_emp_leaves_emp       ON public.emp_leaves(employee_id);
CREATE INDEX IF NOT EXISTS idx_emp_notifs_emp       ON public.emp_notifications(employee_id, read);
CREATE INDEX IF NOT EXISTS idx_emp_proj_members     ON public.emp_project_members(employee_id);

-- ─── updated_at TRIGGER ──────────────────────────────────────
-- Reuses the function created by CRM schema (update_updated_at_column).
-- If running standalone, uncomment:
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_employees_updated_at      ON public.employees;
DROP TRIGGER IF EXISTS trg_emp_projects_updated_at   ON public.emp_projects;
DROP TRIGGER IF EXISTS trg_emp_tasks_updated_at      ON public.emp_tasks;
DROP TRIGGER IF EXISTS trg_emp_timesheets_updated_at ON public.emp_timesheets;
DROP TRIGGER IF EXISTS trg_emp_leaves_updated_at     ON public.emp_leaves;
DROP TRIGGER IF EXISTS trg_emp_meetings_updated_at   ON public.emp_meetings;
DROP TRIGGER IF EXISTS trg_emp_clients_updated_at    ON public.emp_clients;

CREATE TRIGGER trg_employees_updated_at      BEFORE UPDATE ON public.employees       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_emp_projects_updated_at   BEFORE UPDATE ON public.emp_projects    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_emp_tasks_updated_at      BEFORE UPDATE ON public.emp_tasks       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_emp_timesheets_updated_at BEFORE UPDATE ON public.emp_timesheets  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_emp_leaves_updated_at     BEFORE UPDATE ON public.emp_leaves      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_emp_meetings_updated_at   BEFORE UPDATE ON public.emp_meetings    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_emp_clients_updated_at    BEFORE UPDATE ON public.emp_clients     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.employees           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_timesheets      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_attendance      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_leave_balance   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_leaves          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_meetings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_meeting_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_meeting_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_documents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_clients         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_performance     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_courses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emp_course_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (idempotent)
DO $$ DECLARE t TEXT; op TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'employees','emp_projects','emp_project_members','emp_tasks',
    'emp_timesheets','emp_attendance','emp_leave_balance','emp_leaves',
    'emp_meetings','emp_meeting_attendees','emp_meeting_actions',
    'emp_documents','emp_notifications','emp_clients',
    'emp_performance','emp_courses','emp_course_progress'
  ]) LOOP
    FOR op IN SELECT unnest(ARRAY['SELECT','INSERT','UPDATE','DELETE']) LOOP
      EXECUTE format('DROP POLICY IF EXISTS "emp_%s_%s" ON public.%s', op, t, t);
    END LOOP;
  END LOOP;
END $$;

-- All authenticated users can read/write employee data
DO $$ DECLARE t TEXT; op TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'employees','emp_projects','emp_project_members','emp_tasks',
    'emp_timesheets','emp_attendance','emp_leave_balance','emp_leaves',
    'emp_meetings','emp_meeting_attendees','emp_meeting_actions',
    'emp_documents','emp_notifications','emp_clients',
    'emp_performance','emp_courses','emp_course_progress'
  ]) LOOP
    FOR op IN SELECT unnest(ARRAY['SELECT','INSERT','UPDATE','DELETE']) LOOP
      IF op = 'INSERT' THEN
        EXECUTE format('CREATE POLICY "emp_%s_%s" ON public.%s FOR %s WITH CHECK (auth.role() = ''authenticated'')', op, t, t, op);
      ELSE
        EXECUTE format('CREATE POLICY "emp_%s_%s" ON public.%s FOR %s USING (auth.role() = ''authenticated'')', op, t, t, op);
      END IF;
    END LOOP;
  END LOOP;
END $$;

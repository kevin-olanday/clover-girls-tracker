-- ============================================================
-- Clover Girls Club — Event & Finance Management
-- init.sql — Run in Supabase SQL Editor to set up the schema
-- ============================================================

-- 1. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date date,
  venue_name text,
  capacity integer NOT NULL DEFAULT 0,
  registered_count integer NOT NULL DEFAULT 0,
  entrance_fee_per_girl numeric NOT NULL DEFAULT 0,
  food_cost_per_girl numeric NOT NULL DEFAULT 0,
  other_expenses numeric NOT NULL DEFAULT 0,
  notes text,
  other_expenses_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE
  TO anon, authenticated USING (true);

-- 2. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'Medium',
  estimated_cost numeric NOT NULL DEFAULT 0,
  actual_cost numeric NOT NULL DEFAULT 0,
  is_purchased boolean NOT NULL DEFAULT false,
  item_type text,
  item_link text,
  notes text,
  quantity_details text
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_expenses" ON expenses;
CREATE POLICY "anon_select_expenses" ON expenses FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_expenses" ON expenses;
CREATE POLICY "anon_insert_expenses" ON expenses FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_expenses" ON expenses;
CREATE POLICY "anon_update_expenses" ON expenses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_expenses" ON expenses;
CREATE POLICY "anon_delete_expenses" ON expenses FOR DELETE
  TO anon, authenticated USING (true);

-- 3. VENUES TABLE
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  date date,
  time text,
  deposit numeric NOT NULL DEFAULT 0,
  capacity integer NOT NULL DEFAULT 0,
  rental_fee numeric NOT NULL DEFAULT 0,
  hours text,
  batch text,
  status text NOT NULL DEFAULT 'Pending',
  availability text,
  notes text
);

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_venues" ON venues;
CREATE POLICY "anon_select_venues" ON venues FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_venues" ON venues;
CREATE POLICY "anon_insert_venues" ON venues FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_venues" ON venues;
CREATE POLICY "anon_update_venues" ON venues FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_venues" ON venues;
CREATE POLICY "anon_delete_venues" ON venues FOR DELETE
  TO anon, authenticated USING (true);

-- 4. INCOME_RECORDS TABLE
CREATE TABLE IF NOT EXISTS income_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  date date,
  time text,
  amount numeric NOT NULL DEFAULT 0,
  venue_name text,
  batch text,
  status text NOT NULL DEFAULT 'Pending',
  notes text
);

ALTER TABLE income_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_income" ON income_records;
CREATE POLICY "anon_select_income" ON income_records FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_income" ON income_records;
CREATE POLICY "anon_insert_income" ON income_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_income" ON income_records;
CREATE POLICY "anon_update_income" ON income_records FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_income" ON income_records;
CREATE POLICY "anon_delete_income" ON income_records FOR DELETE
  TO anon, authenticated USING (true);

-- 5. MEMBERS TABLE
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'Member',
  phone_number text,
  email text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_members" ON members;
CREATE POLICY "anon_select_members" ON members FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_members" ON members;
CREATE POLICY "anon_insert_members" ON members FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_members" ON members;
CREATE POLICY "anon_update_members" ON members FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_members" ON members;
CREATE POLICY "anon_delete_members" ON members FOR DELETE
  TO anon, authenticated USING (true);

-- INDEXES
-- 6. EVENT_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS event_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (event_id, member_id)
);

ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_event_members" ON event_members;
CREATE POLICY "anon_select_event_members" ON event_members FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_event_members" ON event_members;
CREATE POLICY "anon_insert_event_members" ON event_members FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_event_members" ON event_members;
CREATE POLICY "anon_update_event_members" ON event_members FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_event_members" ON event_members;
CREATE POLICY "anon_delete_event_members" ON event_members FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_income_event_id ON income_records(event_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_members_last_name ON members(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_event_members_event_id ON event_members(event_id);
CREATE INDEX IF NOT EXISTS idx_event_members_member_id ON event_members(member_id);

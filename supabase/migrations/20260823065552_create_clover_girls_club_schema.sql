/*
# Clover Girls Club — Event & Finance Management Schema

## Overview
Creates the core tables for the Clover Girls Club event and finance management app:
events, expenses, venues, and income_records. This is a single-tenant app with no
sign-in screen, so all policies allow anon + authenticated CRUD (data is intentionally
shared/public within the club).

## New Tables

1. `events`
   - id (uuid, primary key)
   - name (text) — event name
   - date (date) — event date
   - venue_name (text) — venue name
   - capacity (integer) — max attendees
   - registered_count (integer) — current registrations
   - entrance_fee_per_girl (numeric) — fee per attendee
   - food_cost_per_girl (numeric) — food cost per attendee
   - other_expenses (numeric) — miscellaneous expenses
   - created_at (timestamptz)

2. `expenses`
   - id (uuid, primary key)
   - event_id (uuid, foreign key → events, nullable) — optional link to an event
   - description (text) — item description
   - priority (text: 'High', 'Medium', 'Low') — procurement priority
   - estimated_cost (numeric) — budgeted cost
   - actual_cost (numeric) — real cost
   - is_purchased (boolean) — purchase status toggle
   - item_type (text) — category/type
   - item_link (text) — URL to item
   - notes (text)

3. `venues`
   - id (uuid, primary key)
   - name (text) — venue name
   - location (text) — venue location
   - date (date) — booking date
   - time (text) — booking time
   - deposit (numeric) — deposit paid
   - capacity (integer) — venue capacity
   - rental_fee (numeric) — rental fee
   - hours (text) — hours booked
   - batch (text) — batch label
   - status (text: 'Booked', 'Confirmed', 'Pending') — booking status
   - availability (text) — availability notes
   - notes (text)

4. `income_records`
   - id (uuid, primary key)
   - event_id (uuid, foreign key → events) — linked event
   - date (date) — payment date
   - time (text) — payment time
   - amount (numeric) — payment amount
   - venue_name (text) — venue name
   - batch (text) — batch name
   - status (text: 'Received', 'Expected', 'Pending') — payment status
   - notes (text)

## Security
- RLS enabled on all four tables.
- Policies allow anon + authenticated full CRUD because this is a no-auth single-tenant
  app where the data is intentionally shared within the club.

## Notes
1. All numeric monetary columns use numeric type for precision.
2. Foreign keys use ON DELETE SET NULL for expenses (nullable link) and ON DELETE SET NULL
   for income_records to preserve historical financial records if an event is removed.
3. created_at defaults to now() for events.
*/

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
  notes text
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

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_income_event_id ON income_records(event_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

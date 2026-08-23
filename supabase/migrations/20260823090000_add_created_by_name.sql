ALTER TABLE events        ADD COLUMN IF NOT EXISTS created_by_name TEXT;
ALTER TABLE expenses      ADD COLUMN IF NOT EXISTS created_by_name TEXT;
ALTER TABLE venues        ADD COLUMN IF NOT EXISTS created_by_name TEXT;
ALTER TABLE income_records ADD COLUMN IF NOT EXISTS created_by_name TEXT;
ALTER TABLE members       ADD COLUMN IF NOT EXISTS created_by_name TEXT;

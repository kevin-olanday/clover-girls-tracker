-- Add quantity_details to expenses and other_expenses_notes to events
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS quantity_details text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS other_expenses_notes text;

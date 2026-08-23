-- Add missing columns to accommodate the full spreadsheet data

-- events: add notes column for "Other Event Expenses" text field
ALTER TABLE events ADD COLUMN IF NOT EXISTS notes text;

-- expenses: add quantity_details column for "Quantity/Details" field
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS quantity_details text;
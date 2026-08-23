ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES venues(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS expenses_one_venue_rental
  ON expenses (venue_id)
  WHERE venue_id IS NOT NULL;

INSERT INTO expenses (
  venue_id,
  description,
  priority,
  estimated_cost,
  actual_cost,
  is_purchased,
  item_type,
  notes
)
SELECT
  v.id,
  v.name || ' rental',
  'High',
  v.rental_fee,
  0,
  false,
  'Venue Rental',
  'Automatically linked from Venues.'
FROM venues v
WHERE v.rental_fee > 0
  AND NOT EXISTS (
    SELECT 1 FROM expenses e WHERE e.venue_id = v.id
  );

DELETE FROM expenses
WHERE venue_id IS NULL
  AND (
    item_type ILIKE '%venue%'
    OR item_type ILIKE '%deposit%'
    OR description ILIKE '%venue rental%'
    OR description ILIKE '%deposit%'
  );

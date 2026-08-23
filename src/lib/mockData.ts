import { ClubEvent, EventMemberLink, Expense, IncomeRecord, Member, Venue } from './types';

export const mockEvents: ClubEvent[] = [
  {
    id: 'mock-event-qc',
    name: 'Sip, Paint & Meet - QC',
    date: '2026-09-05',
    venue_name: 'The Greenhouse QC',
    capacity: 30,
    registered_count: 23,
    entrance_fee_per_girl: 850,
    food_cost_per_girl: 300,
    other_expenses: 1200,
    created_at: '2026-08-01T09:00:00Z',
    created_by_name: 'Jann',
  },
  {
    id: 'mock-event-makati',
    name: 'Sip, Paint & Meet - Makati',
    date: '2026-09-12',
    venue_name: 'The Corner House Makati',
    capacity: 28,
    registered_count: 20,
    entrance_fee_per_girl: 850,
    food_cost_per_girl: 300,
    other_expenses: 900,
    created_at: '2026-08-02T09:00:00Z',
    created_by_name: 'Jenn',
  },
  {
    id: 'mock-event-picnic',
    name: 'Lucky Girls Picnic',
    date: '2026-10-03',
    venue_name: 'Ayala Triangle Gardens',
    capacity: 40,
    registered_count: 14,
    entrance_fee_per_girl: 500,
    food_cost_per_girl: 180,
    other_expenses: 600,
    created_at: '2026-08-10T09:00:00Z',
    created_by_name: 'Jena',
  },
];

export const mockVenues: Venue[] = [
  {
    id: 'mock-venue-qc',
    name: 'The Greenhouse QC',
    location: 'Quezon City',
    date: '2026-09-05',
    time: '2:00 PM',
    deposit: 3000,
    capacity: 30,
    rental_fee: 6900,
    hours: '4 hours',
    batch: 'QC September',
    status: 'Confirmed',
    availability: 'Available',
    notes: 'Bright space with tables and natural light.',
    created_by_name: 'Jann',
  },
  {
    id: 'mock-venue-makati',
    name: 'The Corner House Makati',
    location: 'Makati',
    date: '2026-09-12',
    time: '2:00 PM',
    deposit: 2500,
    capacity: 28,
    rental_fee: 4500,
    hours: '4 hours',
    batch: 'Makati September',
    status: 'Booked',
    availability: 'Available',
    notes: 'Convenient for first-time attendees.',
    created_by_name: 'Jenn',
  },
];

export const mockExpenses = [
  { id: 'mock-expense-1', event_id: 'mock-event-qc', venue_id: null, description: 'Watercolor Paint Sets', priority: 'High', estimated_cost: 2400, actual_cost: 0, is_purchased: false, item_type: 'Event Materials', item_link: null, notes: 'Example estimate.', created_by_name: 'Jann', quantity_details: '24 sets' },
  { id: 'mock-expense-2', event_id: 'mock-event-qc', venue_id: null, description: 'Snack Boxes', priority: 'Medium', estimated_cost: 4200, actual_cost: 0, is_purchased: false, item_type: 'Food & Drinks', item_link: null, notes: 'Example estimate.', created_by_name: 'Jenn', quantity_details: '24 boxes' },
  { id: 'mock-expense-3', event_id: 'mock-event-qc', venue_id: 'mock-venue-qc', description: 'The Greenhouse rental', priority: 'High', estimated_cost: 6900, actual_cost: 0, is_purchased: false, item_type: 'Venue Rental', item_link: null, notes: 'Example estimate.', created_by_name: 'Jann', quantity_details: '4 hours' },
  { id: 'mock-expense-4', event_id: 'mock-event-makati', venue_id: null, description: 'Printed Activity Cards', priority: 'Medium', estimated_cost: 1100, actual_cost: 0, is_purchased: false, item_type: 'Marketing/Promotion', item_link: null, notes: 'Example estimate.', created_by_name: 'Jena', quantity_details: '50 cards' },
  { id: 'mock-expense-5', event_id: 'mock-event-makati', venue_id: null, description: 'Table Flowers', priority: 'Low', estimated_cost: 1500, actual_cost: 0, is_purchased: false, item_type: 'Decoration', item_link: null, notes: 'Example estimate.', created_by_name: 'Jenn', quantity_details: '6 arrangements' },
  { id: 'mock-expense-6', event_id: 'mock-event-makati', venue_id: 'mock-venue-makati', description: 'Corner House rental', priority: 'High', estimated_cost: 4500, actual_cost: 0, is_purchased: false, item_type: 'Venue Rental', item_link: null, notes: 'Example estimate.', created_by_name: 'Jenn', quantity_details: '4 hours' },
  { id: 'mock-expense-7', event_id: 'mock-event-picnic', venue_id: null, description: 'Picnic Blankets', priority: 'Low', estimated_cost: 1800, actual_cost: 0, is_purchased: false, item_type: 'Event Materials', item_link: null, notes: 'Reusable for future events.', created_by_name: 'Jena', quantity_details: '6 blankets' },
] as Expense[];

export const mockIncome: IncomeRecord[] = [
  { id: 'mock-income-1', event_id: 'mock-event-qc', date: '2026-08-15', time: '10:00 AM', amount: 11900, venue_name: 'The Greenhouse QC', batch: 'QC Example Batch', status: 'Expected', notes: 'Example estimate.', created_by_name: 'Jann' },
  { id: 'mock-income-2', event_id: 'mock-event-makati', date: '2026-08-18', time: '3:00 PM', amount: 10200, venue_name: 'The Corner House Makati', batch: 'Makati Example Batch', status: 'Expected', notes: 'Example estimate.', created_by_name: 'Jenn' },
  { id: 'mock-income-3', event_id: 'mock-event-picnic', date: '2026-08-22', time: '1:00 PM', amount: 7000, venue_name: 'Ayala Triangle Gardens', batch: 'Picnic Early Bird', status: 'Expected', notes: 'Early-bird registrations.', created_by_name: 'Jena' },
];

export const mockMembers: Member[] = [
  { id: 'mock-member-1', first_name: 'Demo', last_name: 'Member', role: 'Member', phone_number: null, email: null, notes: null, created_at: '2026-08-01T09:00:00Z', created_by_name: 'Jann' },
  { id: 'mock-member-2', first_name: 'Sample', last_name: 'Participant', role: 'Member', phone_number: null, email: null, notes: 'Example participant.', created_at: '2026-08-02T09:00:00Z', created_by_name: 'Jenn' },
  { id: 'mock-member-3', first_name: 'Demo', last_name: 'Founder', role: 'Founder', phone_number: null, email: null, notes: null, created_at: '2026-08-03T09:00:00Z', created_by_name: 'Jena' },
];

export const mockEventMembers: EventMemberLink[] = [
  { id: 'mock-link-1', event_id: 'mock-event-qc', member_id: 'mock-member-1', created_at: '2026-08-15T09:00:00Z' },
  { id: 'mock-link-2', event_id: 'mock-event-makati', member_id: 'mock-member-2', created_at: '2026-08-18T09:00:00Z' },
];

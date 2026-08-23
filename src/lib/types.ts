export type Priority = 'High' | 'Medium' | 'Low';
export type VenueStatus = 'Booked' | 'Confirmed' | 'Pending';
export type IncomeStatus = 'Received' | 'Expected' | 'Pending';

export interface ClubEvent {
  id: string;
  name: string;
  date: string | null;
  venue_name: string | null;
  capacity: number;
  registered_count: number;
  entrance_fee_per_girl: number;
  food_cost_per_girl: number;
  other_expenses: number;
  created_at: string;
  created_by_name: string | null;
}

export interface Expense {
  id: string;
  event_id: string | null;
  description: string;
  priority: Priority;
  estimated_cost: number;
  actual_cost: number;
  is_purchased: boolean;
  item_type: string | null;
  item_link: string | null;
  notes: string | null;
  created_by_name: string | null;
}

export interface Venue {
  id: string;
  name: string;
  location: string | null;
  date: string | null;
  time: string | null;
  deposit: number;
  capacity: number;
  rental_fee: number;
  hours: string | null;
  batch: string | null;
  status: VenueStatus;
  availability: string | null;
  notes: string | null;
  created_by_name: string | null;
}

export interface IncomeRecord {
  id: string;
  event_id: string | null;
  date: string | null;
  time: string | null;
  amount: number;
  venue_name: string | null;
  batch: string | null;
  status: IncomeStatus;
  notes: string | null;
  created_by_name: string | null;
}

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  created_by_name: string | null;
}

export interface EventMemberLink {
  id: string;
  event_id: string;
  member_id: string;
  created_at: string;
}

export type TabKey = 'dashboard' | 'events' | 'expenses' | 'venues' | 'members';

export interface EventCalculations {
  entranceRevenue: number;
  foodExpenses: number;
  netProfit: number;
  profitPerGirl: number;
  fillRate: number;
}

export function calcEvent(e: ClubEvent): EventCalculations {
  const entranceRevenue = e.registered_count * e.entrance_fee_per_girl;
  const foodExpenses = e.registered_count * e.food_cost_per_girl;
  const netProfit = entranceRevenue - foodExpenses - (e.other_expenses || 0);
  const profitPerGirl = e.registered_count > 0 ? netProfit / e.registered_count : 0;
  const fillRate = e.capacity > 0 ? (e.registered_count / e.capacity) * 100 : 0;
  return { entranceRevenue, foodExpenses, netProfit, profitPerGirl, fillRate };
}

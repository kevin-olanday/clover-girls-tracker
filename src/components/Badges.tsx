import { Priority, VenueStatus, IncomeStatus } from '@/lib/types';

const priorityStyles: Record<Priority, string> = {
  High: 'bg-coral-100 text-coral-600',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-sage-100 text-sage-600',
};

const venueStatusStyles: Record<VenueStatus, string> = {
  Booked: 'bg-slatey-100 text-slatey-600',
  Confirmed: 'bg-emeraldx-100 text-emeraldx-600',
  Pending: 'bg-amber-100 text-amber-700',
};

const incomeStatusStyles: Record<IncomeStatus, string> = {
  Received: 'bg-emeraldx-100 text-emeraldx-600',
  Expected: 'bg-amber-100 text-amber-700',
  Pending: 'bg-slatey-100 text-slatey-500',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`pill ${priorityStyles[priority]}`}>{priority}</span>;
}

export function VenueStatusBadge({ status }: { status: VenueStatus }) {
  return <span className={`pill ${venueStatusStyles[status]}`}>{status}</span>;
}

export function IncomeStatusBadge({ status }: { status: IncomeStatus }) {
  return <span className={`pill ${incomeStatusStyles[status]}`}>{status}</span>;
}

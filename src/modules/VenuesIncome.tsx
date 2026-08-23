import { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Wallet,
  CalendarDays,
  CheckCircle,
} from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import VenueModal from '@/components/VenueModal';
import IncomeModal from '@/components/IncomeModal';
import { VenueStatusBadge, IncomeStatusBadge } from '@/components/Badges';
import { Venue, IncomeRecord, ClubEvent, VenueStatus, IncomeStatus } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/format';

interface VenuesIncomeProps {
  venues: Venue[];
  income: IncomeRecord[];
  events: ClubEvent[];
  saving: boolean;
  onSaveVenue: (v: Partial<Venue>, id?: string) => Promise<boolean>;
  onUpdateVenueStatus: (id: string, status: VenueStatus) => Promise<boolean>;
  onDeleteVenue: (id: string) => Promise<boolean>;
  onSaveIncome: (i: Partial<IncomeRecord>, id?: string) => Promise<boolean>;
  onUpdateIncomeStatus: (id: string, status: IncomeStatus) => Promise<boolean>;
  onDeleteIncome: (id: string) => Promise<boolean>;
}

const venueStatuses: VenueStatus[] = ['Booked', 'Confirmed', 'Pending'];
const incomeStatuses: IncomeStatus[] = ['Received', 'Expected', 'Pending'];

export default function VenuesIncome({
  venues,
  income,
  events,
  saving: _saving,
  onSaveVenue,
  onUpdateVenueStatus,
  onDeleteVenue,
  onSaveIncome,
  onUpdateIncomeStatus,
  onDeleteIncome,
}: VenuesIncomeProps) {
  const [venueModal, setVenueModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [deleteVenue, setDeleteVenue] = useState<Venue | null>(null);
  const [incomeModal, setIncomeModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeRecord | null>(null);
  const [deleteIncome, setDeleteIncome] = useState<IncomeRecord | null>(null);

  const eventMap = useMemo(() => {
    const m = new Map<string, string>();
    events.forEach((e) => m.set(e.id, e.name));
    return m;
  }, [events]);

  const totalReceived = income.filter((i) => i.status === 'Received').reduce((s, i) => s + i.amount, 0);
  const totalExpected = income.filter((i) => i.status === 'Expected').reduce((s, i) => s + i.amount, 0);
  const totalRental = venues.reduce((s, v) => s + v.rental_fee, 0);
  const totalDeposit = venues.reduce((s, v) => s + v.deposit, 0);

  return (
    <div className="space-y-8">
      {/* VENUES SECTION */}
      <section className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold font-display text-slatey-700">Venues</h2>
            <p className="text-sm text-slatey-400 mt-0.5">
              {venues.length} venues · {formatCurrency(totalRental)} total rental
            </p>
          </div>
          <button
            onClick={() => {
              setEditingVenue(null);
              setVenueModal(true);
            }}
            className="btn-primary text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Venue</span>
          </button>
        </div>

        {/* Venue summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card p-4">
            <Building2 size={18} className="text-sage-500 mb-2" />
            <p className="text-xs text-slatey-400">Total Venues</p>
            <p className="text-lg font-bold text-slatey-700">{venues.length}</p>
          </div>
          <div className="card p-4">
            <DollarSign size={18} className="text-coral-500 mb-2" />
            <p className="text-xs text-slatey-400">Total Rental</p>
            <p className="text-lg font-bold text-slatey-700">{formatCurrency(totalRental)}</p>
          </div>
          <div className="card p-4">
            <Wallet size={18} className="text-amber-500 mb-2" />
            <p className="text-xs text-slatey-400">Deposits Paid</p>
            <p className="text-lg font-bold text-slatey-700">{formatCurrency(totalDeposit)}</p>
          </div>
          <div className="card p-4">
            <CheckCircle size={18} className="text-emeraldx-500 mb-2" />
            <p className="text-xs text-slatey-400">Confirmed</p>
            <p className="text-lg font-bold text-slatey-700">
              {venues.filter((v) => v.status === 'Confirmed').length}
            </p>
          </div>
        </div>

        {venues.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Building2 size={28} />}
              title="No venues booked"
              description="Add a venue to track deposits, rental fees, and booking status."
              action={
                <button
                  onClick={() => {
                    setEditingVenue(null);
                    setVenueModal(true);
                  }}
                  className="btn-primary text-sm"
                >
                  <Plus size={18} /> Add Venue
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venues.map((v) => (
              <div key={v.id} className="card p-5 group hover:shadow-soft-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slatey-700">{v.name}</h3>
                    {v.location && (
                      <div className="flex items-center gap-1.5 text-sm text-slatey-400 mt-1">
                        <MapPin size={14} /> {v.location}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingVenue(v);
                        setVenueModal(true);
                      }}
                      className="rounded-lg p-2 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteVenue(v)}
                      className="rounded-lg p-2 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 flex-wrap text-sm text-slatey-400">
                  {v.date && (
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} /> {formatDate(v.date)}
                    </span>
                  )}
                  {v.hours && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {v.hours}
                    </span>
                  )}
                  {v.capacity > 0 && (
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {v.capacity}
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-cream-100 px-3 py-2">
                    <p className="text-xs text-slatey-400">Deposit</p>
                    <p className="text-sm font-bold text-slatey-600">{formatCurrency(v.deposit)}</p>
                  </div>
                  <div className="rounded-xl bg-cream-100 px-3 py-2">
                    <p className="text-xs text-slatey-400">Rental Fee</p>
                    <p className="text-sm font-bold text-slatey-600">{formatCurrency(v.rental_fee)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-cream-200 flex items-center justify-between gap-2">
                  <VenueStatusBadge status={v.status} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slatey-400">Set:</span>
                    <select
                      value={v.status}
                      onChange={(e) => onUpdateVenueStatus(v.id, e.target.value as VenueStatus)}
                      className="rounded-lg border border-cream-300 bg-white px-2 py-1 text-xs font-semibold text-slatey-600 focus:outline-none focus:ring-2 focus:ring-sage-300"
                    >
                      {venueStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {v.notes && (
                  <p className="mt-3 text-xs text-slatey-400 italic">{v.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* INCOME SECTION */}
      <section className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold font-display text-slatey-700">Income Ledger</h2>
            <p className="text-sm text-slatey-400 mt-0.5">
              {income.length} payment batches
            </p>
          </div>
          <button
            onClick={() => {
              setEditingIncome(null);
              setIncomeModal(true);
            }}
            className="btn-primary text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Income</span>
          </button>
        </div>

        {/* Income summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card p-4">
            <Wallet size={18} className="text-emeraldx-500 mb-2" />
            <p className="text-xs text-slatey-400">Received</p>
            <p className="text-lg font-bold text-emeraldx-600">{formatCurrency(totalReceived)}</p>
          </div>
          <div className="card p-4">
            <Clock size={18} className="text-amber-500 mb-2" />
            <p className="text-xs text-slatey-400">Expected</p>
            <p className="text-lg font-bold text-amber-600">{formatCurrency(totalExpected)}</p>
          </div>
          <div className="card p-4">
            <CalendarDays size={18} className="text-slatey-400 mb-2" />
            <p className="text-xs text-slatey-400">Total Batches</p>
            <p className="text-lg font-bold text-slatey-700">{income.length}</p>
          </div>
        </div>

        {income.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Wallet size={28} />}
              title="No income records"
              description="Log attendee payment batches to track expected and received income."
              action={
                <button
                  onClick={() => {
                    setEditingIncome(null);
                    setIncomeModal(true);
                  }}
                  className="btn-primary text-sm"
                >
                  <Plus size={18} /> Add Income
                </button>
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="bg-cream-50 text-xs text-slatey-400 uppercase tracking-wide">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3">Batch</th>
                    <th className="text-left font-semibold px-5 py-3">Event</th>
                    <th className="text-left font-semibold px-5 py-3">Date</th>
                    <th className="text-right font-semibold px-5 py-3">Amount</th>
                    <th className="text-center font-semibold px-5 py-3">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {income.map((i) => (
                    <tr key={i.id} className="group hover:bg-cream-50/50 transition">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slatey-700">{i.batch || '—'}</p>
                        {i.venue_name && <p className="text-xs text-slatey-400">{i.venue_name}</p>}
                      </td>
                      <td className="px-5 py-3 text-slatey-500">
                        {i.event_id && eventMap.get(i.event_id) ? eventMap.get(i.event_id) : '—'}
                      </td>
                      <td className="px-5 py-3 text-slatey-500">{formatDate(i.date)}</td>
                      <td className="px-5 py-3 text-right font-bold text-slatey-700">
                        {formatCurrency(i.amount)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <IncomeStatusBadge status={i.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <select
                            value={i.status}
                            onChange={(e) => onUpdateIncomeStatus(i.id, e.target.value as IncomeStatus)}
                            className="rounded-lg border border-cream-300 bg-white px-2 py-1 text-xs font-semibold text-slatey-600 focus:outline-none focus:ring-2 focus:ring-sage-300"
                          >
                            {incomeStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              setEditingIncome(i);
                              setIncomeModal(true);
                            }}
                            className="rounded-lg p-1.5 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteIncome(i)}
                            className="rounded-lg p-1.5 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-cream-200">
              {income.map((i) => (
                <div key={i.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slatey-700">{i.batch || '—'}</p>
                      <p className="text-xs text-slatey-400 mt-0.5">
                        {i.event_id && eventMap.get(i.event_id) ? eventMap.get(i.event_id) : '—'} · {formatDate(i.date)}
                      </p>
                    </div>
                    <p className="font-bold text-slatey-700">{formatCurrency(i.amount)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <IncomeStatusBadge status={i.status} />
                    <div className="flex items-center gap-1.5">
                      <select
                        value={i.status}
                        onChange={(e) => onUpdateIncomeStatus(i.id, e.target.value as IncomeStatus)}
                        className="rounded-lg border border-cream-300 bg-white px-2 py-1 text-xs font-semibold text-slatey-600 focus:outline-none focus:ring-2 focus:ring-sage-300"
                      >
                        {incomeStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setEditingIncome(i);
                          setIncomeModal(true);
                        }}
                        className="rounded-lg p-1.5 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteIncome(i)}
                        className="rounded-lg p-1.5 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      <VenueModal
        open={venueModal}
        onClose={() => {
          setVenueModal(false);
          setEditingVenue(null);
        }}
        onSave={onSaveVenue}
        editing={editingVenue}
      />
      <IncomeModal
        open={incomeModal}
        onClose={() => {
          setIncomeModal(false);
          setEditingIncome(null);
        }}
        onSave={onSaveIncome}
        editing={editingIncome}
        events={events}
      />

      {/* Delete confirmations */}
      <Modal
        open={!!deleteVenue}
        onClose={() => setDeleteVenue(null)}
        title="Delete Venue"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteVenue(null)} className="btn-ghost">
              Cancel
            </button>
            <button
              onClick={async () => {
                if (deleteVenue) {
                  const ok = await onDeleteVenue(deleteVenue.id);
                  if (ok) setDeleteVenue(null);
                }
              }}
              className="btn bg-coral-500 text-white hover:bg-coral-600 px-4 py-2.5 shadow-soft"
            >
              <Trash2 size={16} /> Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slatey-500">
          Delete venue <strong className="text-slatey-700">{deleteVenue?.name}</strong>?
        </p>
      </Modal>
      <Modal
        open={!!deleteIncome}
        onClose={() => setDeleteIncome(null)}
        title="Delete Income Record"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteIncome(null)} className="btn-ghost">
              Cancel
            </button>
            <button
              onClick={async () => {
                if (deleteIncome) {
                  const ok = await onDeleteIncome(deleteIncome.id);
                  if (ok) setDeleteIncome(null);
                }
              }}
              className="btn bg-coral-500 text-white hover:bg-coral-600 px-4 py-2.5 shadow-soft"
            >
              <Trash2 size={16} /> Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slatey-500">
          Delete income record <strong className="text-slatey-700">{deleteIncome?.batch}</strong>?
        </p>
      </Modal>
    </div>
  );
}

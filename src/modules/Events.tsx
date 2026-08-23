import { useState } from 'react';
import { CalendarDays, MapPin, Pencil, Trash2, Plus, Users, DollarSign, X } from 'lucide-react';
import Modal from '@/components/Modal';
import ProgressBar from '@/components/ProgressBar';
import EmptyState from '@/components/EmptyState';
import EventModal from '@/components/EventModal';
import { ClubEvent, calcEvent, Member, EventMemberLink } from '@/lib/types';
import { formatCurrency, formatDate, isUpcoming, daysUntil } from '@/lib/format';

interface EventsProps {
  events: ClubEvent[];
  members: Member[];
  eventMembers: EventMemberLink[];
  saving: boolean;
  onSaveEvent: (e: Partial<ClubEvent>, id?: string) => Promise<boolean>;
  onDeleteEvent: (id: string) => Promise<boolean>;
  onSaveEventMemberLink: (event_id: string, member_id: string) => Promise<boolean>;
  onDeleteEventMemberLink: (event_id: string, member_id: string) => Promise<boolean>;
  externalModalOpen?: boolean;
  onExternalModalClose?: () => void;
}

export default function Events({
  events,
  members,
  eventMembers,
  saving: _saving,
  onSaveEvent,
  onDeleteEvent,
  onSaveEventMemberLink,
  onDeleteEventMemberLink,
  externalModalOpen,
  onExternalModalClose,
}: EventsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClubEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClubEvent | null>(null);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (e: ClubEvent) => {
    setEditing(e);
    setModalOpen(true);
  };

  const modalOpenState = externalModalOpen || modalOpen;
  const handleClose = () => {
    setModalOpen(false);
    setEditing(null);
    onExternalModalClose?.();
  };

  const sorted = [...events].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const memberMap = new Map(members.map((member) => [member.id, member]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display text-slatey-700">Events</h2>
          <p className="text-sm text-slatey-400 mt-0.5">
            {events.length} total · {events.filter((e) => isUpcoming(e.date)).length} upcoming
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Event</span>
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<CalendarDays size={28} />}
            title="No events yet"
            description="Create your first event to start tracking registrations and finances."
            action={
              <button onClick={openNew} className="btn-primary text-sm">
                <Plus size={18} /> Add Event
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sorted.map((e) => {
            const calc = calcEvent(e);
            const dUntil = daysUntil(e.date);
            return (
              <div key={e.id} className="card p-5 hover:shadow-soft-md transition-shadow group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slatey-700 truncate">{e.name}</h3>
                      {isUpcoming(e.date) && dUntil !== null && dUntil > 0 && (
                        <span className="pill bg-sage-50 text-sage-600 shrink-0">{dUntil}d</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slatey-400 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} /> {formatDate(e.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {e.venue_name || 'TBD'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(e)}
                      className="rounded-lg p-2 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(e)}
                      className="rounded-lg p-2 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    value={e.registered_count}
                    max={e.capacity}
                    label="Registration"
                    color={calc.fillRate >= 80 ? 'emerald' : 'sage'}
                  />
                  <div className="flex items-center justify-between mt-1.5 text-xs text-slatey-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {e.registered_count}/{e.capacity} girls
                    </span>
                    <span>{calc.fillRate.toFixed(0)}% filled</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-cream-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-slatey-400">Revenue</p>
                    <p className="text-sm font-bold text-sage-600">{formatCurrency(calc.entranceRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slatey-400">Food Cost</p>
                    <p className="text-sm font-bold text-coral-500">{formatCurrency(calc.foodExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slatey-400">Net Profit</p>
                    <p className={`text-sm font-bold ${calc.netProfit >= 0 ? 'text-emeraldx-600' : 'text-coral-500'}`}>
                      {formatCurrency(calc.netProfit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slatey-400">Per Girl</p>
                    <p className="text-sm font-bold text-slatey-600">{formatCurrency(calc.profitPerGirl)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-cream-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slatey-400">Members attending</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {eventMembers
                      .filter((link) => link.event_id === e.id)
                      .map((link) => {
                        const member = memberMap.get(link.member_id);
                        if (!member) return null;
                        return (
                          <button
                            key={`${e.id}-${member.id}`}
                            type="button"
                            onClick={() => onDeleteEventMemberLink(e.id, member.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-2.5 py-1 text-xs font-medium text-sage-700 ring-1 ring-sage-200 transition hover:bg-sage-100"
                            title={`Remove ${member.first_name} ${member.last_name}`}
                          >
                            <span>{member.first_name} {member.last_name}</span>
                            <X size={12} />
                          </button>
                        );
                      })}
                  </div>

                  {members.length > 0 && (
                    <div>
                      <label className="sr-only">Add member to event</label>
                      <select
                        className="input py-2 text-sm"
                        value=""
                        onChange={async (event) => {
                          const selectedId = event.target.value;
                          if (!selectedId) return;
                          await onSaveEventMemberLink(e.id, selectedId);
                          event.target.value = '';
                        }}
                      >
                        <option value="">Add member to this event</option>
                        {members
                          .filter((member) => !eventMembers.some((link) => link.event_id === e.id && link.member_id === member.id))
                          .map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.first_name} {member.last_name} · {member.role || 'Member'}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EventModal
        open={modalOpenState}
        onClose={handleClose}
        onSave={onSaveEvent}
        editing={editing}
      />

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Event"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn-ghost">
              Cancel
            </button>
            <button
              onClick={async () => {
                if (deleteTarget) {
                  const ok = await onDeleteEvent(deleteTarget.id);
                  if (ok) setDeleteTarget(null);
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
          Are you sure you want to delete <strong className="text-slatey-700">{deleteTarget?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { IncomeRecord, ClubEvent, IncomeStatus } from '@/lib/types';

interface IncomeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (i: Partial<IncomeRecord>, id?: string) => Promise<boolean>;
  editing?: IncomeRecord | null;
  events: ClubEvent[];
}

const empty: Partial<IncomeRecord> = {
  event_id: null,
  date: '',
  time: '',
  amount: 0,
  venue_name: '',
  batch: '',
  status: 'Pending',
  notes: '',
};

const statuses: IncomeStatus[] = ['Received', 'Expected', 'Pending'];

export default function IncomeModal({ open, onClose, onSave, editing, events }: IncomeModalProps) {
  const [form, setForm] = useState<Partial<IncomeRecord>>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(editing ? { ...editing } : { ...empty });
  }, [open, editing]);

  const handleSave = async () => {
    if (form.amount === undefined || form.amount === null) return;
    setSaving(true);
    const payload: Partial<IncomeRecord> = {
      event_id: form.event_id || null,
      date: form.date || null,
      time: form.time || null,
      amount: Number(form.amount) || 0,
      venue_name: form.venue_name || null,
      batch: form.batch || null,
      status: form.status || 'Pending',
      notes: form.notes || null,
    };
    const ok = await onSave(payload, editing?.id);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Income Record' : 'Add Income Record'}
      subtitle="Log attendee payment batches"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Record'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Linked Event</label>
            <select
              className="input"
              value={form.event_id || ''}
              onChange={(e) => setForm({ ...form, event_id: e.target.value || null })}
            >
              <option value="">No specific event</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Batch Name</label>
            <input
              className="input"
              value={form.batch || ''}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              placeholder="e.g. Batch A — Early Bird"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              value={form.date || ''}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Time</label>
            <input
              type="time"
              className="input"
              value={form.time || ''}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.amount ?? 0}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Venue Name</label>
            <input
              className="input"
              value={form.venue_name || ''}
              onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
              placeholder="e.g. The Ivy Pavilion"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status || 'Pending'}
              onChange={(e) => setForm({ ...form, status: e.target.value as IncomeStatus })}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[70px] resize-y"
            value={form.notes || ''}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Optional notes…"
          />
        </div>
      </div>
    </Modal>
  );
}

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { Venue, VenueStatus } from '@/lib/types';

interface VenueModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (v: Partial<Venue>, id?: string) => Promise<boolean>;
  editing?: Venue | null;
}

const empty: Partial<Venue> = {
  name: '',
  location: '',
  date: '',
  time: '',
  deposit: 0,
  capacity: 0,
  rental_fee: 0,
  hours: '',
  batch: '',
  status: 'Pending',
  availability: '',
  notes: '',
};

const statuses: VenueStatus[] = ['Booked', 'Confirmed', 'Pending'];

export default function VenueModal({ open, onClose, onSave, editing }: VenueModalProps) {
  const [form, setForm] = useState<Partial<Venue>>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(editing ? { ...editing } : { ...empty });
  }, [open, editing]);

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    const payload: Partial<Venue> = {
      name: form.name,
      location: form.location || null,
      date: form.date || null,
      time: form.time || null,
      deposit: Number(form.deposit) || 0,
      capacity: Number(form.capacity) || 0,
      rental_fee: Number(form.rental_fee) || 0,
      hours: form.hours || null,
      batch: form.batch || null,
      status: form.status || 'Pending',
      availability: form.availability || null,
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
      title={editing ? 'Edit Venue' : 'Add Venue'}
      subtitle="Track venue bookings and rental details"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !form.name?.trim()} className="btn-primary">
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Venue'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Venue Name</label>
            <input
              className="input"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. The Ivy Pavilion"
            />
          </div>
          <div>
            <label className="label">Location</label>
            <input
              className="input"
              value={form.location || ''}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. 12 Garden Lane"
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
            <label className="label">Hours</label>
            <input
              className="input"
              value={form.hours || ''}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              placeholder="e.g. 2pm – 6pm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Deposit</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.deposit ?? 0}
              onChange={(e) => setForm({ ...form, deposit: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label">Rental Fee</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.rental_fee ?? 0}
              onChange={(e) => setForm({ ...form, rental_fee: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label">Capacity</label>
            <input
              type="number"
              min={0}
              className="input"
              value={form.capacity ?? 0}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Batch</label>
            <input
              className="input"
              value={form.batch || ''}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              placeholder="e.g. Spring Batch"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status || 'Pending'}
              onChange={(e) => setForm({ ...form, status: e.target.value as VenueStatus })}
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
          <label className="label">Availability</label>
          <input
            className="input"
            value={form.availability || ''}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
            placeholder="e.g. Available all day"
          />
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

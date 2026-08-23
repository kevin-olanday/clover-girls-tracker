import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { ClubEvent, calcEvent } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (e: Partial<ClubEvent>, id?: string) => Promise<boolean>;
  editing?: ClubEvent | null;
}

const empty: Partial<ClubEvent> = {
  name: '',
  date: '',
  venue_name: '',
  capacity: 0,
  registered_count: 0,
  entrance_fee_per_girl: 0,
  food_cost_per_girl: 0,
  other_expenses: 0,
};

export default function EventModal({ open, onClose, onSave, editing }: EventModalProps) {
  const [form, setForm] = useState<Partial<ClubEvent>>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(editing ? { ...editing } : { ...empty });
  }, [open, editing]);

  const preview = calcEvent({
    id: '',
    name: '',
    date: null,
    venue_name: null,
    created_at: '',
    capacity: Number(form.capacity) || 0,
    registered_count: Number(form.registered_count) || 0,
    entrance_fee_per_girl: Number(form.entrance_fee_per_girl) || 0,
    food_cost_per_girl: Number(form.food_cost_per_girl) || 0,
    other_expenses: Number(form.other_expenses) || 0,
  });

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    const payload: Partial<ClubEvent> = {
      name: form.name,
      date: form.date || null,
      venue_name: form.venue_name || null,
      capacity: Number(form.capacity) || 0,
      registered_count: Number(form.registered_count) || 0,
      entrance_fee_per_girl: Number(form.entrance_fee_per_girl) || 0,
      food_cost_per_girl: Number(form.food_cost_per_girl) || 0,
      other_expenses: Number(form.other_expenses) || 0,
    };
    const ok = await onSave(payload, editing?.id);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Event' : 'New Event'}
      subtitle={editing ? 'Update event details' : 'Create a new event for the club'}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !form.name?.trim()} className="btn-primary">
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Event'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Event Name</label>
          <input
            className="input"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Spring Garden Soirée"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="label">Venue Name</label>
            <input
              className="input"
              value={form.venue_name || ''}
              onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
              placeholder="e.g. The Ivy Pavilion"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="label">Registered Count</label>
            <input
              type="number"
              min={0}
              className="input"
              value={form.registered_count ?? 0}
              onChange={(e) => setForm({ ...form, registered_count: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Entrance Fee / Girl</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.entrance_fee_per_girl ?? 0}
              onChange={(e) => setForm({ ...form, entrance_fee_per_girl: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label">Food Cost / Girl</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.food_cost_per_girl ?? 0}
              onChange={(e) => setForm({ ...form, food_cost_per_girl: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label">Other Expenses</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.other_expenses ?? 0}
              onChange={(e) => setForm({ ...form, other_expenses: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Live calculation preview */}
        <div className="rounded-2xl bg-cream-100 p-4 border border-cream-200">
          <p className="text-xs font-semibold text-slatey-400 uppercase tracking-wide mb-3">
            Live Preview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-slatey-400">Entrance Revenue</p>
              <p className="text-sm font-bold text-sage-600">{formatCurrency(preview.entranceRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-slatey-400">Food Expenses</p>
              <p className="text-sm font-bold text-coral-500">{formatCurrency(preview.foodExpenses)}</p>
            </div>
            <div>
              <p className="text-xs text-slatey-400">Net Profit</p>
              <p className={`text-sm font-bold ${preview.netProfit >= 0 ? 'text-emeraldx-600' : 'text-coral-500'}`}>
                {formatCurrency(preview.netProfit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slatey-400">Profit / Girl</p>
              <p className="text-sm font-bold text-slatey-600">{formatCurrency(preview.profitPerGirl)}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

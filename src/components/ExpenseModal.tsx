import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { Expense, ClubEvent, Priority } from '@/lib/types';

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (e: Partial<Expense>, id?: string) => Promise<boolean>;
  editing?: Expense | null;
  events: ClubEvent[];
}

const empty: Partial<Expense> = {
  description: '',
  priority: 'Medium',
  estimated_cost: 0,
  actual_cost: 0,
  is_purchased: false,
  item_type: '',
  item_link: '',
  notes: '',
  event_id: null,
};

const priorities: Priority[] = ['High', 'Medium', 'Low'];

export default function ExpenseModal({ open, onClose, onSave, editing, events }: ExpenseModalProps) {
  const [form, setForm] = useState<Partial<Expense>>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(editing ? { ...editing } : { ...empty });
  }, [open, editing]);

  const handleSave = async () => {
    if (!form.description?.trim()) return;
    setSaving(true);
    const payload: Partial<Expense> = {
      description: form.description,
      priority: form.priority || 'Medium',
      estimated_cost: Number(form.estimated_cost) || 0,
      actual_cost: Number(form.actual_cost) || 0,
      is_purchased: form.is_purchased ?? false,
      item_type: form.item_type || null,
      item_link: form.item_link || null,
      notes: form.notes || null,
      event_id: form.event_id || null,
    };
    const ok = await onSave(payload, editing?.id);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Expense' : 'Add Expense'}
      subtitle="Track items to procure for events"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !form.description?.trim()} className="btn-primary">
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Expense'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Item Description</label>
          <input
            className="input"
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Floral centerpieces (x8)"
          />
        </div>

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
            <label className="label">Category / Type</label>
            <input
              className="input"
              value={form.item_type || ''}
              onChange={(e) => setForm({ ...form, item_type: e.target.value })}
              placeholder="e.g. Decor, Stationery"
            />
          </div>
        </div>

        <div>
          <label className="label">Priority</label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => setForm({ ...form, priority: p })}
                className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  form.priority === p
                    ? p === 'High'
                      ? 'bg-coral-100 text-coral-600 ring-2 ring-coral-300'
                      : p === 'Medium'
                        ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300'
                        : 'bg-sage-100 text-sage-600 ring-2 ring-sage-300'
                    : 'bg-cream-100 text-slatey-400 hover:bg-cream-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Estimated Cost</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.estimated_cost ?? 0}
              onChange={(e) => setForm({ ...form, estimated_cost: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label">Actual Cost</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.actual_cost ?? 0}
              onChange={(e) => setForm({ ...form, actual_cost: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="label">Item Link</label>
          <input
            className="input"
            value={form.item_link || ''}
            onChange={(e) => setForm({ ...form, item_link: e.target.value })}
            placeholder="https://…"
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[80px] resize-y"
            value={form.notes || ''}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Optional notes…"
          />
        </div>
      </div>
    </Modal>
  );
}

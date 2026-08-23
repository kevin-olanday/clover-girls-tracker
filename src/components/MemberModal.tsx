import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { Member } from '@/lib/types';

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (m: Partial<Member>, id?: string) => Promise<boolean>;
  editing?: Member | null;
}

const empty: Partial<Member> = {
  first_name: '',
  last_name: '',
  role: 'Member',
  phone_number: '',
  email: '',
  notes: '',
};

export default function MemberModal({ open, onClose, onSave, editing }: MemberModalProps) {
  const [form, setForm] = useState<Partial<Member>>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(editing ? { ...editing } : { ...empty });
  }, [open, editing]);

  const handleSave = async () => {
    const firstName = form.first_name?.trim() || '';
    const lastName = form.last_name?.trim() || '';
    if (!firstName && !lastName) return;

    setSaving(true);
    const payload: Partial<Member> = {
      first_name: firstName,
      last_name: lastName,
      role: form.role?.trim() || 'Member',
      phone_number: form.phone_number?.trim() || null,
      email: form.email?.trim() || null,
      notes: form.notes?.trim() || null,
    };

    const ok = await onSave(payload, editing?.id);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Member' : 'Add Member'}
      subtitle="Track participants and their contact details"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || (!form.first_name?.trim() && !form.last_name?.trim())}
            className="btn-primary"
          >
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Member'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">First name</label>
            <input
              className="input"
              value={form.first_name || ''}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="label">Last name</label>
            <input
              className="input"
              value={form.last_name || ''}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="label">Role</label>
          <input
            className="input"
            value={form.role || ''}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Admin, Founder, Member, Volunteer..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Number</label>
            <input
              className="input"
              value={form.phone_number || ''}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              placeholder="+63 912 345 6789"
            />
          </div>
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              className="input"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[90px] resize-y"
            value={form.notes || ''}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Optional details, availability, notes, or reminders..."
          />
        </div>
      </div>
    </Modal>
  );
}

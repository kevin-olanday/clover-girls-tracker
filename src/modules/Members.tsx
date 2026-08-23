import { useMemo, useState } from 'react';
import { Mail, Phone, Plus, Pencil, Trash2, Users, BadgeCheck } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import MemberModal from '@/components/MemberModal';
import { Member } from '@/lib/types';

interface MembersProps {
  members: Member[];
  saving: boolean;
  onSaveMember: (m: Partial<Member>, id?: string) => Promise<boolean>;
  onDeleteMember: (id: string) => Promise<boolean>;
}

export default function Members({ members, saving, onSaveMember, onDeleteMember }: MembersProps) {
  const [memberModal, setMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);

  const memberCount = members.length;
  const admins = useMemo(() => members.filter((m) => /admin/i.test(m.role || '')).length, [members]);
  const founders = useMemo(() => members.filter((m) => /founder/i.test(m.role || '')).length, [members]);

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-soft-sm">
          <img
            src="https://ih1.redbubble.net/image.5294122878.0092/pp,504x498-pad,600x600,f8f8f8.u5.jpg"
            alt="Lucky Girls members artwork"
            className="h-52 w-full object-cover sm:h-72"
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold font-display text-slatey-700">Members</h2>
            <p className="text-sm text-slatey-400 mt-0.5">
              {memberCount} total members · {admins} admins · {founders} founders
            </p>
          </div>
          <button
            onClick={() => {
              setEditingMember(null);
              setMemberModal(true);
            }}
            className="btn-primary text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Member</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="card p-4">
            <Users size={18} className="text-sage-500 mb-2" />
            <p className="text-xs text-slatey-400">Total Members</p>
            <p className="text-lg font-bold text-slatey-700">{memberCount}</p>
          </div>
          <div className="card p-4">
            <BadgeCheck size={18} className="text-coral-500 mb-2" />
            <p className="text-xs text-slatey-400">Admins</p>
            <p className="text-lg font-bold text-slatey-700">{admins}</p>
          </div>
          <div className="card p-4">
            <BadgeCheck size={18} className="text-amber-500 mb-2" />
            <p className="text-xs text-slatey-400">Founders</p>
            <p className="text-lg font-bold text-slatey-700">{founders}</p>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Users size={28} />}
              title="No members yet"
              description="Add a member to track their role, number, email, and notes."
              action={
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setMemberModal(true);
                  }}
                  className="btn-primary text-sm"
                >
                  <Plus size={18} /> Add member
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map((member) => (
              <div key={member.id} className="card p-5 group hover:shadow-soft-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slatey-700 text-lg">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-sm text-sage-600 mt-1">{member.role || 'Member'}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMember(member);
                        setMemberModal(true);
                      }}
                      className="rounded-lg p-2 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteMember(member)}
                      className="rounded-lg p-2 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slatey-500">
                  {member.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slatey-400" />
                      <span>{member.phone_number}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 break-all">
                      <Mail size={14} className="text-slatey-400" />
                      <span>{member.email}</span>
                    </div>
                  )}
                </div>

                {member.notes && (
                  <p className="mt-4 border-t border-cream-200 pt-3 text-sm text-slatey-400 italic">
                    {member.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <MemberModal
        open={memberModal}
        onClose={() => {
          setMemberModal(false);
          setEditingMember(null);
        }}
        onSave={async (payload, id) => {
          const ok = await onSaveMember(payload, id);
          if (ok) {
            setMemberModal(false);
            setEditingMember(null);
          }
          return ok;
        }}
        editing={editingMember}
      />

      {deleteMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slatey-900/40 backdrop-blur-sm" onClick={() => setDeleteMember(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-soft-md">
            <h3 className="text-lg font-semibold text-slatey-700">Delete member?</h3>
            <p className="mt-2 text-sm text-slatey-400">
              Remove {deleteMember.first_name} {deleteMember.last_name} from the tracker?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setDeleteMember(null)} className="btn-ghost">
                Cancel
              </button>
              <button
                onClick={async () => {
                  const ok = await onDeleteMember(deleteMember.id);
                  if (ok) setDeleteMember(null);
                }}
                className="btn-danger"
                disabled={saving}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

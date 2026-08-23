import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Users, BadgeCheck, FileUp } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import MemberModal from '@/components/MemberModal';
import CsvImportModal, { CsvParticipantRow } from '@/components/CsvImportModal';
import { Member } from '@/lib/types';

interface MembersProps {
  members: Member[];
  saving: boolean;
  onSaveMember: (m: Partial<Member>, id?: string) => Promise<boolean>;
  onDeleteMember: (id: string) => Promise<boolean>;
  onImportMembers: (rows: CsvParticipantRow[]) => Promise<{ created: number; linked: number; skipped: number }>;
  showAttribution: boolean;
}

export default function Members({ members, saving, onSaveMember, onDeleteMember, onImportMembers, showAttribution }: MembersProps) {
  const [memberModal, setMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);
  const [csvImportOpen, setCsvImportOpen] = useState(false);

  const memberCount = members.length;
  const admins = useMemo(() => members.filter((m) => /admin/i.test(m.role || '')).length, [members]);
  const founders = useMemo(() => members.filter((m) => /founder/i.test(m.role || '')).length, [members]);

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-semibold font-display text-slatey-700">Participants</h2>
            <p className="text-sm text-slatey-400 mt-0.5">
              {memberCount} total participants · {admins} admins · {founders} founders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCsvImportOpen(true)}
              className="btn-outline text-sm"
            >
              <FileUp size={16} />
              <span className="hidden sm:inline">Import CSV</span>
            </button>
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="card p-4">
            <Users size={18} className="text-sage-500 mb-2" />
            <p className="text-xs text-slatey-400">Total Participants</p>
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
              title="No participants yet"
              description="Add a participant to track their role, number, email, and notes."
              action={
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setMemberModal(true);
                  }}
                  className="btn-primary text-sm"
                >
                  <Plus size={18} /> Add participant
                </button>
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead className="bg-cream-50 text-xs text-slatey-400 uppercase tracking-wide">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3">Name</th>
                    <th className="text-left font-semibold px-5 py-3">Role</th>
                    <th className="text-left font-semibold px-5 py-3">Phone</th>
                    <th className="text-left font-semibold px-5 py-3">Email</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {members.map((member) => (
                    <tr key={member.id} className="group hover:bg-cream-50/50 transition">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slatey-700">{member.first_name} {member.last_name}</p>
                        {member.notes && (
                          <p className="text-xs text-slatey-400 truncate max-w-xs mt-0.5">{member.notes}</p>
                        )}
                        {showAttribution && member.created_by_name && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-xs font-medium text-slatey-500">
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sage-200 text-[9px] font-bold text-sage-700">
                              {member.created_by_name[0]}
                            </span>
                            {member.created_by_name}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slatey-500">{member.role || 'Member'}</td>
                      <td className="px-5 py-3 text-slatey-500">{member.phone_number || '—'}</td>
                      <td className="px-5 py-3 text-slatey-500">{member.email || '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingMember(member); setMemberModal(true); }}
                            className="rounded-lg p-1.5 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteMember(member)}
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

            {/* Mobile list */}
            <div className="sm:hidden divide-y divide-cream-200">
              {members.map((member) => (
                <div key={member.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slatey-700">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-xs text-slatey-400 mt-0.5">
                      {member.role || 'Member'}{member.phone_number ? ` · ${member.phone_number}` : ''}
                    </p>
                    {showAttribution && member.created_by_name && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-xs font-medium text-slatey-500">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sage-200 text-[9px] font-bold text-sage-700">
                          {member.created_by_name[0]}
                        </span>
                        {member.created_by_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => { setEditingMember(member); setMemberModal(true); }}
                      className="rounded-lg p-1.5 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteMember(member)}
                      className="rounded-lg p-1.5 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

      <CsvImportModal
        open={csvImportOpen}
        onClose={() => setCsvImportOpen(false)}
        onImport={onImportMembers}
      />
    </div>
  );
}

import { useState, useMemo } from 'react';
import { ShoppingBag, Plus, Pencil, Trash2, ExternalLink, Check, Circle, Filter } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import ProgressBar from '@/components/ProgressBar';
import ExpenseModal from '@/components/ExpenseModal';
import Modal from '@/components/Modal';
import { PriorityBadge } from '@/components/Badges';
import { Expense, ClubEvent } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

interface ExpensesProps {
  expenses: Expense[];
  events: ClubEvent[];
  saving: boolean;
  onSaveExpense: (e: Partial<Expense>, id?: string) => Promise<boolean>;
  onTogglePurchased: (id: string, current: boolean) => Promise<boolean>;
  onDeleteExpense: (id: string) => Promise<boolean>;
}

export default function Expenses({
  expenses,
  events,
  saving: _saving,
  onSaveExpense,
  onTogglePurchased,
  onDeleteExpense,
}: ExpensesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');

  const eventMap = useMemo(() => {
    const m = new Map<string, string>();
    events.forEach((e) => m.set(e.id, e.name));
    return m;
  }, [events]);

  const types = useMemo(() => {
    const s = new Set<string>();
    expenses.forEach((e) => e.item_type && s.add(e.item_type));
    return Array.from(s).sort();
  }, [expenses]);

  const filtered = expenses.filter((e) => {
    if (filterType !== 'all' && e.item_type !== filterType) return false;
    if (filterEvent !== 'all' && e.event_id !== filterEvent) return false;
    return true;
  });

  const totalEstimated = expenses.reduce((s, e) => s + (e.estimated_cost || 0), 0);
  const totalActual = expenses.reduce((s, e) => s + (e.actual_cost || 0), 0);
  const variance = totalActual - totalEstimated;
  const purchasedCount = expenses.filter((e) => e.is_purchased).length;

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (e: Expense) => {
    setEditing(e);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold font-display text-slatey-700">Things to Buy</h2>
          <p className="text-sm text-slatey-400 mt-0.5">
            {expenses.length} items · {purchasedCount} purchased
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
      </div>

      {/* Budget variance bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slatey-600">Budget Variance</h3>
          <span
            className={`pill ${
              variance > 0 ? 'bg-coral-100 text-coral-600' : variance < 0 ? 'bg-emeraldx-100 text-emeraldx-600' : 'bg-cream-100 text-slatey-500'
            }`}
          >
            {variance > 0 ? '+' : ''}
            {formatCurrency(variance)}
          </span>
        </div>
        <ProgressBar
          value={totalActual}
          max={Math.max(totalEstimated, totalActual, 1)}
          showValue={false}
          color={variance > 0 ? 'coral' : 'sage'}
          size="sm"
        />
        <div className="flex items-center justify-between mt-2 text-xs text-slatey-400">
          <span>Estimated: {formatCurrency(totalEstimated)}</span>
          <span>Actual: {formatCurrency(totalActual)}</span>
        </div>
      </div>

      {/* Filters */}
      {(types.length > 0 || events.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-sm text-slatey-400">
            <Filter size={15} /> Filter:
          </span>
          {types.length > 0 && (
            <select
              className="input max-w-[180px] py-2 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Categories</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
          {events.length > 0 && (
            <select
              className="input max-w-[180px] py-2 text-sm"
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
            >
              <option value="all">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Expense list */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="No expenses found"
            description="Add items to procure for your events, or adjust your filters."
            action={
              <button onClick={openNew} className="btn-primary text-sm">
                <Plus size={18} /> Add Expense
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((e) => {
            const itemVariance = (e.actual_cost || 0) - (e.estimated_cost || 0);
            return (
              <div
                key={e.id}
                className={`card p-4 transition-all group ${
                  e.is_purchased ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Purchase toggle */}
                  <button
                    onClick={() => onTogglePurchased(e.id, e.is_purchased)}
                    className={`mt-0.5 shrink-0 rounded-full p-1.5 transition-all ${
                      e.is_purchased
                        ? 'bg-emeraldx-400 text-white'
                        : 'bg-cream-100 text-slatey-300 hover:bg-cream-200 hover:text-slatey-400'
                    }`}
                    title={e.is_purchased ? 'Mark as not purchased' : 'Mark as purchased'}
                  >
                    {e.is_purchased ? <Check size={16} /> : <Circle size={16} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3
                          className={`font-semibold text-slatey-700 truncate ${
                            e.is_purchased ? 'line-through' : ''
                          }`}
                        >
                          {e.description}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <PriorityBadge priority={e.priority} />
                          {e.item_type && (
                            <span className="pill bg-cream-100 text-slatey-500">{e.item_type}</span>
                          )}
                          {e.event_id && eventMap.get(e.event_id) && (
                            <span className="text-xs text-slatey-400 truncate">
                              {eventMap.get(e.event_id)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => openEdit(e)}
                          className="rounded-lg p-1.5 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(e)}
                          className="rounded-lg p-1.5 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-slatey-400">Est.</p>
                        <p className="text-sm font-semibold text-slatey-600">
                          {formatCurrency(e.estimated_cost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slatey-400">Actual</p>
                        <p className="text-sm font-semibold text-slatey-600">
                          {formatCurrency(e.actual_cost)}
                        </p>
                      </div>
                      {itemVariance !== 0 && (
                        <div>
                          <p className="text-xs text-slatey-400">Variance</p>
                          <p
                            className={`text-sm font-semibold ${
                              itemVariance > 0 ? 'text-coral-500' : 'text-emeraldx-600'
                            }`}
                          >
                            {itemVariance > 0 ? '+' : ''}
                            {formatCurrency(itemVariance)}
                          </p>
                        </div>
                      )}
                    </div>

                    {e.item_link && (
                      <a
                        href={e.item_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sage-600 hover:text-sage-700 transition"
                      >
                        <ExternalLink size={13} /> View item
                      </a>
                    )}
                    {e.notes && (
                      <p className="mt-2 text-xs text-slatey-400 italic line-clamp-2">{e.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ExpenseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={onSaveExpense}
        editing={editing}
        events={events}
      />

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Expense"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn-ghost">
              Cancel
            </button>
            <button
              onClick={async () => {
                if (deleteTarget) {
                  const ok = await onDeleteExpense(deleteTarget.id);
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
          Delete <strong className="text-slatey-700">{deleteTarget?.description}</strong>?
        </p>
      </Modal>
    </div>
  );
}

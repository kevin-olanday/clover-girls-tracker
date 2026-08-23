import { useState, useMemo } from 'react';
import { ShoppingBag, Plus, Pencil, Trash2, ExternalLink, Check, Circle, Filter, Search, LayoutList, LayoutGrid } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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
    if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalEstimated = expenses.reduce((s, e) => s + (e.estimated_cost || 0), 0);
  const totalActual = expenses.reduce((s, e) => s + (e.actual_cost || 0), 0);
  const variance = totalActual - totalEstimated;
  const purchasedCount = expenses.filter((e) => e.is_purchased).length;
  const unpurchasedCount = expenses.length - purchasedCount;

  // Totals grouped by event
  const eventTotals = useMemo(() => {
    const map = new Map<string, { name: string; estimated: number; actual: number; count: number }>();
    expenses.forEach((e) => {
      const key = e.event_id || '__none__';
      const name = (e.event_id && eventMap.get(e.event_id)) || 'No Event';
      const existing = map.get(key) || { name, estimated: 0, actual: 0, count: 0 };
      map.set(key, {
        name,
        estimated: existing.estimated + (e.estimated_cost || 0),
        actual: existing.actual + (e.actual_cost || 0),
        count: existing.count + 1,
      });
    });
    return Array.from(map.values()).sort((a, b) => b.actual - a.actual);
  }, [expenses, eventMap]);

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (e: Expense) => { setEditing(e); setModalOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold font-display text-slatey-700">Things to Buy</h2>
          <p className="text-sm text-slatey-400 mt-0.5">
            {expenses.length} items · {purchasedCount} purchased · {unpurchasedCount} remaining
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Expense</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Budget variance */}
        <div className="card p-4 sm:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slatey-600">Budget Variance</h3>
            <span className={`pill ${variance > 0 ? 'bg-coral-100 text-coral-600' : variance < 0 ? 'bg-emeraldx-100 text-emeraldx-600' : 'bg-cream-100 text-slatey-500'}`}>
              {variance > 0 ? '+' : ''}{formatCurrency(variance)}
            </span>
          </div>
          <ProgressBar value={totalActual} max={Math.max(totalEstimated, totalActual, 1)} showValue={false} color={variance > 0 ? 'coral' : 'sage'} size="sm" />
          <div className="flex items-center justify-between mt-2 text-xs text-slatey-400">
            <span>Estimated: {formatCurrency(totalEstimated)}</span>
            <span>Actual: {formatCurrency(totalActual)}</span>
          </div>
        </div>

        {/* Purchased progress */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slatey-600 mb-2">Purchased</h3>
          <ProgressBar value={purchasedCount} max={Math.max(expenses.length, 1)} showValue={false} color="emerald" size="sm" />
          <div className="flex items-center justify-between mt-2 text-xs text-slatey-400">
            <span className="text-emeraldx-600 font-medium">{purchasedCount} done</span>
            <span>{unpurchasedCount} left</span>
          </div>
          <p className="text-2xl font-bold font-display text-slatey-700 mt-1">
            {expenses.length > 0 ? Math.round((purchasedCount / expenses.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Event totals */}
      {eventTotals.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slatey-600 mb-3">Totals by Event</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slatey-400 border-b border-cream-200">
                  <th className="text-left pb-2 font-medium">Event</th>
                  <th className="text-right pb-2 font-medium hidden sm:table-cell">Items</th>
                  <th className="text-right pb-2 font-medium hidden sm:table-cell">Estimated</th>
                  <th className="text-right pb-2 font-medium">Actual</th>
                  <th className="text-right pb-2 font-medium">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {eventTotals.map((row) => {
                  const v = row.actual - row.estimated;
                  return (
                    <tr key={row.name} className="hover:bg-cream-50 transition-colors">
                      <td className="py-2 pr-3 font-medium text-slatey-700 max-w-[120px] truncate">{row.name}</td>
                      <td className="py-2 text-right text-slatey-400 hidden sm:table-cell">{row.count}</td>
                      <td className="py-2 text-right text-slatey-500 hidden sm:table-cell">{formatCurrency(row.estimated)}</td>
                      <td className="py-2 text-right text-slatey-700 font-semibold">{formatCurrency(row.actual)}</td>
                      <td className={`py-2 text-right font-semibold ${v > 0 ? 'text-coral-500' : v < 0 ? 'text-emeraldx-600' : 'text-slatey-400'}`}>
                        {v > 0 ? '+' : ''}{formatCurrency(v)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Search + filters + view toggle */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slatey-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search expenses…"
              className="input pl-9 py-2 text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center rounded-xl border border-cream-200 bg-white overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-sage-50 text-sage-600' : 'text-slatey-400 hover:bg-cream-50'} transition`}
              title="List view"
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-sage-50 text-sage-600' : 'text-slatey-400 hover:bg-cream-50'} transition`}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
        {(types.length > 0 || events.length > 0) && (
          <div className="flex gap-2 flex-wrap">
            {types.length > 0 && (
              <select className="input py-2 text-sm flex-1 min-w-[140px]" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Categories</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            {events.length > 0 && (
              <select className="input py-2 text-sm flex-1 min-w-[140px]" value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}>
                <option value="all">All Events</option>
                {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Expense list */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="No expenses found"
            description="Add items to procure for your events, or adjust your filters."
            action={<button onClick={openNew} className="btn-primary text-sm"><Plus size={18} /> Add Expense</button>}
          />
        </div>
      ) : viewMode === 'list' ? (
        /* Compact list view */
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slatey-400 border-b border-cream-200 bg-cream-50">
                <th className="text-left px-3 py-3 font-medium w-6"></th>
                <th className="text-left px-3 py-3 font-medium">Item</th>
                <th className="text-left px-3 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Qty / Details</th>
                <th className="text-right px-3 py-3 font-medium hidden xs:table-cell">Est.</th>
                <th className="text-right px-3 py-3 font-medium">Actual</th>
                <th className="text-right px-3 py-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filtered.map((e) => (
                <tr key={e.id} className={`group hover:bg-cream-50 transition-colors ${e.is_purchased ? 'opacity-60' : ''}`}>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => onTogglePurchased(e.id, e.is_purchased)}
                      className={`rounded-full p-1.5 transition-all ${e.is_purchased ? 'bg-emeraldx-400 text-white' : 'bg-cream-100 text-slatey-300 hover:bg-cream-200'}`}
                    >
                      {e.is_purchased ? <Check size={13} /> : <Circle size={13} />}
                    </button>
                  </td>
                  <td className="px-3 py-3 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <PriorityBadge priority={e.priority} />
                      <span className={`font-medium text-slatey-700 break-words ${e.is_purchased ? 'line-through' : ''}`}>{e.description}</span>
                    </div>
                    {e.item_type && <span className="pill bg-cream-100 text-slatey-500 text-xs mt-1 sm:hidden">{e.item_type}</span>}
                    {e.notes && <p className="text-xs text-slatey-400 mt-0.5 italic">{e.notes}</p>}
                    {e.created_by_name && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-xs font-medium text-slatey-500">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sage-200 text-[9px] font-bold text-sage-700">
                          {e.created_by_name[0]}
                        </span>
                        {e.created_by_name}
                      </span>
                    )}
                    {e.item_link && (
                      <a href={e.item_link} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs text-sage-500 hover:text-sage-700 transition sm:hidden">
                        <ExternalLink size={11} /> Link
                      </a>
                    )}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    {e.item_type && <span className="pill bg-cream-100 text-slatey-500 text-xs">{e.item_type}</span>}
                  </td>
                  <td className="px-3 py-3 text-slatey-400 text-xs hidden md:table-cell">
                    {(e as any).quantity_details || '—'}
                  </td>
                  <td className="px-3 py-3 text-right text-slatey-500 hidden xs:table-cell">{formatCurrency(e.estimated_cost)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-slatey-700">
                    <div className="flex items-center justify-end gap-1.5">
                      {formatCurrency(e.actual_cost)}
                      {e.item_link && (
                        <a href={e.item_link} target="_blank" rel="noopener noreferrer" className="text-sage-500 hover:text-sage-700 transition hidden sm:inline">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => openEdit(e)} className="rounded-lg p-1.5 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget(e)} className="rounded-lg p-1.5 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid view */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((e) => {
            const itemVariance = (e.actual_cost || 0) - (e.estimated_cost || 0);
            return (
              <div key={e.id} className={`card p-4 transition-all group ${e.is_purchased ? 'opacity-75' : ''}`}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onTogglePurchased(e.id, e.is_purchased)}
                    className={`mt-0.5 shrink-0 rounded-full p-1.5 transition-all ${e.is_purchased ? 'bg-emeraldx-400 text-white' : 'bg-cream-100 text-slatey-300 hover:bg-cream-200 hover:text-slatey-400'}`}
                    title={e.is_purchased ? 'Mark as not purchased' : 'Mark as purchased'}
                  >
                    {e.is_purchased ? <Check size={16} /> : <Circle size={16} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className={`font-semibold text-slatey-700 truncate ${e.is_purchased ? 'line-through' : ''}`}>{e.description}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <PriorityBadge priority={e.priority} />
                          {e.item_type && <span className="pill bg-cream-100 text-slatey-500">{e.item_type}</span>}
                          {e.event_id && eventMap.get(e.event_id) && (
                            <span className="text-xs text-slatey-400 truncate">{eventMap.get(e.event_id)}</span>
                          )}
                        </div>
                        {(e as any).quantity_details && (
                          <p className="text-xs text-slatey-400 mt-1">Qty: {(e as any).quantity_details}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => openEdit(e)} className="rounded-lg p-1.5 text-slatey-400 hover:bg-cream-100 hover:text-sage-600 transition"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(e)} className="rounded-lg p-1.5 text-slatey-400 hover:bg-coral-50 hover:text-coral-500 transition"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-slatey-400">Est.</p>
                        <p className="text-sm font-semibold text-slatey-600">{formatCurrency(e.estimated_cost)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slatey-400">Actual</p>
                        <p className="text-sm font-semibold text-slatey-600">{formatCurrency(e.actual_cost)}</p>
                      </div>
                      {itemVariance !== 0 && (
                        <div>
                          <p className="text-xs text-slatey-400">Variance</p>
                          <p className={`text-sm font-semibold ${itemVariance > 0 ? 'text-coral-500' : 'text-emeraldx-600'}`}>
                            {itemVariance > 0 ? '+' : ''}{formatCurrency(itemVariance)}
                          </p>
                        </div>
                      )}
                    </div>
                    {e.item_link && (
                      <a href={e.item_link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sage-600 hover:text-sage-700 transition">
                        <ExternalLink size={13} /> View item
                      </a>
                    )}
                    {e.notes && <p className="mt-2 text-xs text-slatey-400 italic line-clamp-2">{e.notes}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ExpenseModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
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
            <button onClick={() => setDeleteTarget(null)} className="btn-ghost">Cancel</button>
            <button
              onClick={async () => { if (deleteTarget) { const ok = await onDeleteExpense(deleteTarget.id); if (ok) setDeleteTarget(null); } }}
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
import { useRef, useState } from 'react';
import { Banknote, TrendingDown, TrendingUp, Users, AlertTriangle, CalendarDays, MapPin, Receipt, Tag, Clover } from 'lucide-react';
import { useReward } from 'partycles';
import KPICard from '@/components/KPICard';
import ProgressBar from '@/components/ProgressBar';
import EmptyState from '@/components/EmptyState';
import { ClubEvent, Expense, Venue, IncomeRecord, calcEvent } from '@/lib/types';
import { formatCurrency, formatDate, isUpcoming, daysUntil } from '@/lib/format';
import MetricTooltip from '@/components/MetricTooltip';
import { useLanguage } from '@/lib/LanguageContext';
import Modal from '@/components/Modal';

interface DashboardProps {
  events: ClubEvent[];
  expenses: Expense[];
  venues: Venue[];
  income: IncomeRecord[];
}

interface FounderAvatarButtonProps {
  name: string;
  avatar: string;
  onSelect: (replayReward: () => void) => void;
}

function FounderAvatarButton({ name, avatar, onSelect }: FounderAvatarButtonProps) {
  const avatarRewardRef = useRef<HTMLImageElement>(null);
  const { reward } = useReward(avatarRewardRef, 'hearts', {
    particleCount: 40,
    spread: 50,
    elementSize: 25,
    effects: { pulse: true },
  });

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        reward();
        onSelect(reward);
      }}
      aria-label={`View ${name}'s full avatar`}
      className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
    >
      <img ref={avatarRewardRef} src={avatar} alt={`${name} avatar`} className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-cream-200 transition hover:ring-sage-400" />
    </button>
  );
}

export default function Dashboard({ events, expenses, venues, income }: DashboardProps) {
  const totalRevenue = events.reduce((sum, e) => sum + calcEvent(e).entranceRevenue, 0);
  const totalExpenseCosts = expenses.reduce(
    (sum, e) => sum + (e.is_purchased ? (e.actual_cost || e.estimated_cost || 0) : (e.estimated_cost || 0)),
    0
  );
  const totalVenueRental = expenses.filter((expense) => Boolean(expense.venue_id)).reduce(
    (sum, expense) => sum + (expense.is_purchased ? (expense.actual_cost || expense.estimated_cost || 0) : (expense.estimated_cost || 0)),
    0,
  );
  const totalExpenses = totalExpenseCosts;
  const totalSupplyExpenses = totalExpenseCosts - totalVenueRental;
  const netProfit = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
  const totalRegistered = events.reduce((sum, e) => sum + e.registered_count, 0);
  const fillRate = totalCapacity > 0 ? (totalRegistered / totalCapacity) * 100 : 0;

  const totalEstimated = expenses.reduce((sum, e) => sum + (e.estimated_cost || 0), 0);
  const totalActual = expenses.reduce((sum, e) => sum + (e.is_purchased ? (e.actual_cost || e.estimated_cost || 0) : 0), 0);
  const budgetVariance = totalActual - totalEstimated;

  const upcomingEvents = events
    .filter((e) => isUpcoming(e.date))
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  // Expense category breakdown
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    const cat = e.item_type?.trim() || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + (e.actual_cost || e.estimated_cost || 0);
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryTotals)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);
  const maxCategoryAmount = sortedCategories[0]?.[1] || 1;

  // Top expenses
  const topExpenses = [...expenses]
    .filter((e) => (e.actual_cost || e.estimated_cost || 0) > 0)
    .sort((a, b) => (b.actual_cost || b.estimated_cost || 0) - (a.actual_cost || a.estimated_cost || 0))
    .slice(0, 5);

  const profitPerFounder = netProfit / 3;
  const [showProfitSplit, setShowProfitSplit] = useState(false);
  const [showExpenseBreakdown, setShowExpenseBreakdown] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<{ name: string; avatar: string; replayReward: () => void } | null>(null);
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold font-display text-slatey-700">Dashboard</h2>
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          label={language === 'tl' ? 'Kabuuang Kita' : 'Total Revenue'}
          value={formatCurrency(totalRevenue)}
          sublabel={language === 'tl' ? 'Mula sa lahat ng pagpaparehistro' : 'From all event registrations'}
          icon={<Banknote size={22} />}
          accent="sage"
          language={language}
          tooltip={{ english: 'Money collected from all event registration payments.', tagalog: 'Kabuuang perang nakolekta mula sa bayad sa pagpaparehistro ng mga event.' }}
        />
        <div className="relative">
          <KPICard
            label={language === 'tl' ? 'Kabuuang Gastos' : 'Total Expenses'}
            value={formatCurrency(totalExpenses)}
            sublabel={language === 'tl' ? 'Mga binili at upa sa venue' : 'Procurement + venue rentals'}
            icon={<TrendingDown size={22} />}
            accent="coral"
            language={language}
            expanded={showExpenseBreakdown}
            onClick={() => setShowExpenseBreakdown((open) => !open)}
            tooltip={{ english: 'Click to see the Expenses ledger total plus venue booking rentals.', tagalog: 'I-click para makita ang kabuuan ng Expenses at mga upa sa venue.' }}
          />
          {showExpenseBreakdown && (
            <div className="absolute right-0 top-full z-20 mt-2 w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-cream-200 bg-white p-4 shadow-soft-md sm:left-0 sm:right-auto">
              <p className="text-xs font-semibold uppercase tracking-wide text-slatey-400">
                {language === 'tl' ? 'Paano kinukuwenta' : 'How it is calculated'}
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slatey-500">{language === 'tl' ? 'Mga gamit at ibang gastos' : 'Supplies & other expenses'}</span>
                  <span className="font-semibold text-slatey-700">{formatCurrency(totalSupplyExpenses)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slatey-500">{language === 'tl' ? 'Upa sa venue' : 'Venue rental expense'}</span>
                  <span className="font-semibold text-slatey-700">{formatCurrency(totalVenueRental)}</span>
                </div>
                <div className="border-t border-cream-200 pt-2 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <span className="font-semibold text-slatey-700">Total</span>
                  <span className="font-bold text-coral-500 break-words">{formatCurrency(totalSupplyExpenses)} + {formatCurrency(totalVenueRental)} = {formatCurrency(totalExpenses)}</span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-4 text-slatey-400">
                {language === 'tl'
                  ? 'Bawat venue rental ay naka-link sa isang venue at isang beses lang binibilang.'
                  : 'Each venue rental is linked to one venue and counted once.'}
              </p>
            </div>
          )}
        </div>

        {/* Net Profit — click to reveal per-founder split */}
        <div className="relative">
          {showProfitSplit && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowProfitSplit(false)}
              aria-hidden
            />
          )}
          <button
            type="button"
            onClick={() => setShowProfitSplit((v) => !v)}
            className="card p-5 w-full text-left animate-slide-up hover:shadow-soft-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-300"
            aria-expanded={showProfitSplit}
            aria-label="Net profit — tap to see founder split"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2.5 ring-4 ${
                netProfit >= 0
                  ? 'bg-emeraldx-50 text-emeraldx-600 ring-emeraldx-100'
                  : 'bg-coral-50 text-coral-500 ring-coral-100'
              }`}>
                {netProfit >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
              </div>
              <span className="text-xs font-semibold text-slatey-400 mt-1">tap to split ↓</span>
            </div>
            <p className="mt-4 text-2xl font-bold font-display text-slatey-700 tracking-tight">
              {formatCurrency(netProfit)}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <p className="text-sm text-slatey-400">{language === 'tl' ? 'Netong Kita' : 'Net Profit'}</p>
              <MetricTooltip
                language={language}
                english="Revenue minus all recorded expenses. Tap the card to see the founder split."
                tagalog="Kita na ibinawas ang lahat ng naitalang gastos. I-tap ang card para makita ang hatian ng founders."
              />
            </div>
            <p className="text-xs text-slatey-300 mt-1">{margin.toFixed(1)}% {language === 'tl' ? 'margin' : 'margin'}</p>
          </button>

          {showProfitSplit && (
            <div className="absolute left-0 right-auto top-full z-20 mt-2 w-[min(300px,calc(100vw-2rem))] rounded-2xl border border-cream-200 bg-white p-4 shadow-soft-md sm:right-0 sm:w-auto sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slatey-400 mb-4">Profit ÷ 3 founders</p>
              <div className="space-y-3">
                {[{ name: 'Jann', avatar: '/jann.jpg' }, { name: 'Jenn', avatar: '/jenn.jpg' }, { name: 'Jena', avatar: '/jena.jpg' }].map(({ name, avatar }) => (
                  <div key={name} className="flex min-w-0 items-center justify-between gap-2 rounded-xl bg-cream-50 px-3 py-3 sm:px-4">
                    <span className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-medium text-slatey-700">
                      <FounderAvatarButton
                        name={name}
                        avatar={avatar}
                        onSelect={(replayReward) => setSelectedAvatar({ name, avatar, replayReward })}
                      />
                      {name}
                    </span>
                    <span className={`shrink-0 text-sm font-bold ${
                      profitPerFounder >= 0 ? 'text-emeraldx-600' : 'text-coral-500'
                    }`}>
                      {formatCurrency(profitPerFounder)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          )}
        </div>
        <KPICard
          label={language === 'tl' ? 'Porsiyento ng Kalahok' : 'Registration Fill Rate'}
          value={`${fillRate.toFixed(0)}%`}
          sublabel={language === 'tl' ? `${totalRegistered} / ${totalCapacity} puwesto ang napunan` : `${totalRegistered} / ${totalCapacity} spots filled`}
          icon={<Users size={22} />}
          accent="slate"
          language={language}
          tooltip={{ english: 'The percentage of available event seats that are currently registered.', tagalog: 'Porsiyento ng mga available na upuan sa event na may nakarehistrong participant.' }}
        />
      </div>

      <Modal
        open={!!selectedAvatar}
        onClose={() => setSelectedAvatar(null)}
        title={
          <span className="flex items-center gap-2">
            <Clover size={18} className="text-sage-500" />
            {selectedAvatar?.name}
          </span>
        }
        size="md"
        centered
      >
        {selectedAvatar && (
          <div className="relative flex justify-center">
            <img
              src={selectedAvatar.avatar}
              alt={`${selectedAvatar.name} full avatar`}
              onClick={selectedAvatar.replayReward}
              className="relative z-10 mx-auto max-h-[65vh] w-full cursor-pointer rounded-xl object-contain"
            />
          </div>
        )}
      </Modal>

      {/* Budget Variance */}
      <div
        className={`rounded-2xl p-5 border ${
          budgetVariance > 0
            ? 'bg-coral-50 border-coral-200'
            : budgetVariance < 0
              ? 'bg-emeraldx-50 border-emeraldx-200'
              : 'bg-cream-100 border-cream-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`rounded-xl p-2.5 ${
              budgetVariance > 0 ? 'bg-coral-100 text-coral-600' : 'bg-emeraldx-100 text-emeraldx-600'
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slatey-700">Budget Variance</h3>
            <p className="text-sm text-slatey-400 mt-0.5">
              {budgetVariance > 0
                ? `You are ${formatCurrency(Math.abs(budgetVariance))} over the estimated budget.`
                : budgetVariance < 0
                  ? `You are ${formatCurrency(Math.abs(budgetVariance))} under budget — great work!`
                  : 'Actual spending matches the estimated budget exactly.'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/70 px-3 py-2">
                <p className="text-xs text-slatey-400 font-medium">Estimated</p>
                <p className="text-sm font-bold text-slatey-600">{formatCurrency(totalEstimated)}</p>
              </div>
              <div className="rounded-xl bg-white/70 px-3 py-2">
                <p className="text-xs text-slatey-400 font-medium">Actual</p>
                <p className="text-sm font-bold text-slatey-600">{formatCurrency(totalActual)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-event breakdown + Top expenses side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per-event breakdown */}
        <div className="card p-5">
          <h2 className="text-base font-semibold font-display text-slatey-700 mb-4">Per-Event Breakdown</h2>
          {events.length === 0 ? (
            <p className="text-sm text-slatey-300">No events yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slatey-400 border-b border-cream-200">
                    <th className="text-left pb-2 font-medium">Event</th>
                    <th className="text-right pb-2 font-medium hidden sm:table-cell">Revenue</th>
                    <th className="text-right pb-2 font-medium hidden sm:table-cell">Expenses</th>
                    <th className="text-right pb-2 font-medium">Net</th>
                    <th className="text-right pb-2 font-medium hidden xs:table-cell">Fill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {events.map((e) => {
                    const calc = calcEvent(e);
                    const eventExpenses = expenses
                      .filter((ex) => ex.event_id === e.id)
                      .reduce((s, ex) => s + (ex.actual_cost || ex.estimated_cost || 0), 0);
                    return (
                      <tr key={e.id} className="hover:bg-cream-50 transition-colors">
                        <td className="py-2.5 pr-3">
                          <p className="font-medium text-slatey-700 truncate max-w-[140px]">{e.name}</p>
                          <p className="text-xs text-slatey-400">{formatDate(e.date)}</p>
                        </td>
                        <td className="py-2.5 text-right text-sage-600 font-semibold tabular-nums hidden sm:table-cell">
                          {formatCurrency(calc.entranceRevenue)}
                        </td>
                        <td className="py-2.5 text-right text-coral-500 font-semibold tabular-nums hidden sm:table-cell">
                          {formatCurrency(eventExpenses)}
                        </td>
                        <td className={`py-2.5 text-right font-bold tabular-nums ${calc.netProfit >= 0 ? 'text-emeraldx-600' : 'text-coral-500'}`}>
                          {formatCurrency(calc.netProfit)}
                        </td>
                        <td className="py-2.5 text-right text-slatey-500 tabular-nums hidden xs:table-cell">
                          {calc.fillRate.toFixed(0)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {events.length > 1 && (
                  <tfoot>
                    <tr className="border-t border-cream-300 text-xs font-bold text-slatey-600">
                      <td className="pt-2.5">Total</td>
                      <td className="pt-2.5 text-right text-sage-600 tabular-nums hidden sm:table-cell">{formatCurrency(totalRevenue)}</td>
                      <td className="pt-2.5 text-right text-coral-500 tabular-nums hidden sm:table-cell">{formatCurrency(totalExpenseCosts)}</td>
                      <td className={`pt-2.5 text-right tabular-nums ${netProfit >= 0 ? 'text-emeraldx-600' : 'text-coral-500'}`}>{formatCurrency(netProfit)}</td>
                      <td className="pt-2.5 text-right text-slatey-500 tabular-nums hidden xs:table-cell">{fillRate.toFixed(0)}%</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>

        {/* Top expenses */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Receipt size={16} className="text-slatey-400" />
            <h2 className="text-base font-semibold font-display text-slatey-700">Top Expenses</h2>
          </div>
          {topExpenses.length === 0 ? (
            <p className="text-sm text-slatey-300">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {topExpenses.map((e, i) => {
                const amount = e.actual_cost || e.estimated_cost || 0;
                const maxAmount = topExpenses[0] ? (topExpenses[0].actual_cost || topExpenses[0].estimated_cost || 1) : 1;
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slatey-300 w-4 shrink-0">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-slatey-700 truncate">{e.description}</p>
                        <p className="text-sm font-bold text-coral-500 ml-2 shrink-0">{formatCurrency(amount)}</p>
                      </div>
                      <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-coral-300 rounded-full"
                          style={{ width: `${(amount / maxAmount) * 100}%` }}
                        />
                      </div>
                      {e.item_type && (
                        <p className="text-xs text-slatey-400 mt-0.5">{e.item_type}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Expense category breakdown */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={16} className="text-slatey-400" />
          <h2 className="text-base font-semibold font-display text-slatey-700">Spending by Category</h2>
        </div>
        {sortedCategories.length === 0 ? (
          <p className="text-sm text-slatey-300">No expenses recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {sortedCategories.map(([cat, amount]) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slatey-600 truncate max-w-[60%]">{cat}</span>
                  <span className="text-sm font-semibold text-slatey-700">{formatCurrency(amount)}</span>
                </div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage-400 rounded-full transition-all"
                    style={{ width: `${(amount / maxCategoryAmount) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slatey-400 mt-0.5">
                  {totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-display text-slatey-700">Upcoming Events</h2>
          <span className="text-sm text-slatey-400">{upcomingEvents.length} scheduled</span>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<CalendarDays size={28} />}
              title="No upcoming events"
              description="Create a new event to see it appear here."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((e) => {
              const calc = calcEvent(e);
              const dUntil = daysUntil(e.date);
              return (
                <div key={e.id} className="card p-5 hover:shadow-soft-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slatey-700">{e.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-slatey-400 mt-1">
                        <MapPin size={14} />
                        {e.venue_name || 'Venue TBD'}
                      </div>
                    </div>
                    {dUntil !== null && dUntil > 0 && (
                      <span className="pill bg-sage-50 text-sage-600">
                        {dUntil}d away
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <ProgressBar
                      value={e.registered_count}
                      max={e.capacity}
                      label="Registration"
                      color={calc.fillRate >= 80 ? 'emerald' : 'sage'}
                    />
                    <p className="text-xs text-slatey-400 mt-1.5">
                      {formatDate(e.date)} · {e.registered_count}/{e.capacity} girls
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-cream-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slatey-400">Net Profit</p>
                      <p
                        className={`text-lg font-extrabold font-display tabular-nums ${
                          calc.netProfit >= 0 ? 'text-emeraldx-600' : 'text-coral-500'
                        }`}
                      >
                        {formatCurrency(calc.netProfit)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slatey-400">Per Girl</p>
                      <p className="text-sm font-semibold text-slatey-600">
                        {formatCurrency(calc.profitPerGirl)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Income Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-slatey-400">Income Received</p>
          <p className="text-2xl font-extrabold font-display text-emeraldx-600 mt-1 tabular-nums">
            {formatCurrency(income.filter((i) => i.status === 'Received').reduce((s, i) => s + i.amount, 0))}
          </p>
          <p className="text-xs text-slatey-400 mt-1">
            {income.filter((i) => i.status === 'Received').length} batches
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slatey-400">Income Expected</p>
          <p className="text-2xl font-extrabold font-display text-amber-600 mt-1 tabular-nums">
            {formatCurrency(income.filter((i) => i.status === 'Expected').reduce((s, i) => s + i.amount, 0))}
          </p>
          <p className="text-xs text-slatey-400 mt-1">
            {income.filter((i) => i.status === 'Expected').length} batches
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slatey-400">Pending Income</p>
          <p className="text-2xl font-extrabold font-display text-slatey-500 mt-1 tabular-nums">
            {formatCurrency(income.filter((i) => i.status === 'Pending').reduce((s, i) => s + i.amount, 0))}
          </p>
          <p className="text-xs text-slatey-400 mt-1">
            {income.filter((i) => i.status === 'Pending').length} batches
          </p>
        </div>
      </div>
    </div>
  );
}

import { LayoutDashboard, CalendarDays, ShoppingBag, Building2, Users } from 'lucide-react';
import { TabKey } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';

interface NavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  showAttribution: boolean;
  onToggleAttribution: () => void;
}

const tabs: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'expenses', label: 'Expenses', icon: ShoppingBag },
  { key: 'venues', label: 'Venues & Income', icon: Building2 },
  { key: 'members', label: 'Participants', icon: Users },
];

export default function Navigation({ active, onChange, showAttribution, onToggleAttribution }: NavProps) {
  const { language, setLanguage } = useLanguage();
  const labels = language === 'tl'
    ? { dashboard: 'Dashboard', events: 'Mga Event', expenses: 'Mga Gastos', venues: 'Venue at Kita', members: 'Mga Kalahok', names: 'Pangalan', hidden: 'Nakatago' }
    : { dashboard: 'Dashboard', events: 'Events', expenses: 'Expenses', venues: 'Venues & Income', members: 'Participants', names: 'Names', hidden: 'Hidden' };
  const translatedTabs = tabs.map((tab) => ({ ...tab, label: labels[tab.key] }));
  return (
    <>
      {/* Desktop / tablet top tabs */}
      <nav className="sticky top-16 z-30 bg-cream-50/85 backdrop-blur-md border-b border-cream-200 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1">
            {translatedTabs.map(({ key, label, icon: Icon }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => onChange(key)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
                    isActive ? 'text-sage-600' : 'text-slatey-400 hover:text-slatey-600'
                  }`}
                >
                  <Icon size={17} />
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sage-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 h-16 bg-white/95 backdrop-blur-md border-t border-cream-200 sm:hidden">
        <div className="h-full flex items-center">
          <div className="flex w-full items-center justify-around gap-1 px-2 py-1.5">
            {translatedTabs.map(({ key, label, icon: Icon }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => onChange(key)}
                  className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-colors ${
                    isActive ? 'text-sage-600' : 'text-slatey-400'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

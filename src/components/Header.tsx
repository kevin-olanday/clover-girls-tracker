import { useRef, useState } from 'react';
import { Clover, HelpCircle, Plus, LogOut, Menu, X, Eye, EyeOff, CircleUserRound } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useLanguage } from '@/lib/LanguageContext';

interface HeaderProps {
  onNewEvent: () => void;
  onSecret: () => void;
  onHelp: () => void;
  user?: User | null;
  onSignOut?: () => void;
  showAttribution?: boolean;
  onToggleAttribution?: () => void;
}

const getAvatar = (user?: User | null) => {
  const accountName = (user?.user_metadata?.name || user?.email?.split('@')[0] || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  const avatarName = ['admin', 'jann', 'jenn', 'jena'].find((name) => accountName.startsWith(name));
  return avatarName ? `/${avatarName}.jpg` : null;
};

export default function Header({ onNewEvent, onSecret, onHelp, user, onSignOut, showAttribution = true, onToggleAttribution }: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDemoMode = sessionStorage.getItem('clover-demo-mode') === 'true';
  const labels = language === 'tl'
    ? { subtitle: 'Event & Finance Manager', help: 'Paano', connected: 'Nakakonekta', connectionError: 'May error sa koneksyon', connecting: 'Kumokonekta…', newEvent: 'Bagong Event', signOut: 'Mag-sign out' }
    : { subtitle: 'Event & Finance Manager', help: 'How to', connected: 'Connected', connectionError: 'Connection Error', connecting: 'Connecting…', newEvent: 'New Event', signOut: 'Sign out' };
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);
  const avatar = getAvatar(user);

  const handleSecretTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 700) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }

    lastTapRef.current = now;

    if (tapCountRef.current === 7) {
      tapCountRef.current = 0;
      onSecret();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-50/85 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSecretTap}
              className="relative rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-300"
              aria-label="Secret surprise"
            >
              <div className="w-10 h-10 rounded-2xl bg-sage-400 flex items-center justify-center shadow-soft">
                <Clover size={22} className="text-white" />
              </div>
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-slatey-700 leading-none tracking-tight">
                Clover Girls Club
              </h1>
              <p className="text-xs text-slatey-400 mt-0.5 hidden sm:block">
                {labels.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onHelp}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slatey-600 shadow-soft transition hover:bg-cream-50"
              aria-label={language === 'tl' ? 'Buksan ang gabay' : 'Open how-to guide'}
            >
              <HelpCircle size={14} />
              <span className="hidden sm:inline">{labels.help}</span>
            </button>
            <button onClick={onNewEvent} className="btn-primary text-sm hidden sm:inline-flex">
              <Plus size={18} />
              <span className="hidden sm:inline">{labels.newEvent}</span>
            </button>
            {user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                title={language === 'tl' ? 'Naka-sign in bilang' : 'Signed in as'}
                aria-label={language === 'tl' ? 'Ipakita ang user menu' : 'Show user menu'}
                className="rounded-xl p-2 text-sage-600 hover:bg-cream-100 transition sm:hidden"
              >
                {avatar ? <img src={avatar} alt={`${user.user_metadata?.name || 'Account'} avatar`} className="h-5 w-5 rounded-full object-cover" /> : <CircleUserRound size={19} />}
              </button>
            )}
            {onToggleAttribution && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  title={language === 'tl' ? 'Buksan ang menu' : 'Open menu'}
                  aria-label={language === 'tl' ? 'Buksan ang menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
                  className="rounded-xl p-2 text-slatey-500 hover:bg-cream-100 transition"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                {mobileMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 flex min-w-56 flex-col gap-3 rounded-2xl border border-cream-200 bg-white p-3 shadow-soft-md">
                    {user && (
                      <div className="border-b border-cream-100 pb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slatey-400">
                          {language === 'tl' ? 'Naka-sign in bilang' : 'Signed in as'}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slatey-700">
                          {user.user_metadata?.name ?? user.email}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={onToggleAttribution}
                      title={showAttribution ? 'Hide added-by names' : 'Show added-by names'}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-cream-200 bg-cream-50 px-2.5 py-1.5 text-xs font-semibold text-slatey-500"
                    >
                      {showAttribution ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{showAttribution ? 'Names' : 'Names hidden'}</span>
                    </button>
                    <div className="inline-flex items-center rounded-lg border border-cream-200 bg-white p-0.5">
                      <button type="button" onClick={() => setLanguage('en')} title="English" className={`rounded-md px-2 py-1 text-base leading-none ${language === 'en' ? 'bg-sage-100' : 'opacity-50 grayscale'}`}>🇺🇸</button>
                      <button type="button" onClick={() => setLanguage('tl')} title="Tagalog" className={`rounded-md px-2 py-1 text-base leading-none ${language === 'tl' ? 'bg-sage-100' : 'opacity-50 grayscale'}`}>🇵🇭</button>
                    </div>
                    </div>
                    {(user || isDemoMode) && onSignOut && (
                      <button type="button" onClick={onSignOut} className="inline-flex items-center justify-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-3 py-2 text-xs font-semibold text-coral-600 hover:bg-coral-100">
                        <LogOut size={14} /> {isDemoMode ? 'Exit demo mode' : labels.signOut}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            {(user || isDemoMode) && onSignOut && (
              <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-cream-200">
                {user && (avatar ? <img src={avatar} alt={`${user.user_metadata?.name || 'Account'} avatar`} className="h-5 w-5 rounded-full object-cover" /> : <CircleUserRound size={16} className="text-sage-600" />)}
                <span className="hidden sm:block text-xs font-semibold text-slatey-600">
                  {user ? (user.user_metadata?.name ?? user.email) : 'Demo mode'}
                </span>
                <button
                  type="button"
                  onClick={onSignOut}
                  title={labels.signOut}
                  className="rounded-full p-1.5 text-slatey-400 hover:bg-cream-100 hover:text-coral-500 transition"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

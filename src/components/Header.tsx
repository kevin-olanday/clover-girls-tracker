import { useRef } from 'react';
import { Clover, HelpCircle, Plus, Wifi, WifiOff, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useLanguage } from '@/lib/LanguageContext';

interface HeaderProps {
  connection: 'connecting' | 'connected' | 'error';
  onNewEvent: () => void;
  onSecret: () => void;
  onHelp: () => void;
  user?: User | null;
  onSignOut?: () => void;
}

export default function Header({ connection, onNewEvent, onSecret, onHelp, user, onSignOut }: HeaderProps) {
  const { language } = useLanguage();
  const labels = language === 'tl'
    ? { subtitle: 'Event & Finance Manager', help: 'Paano', connected: 'Nakakonekta', connectionError: 'May error sa koneksyon', connecting: 'Kumokonekta…', newEvent: 'Bagong Event', signOut: 'Mag-sign out' }
    : { subtitle: 'Event & Finance Manager', help: 'How to', connected: 'Connected', connectionError: 'Connection Error', connecting: 'Connecting…', newEvent: 'New Event', signOut: 'Sign out' };
  const connected = connection === 'connected';
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const handleSecretTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 700) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }

    lastTapRef.current = now;

    if (tapCountRef.current >= 7) {
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
              onTouchStart={handleSecretTap}
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
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                connected
                  ? 'bg-emeraldx-50 text-emeraldx-600'
                  : connection === 'error'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-slatey-50 text-slatey-400'
              }`}
              title={connected ? 'Connected to Supabase' : 'Supabase connection unavailable'}
            >
              {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span className="hidden sm:inline">
                {connected ? labels.connected : connection === 'error' ? labels.connectionError : labels.connecting}
              </span>
            </div>
            <button onClick={onNewEvent} className="btn-primary text-sm">
              <Plus size={18} />
              <span className="hidden sm:inline">{labels.newEvent}</span>
            </button>
            {user && onSignOut && (
              <div className="flex items-center gap-2 pl-1 border-l border-cream-200">
                <span className="hidden sm:block text-xs font-semibold text-slatey-600">
                  {user.user_metadata?.name ?? user.email}
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

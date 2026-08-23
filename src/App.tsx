import { useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Dashboard from '@/modules/Dashboard';
import Events from '@/modules/Events';
import Expenses from '@/modules/Expenses';
import VenuesIncome from '@/modules/VenuesIncome';
import Members from '@/modules/Members';
import AuthGate from '@/components/AuthGate';
import { useClubData } from '@/lib/useClubData';
import { useMutations } from '@/lib/useMutations';
import { supabase } from '@/lib/supabase';
import { TabKey } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/Modal';
import type { User } from '@supabase/supabase-js';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const LUCK_QUOTES = [
  { quote: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca' },
  { quote: 'The harder I work, the luckier I get.', author: 'Samuel Goldwyn' },
  { quote: 'I find that the harder I work, the more luck I seem to have.', author: 'Thomas Jefferson' },
  { quote: 'Success is where preparation and opportunity meet.', author: 'Bobby Unser' },
  { quote: 'Luck is a dividend of sweat. The more you sweat, the more luck you get.', author: 'Ray Kroc' },
  { quote: 'Do not be afraid of the luck you have; it is the beginning of something wonderful.', author: 'Unknown' },
  { quote: 'Luck is not chance—it is the byproduct of focus, resilience, and action.', author: 'Unknown' },
  { quote: 'When you feel lucky, you are usually standing at the edge of effort and timing.', author: 'Unknown' },
  { quote: 'Good luck is the result of good habits and good decisions.', author: 'Unknown' },
  { quote: 'Luck favors the prepared mind and the brave heart.', author: 'Unknown' },
  { quote: 'Opportunities are usually disguised as hard work.', author: 'Unknown' },
  { quote: 'Fortune smiles on those who keep moving.', author: 'Unknown' },
  { quote: 'Luck is a byproduct of curiosity and courage.', author: 'Unknown' },
  { quote: 'A lucky moment is just a prepared one recognized.', author: 'Unknown' },
  { quote: 'When luck arrives, it often looks like work in disguise.', author: 'Unknown' },
  { quote: 'The universe rewards consistency more than intensity.', author: 'Unknown' },
  { quote: 'Lucky people make their own openings.', author: 'Unknown' },
  { quote: 'Chance favors the one who keeps showing up.', author: 'Unknown' },
  { quote: 'Good fortune is a mirror of your effort.', author: 'Unknown' },
  { quote: 'Luck is being ready when the door opens.', author: 'Unknown' },
  { quote: 'Some people call it luck; others call it momentum.', author: 'Unknown' },
  { quote: 'Your next breakthrough may be hiding in your next step.', author: 'Unknown' },
  { quote: 'Luck loves a clear intention.', author: 'Unknown' },
  { quote: 'Fortune follows faith, action, and consistency.', author: 'Unknown' },
  { quote: 'The stars do not choose the lazy dreamer.', author: 'Unknown' },
  { quote: 'You make your own luck by making your own moves.', author: 'Unknown' },
  { quote: 'Lucky hearts are often the ones who keep giving.', author: 'Unknown' },
  { quote: 'Preparation creates the path that luck can walk.', author: 'Unknown' },
  { quote: 'Great things often begin with a little bit of luck and a lot of courage.', author: 'Unknown' },
  { quote: 'Luck shines brightest on the ones who never quit.', author: 'Unknown' },
];

function App() {
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [showAttribution, setShowAttribution] = useState(() => localStorage.getItem('show-attribution') !== 'false');
  const [luckyQuote, setLuckyQuote] = useState(LUCK_QUOTES[0]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { events, expenses, venues, income, members, eventMembers, loading, connection, reload } = useClubData();
  const mutations = useMutations(reload, currentUser?.user_metadata?.name ?? null);
  const [headerEventModal, setHeaderEventModal] = useState(false);
  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const konamiBufferRef = useRef<string[]>([]);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user ?? null);
    }) ?? { data: { subscription: { unsubscribe: () => {} } } };
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * LUCK_QUOTES.length);
    setLuckyQuote(LUCK_QUOTES[randomIndex]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      konamiBufferRef.current.push(key);

      if (konamiBufferRef.current.length > KONAMI_CODE.length) {
        konamiBufferRef.current.shift();
      }

      if (konamiBufferRef.current.length === KONAMI_CODE.length && konamiBufferRef.current.every((value, index) => value === KONAMI_CODE[index])) {
        setSecretModalOpen(true);
        konamiBufferRef.current = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AuthGate>
    <div className="min-h-screen bg-cream-50">
      <Header
        onSecret={() => setSecretModalOpen(true)}
        onHelp={() => setHelpModalOpen(true)}
        onNewEvent={() => {
          setTab('events');
          setHeaderEventModal(true);
        }}
        user={currentUser}
        onSignOut={handleSignOut}
        showAttribution={showAttribution}
        onToggleAttribution={() => setShowAttribution((visible) => {
          const next = !visible;
          localStorage.setItem('show-attribution', String(next));
          return next;
        })}
      />
      <Navigation
        active={tab}
        onChange={setTab}
        showAttribution={showAttribution}
        onToggleAttribution={() => setShowAttribution((visible) => {
          const next = !visible;
          localStorage.setItem('show-attribution', String(next));
          return next;
        })}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 sm:pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={32} className="text-sage-400 animate-spin" />
          </div>
        ) : (
          <div className="animate-fade-in">
            {tab === 'dashboard' && (
              <Dashboard events={events} expenses={expenses} venues={venues} income={income} />
            )}
            {tab === 'events' && (
              <Events
                events={events}
                members={members}
                eventMembers={eventMembers}
                saving={mutations.saving}
                onSaveEvent={mutations.saveEvent}
                onDeleteEvent={mutations.deleteEvent}
                onSaveEventMemberLink={mutations.saveEventMemberLink}
                onDeleteEventMemberLink={mutations.deleteEventMemberLink}
                showAttribution={showAttribution}
                onImportParticipants={(event_id, rows) =>
                  mutations.importEventParticipants(
                    event_id,
                    rows,
                    members,
                    new Set(eventMembers.filter((l) => l.event_id === event_id).map((l) => l.member_id)),
                  )
                }
                externalModalOpen={headerEventModal}
                onExternalModalClose={() => setHeaderEventModal(false)}
              />
            )}
            {tab === 'expenses' && (
              <Expenses
                expenses={expenses}
                events={events}
                venues={venues}
                saving={mutations.saving}
                onSaveExpense={mutations.saveExpense}
                onTogglePurchased={mutations.toggleExpensePurchased}
                onDeleteExpense={mutations.deleteExpense}
                showAttribution={showAttribution}
              />
            )}
            {tab === 'venues' && (
              <VenuesIncome
                venues={venues}
                income={income}
                events={events}
                saving={mutations.saving}
                onSaveVenue={mutations.saveVenue}
                onUpdateVenueStatus={mutations.updateVenueStatus}
                onDeleteVenue={mutations.deleteVenue}
                onSaveIncome={mutations.saveIncome}
                onUpdateIncomeStatus={mutations.updateIncomeStatus}
                onDeleteIncome={mutations.deleteIncome}
                showAttribution={showAttribution}
              />
            )}
            {tab === 'members' && (
              <Members
                members={members}
                saving={mutations.saving}
                onSaveMember={mutations.saveMember}
                onDeleteMember={mutations.deleteMember}
                onImportMembers={(rows) => mutations.importMembers(rows, members)}
                showAttribution={showAttribution}
              />
            )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-16 left-0 right-0 z-30 border-t border-cream-200 bg-white/90 backdrop-blur-sm sm:bottom-0">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-4 py-2 text-center text-[11px] text-slatey-500 sm:text-xs">
          <span className="font-semibold uppercase tracking-[0.12em] text-sage-600 shrink-0">Lucky quote</span>
          <p className="max-w-4xl italic text-slatey-600 leading-snug">
            “{luckyQuote.quote}”
            <span className="not-italic text-slatey-400"> — {luckyQuote.author}</span>
          </p>
        </div>
      </footer>

      <Modal
        open={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="How to use this tracker"
        size="lg"
        footer={
          <button onClick={() => setHelpModalOpen(false)} className="btn-primary">
            Got it
          </button>
        }
      >
        <div className="space-y-5">
          <div className="flex justify-center">
            <img
              src="https://preview.redd.it/submission-for-subreddit-banner-and-logo-v0-m7kbkp7gby281.jpg?width=476&format=pjpg&auto=webp&s=f46e74752008d4284a9e8d918ae87d45ddc12ece"
              alt="Lucky mascot"
              className="h-28 w-28 rounded-2xl object-cover shadow-soft"
            />
          </div>
          <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
            <p className="text-sm text-slatey-500">Follow these steps to keep the tracker accurate and useful.</p>
          </div>

          {[{
            title: '1. Add participants',
            body: 'Go to the Participants tab to add club members individually or import them in bulk via CSV. These participants can then be linked to specific events.',
            targetTab: 'members'
          }, {
            title: '2. Create an event',
            body: 'Go to the Events tab and add a new event with its name, date, venue, capacity, attendance, and payment details. Link participants and import attendees via CSV directly from each event card.',
            targetTab: 'events'
          }, {
            title: '3. Track all expenses',
            body: 'Use the Expenses tab to record actual costs, estimated prices, purchase status, and notes for every item.',
            targetTab: 'expenses'
          }, {
            title: '4. Manage venue and income details',
            body: 'Use Venues & Income to log venue bookings, deposits, payment batches, and the current status of expected or received income.',
            targetTab: 'venues'
          }, {
            title: '5. Review the dashboard',
            body: 'Check the Dashboard to monitor revenue, registration fill rate, total expenses, profit margin, and budget variance in one place.',
            targetTab: 'dashboard'
          }].map((step) => (
            <button
              key={step.title}
              type="button"
              onClick={() => {
                setTab(step.targetTab as TabKey);
                setHelpModalOpen(false);
              }}
              className="block w-full rounded-2xl border border-cream-200 bg-white p-4 text-left transition hover:border-sage-300 hover:bg-sage-50/40"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slatey-700">{step.title}</h3>
                <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">Open</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slatey-500">{step.body}</p>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        open={secretModalOpen}
        onClose={() => setSecretModalOpen(false)}
        title="Lucky Surprise!"
        size="md"
        footer={
          <button onClick={() => setSecretModalOpen(false)} className="btn-primary">
            Close
          </button>
        }
      >
        <div className="space-y-4 text-center">
          <img
            src="https://i.pinimg.com/originals/86/8e/5b/868e5b65b040abdf8688945fde0e4c9e.gif"
            alt="Lucky Girls surprise"
            className="mx-auto w-full max-w-md rounded-2xl shadow-soft"
          />
          <p className="text-lg text-slatey-700 leading-relaxed">
            Made with ❤️ by Kevin Olanday for all the Lucky Girls out there.
          </p>
        </div>
      </Modal>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#FFFFFF',
            color: '#2C3E50',
            border: '1px solid #E2DAC8',
            borderRadius: '16px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 4px 16px -4px rgba(44, 62, 80, 0.12)',
          },
          success: { iconTheme: { primary: '#46b073', secondary: '#fff' } },
          error: { iconTheme: { primary: '#d65f44', secondary: '#fff' } },
        }}
      />
    </div>
    </AuthGate>
  );
}

export default App;

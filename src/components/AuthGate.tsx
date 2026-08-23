import { useState, useEffect } from 'react';
import { Eye, EyeOff, Clover, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

type AuthState = 'loading' | 'login' | 'force-change' | 'ready';

// Users log in with just their first name; this converts it to the Supabase email.
const EMAIL_DOMAIN = 'luckygirls.app';
const toEmail = (name: string) => `${name.trim().toLowerCase()}@${EMAIL_DOMAIN}`;

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) {
      setState('ready'); // demo mode — skip auth
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setState(session.user.user_metadata?.force_password_change ? 'force-change' : 'ready');
      } else {
        setState('login');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setState(session.user.user_metadata?.force_password_change ? 'force-change' : 'ready');
      } else {
        setUser(null);
        setState('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-sage-200 border-t-sage-400 animate-spin" />
      </div>
    );
  }

  if (state === 'login') return <LoginForm />;
  if (state === 'force-change' && user) return <ChangePasswordForm user={user} />;
  return <>{children}</>;
}

/* ─── Login form ──────────────────────────────────────────────── */

function LoginForm() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password) return;
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase!.auth.signInWithPassword({
        email: toEmail(name),
        password,
      });
      if (error) setError('Incorrect name or password. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sage-400 flex items-center justify-center shadow-soft mx-auto mb-4">
            <Clover size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slatey-700">Clover Girls Club</h1>
          <p className="text-sm text-slatey-400 mt-1">Event &amp; Finance Manager</p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slatey-700 mb-4">Sign in</h2>
          <img
            src="https://dl.glitter-graphics.com/pub/3434/3434301x65mamt5bt.gif"
            alt=""
            className="mx-auto rounded-xl mb-4"
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jann, Jenn, or Jena"
                className="input"
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slatey-400 hover:text-slatey-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-center">
                <p className="text-sm text-coral-500 bg-coral-50 rounded-xl px-3 py-2">{error}</p>
                <img
                  src="https://images6.alphacoders.com/315/thumb-1920-315988.png"
                  alt=""
                  className="w-1/2 mx-auto mt-3 rounded-lg"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim() || !password}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Forced password change form ────────────────────────────── */

function ChangePasswordForm({ user }: { user: User }) {
  const displayName = user.user_metadata?.name ?? 'there';
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase!.auth.updateUser({
        password: newPassword,
        data: { force_password_change: false },
      });
      if (error) setError(error.message);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center shadow-soft mx-auto mb-4">
            <Lock size={24} className="text-sage-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slatey-700">Set your password</h1>
          <p className="text-sm text-slatey-400 mt-1">Welcome, {displayName}!</p>
        </div>

        <div className="card p-6">
          <div className="rounded-xl bg-sage-50 border border-sage-100 px-4 py-3 mb-5">
            <p className="text-sm text-sage-700">
              This is your first login. Please set a new password before continuing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">New password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="input pr-10"
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slatey-400 hover:text-slatey-600 transition"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type it again"
                  className="input pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slatey-400 hover:text-slatey-600 transition"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-coral-500 bg-coral-50 rounded-xl px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !newPassword || !confirm}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                'Update password'
              )}
            </button>

            <button
              type="button"
              onClick={() => supabase!.auth.signOut()}
              className="btn-ghost w-full"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

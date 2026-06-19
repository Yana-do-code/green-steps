import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const FIREBASE_ERRORS = {
  'auth/user-not-found':       'No account found with this email.',
  'auth/wrong-password':       'Incorrect password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password':        'Password must be at least 6 characters.',
  'auth/invalid-email':        'Please enter a valid email address.',
  'auth/invalid-credential':   'Incorrect email or password.',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  'auth/too-many-requests':    'Too many attempts. Please try again later.',
};

function friendlyError(err) {
  return FIREBASE_ERRORS[err?.code] ?? 'Something went wrong. Please try again.';
}

export default function Login() {
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const [tab,      setTab]      = useState('signin'); // 'signin' | 'signup'
  const [form,     setForm]     = useState({ name: '', email: '', password: '' });
  const [error,    setError]    = useState('');
  const [busy,     setBusy]     = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (tab === 'signup') {
        if (!form.name.trim()) { setError('Please enter your name.'); setBusy(false); return; }
        await signup(form.name.trim(), form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">

        <Link to="/" className="login-logo">
          <div className="login-logo__icon"><Leaf size={22} strokeWidth={2.5} /></div>
          <span className="login-logo__text">GreenSteps</span>
        </Link>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab${tab === 'signin' ? ' login-tab--active' : ''}`}
            onClick={() => { setTab('signin'); setError(''); }}
          >Sign In</button>
          <button
            className={`login-tab${tab === 'signup' ? ' login-tab--active' : ''}`}
            onClick={() => { setTab('signup'); setError(''); }}
          >Sign Up</button>
        </div>

        <p className="login-sub">
          {tab === 'signin'
            ? 'Welcome back — sign in to see your progress.'
            : 'Create an account to start tracking your footprint.'}
        </p>

        {/* Google button */}
        <button className="login-google btn btn-secondary" onClick={handleGoogle} disabled={busy}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.6 35.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C37.2 39 44 34 44 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-divider"><span>or</span></div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {tab === 'signup' && (
            <div className="login-field">
              <label className="login-label label-sm">Full Name</label>
              <input className="input login-input" type="text" placeholder="Your name" value={form.name} onChange={set('name')} />
            </div>
          )}
          <div className="login-field">
            <label className="login-label label-sm">Email Address</label>
            <input className="input login-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="login-field">
            <label className="login-label label-sm">Password</label>
            <input className="input login-input" type="password" placeholder={tab === 'signup' ? 'Min. 6 characters' : '••••••••'} value={form.password} onChange={set('password')} />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-submit" disabled={busy}>
            {busy ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="login-back"><Link to="/">← Back to Home</Link></p>
      </div>
    </div>
  );
}

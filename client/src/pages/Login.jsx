import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    login({ name: form.name.trim(), email: form.email.trim() });
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <Link to="/" className="login-logo">
          <div className="login-logo__icon">
            <Leaf size={22} strokeWidth={2.5} />
          </div>
          <span className="login-logo__text">GreenSteps</span>
        </Link>

        <h1 className="login-title">Get Started</h1>
        <p className="login-sub">Enter your details to track your carbon footprint and join the community.</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label label-sm">Full Name</label>
            <input
              className="input login-input"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="login-field">
            <label className="login-label label-sm">Email Address</label>
            <input
              className="input login-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-submit">
            Start Tracking Free
          </button>
        </form>

        <p className="login-back">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

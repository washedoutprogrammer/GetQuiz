import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Name is required.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { ok, error: apiErr } = await register(name.trim(), email.trim(), password);
    setLoading(false);

    if (ok) {
      navigate('/dashboard');
    } else {
      setError(apiErr ?? 'Registration failed. Please try again.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <Link className="auth-brand" to="/" aria-label="GetQuiz Home">
          <div className="auth-brand-icon">
            <Zap size={18} color="#f0eeff" strokeWidth={2.5} />
          </div>
          <span className="auth-brand-name">GetQuiz</span>
        </Link>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Free forever — no credit card required</p>

        {error && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-name">YOUR NAME</label>
            <input
              id="reg-name"
              type="text"
              className={`auth-input${error && !name.trim() ? ' error' : ''}`}
              placeholder="Alex Johnson"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-email">EMAIL</label>
            <input
              id="reg-email"
              type="email"
              className={`auth-input${error && !email.trim() ? ' error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-password">PASSWORD</label>
            <input
              id="reg-password"
              type="password"
              className="auth-input"
              placeholder="Min. 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-confirm">CONFIRM PASSWORD</label>
            <input
              id="reg-confirm"
              type="password"
              className={`auth-input${error && password !== confirm && confirm ? ' error' : ''}`}
              placeholder="Repeat password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? 'Creating account…' : 'Create Free Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setLoading(true);
    const { ok, error: apiErr } = await login(email.trim(), password);
    setLoading(false);

    if (ok) {
      navigate('/dashboard');
    } else {
      setError(apiErr ?? 'Login failed. Please check your credentials.');
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

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        {error && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">EMAIL</label>
            <input
              id="login-email"
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
            <label className="auth-label" htmlFor="login-password">PASSWORD</label>
            <input
              id="login-password"
              type="password"
              className={`auth-input${error && !password ? ' error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
}

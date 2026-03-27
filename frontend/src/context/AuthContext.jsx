import { createContext, useContext, useEffect, useState } from 'react';
import { loginApi, registerApi, logoutApi, getMeApi } from '../api/auth';

const AuthContext = createContext(null);

/* ── Mock token for offline/no-backend development ── */
const MOCK_MODE = true; // set false once a real backend is running

function buildMockUser(name, email) {
  return { id: 'mock-1', name, email };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('gq-token'));
  const [loading, setLoading] = useState(true);

  /* On mount, restore session */
  useEffect(() => {
    const stored = localStorage.getItem('gq-token');
    if (!stored) { setLoading(false); return; }

    if (MOCK_MODE) {
      // Restore mock user from storage
      try {
        const u = JSON.parse(localStorage.getItem('gq-user') ?? 'null');
        if (u) setUser(u);
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }

    // Real mode: verify token with backend
    getMeApi().then(({ ok, data }) => {
      if (ok && data) setUser(data);
      else {
        localStorage.removeItem('gq-token');
        localStorage.removeItem('gq-user');
        setToken(null);
      }
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Login ── */
  async function login(email, password) {
    if (MOCK_MODE) {
      const mockToken = 'mock-token-' + Date.now();
      const mockUser = buildMockUser(email.split('@')[0], email);
      localStorage.setItem('gq-token', mockToken);
      localStorage.setItem('gq-user', JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);
      return { ok: true, error: null };
    }

    const { ok, data, error } = await loginApi(email, password);
    if (ok && data?.access_token) {
      localStorage.setItem('gq-token', data.access_token);
      localStorage.setItem('gq-user', JSON.stringify(data.user ?? {}));
      setToken(data.access_token);
      setUser(data.user ?? {});
    }
    return { ok, error };
  }

  /* ── Register ── */
  async function register(name, email, password) {
    if (MOCK_MODE) {
      const mockToken = 'mock-token-' + Date.now();
      const mockUser = buildMockUser(name, email);
      localStorage.setItem('gq-token', mockToken);
      localStorage.setItem('gq-user', JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);
      return { ok: true, error: null };
    }

    const { ok, data, error } = await registerApi(name, email, password);
    if (ok && data?.access_token) {
      localStorage.setItem('gq-token', data.access_token);
      localStorage.setItem('gq-user', JSON.stringify(data.user ?? {}));
      setToken(data.access_token);
      setUser(data.user ?? {});
    }
    return { ok, error };
  }

  /* ── Logout ── */
  async function logout() {
    if (!MOCK_MODE) await logoutApi();
    localStorage.removeItem('gq-token');
    localStorage.removeItem('gq-user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

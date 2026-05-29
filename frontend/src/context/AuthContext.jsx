import { createContext, useContext, useEffect, useState } from 'react';
import { loginApi, registerApi, logoutApi, getMeApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('gq-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('gq-token');
    if (!stored) { setLoading(false); return; }

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
    await logoutApi();
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

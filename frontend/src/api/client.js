/* ── API Base Client ───────────────────────────────────────── */

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('gq-token') ?? null;
}

/**
 * apiFetch(path, options?)
 * Returns { ok: boolean, data: any, error: string|null }
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers,
    });

    let data = null;
    const text = await res.text();
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!res.ok) {
      const message =
        (data && (data.detail || data.message || data.error)) ||
        `HTTP ${res.status}`;
      return { ok: false, data: null, error: String(message) };
    }

    return { ok: true, data, error: null };
  } catch (err) {
    return { ok: false, data: null, error: err.message ?? 'Network error' };
  }
}

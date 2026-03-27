import { apiFetch } from './client';

export async function loginApi(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(name, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function logoutApi() {
  return apiFetch('/auth/logout', { method: 'POST' });
}

export async function getMeApi() {
  return apiFetch('/auth/me');
}

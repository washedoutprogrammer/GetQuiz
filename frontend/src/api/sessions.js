import { apiFetch } from './client';

export async function startSession(quizId) {
  return apiFetch('/sessions', {
    method: 'POST',
    body: JSON.stringify({ quiz_id: quizId }),
  });
}

export async function submitAnswer(sessionId, questionId, answer) {
  return apiFetch(`/sessions/${sessionId}/answers`, {
    method: 'POST',
    body: JSON.stringify({ question_id: questionId, answer }),
  });
}

export async function finishSession(sessionId) {
  return apiFetch(`/sessions/${sessionId}/finish`, { method: 'POST' });
}

export async function getHistory() {
  return apiFetch('/sessions');
}

export async function getSession(sessionId) {
  return apiFetch(`/sessions/${sessionId}`);
}

import { apiFetch } from './client';

export async function getQuizzes() {
  return apiFetch('/quizzes');
}

export async function getQuiz(id) {
  return apiFetch(`/quizzes/${id}`);
}

export async function createQuiz(payload) {
  return apiFetch('/quizzes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteQuiz(id) {
  return apiFetch(`/quizzes/${id}`, { method: 'DELETE' });
}

export async function generateQuiz(topic, count = 5) {
  return apiFetch('/quizzes/generate', {
    method: 'POST',
    body: JSON.stringify({ topic, count }),
  });
}

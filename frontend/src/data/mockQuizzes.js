/**
 * Shared mock quiz data used when the backend is unavailable.
 * Field names match the real API shape:
 *   MCQ  → correct_index  (0-based)
 *   T/F  → correct_answer (boolean)
 */
export const MOCK_QUIZZES = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Core JS concepts: closures, promises, prototypes',
    createdAt: '2026-03-10',
    tags: ['JavaScript', 'Programming'],
    questions: [
      {
        id: 'js-1', type: 'mcq',
        text: 'What is a closure in JavaScript?',
        options: ['A loop construct', 'A function with access to outer scope', 'An array method', 'A class pattern'],
        correct_index: 1,
      },
      {
        id: 'js-2', type: 'tf',
        text: 'JavaScript is a compiled language.',
        correct_answer: false,
      },
      {
        id: 'js-3', type: 'mcq',
        text: 'Which method removes the last element from an array?',
        options: ['shift()', 'pop()', 'slice()', 'splice()'],
        correct_index: 1,
      },
      {
        id: 'js-4', type: 'tf',
        text: 'Promises are always resolved asynchronously.',
        correct_answer: true,
      },
    ],
  },
  {
    id: 2,
    title: 'React Hooks Deep Dive',
    description: 'useState, useEffect, useCallback, useMemo patterns',
    createdAt: '2026-03-12',
    tags: ['React', 'Frontend'],
    questions: [
      {
        id: 'rh-1', type: 'tf',
        text: 'useEffect runs after every render by default.',
        correct_answer: true,
      },
      {
        id: 'rh-2', type: 'mcq',
        text: 'What hook is used to optimize expensive calculations?',
        options: ['useState', 'useCallback', 'useMemo', 'useRef'],
        correct_index: 2,
      },
      {
        id: 'rh-3', type: 'mcq',
        text: 'Which hook should you use to store a mutable value without causing re-renders?',
        options: ['useState', 'useReducer', 'useRef', 'useContext'],
        correct_index: 2,
      },
    ],
  },
  {
    id: 3,
    title: 'CSS Layout Mastery',
    description: 'Flexbox, Grid, positioning, responsive design',
    createdAt: '2026-03-14',
    tags: ['CSS', 'Design'],
    questions: [
      {
        id: 'css-1', type: 'tf',
        text: 'CSS Grid can only be used for two-dimensional layouts.',
        correct_answer: false,
      },
      {
        id: 'css-2', type: 'mcq',
        text: 'Which flex property controls the main axis alignment?',
        options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
        correct_index: 1,
      },
      {
        id: 'css-3', type: 'mcq',
        text: 'Which CSS unit is relative to the root element font size?',
        options: ['em', 'rem', 'px', 'vh'],
        correct_index: 1,
      },
    ],
  },
];

/** Returns a mock quiz by id (number or string), or null if not found. */
export function getMockQuiz(id) {
  const numId = Number(id);
  return MOCK_QUIZZES.find(q => q.id === numId) ?? null;
}

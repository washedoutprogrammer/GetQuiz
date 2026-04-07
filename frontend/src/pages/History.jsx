import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Clock, CheckCircle, XCircle, Edit3, PlusCircle } from 'lucide-react';
import '../styles/dashboard.css';

// Mock data for user's history
const MOCK_ATTEMPTS = [
  { id: 1, quizTitle: "JavaScript Fundamentals", score: 80, date: "2026-04-05", total: 10, wrongs: ["Q2: Closures", "Q7: Promises"] },
  { id: 2, quizTitle: "React Hooks Basics", score: 100, date: "2026-04-03", total: 5, wrongs: [] },
  { id: 3, quizTitle: "CSS Grid vs Flexbox", score: 60, date: "2026-04-01", total: 5, wrongs: ["Q1: Grid Template Areas", "Q4: Flex Grow"] }
];

const MOCK_EVENTS = [
  { id: 1, action: "Created", target: "CSS Layouts Quiz", date: "2026-04-06" },
  { id: 2, action: "Edited", target: "JavaScript Fundamentals", date: "2026-04-04" },
  { id: 3, action: "Created", target: "React Hooks Basics", date: "2026-04-02" }
];

export default function History() {
  const { theme } = useTheme();

  return (
    <div className="db-root">
      {/* Sidebar - consistent with Dashboard */}
      <aside className="db-sidebar">
        <Link to="/" className="db-brand" aria-label="Go to homepage">
          <div className="db-brand-icon"><Clock size={16} color="#f0eeff" strokeWidth={2.5} /></div>
          <span>GetQuiz</span>
        </Link>
        <div className="db-sidebar-footer" style={{ marginTop: 'auto' }}>
          <Link to="/dashboard" className="db-home-link">
            <ArrowLeft size={13} />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="db-main db-view">
        <header className="db-view-header">
          <div>
            <h1 className="db-view-title">Activity History</h1>
            <p className="db-view-sub">Review your past quiz attempts and content changes.</p>
          </div>
        </header>

        <div className="db-stats-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
          
          {/* Past Attempts Section */}
          <section className="db-form-section" style={{ margin: 0 }}>
            <h2 className="db-form-section-title">Past Quiz Attempts</h2>
            <div className="db-questions-list">
              {MOCK_ATTEMPTS.map(attempt => (
                <div key={attempt.id} className="db-question-card" style={{ padding: '1rem', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-1)', margin: 0 }}>{attempt.quizTitle}</h3>
                    <span className="db-quiz-card-date"><Clock size={11} /> {attempt.date}</span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <span className="db-meta-chip db-meta-mcq" style={{ background: attempt.score >= 80 ? 'var(--success-soft)' : 'rgba(255,190,61,0.1)', color: attempt.score >= 80 ? 'var(--success)' : 'var(--warn)' }}>
                      Score: {attempt.score}% ({attempt.score / 100 * attempt.total}/{attempt.total})
                    </span>
                  </div>
                  {attempt.wrongs.length > 0 ? (
                    <div>
                      <p className="db-label" style={{ marginBottom: '0.25rem' }}>Incorrect answers:</p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: 'var(--text-3)' }}>
                        {attempt.wrongs.map((wrong, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                            <XCircle size={11} color="#ff7070" /> {wrong}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--success)' }}>
                      <CheckCircle size={12} /> Perfect Score!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Activity Log Section */}
          <section className="db-form-section" style={{ margin: 0 }}>
            <h2 className="db-form-section-title">Content Activity Log</h2>
            <div className="db-questions-list">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="db-option" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {event.action === 'Created' ? <PlusCircle size={16} color="var(--accent-2)" /> : <Edit3 size={16} color="var(--cold)" />}
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-1)' }}>
                        <strong>{event.action}</strong> quiz
                      </p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-3)' }}>{event.target}</p>
                    </div>
                  </div>
                  <span className="db-quiz-card-date"><Clock size={11} /> {event.date}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

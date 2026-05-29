import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import {
  ArrowLeft, Clock, CheckCircle, PlusCircle, Zap,
  BookOpen, ChevronRight, HelpCircle, Loader2, AlertCircle,
  Trash2, Trophy, RotateCcw, X, Check, XCircle, Search
} from 'lucide-react';
import '../styles/dashboard.css';
import { getQuizzes, getDeletedQuizzes, getDetailedAttempts, restoreQuiz, permanentDeleteQuiz, getQuiz } from '../api/quizzes';
import Toast from '../components/Toast';

export default function History() {
  const { theme } = useTheme();
  const { user } = useUser();
  const { getToken } = useAuth();
  const userId = user?.id ?? 'anonymous';
  const navigate = useNavigate();
  const location = useLocation();

  // description: Trạng thái Tab hiện tại
  // input: chuỗi text 'CREATED', 'ATTEMPTS', 'DELETED'
  // output: setState để re-render giao diện tab tương ứng
  const [activeTab, setActiveTab] = useState('CREATED');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [deletedQuizzes, setDeletedQuizzes] = useState([]);

  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [selectedDeleted, setSelectedDeleted] = useState(null);

  const [loadingQuizId, setLoadingQuizId] = useState(null);

  useEffect(() => {
    const activity = location.state?.targetActivity;
    if (!activity) return;

    if (activity.type === 'quiz_created') {
      // Navigate directly to quiz preview — but only if the quiz still exists and is not soft-deleted
      const openCreatedQuiz = async () => {
        try {
          const [{ ok, data }, deletedRes] = await Promise.all([
            getQuiz(activity.quizId),
            getDeletedQuizzes(userId)
          ]);
          
          const isDeleted = (data && data.isDeleted) || 
                            (deletedRes.ok && deletedRes.data.some(q => q.id === activity.quizId));

          if (ok && data && !isDeleted) {
            navigate(`/quiz-preview/${activity.quizId}`, { state: { quiz: data, userId } });
          } else {
            // Quiz was soft-deleted, permanently deleted, or not found
            setToast({ message: 'Quiz not found. It may have been deleted.', type: 'warn' });
            setActiveTab('CREATED');
          }
        } catch {
          setToast({ message: 'Quiz not found. It may have been deleted.', type: 'warn' });
          setActiveTab('CREATED');
        }
      };
      openCreatedQuiz();
    } else if (activity.type === 'quiz_attempted') {
      setActiveTab('ATTEMPTS');
      setSelectedAttempt(activity.attemptId);
    } else if (activity.type === 'quiz_deleted') {
      // Safely switch to DELETED tab and open the modal only if it's still deleted
      setActiveTab('DELETED');
      if (activity.quizId && activity.quizTitle) {
        const checkDeletedStatus = async () => {
          try {
            const deletedRes = await getDeletedQuizzes(userId);
            if (deletedRes.ok && deletedRes.data.some(q => q.id === activity.quizId)) {
              setSelectedDeleted({ id: activity.quizId, title: activity.quizTitle });
            }
          } catch {
          }
        };
        checkDeletedStatus();
      }
    }

    // Clear route state to prevent re-triggering on F5
    window.history.replaceState({}, document.title);
  }, [location.state?.targetActivity, navigate, userId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (activeTab === 'CREATED') {
          const res = await getQuizzes(userId);
          if (!cancelled && res.ok) setCreatedQuizzes(res.data);
        } else if (activeTab === 'ATTEMPTS') {
          const res = await getDetailedAttempts(userId);
          if (!cancelled && res.ok) setAttempts(res.data);
        } else if (activeTab === 'DELETED') {
          const res = await getDeletedQuizzes(userId);
          if (!cancelled && res.ok) setDeletedQuizzes(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeTab, userId]);

  const handleRestore = async (id) => {
    const res = await restoreQuiz(id, userId);
    if (res.ok) {
      setToast({ message: 'Quiz restored successfully', type: 'success' });
      setDeletedQuizzes(prev => prev.filter(q => q.id !== id));
      setSelectedDeleted(null);
    } else {
      setToast({ message: 'Failed to restore quiz', type: 'error' });
    }
  };

  const handlePermanentDelete = async (id) => {
    const res = await permanentDeleteQuiz(id, userId);
    if (res.ok) {
      setToast({ message: 'Quiz permanently deleted', type: 'success' });
      setDeletedQuizzes(prev => prev.filter(q => q.id !== id));
      setSelectedDeleted(null);
    } else {
      setToast({ message: 'Failed to delete quiz', type: 'error' });
    }
  };

  const filteredCreated = useMemo(() => {
    if (!search) return createdQuizzes;
    const lowerSearch = search.toLowerCase();
    return createdQuizzes.filter(q => q.title.toLowerCase().includes(lowerSearch));
  }, [createdQuizzes, search]);

  const filteredAttempts = useMemo(() => {
    if (!search) return attempts;
    const lowerSearch = search.toLowerCase();
    return attempts.filter(att => att.quiz_title.toLowerCase().includes(lowerSearch));
  }, [attempts, search]);

  const filteredDeleted = useMemo(() => {
    if (!search) return deletedQuizzes;
    const lowerSearch = search.toLowerCase();
    return deletedQuizzes.filter(q => q.title.toLowerCase().includes(lowerSearch));
  }, [deletedQuizzes, search]);

  const handleOpenQuiz = async (quiz) => {
    if (loadingQuizId) return; // chặn double-click khi đang tải
    setLoadingQuizId(quiz.id);
    try {
      const { ok, data } = await getQuiz(quiz.id);
      if (ok && data) {
        navigate(`/quiz-preview/${quiz.id}`, { state: { quiz: data, userId } });
      } else {
        // fallback: dùng dữ liệu cơ bản nếu fetch thất bại
        navigate(`/quiz-preview/${quiz.id}`, { state: { quiz, userId } });
      }
    } catch {
      navigate(`/quiz-preview/${quiz.id}`, { state: { quiz, userId } });
    } finally {
      setLoadingQuizId(null);
    }
  };

  return (
    <div className="db-root">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar */}
      <aside className="db-sidebar">
        <Link to="/" className="db-brand" aria-label="Go to homepage">
          <div className="db-brand-icon"><Zap size={16} color="#f0eeff" strokeWidth={2.5} /></div>
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
            <p className="db-view-sub">
              Manage your created quizzes, view attempt history and manage deleted quizzes.
            </p>
          </div>
        </header>

        {/* Tab Navigation + Search Bar*/}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border)', gap: '1rem' }}>
          {/* Tab buttons */}
          <div className="tabs-container" style={{ borderBottom: 'none', marginBottom: 0, flex: '0 0 auto' }}>
            <button
              className={`tab-btn ${activeTab === 'CREATED' ? 'active' : ''}`}
              onClick={() => setActiveTab('CREATED')}
            >
              CREATED
            </button>
            <button
              className={`tab-btn ${activeTab === 'ATTEMPTS' ? 'active' : ''}`}
              onClick={() => setActiveTab('ATTEMPTS')}
            >
              ATTEMPTS
            </button>
            <button
              className={`tab-btn ${activeTab === 'DELETED' ? 'active' : ''}`}
              onClick={() => setActiveTab('DELETED')}
            >
              DELETED
            </button>
          </div>

          {/* Search bar */}
          <div className="db-search-wrap" style={{ margin: 0, flex: '1', maxWidth: '320px', paddingBottom: '0.5rem' }}>
            <Search size={14} className="db-search-icon" />
            <input
              className="db-search"
              type="text"
              placeholder="Search quizzes by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="db-empty">
            <Loader2 size={32} className="spin" style={{ color: 'var(--accent-2)', opacity: 0.7 }} />
            <p className="db-empty-msg">Loading {activeTab.toLowerCase()}...</p>
          </div>
        ) : (
          <div className="tab-content">
            {/* Tab CREATED */}
            {activeTab === 'CREATED' && (
              filteredCreated.length === 0 ? (
                <div className="db-empty"><p className="db-empty-msg">{search ? 'No matches found.' : 'No quizzes created.'}</p></div>
              ) : (
                <ul className="hist-list">
                  {filteredCreated.map(quiz => (
                    <li key={quiz.id}>
                      <button
                        className="hist-card"
                        onClick={() => handleOpenQuiz(quiz)}
                        disabled={loadingQuizId === quiz.id}
                        style={{ opacity: loadingQuizId && loadingQuizId !== quiz.id ? 0.5 : 1 }}
                      >
                        <div className="hist-card-body">
                          <p className="hist-card-title">{quiz.title}</p>
                          <div className="hist-card-meta">
                            <span><Clock size={11} /> {quiz.createdAt}</span>
                          </div>
                        </div>
                        {loadingQuizId === quiz.id
                          ? <Loader2 size={16} className="spin" style={{ color: 'var(--accent-1)', flexShrink: 0 }} />
                          : <ChevronRight size={16} className="hist-card-arrow" />
                        }
                      </button>
                    </li>
                  ))}
                </ul>
              )
            )}

            {/* Tab ATTEMPTS */}
            {activeTab === 'ATTEMPTS' && (
              filteredAttempts.length === 0 ? (
                <div className="db-empty"><p className="db-empty-msg">{search ? 'No matches found.' : 'No attempts found.'}</p></div>
              ) : (
                <div className="attempts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredAttempts.map(att => (
                    <div key={att.attempt_id} className="attempt-card" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', background: 'var(--surface)' }}>
                      <div className="attempt-header" style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setSelectedAttempt(selectedAttempt === att.attempt_id ? null : att.attempt_id)}>
                        <div>
                          <p style={{ fontWeight: 'bold', margin: 0, fontSize: '1.1rem' }}>{att.quiz_title}</p>
                          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-color)', opacity: 0.7 }}>{formatTime(att.end_time)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: scoreColour(att.score), fontWeight: 'bold', fontSize: '1.2rem' }}>{att.score}%</span>
                          <ChevronRight size={20} style={{ transform: selectedAttempt === att.attempt_id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Tab DELETED */}
            {activeTab === 'DELETED' && (
              filteredDeleted.length === 0 ? (
                <div className="db-empty"><p className="db-empty-msg">{search ? 'No matches found.' : 'Trash is empty.'}</p></div>
              ) : (
                <ul className="hist-list">
                  {filteredDeleted.map(quiz => (
                    <li key={quiz.id}>
                      <button className="hist-card" onClick={() => setSelectedDeleted(quiz)}>
                        <div className="hist-card-body">
                          <p className="hist-card-title">{quiz.title}</p>
                          <div className="hist-card-meta">
                            <span><Trash2 size={11} /> Deleted</span>
                          </div>
                        </div>
                        <Trash2 size={16} className="hist-card-arrow" />
                      </button>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        )}
      </main>


      {selectedAttempt && (
        (() => {
          const att = attempts.find(a => a.attempt_id === selectedAttempt);
          if (!att) return null;
          return (
            /* Description: Modal container */
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelectedAttempt(null)}>

              <div
                style={{ display: 'flex', flexDirection: 'row', background: '#080810', borderRadius: '16px', width: '92%', maxWidth: '1050px', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{
                  width: '212px', minWidth: '212px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                  padding: '2rem 1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.6rem',
                  alignContent: 'start',
                  overflowY: 'auto',
                }}>
                  {att.details.map((ans, idx) => (

                    <button
                      key={idx}
                      title={`Jump to Q${idx + 1}`}
                      onClick={() => {
                        const el = document.getElementById(`q-${idx}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      style={{
                        width: '38px', height: '38px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '0.8rem', color: '#000',
                        background: ans.is_correct ? '#3dffa0' : '#ff7070',
                        boxShadow: ans.is_correct ? '0 0 8px rgba(61,255,160,0.4)' : '0 0 8px rgba(255,112,112,0.4)',
                        transition: 'transform 0.15s ease',
                        justifySelf: 'center',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>

                  <button
                    onClick={() => setSelectedAttempt(null)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)', zIndex: 1 }}
                  >
                    <X size={22} />
                  </button>

                  <div style={{ padding: '2rem 3rem 1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                    <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.4rem', fontWeight: '700' }}>{att.quiz_title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.75 }}>
                      <span style={{ fontSize: '0.85rem' }}>
                        <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                        {formatTime(att.end_time)}
                      </span>
                      <span style={{ color: scoreColour(att.score), fontWeight: '700', fontSize: '1.25rem' }}>
                        {att.score}%
                      </span>
                    </div>
                  </div>

                  {/* List of question card */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {att.details.map((ans, idx) => (
                        <div
                          id={`q-${idx}`}
                          key={idx}
                          style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.05rem', lineHeight: '1.5' }}>
                            <span style={{ color: 'var(--accent-1)', marginRight: '8px' }}>Q{idx + 1}.</span>
                            {ans.question_text}
                          </p>

                          {/* List of answer questions: green if true, red if false */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            {(ans.options && ans.options.length > 0 ? ans.options : [ans.correct_answer, ans.chosen_answer].filter(Boolean)).map((opt, optIdx) => {
                              const isChosen = opt === ans.chosen_answer;
                              const isCorrect = opt === ans.correct_answer;
                              let optStyle = { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', fontSize: '0.95rem' };
                              if (isCorrect) {
                                optStyle = { ...optStyle, borderColor: '#3dffa0', background: 'rgba(61,255,160,0.1)', color: '#3dffa0', fontWeight: '600' };
                              } else if (isChosen && !isCorrect) {
                                optStyle = { ...optStyle, borderColor: '#ff7070', background: 'rgba(255,112,112,0.1)', color: '#ff7070' };
                              }
                              return <div key={optIdx} style={optStyle}>{opt}</div>;
                            })}
                          </div>

                          {/* True anwser notification */}
                          <div style={{ background: 'rgba(61,255,160,0.05)', padding: '0.6rem 1rem', borderRadius: '6px', borderLeft: '3px solid #3dffa0', marginBottom: '1rem', color: '#3dffa0' }}>
                            <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem' }}>
                              The correct answer is: <strong>{ans.correct_answer}</strong>
                            </p>
                          </div>

                          {/* Explanation line */}
                          {ans.explanation && (
                            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-1)' }}>
                              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
                                <strong style={{ color: 'var(--accent-1)' }}>Explanation: </strong>
                                {ans.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* Modal display  Restore / Delete function for deleted quiz */}
      {selectedDeleted && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelectedDeleted(null)}>
          <div
            style={{ background: '#080810', borderRadius: '12px', width: '90%', maxWidth: '400px', padding: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Deleted Quiz</h3>
              <button
                onClick={() => setSelectedDeleted(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0, display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: '0 0 1.5rem', fontSize: '0.95rem', color: 'var(--text-color)', opacity: 0.9, lineHeight: 1.5 }}>
              What would you like to do with <strong>{selectedDeleted.title}</strong>?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => handleRestore(selectedDeleted.id)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 190, 61, 0.2)', background: 'rgba(255, 190, 61, 0.1)', color: '#ffbe3d', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'filter 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
              >
                <RotateCcw size={16} />
                Restore Quiz
              </button>

              <button
                onClick={() => handlePermanentDelete(selectedDeleted.id)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,112,112,0.3)', background: 'rgba(255,112,112,0.1)', color: '#ff7070', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,112,112,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,112,112,0.1)'}
              >
                <Trash2 size={16} />
                Permanent Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColour(pct) {
  if (pct >= 80) return '#3dffa0';
  if (pct >= 60) return '#9d7fff';
  if (pct >= 40) return '#ffbe3d';
  return '#ff7070';
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

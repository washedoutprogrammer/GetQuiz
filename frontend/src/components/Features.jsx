import { useRef, useEffect } from 'react';
import { Sparkles, Clock, History, WifiOff } from 'lucide-react';

const FEATURES = [
  {
    id: '01',
    icon: Sparkles,
    iconColor: 'var(--accent-2)',
    iconBg: 'var(--accent-soft)',
    title: 'AI-Powered Generation',
    desc: 'Upload your lecture slides or notes (PDF, DOCX, TXT) or type a topic. GetQuiz uses AI to extract key concepts and craft questions instantly.',
    tag: 'Core feature',
  },
  {
    id: '02',
    icon: Clock,
    iconColor: 'var(--cold)',
    iconBg: 'var(--cold-soft)',
    title: 'Interactive Quiz Sessions',
    desc: 'Take your quizzes in a distraction-free environment. Includes a built-in countdown timer and prevents data loss during your test.',
    tag: 'Testing',
  },
  {
    id: '03',
    icon: History,
    iconColor: '#ffbe3d',
    iconBg: 'rgba(255,190,61,0.1)',
    title: 'Detailed History Tracking',
    desc: 'Keep track of your learning progress. Review past attempts, check your scores, and read detailed explanations for every answer.',
    tag: 'Analytics',
  },
  {
    id: '04',
    icon: WifiOff,
    iconColor: '#3dffa0',
    iconBg: 'rgba(61,255,160,0.1)',
    title: 'Offline Mock Mode',
    desc: 'No connection? No problem. The system automatically switches to offline mode with built-in practice sets when the AI service is busy.',
    tag: 'Fail-safe',
  },
];

export default function Features() {
  const gridRef = useRef(null);

  return (
    <section className="section" id="features" aria-labelledby="features-heading">
      <div className="container">
        <div className="section-label" aria-hidden="true">
          Capabilities
        </div>
        <h2 id="features-heading" className="section-title">
          Everything you need to{' '}
          <span className="gradient-text">quiz smarter</span>
        </h2>
        <p className="section-sub">
          From AI generation to session tracking — a complete quiz ecosystem built for results.
        </p>

        <div className="features-grid" ref={gridRef}>
          {FEATURES.map(({ id, icon: Icon, iconColor, iconBg, title, desc, tag }) => (
            <div key={id} className="feature-cell" role="article">
              <div
                className="feature-icon-wrap"
                style={{ background: iconBg }}
                aria-hidden="true"
              >
                <Icon size={22} color={iconColor} strokeWidth={1.75} />
                <span className="feature-num" aria-hidden="true">{id}</span>
              </div>

              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>

              <div className="feature-tag">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <circle cx="4" cy="4" r="3" fill={iconColor} />
                </svg>
                {tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import { useRef, useEffect } from 'react';
import { Sparkles, PenTool, BarChart2, Share2 } from 'lucide-react';

const FEATURES = [
  {
    id: '01',
    icon: Sparkles,
    iconColor: 'var(--accent-2)',
    iconBg: 'var(--accent-soft)',
    title: 'AI-Powered Generation',
    desc: 'Paste any text, upload a PDF, or drop a URL. GetQuiz\'s AI extracts key concepts and crafts targeted questions in under 5 seconds.',
    tag: 'Core feature',
  },
  {
    id: '02',
    icon: PenTool,
    iconColor: 'var(--cold)',
    iconBg: 'var(--cold-soft)',
    title: 'Powerful Manual Editor',
    desc: 'Full creative control. Add, edit, or delete questions. Rearrange options, set point values, and add explanations with rich text.',
    tag: 'Pro & Teams',
  },
  {
    id: '03',
    icon: BarChart2,
    iconColor: '#ffbe3d',
    iconBg: 'rgba(255,190,61,0.1)',
    title: 'Instant Analytics',
    desc: 'Real-time dashboards show scores, completion rates, time-per-question, and question-level difficulty across all participants.',
    tag: 'Pro & Teams',
  },
  {
    id: '04',
    icon: Share2,
    iconColor: '#3dffa0',
    iconBg: 'rgba(61,255,160,0.1)',
    title: 'Seamless Exporting',
    desc: 'One-click export to PDF, SCORM, Google Forms, or direct shareable link. Native LMS integration for Moodle, Canvas, and Blackboard.',
    tag: 'All plans',
  },
];

export default function Features() {
  const gridRef = useRef(null);

  // Track mouse position for each card's radial gradient hotspot
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMove = (e) => {
      const cells = grid.querySelectorAll('.feature-cell');
      cells.forEach(cell => {
        const rect = cell.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        cell.style.setProperty('--mx', `${mx}%`);
        cell.style.setProperty('--my', `${my}%`);
      });
    };

    grid.addEventListener('mousemove', handleMove);
    return () => grid.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section className="section features" id="features" aria-labelledby="features-heading">
      <div className="container">
        <div className="section-label" aria-hidden="true">
          Capabilities
        </div>
        <h2 id="features-heading" className="section-title">
          Everything you need to{' '}
          <span className="gradient-text">quiz smarter</span>
        </h2>
        <p className="section-sub">
          From AI generation to live analytics — a complete quiz ecosystem built for results.
        </p>

        {/* Feature grid — 2×2 separated-border layout */}
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

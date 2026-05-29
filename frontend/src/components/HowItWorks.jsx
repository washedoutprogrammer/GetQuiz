import { FileText, Bot, Trophy } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: FileText,
    title: 'Give a topic or upload content',
    desc: 'Simply type a topic you want to learn about, or upload your study documents (PDF, DOCX, TXT) up to 15,000 characters.',
    color: 'var(--accent-2)',
  },
  {
    num: '02',
    icon: Bot,
    title: 'Watch AI build the quiz',
    desc: 'Our system connects to OpenRouter AI to analyze your document\'s context and generate multiple-choice and true/false questions.',
    color: 'var(--cold)',
  },
  {
    num: '03',
    icon: Trophy,
    title: 'Test yourself & get graded',
    desc: 'Start the timer, complete the quiz, and get instantly graded with a visual score breakdown and detailed explanations.',
    color: '#3dffa0',
  },
];

export default function HowItWorks() {
  return (
    <section
      className="section how"
      id="how-it-works"
      aria-labelledby="how-heading"
      style={{ background: 'var(--ink-2)' }}
    >
      <div className="container">
        <div className="section-label" aria-hidden="true">
          Process
        </div>
        <h2 id="how-heading" className="section-title">
          From idea to quiz in{' '}
          <span className="gradient-text">three steps</span>
        </h2>
        <p className="section-sub">
          Stop wasting hours writing questions manually. Let the AI do the heavy lifting for you.
        </p>

        <div className="how-steps">
          {STEPS.map(({ num, icon: Icon, title, desc, color }) => (
            <div key={num} className="how-step">
              <div className="how-step-icon-wrap" aria-hidden="true">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 24px ${color}40`,
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={24} color="var(--ink)" strokeWidth={2} />
                </div>
              </div>
              <h3 className="how-step-title">{title}</h3>
              <p className="how-step-desc">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom proof strip */}
        <div
          style={{
            marginTop: 'var(--space-6)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--ink-2)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-5)',
            flexWrap: 'wrap',
          }}
        >
          {[
            { emoji: '⚡', text: 'Auto-fallback to Mock Mode on errors' },
            { emoji: '🎯', text: 'Supports True/False and MCQ formats' },
            { emoji: '🔁', text: 'Quota limits to prevent API abuse' },
          ].map(({ emoji, text }) => (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--accent-2)',
              }}
            >
              <span role="img" aria-hidden="true">{emoji}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
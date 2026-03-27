import { Type, Brain, Send } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Type,
    title: 'Give a topic or upload content',
    desc: 'Type a prompt, paste text, drop a document (PDF/DOCX), or share a URL. GetQuiz understands it all.',
    color: 'var(--accent-2)',
  },
  {
    num: '02',
    icon: Brain,
    title: 'Watch AI build the quiz',
    desc: 'Our large language model identifies key concepts, generates distractors, and assembles a balanced, pedagogically sound assessment.',
    color: 'var(--cold)',
  },
  {
    num: '03',
    icon: Send,
    title: 'Publish & share instantly',
    desc: 'Review, tweak if needed, then publish with one click. Share via link, embed on your site, or push directly to your LMS.',
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
          No learning curve. No templates. Just describe what you need and GetQuiz handles the rest.
        </p>

        <div className="how-steps" role="list">
          {STEPS.map(({ num, icon: Icon, title, desc, color }, i) => (
            <div
              key={num}
              className="how-step"
              role="listitem"
              aria-label={`Step ${num}: ${title}`}
            >
              <div className="how-step-num" style={{ color }}>
                {num}
                <div
                  className="how-step-icon"
                  style={{ background: color }}
                  aria-hidden="true"
                >
                  <Icon size={13} color="var(--ink)" strokeWidth={2.5} />
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
            background: 'var(--accent-soft)',
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
            { emoji: '⚡', text: 'Average quiz created in 3.2 seconds' },
            { emoji: '🎯', text: '98.4% question accuracy rate' },
            { emoji: '🔁', text: 'Unlimited regeneration per prompt' },
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

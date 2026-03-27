import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function BottomCta() {
  return (
    <section className="bottom-cta" aria-labelledby="bottom-cta-heading">
      <div className="bottom-cta-bg" aria-hidden="true" />

      {/* Decorative grid lines */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(124,92,252,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,92,252,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black, transparent)',
        }}
      />

      <div className="container bottom-cta-inner">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-soft)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-full)',
            padding: '0.3rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--accent-2)',
            marginBottom: 'var(--space-3)',
          }}
        >
          <Sparkles size={11} />
          Start generating — it's free
        </div>

        <h2 id="bottom-cta-heading" className="bottom-cta-title">
          Your next quiz is{' '}
          <span className="gradient-text">3 seconds away.</span>
        </h2>

        <p className="bottom-cta-sub">
          No account required to try it. No credit card. No setup.
          <br />
          Just describe your topic and watch the magic happen.
        </p>

        <div className="bottom-cta-actions">
          <Link to="/dashboard" id="bottom-cta-primary-btn" className="btn btn-primary btn-large">
            <Sparkles size={17} />
            Generate My First Quiz
            <ArrowRight size={17} />
          </Link>
          <button id="bottom-cta-demo-btn" className="btn btn-ghost btn-large">
            Watch a 90-second demo
          </button>
        </div>

        <p className="bottom-cta-note">
          Join 50,000+ educators, trainers, and marketers · Free forever plan available
        </p>
      </div>
    </section>
  );
}

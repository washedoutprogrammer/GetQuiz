import { useState } from 'react';
import { Check, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    tier: 'Starter',
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: 'Perfect for trying out GetQuiz or occasional personal use.',
    features: [
      { text: '10 quizzes per month', included: true },
      { text: 'Up to 15 questions per quiz', included: true },
      { text: 'Basic question types (MCQ, T/F)', included: true },
      { text: 'Shareable quiz link', included: true },
      { text: 'Real-time analytics', included: false },
      { text: 'PDF/SCORM export', included: false },
      { text: 'LMS integration', included: false },
    ],
    cta: 'Start for Free',
    ctaStyle: 'ghost',
    featured: false,
  },
  {
    id: 'pro',
    tier: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 19,
    desc: 'For educators and trainers who run quizzes regularly.',
    features: [
      { text: 'Unlimited quizzes', included: true },
      { text: 'Up to 100 questions per quiz', included: true },
      { text: 'All question types + rich text', included: true },
      { text: 'Custom branding & themes', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'PDF, SCORM & Google Forms export', included: true },
      { text: 'LMS integration (Canvas, Moodle)', included: false },
    ],
    cta: 'Start Pro Trial',
    ctaStyle: 'primary',
    featured: true,
  },
  {
    id: 'teams',
    tier: 'Teams',
    monthlyPrice: 89,
    yearlyPrice: 59,
    desc: 'For organizations needing collaboration and enterprise controls.',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Up to 25 team members', included: true },
      { text: 'Shared quiz library', included: true },
      { text: 'SSO & advanced security', included: true },
      { text: 'Full LMS integration suite', included: true },
      { text: 'Priority support & SLA', included: true },
      { text: 'Custom API access', included: true },
    ],
    cta: 'Contact Sales',
    ctaStyle: 'ghost',
    featured: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  // For the toggle slider animation
  const TOGGLE_W = 90;

  return (
    <section
      className="section pricing"
      id="pricing"
      aria-labelledby="pricing-heading"
      style={{ background: 'var(--ink-2)' }}
    >
      <div className="container">
        <div className="section-label" aria-hidden="true">Pricing</div>
        <h2 id="pricing-heading" className="section-title">
          Simple, transparent{' '}
          <span className="gradient-text">pricing</span>
        </h2>
        <p className="section-sub">
          No surprise fees. Upgrade or downgrade any time.
        </p>

        {/* Billing toggle */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'var(--space-4)' }}
          role="group"
          aria-label="Billing frequency"
        >
          <div
            className="pricing-toggle"
            style={{ minWidth: `${TOGGLE_W * 2 + 8}px` }}
          >
            <div
              className="pricing-toggle-slider"
              style={{ width: TOGGLE_W, left: yearly ? `${TOGGLE_W + 4}px` : '4px' }}
              aria-hidden="true"
            />
            <button
              className={`pricing-toggle-option${!yearly ? ' active' : ''}`}
              onClick={() => setYearly(false)}
              aria-pressed={!yearly}
              style={{ width: TOGGLE_W }}
            >
              Monthly
            </button>
            <button
              className={`pricing-toggle-option${yearly ? ' active' : ''}`}
              onClick={() => setYearly(true)}
              aria-pressed={yearly}
              style={{ width: TOGGLE_W }}
            >
              Annual
            </button>
          </div>
          {yearly && (
            <span className="pricing-save-badge">
              <Zap size={10} />
              Save up to 34%
            </span>
          )}
        </div>

        {/* Plans grid */}
        <div className="pricing-grid" role="list">
          {PLANS.map(({ id, tier, monthlyPrice, yearlyPrice, desc, features, cta, ctaStyle, featured }) => {
            const price = yearly ? yearlyPrice : monthlyPrice;
            return (
              <article
                key={id}
                className={`pricing-card${featured ? ' featured' : ''}`}
                role="listitem"
                aria-label={`${tier} plan`}
              >
                {featured && (
                  <div className="pricing-featured-badge" aria-label="Most popular plan">
                    ✦ Most Popular
                  </div>
                )}

                <div className="pricing-tier">{tier}</div>

                <div className="pricing-amount">
                  {price === 0 ? (
                    'Free'
                  ) : (
                    <>
                      <sup>$</sup>
                      {price}
                    </>
                  )}
                </div>

                {price > 0 && (
                  <div className="pricing-cycle">
                    / month{yearly ? ', billed annually' : ''}
                  </div>
                )}
                {price === 0 && (
                  <div className="pricing-cycle">Forever free</div>
                )}

                <p className="pricing-desc">{desc}</p>

                <ul className="pricing-features" aria-label={`${tier} plan features`}>
                  {features.map(({ text, included }) => (
                    <li key={text} className="pricing-feature-item">
                      <div
                        className="pricing-feature-check"
                        aria-hidden="true"
                      >
                        {included ? (
                          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="8" fill="rgba(124,92,252,0.15)" />
                            <path d="M5 8l2 2 4-4" stroke="var(--accent-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="8" fill="rgba(107,100,122,0.15)" />
                            <path d="M5.5 10.5l5-5M10.5 10.5l-5-5" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{ color: included ? 'var(--text-2)' : 'var(--text-3)', textDecoration: included ? 'none' : 'none' }}>
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  id={`pricing-cta-${id}`}
                  className={`btn btn-${featured ? 'primary' : 'ghost'} pricing-cta`}
                  aria-label={`Choose ${tier} plan — ${cta}`}
                >
                  {cta}
                </button>
              </article>
            );
          })}
        </div>

        {/* Guarantee strip */}
        <p
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-4)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--text-3)',
          }}
        >
          🔒 14-day money-back guarantee on all paid plans · Cancel anytime, no questions asked
        </p>
      </div>
    </section>
  );
}

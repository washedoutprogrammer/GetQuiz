const TESTIMONIALS = [
  {
    id: 'testimonial-1',
    quote: "I used to spend an entire Sunday crafting quiz questions for Monday's class. With GetQuiz, I describe the chapter topic and have 20 solid questions in under a minute. The AI even includes plausible distractors I wouldn't have thought of.",
    name: 'Mei-Lin Huang',
    role: 'High School Biology Teacher',
    avatar: 'ML',
    avatarBg: 'linear-gradient(135deg, #7c5cfc, #4ff8e5)',
    company: 'Jefferson Science Academy',
    companyIcon: '🏫',
    stars: 5,
  },
  {
    id: 'testimonial-2',
    quote: "We run onboarding quizzes for 400+ new hires per quarter. GetQuiz cut our L&D team's quiz-creation time by 80%. The LMS export is flawless and the analytics help us identify which modules need better training material.",
    name: 'Daniel Osei',
    role: 'Senior HR Manager',
    avatar: 'DO',
    avatarBg: 'linear-gradient(135deg, #4ff8e5, #3dffa0)',
    company: 'Nexora Technologies',
    companyIcon: '🏢',
    stars: 5,
  },
  {
    id: 'testimonial-3',
    quote: "We embedded a product knowledge quiz in our campaign landing page. GetQuiz generated it from our product brief in minutes. Completion rate was 73% — and high scorers converted to purchases at 3× the baseline rate.",
    name: 'Priya Nair',
    role: 'Digital Marketing Lead',
    avatar: 'PN',
    avatarBg: 'linear-gradient(135deg, #ffbe3d, #ff8057)',
    company: 'Veldra Consumer Brands',
    companyIcon: '📣',
    stars: 5,
  },
];

function StarRating({ count }) {
  return (
    <div className="testimonial-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="testimonial-star" aria-hidden="true">★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      className="section testimonials"
      id="testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="testimonials-bg" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-label" aria-hidden="true">
          Social Proof
        </div>
        <h2 id="testimonials-heading" className="section-title">
          Loved by{' '}
          <span className="gradient-text">50,000+ professionals</span>
        </h2>
        <p className="section-sub">
          From classrooms to boardrooms — GetQuiz powers quizzes that matter.
        </p>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(({ id, quote, name, role, avatar, avatarBg, company, companyIcon, stars }) => (
            <article key={id} className="testimonial-card" aria-label={`Testimonial from ${name}`}>
              <StarRating count={stars} />

              <blockquote>
                <p className="testimonial-text">"{quote}"</p>
              </blockquote>

              <footer className="testimonial-author">
                <div
                  className="testimonial-avatar"
                  style={{ background: avatarBg }}
                  aria-hidden="true"
                >
                  {avatar}
                </div>
                <div>
                  <div className="testimonial-name">{name}</div>
                  <div className="testimonial-role">{role}</div>
                </div>
                <div
                  style={{
                    marginLeft: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-3)',
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '2px',
                  }}
                >
                  <span aria-hidden="true">{companyIcon}</span>
                  <span>{company}</span>
                </div>
              </footer>
            </article>
          ))}
        </div>

        {/* Trust bar */}
        <div
          style={{
            marginTop: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-5)',
            flexWrap: 'wrap',
          }}
        >
          {['Harvard Extension', 'Google EMEA', 'Shopify', 'Duolingo', 'MIT OpenCourseWare'].map(name => (
            <div
              key={name}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0.6,
                transition: 'opacity 0.2s',
                cursor: 'default',
              }}
              role="img"
              aria-label={`Trusted by ${name}`}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

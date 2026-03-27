import { Zap, Twitter, Github, Linkedin } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Templates', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Community', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Status', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand column */}
          <div>
            <div className="nav-logo" style={{ marginBottom: 'var(--space-2)' }}>
              <div className="nav-logo-icon" aria-hidden="true">
                <Zap size={16} color="#f0eeff" strokeWidth={2.5} />
              </div>
              GetQuiz
            </div>
            <p className="footer-brand-desc">
              AI-powered quiz generation for educators, L&D teams, and marketers.
              Build better quizzes, faster.
            </p>
            {/* Social */}
            <div className="footer-social" style={{ marginTop: 'var(--space-3)' }}>
              {[
                { Icon: Twitter, label: 'GetQuiz on Twitter' },
                { Icon: Github, label: 'GetQuiz on GitHub' },
                { Icon: Linkedin, label: 'GetQuiz on LinkedIn' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="footer-social-link"
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <nav key={col} aria-label={`${col} links`}>
              <div className="footer-col-title">{col}</div>
              <ul className="footer-links">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="footer-link">{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} GetQuiz, Inc. — Built with ☕ and lots of ✨
          </p>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--success)',
                boxShadow: '0 0 8px var(--success)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

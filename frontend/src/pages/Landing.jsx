import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import BottomCta from '../components/BottomCta';
import Footer from '../components/Footer';

// Lazy reveal: fade-up sections as they enter viewport
function useSectionReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Landing() {
  useSectionReveal();

  return (
    <>
      {/* Film-grain noise texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Skip-nav for accessibility */}
      <a
        href="#hero"
        style={{
          position: 'absolute',
          top: -100,
          left: 0,
          zIndex: 9999,
          background: 'var(--accent)',
          color: 'var(--text-1)',
          padding: '0.5rem 1rem',
          borderRadius: '0 0 var(--radius-sm) 0',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'top 0.2s',
        }}
        onFocus={e => (e.currentTarget.style.top = '0')}
        onBlur={e => (e.currentTarget.style.top = '-100px')}
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />

        <div data-reveal>
          <Features />
        </div>

        <div data-reveal>
          <HowItWorks />
        </div>

        <div data-reveal>
          <Testimonials />
        </div>

        <div data-reveal>
          <Pricing />
        </div>

        <div data-reveal>
          <BottomCta />
        </div>
      </main>

      <Footer />

      {/* Global reveal animation style */}
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
                      transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}

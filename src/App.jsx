import React, { useState, useEffect } from 'react';
import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import About          from './components/About';
import OrbitalSection from './components/OrbitalSection';
import Work           from './components/Work';
import Contact        from './components/Contact';
import Footer         from './components/Footer';

/* ── Marquee Banner ── */
const MarqueeBanner = () => (
  <div className="marquee-section">
    <div className="marquee-track">
      <span>FRONT-END DEVELOPER</span>
      <span>•</span>
      <span>FLUTTER DEVELOPER</span>
      <span>•</span>
      <span>REACT.JS</span>
      <span>•</span>
      <span>UI/UX DESIGN</span>
      <span>•</span>
      <span>FRONT-END DEVELOPER</span>
      <span>•</span>
      <span>FLUTTER DEVELOPER</span>
      <span>•</span>
      <span>REACT.JS</span>
      <span>•</span>
      <span>UI/UX DESIGN</span>
      <span>•</span>
    </div>
  </div>
);

/* ── Back-to-top button ── */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-5 left-5 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: '#ffffff',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        boxShadow: '0 0 20px rgba(255,255,255,0.20)',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
};

/* ── Main App ── */
const App = () => {
  /* ── Scroll-reveal IntersectionObserver ── */
  useEffect(() => {
    const register = () => {
      const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      targets.forEach(el => observer.observe(el));
    };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10, rootMargin: '0px 0px -50px 0px' }
    );

    register();
    /* re-register after 600ms to catch dynamically added elements */
    const t = setTimeout(register, 600);
    return () => { observer.disconnect(); clearTimeout(t); };
  }, []);

  /* ── Global ripple effect on .gradient-btn clicks ── */
  useEffect(() => {
    const handler = (e) => {
      const btn = e.target.closest('.gradient-btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top  = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: '#000000' }}>

      {/* ── Fixed UI ── */}
      <Navbar />
      <BackToTop />

      {/* ── Page sections ── */}
      <main>
        <Hero />
        <MarqueeBanner />
        <About />
        <OrbitalSection />
        <Work />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;

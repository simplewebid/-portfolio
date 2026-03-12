import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Navbar  from './components/Navbar';
import Hero    from './components/Hero';
import About   from './components/About';
import Work    from './components/Work';
import Contact from './components/Contact';
import Footer  from './components/Footer';

/* ── Global Cursor Follower ── */
const CursorFollower = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef  = useRef(null);

  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onOver = (e) => {
      if (e.target.closest('a, button')) ringRef.current?.classList.add('hovered');
    };
    const onOut = (e) => {
      if (e.target.closest('a, button')) ringRef.current?.classList.remove('hovered');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left  = `${pos.current.x}px`;
        dotRef.current.style.top   = `${pos.current.y}px`;
      }
      if (ringRef.current) {
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top  = `${ringPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

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
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#111',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
};

/* ── Main App ── */
const App = () => {
  const [loaded, setLoaded] = useState(false);

  /* ── Smooth scroll via CSS ── */
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

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
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: '#EBEBEB', minHeight: '100vh' }}
      >
        <CursorFollower />
        <Navbar />
        <BackToTop />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <Hero />
          <About />
          <Work />
          <Contact />
        </motion.main>
        <Footer />
      </motion.div>
    </>
  );
};

export default App;

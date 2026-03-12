import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = ['Home', 'About', 'Work', 'Contact'];

const SOCIALS = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/afri-ansyah-400a963b4',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/6285840017984',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Afriansyah',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState('Home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(capitalise(entry.target.id));
        });
      },
      { threshold: 0.3 }
    );
    NAV_LINKS.forEach(l => {
      const el = document.getElementById(l.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const capitalise = s => s.charAt(0).toUpperCase() + s.slice(1);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Fixed left social bar */}
      <div
        style={{
          position: 'fixed',
          left: '28px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          zIndex: 100,
        }}
      >
        {SOCIALS.map(s => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.name}
            className="social-left-icon"
          >
            {s.icon}
          </a>
        ))}
        <div style={{ width: '1px', height: '60px', background: '#c8c8c8', marginTop: '4px' }} />
      </div>

      {/* Floating menu button (shown when scrolled > 100px) */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            key="floating-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            onClick={() => setMenuOpen(true)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '24px',
              zIndex: 1000,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#111',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" width="18" height="18">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Navbar (hidden when scrolled) */}
      <AnimatePresence>
        {!scrolled && (
          <motion.nav
            key="main-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              padding: '20px 0',
              background: 'rgba(235,235,235,0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid #d0d0d0',
            }}
          >
            <div
              style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Logo */}
              <button
                onClick={() => scrollTo('home')}
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  fontFamily: 'Josefin Sans, sans-serif',
                  color: '#111',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  letterSpacing: '-0.5px',
                  cursor: 'pointer',
                }}
              >
                A.
              </button>

              {/* Desktop Links */}
              <ul
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '36px',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
                className="hidden md:flex"
              >
                {NAV_LINKS.map(link => (
                  <li key={link}>
                    <button
                      onClick={() => scrollTo(link)}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: active === link ? 600 : 400,
                        color: active === link ? '#111' : '#777',
                        background: 'none',
                        border: 'none',
                        padding: '4px 0',
                        position: 'relative',
                        transition: 'color 0.2s',
                        letterSpacing: '0.3px',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { if (active !== link) e.currentTarget.style.color = '#333'; }}
                      onMouseLeave={e => { if (active !== link) e.currentTarget.style.color = '#777'; }}
                    >
                      {link}
                      {active === link && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '1.5px',
                            background: '#111',
                            borderRadius: '1px',
                          }}
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Right CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => scrollTo('contact')}
                  className="hidden md:block"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#fff',
                    background: '#111',
                    border: '1px solid #111',
                    borderRadius: '999px',
                    padding: '9px 22px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#333'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#111'; }}
                >
                  Contact
                </button>

                <button
                  onClick={() => scrollTo('work')}
                  className="hidden md:flex"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#111',
                    border: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(45deg) scale(1.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </button>

                {/* Mobile hamburger */}
                <button
                  className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
                  onClick={() => setMenuOpen(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#111' }} />
                  <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#111' }} />
                  <span style={{ display: 'block', width: '22px', height: '1.5px', background: '#111' }} />
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Side panel menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="fullscreen-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '340px',
              height: '100vh',
              background: '#1a1a1a',
              zIndex: 9998,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px 48px',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => scrollTo(item)}
                  style={{
                    color: '#fff',
                    fontSize: '42px',
                    fontFamily: 'Josefin Sans, sans-serif',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    borderBottom: '1px solid #333',
                    padding: '20px 0',
                    display: 'block',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#aaa'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#fff'; }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

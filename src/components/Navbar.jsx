import React, { useState, useEffect } from 'react';

const NAV_LINKS = ['Home', 'About', 'Work', 'Contact'];

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [active, setActive]       = useState('Home');

  /* ---- scroll detection ---- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---- active section detection ---- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(capitalise(entry.target.id));
        });
      },
      { threshold: 0.4 }
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      style={{
        background: scrolled
          ? 'rgba(0, 0, 0, 0.88)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(22px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(22px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.6)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* ── Logo ── */}
        <button
          onClick={() => scrollTo('home')}
          className="text-2xl font-bold tracking-wider select-none"
          style={{ fontFamily: 'Josefin Sans, sans-serif' }}
        >
          <span className="text-white">AFRI</span>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>.</span>
        </button>

        {/* ── Desktop Links ── */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(link => (
            <li key={link}>
              <button
                onClick={() => scrollTo(link)}
                className={`nav-link text-sm ${active === link ? 'active' : ''}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link}
              </button>
            </li>
          ))}
        </ul>

        {/* ── Hamburger ── */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 rounded-full transition-all duration-300 origin-center"
            style={{
              background: '#ffffff',
              transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
            }}
          />
          <span
            className="block w-6 h-0.5 rounded-full transition-all duration-300"
            style={{
              background: '#ffffff',
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'scaleX(0)' : 'none',
            }}
          />
          <span
            className="block w-6 h-0.5 rounded-full transition-all duration-300 origin-center"
            style={{
              background: '#ffffff',
              transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className="md:hidden transition-all duration-300 overflow-hidden"
        style={{
          maxHeight: menuOpen ? '280px' : '0',
          opacity: menuOpen ? 1 : 0,
          background: 'rgba(0, 0, 0, 0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: menuOpen ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        }}
      >
        <ul className="flex flex-col gap-1 px-6 py-6">
          {NAV_LINKS.map(link => (
            <li key={link}>
              <button
                onClick={() => scrollTo(link)}
                className="w-full text-left py-3 px-4 rounded-xl text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  background: active === link ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                  borderLeft: active === link ? '2px solid rgba(255,255,255,0.60)' : '2px solid transparent',
                }}
              >
                {link}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

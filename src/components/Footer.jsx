import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const hh = String(wib.getUTCHours()).padStart(2, '0');
      const mm = String(wib.getUTCMinutes()).padStart(2, '0');
      const ss = String(wib.getUTCSeconds()).padStart(2, '0');
      setTime(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const colHead = {
    fontFamily: 'Josefin Sans, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    color: '#555',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '20px',
    display: 'block',
  };

  const colLink = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    color: '#777',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'color 0.2s',
    background: 'none',
    border: 'none',
    padding: 0,
    textAlign: 'left',
  };

  return (
    <footer style={{ background: '#0d0d0d', overflow: 'hidden' }}>

      {/* ── 4-col grid ── */}
      <div className="footer-inner">
        <div className="footer-cols">
          {/* COL 1 — LINKS */}
          <div>
            <span style={colHead}>Links</span>
            {[
              { label: 'Home', id: 'hero' },
              { label: 'About', id: 'about' },
              { label: 'Work',  id: 'work'  },
              { label: 'Contact', id: 'contact' },
            ].map(item => (
              <button
                key={item.id}
                style={colLink}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#777'}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* COL 2 — SOCIALS */}
          <div>
            <span style={colHead}>Socials</span>
            {[
              { label: 'Email',    href: 'mailto:afriansyah20082@gmail.com' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/afriansyah' },
              { label: 'WhatsApp', href: 'https://wa.me/6285840017984' },
              { label: 'GitHub',   href: 'https://github.com/Afriansyah' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={colLink}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#777'}
              >
                {s.label} ↗
              </a>
            ))}
          </div>

          {/* COL 3 — LOCAL TIME */}
          <div>
            <span style={colHead}>Local Time</span>
            <div
              style={{
                fontFamily: 'Josefin Sans, monospace',
                fontSize: '28px',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-1px',
                lineHeight: 1.1,
                marginBottom: '8px',
              }}
            >
              {time}
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#444', letterSpacing: '1px' }}>
              WIB — UTC +7
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#444', marginTop: '6px' }}>
              Padang, West Sumatra
            </div>
          </div>

          {/* COL 4 — VERSION */}
          <div>
            <span style={colHead}>Version</span>
            <div style={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '10px' }}>
              2026 © Edition
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#555', lineHeight: 1.7 }}>
              Built with React + Vite<br />
              Designed by Afriansyah
            </div>
            <div
              style={{
                marginTop: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '999px',
                padding: '5px 12px',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#555', letterSpacing: '1px' }}>Online</span>
            </div>
          </div>
        </div>

        {/* ── divider ── */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '24px' }} />

        {/* ── bottom bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '48px',
          }}
        >
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#333', letterSpacing: '1px' }}>
            © 2026 Afriansyah. All rights reserved.
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#444',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              padding: '6px 16px',
              cursor: 'pointer',
              letterSpacing: '1px',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#444'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            ↑ Back to Top
          </button>
        </div>
      </div>

      {/* ── HUGE footer name ── */}
      <div style={{ overflow: 'hidden', paddingBottom: '0' }}>
        <div
          style={{
            fontFamily: 'Josefin Sans, sans-serif',
            fontSize: 'clamp(52px, 10.5vw, 152px)',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-4px',
            lineHeight: 0.82,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            opacity: 0.06,
            userSelect: 'none',
            paddingBottom: '0',
            paddingLeft: '80px',
            paddingRight: '80px',
          }}
        >
          AFRI ANSYAH
        </div>
      </div>

    </footer>
  );
};

export default Footer;

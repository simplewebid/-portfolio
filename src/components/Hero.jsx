import React from 'react';
import { motion } from 'framer-motion';

/* ── Rasya-style text reveal: clip from bottom ── */
const clipReveal = (delay = 0) => ({
  initial:  { y: '110%' },
  animate:  { y: '0%', transition: { duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] } },
});

const fadeUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 30 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.76, 0, 0.24, 1] } },
});

const Hero = () => {
  return (
    <section id="home" style={{ background: '#EBEBEB', minHeight: '100vh', position: 'relative' }}>

      {/* Fixed vertical line left */}
      <div className="hero-line-left" style={{ position: 'fixed', left: '68px', top: '200px', width: '1px', height: '120px', background: '#ccc', zIndex: 5 }} />

      {/* CENTER TEXT */}
      <div style={{ textAlign: 'center', paddingTop: 'clamp(100px, 16vw, 140px)', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px', position: 'relative', zIndex: 2 }}>

        {/* Tag line */}
        <div style={{ overflow: 'hidden', marginBottom: '24px' }}>
          <motion.p
            {...fadeUp(0.2)}
            style={{ fontSize: '12px', letterSpacing: '4px', color: '#888', fontFamily: 'Inter, sans-serif', margin: 0 }}
          >
            HI! I'M AFRI
          </motion.p>
        </div>

        {/* Headline — each word in its own overflow:hidden clip container */}
        {['Flutter', 'Developer', 'Front-End Dev.'].map((word, i) => (
          <div key={word} style={{ overflow: 'hidden', lineHeight: 0.9 }}>
            <motion.h1
              {...clipReveal(0.3 + i * 0.12)}
              style={{
                fontSize: 'clamp(72px, 11vw, 130px)',
                fontWeight: 900,
                color: i === 2 ? '#aaaaaa' : '#111',
                fontFamily: 'Josefin Sans, sans-serif',
                letterSpacing: '-4px',
                margin: 0,
                lineHeight: 0.9,
              }}
            >
              {word}
            </motion.h1>
          </div>
        ))}

        {/* Bio paragraph */}
        <div style={{ overflow: 'hidden', marginTop: '40px', marginBottom: '0' }}>
          <motion.p
            {...fadeUp(0.75)}
            style={{ color: '#666', fontSize: '15px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}
          >
            Mahasiswa Teknik Elektro UNP 2025. Passionate membangun aplikasi mobile &amp; web yang performant dan beautiful.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          {...fadeUp(0.9)}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '36px', marginBottom: '60px' }}
        >
          <MagneticButton
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            dark
          >
            View Work ↗
          </MagneticButton>
          <MagneticButton
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Let's Talk
          </MagneticButton>
        </motion.div>

        {/* Scroll down */}
        <motion.div
          {...fadeUp(1.1)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '40px' }}
        >
          <span style={{ fontSize: '11px', letterSpacing: '3px', color: '#999', fontFamily: 'Inter, sans-serif' }}>scroll down</span>
          <motion.div
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #999, transparent)', transformOrigin: 'top' }}
          />
        </motion.div>
      </div>

    </section>
  );
};

/* ── Magnetic Button ── */
const MagneticButton = ({ children, onClick, dark }) => {
  const ref = React.useRef(null);

  const handleMouseMove = (e) => {
    const btn = ref.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.35}px, ${y * 0.45}px)`;
  };

  const handleMouseLeave = () => {
    ref.current.style.transform = 'translate(0,0)';
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
  };

  const handleMouseEnter = () => {
    ref.current.style.transition = 'transform 0.1s';
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        background: dark ? '#111' : 'transparent',
        color: dark ? '#fff' : '#111',
        border: dark ? 'none' : '1.5px solid #bbb',
        borderRadius: '100px',
        padding: '14px 32px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        display: 'inline-block',
        willChange: 'transform',
      }}
    >
      {children}
    </button>
  );
};

export default Hero;

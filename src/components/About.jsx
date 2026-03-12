import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import profileImg from '../assets/profile.jpg';
import { SiFlutter, SiDart, SiReact, SiTypescript, SiJavascript, SiTailwindcss, SiNextdotjs, SiNodedotjs, SiGit, SiFigma, SiFirebase, SiSqlite } from 'react-icons/si';

/* ── CountUp hook ── */
const useCountUp = (target, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

const MARQUEE_TEXT = 'FLUTTER DEVELOPER \u2022 FRONT-END DEVELOPER \u2022 REACT.JS \u2022 UI/UX DESIGN \u2022 DART \u2022 TAILWIND CSS \u2022 NODE.JS \u2022 ';

const techs = [
  { name: 'Flutter',      icon: <SiFlutter color="#54C5F8" /> },
  { name: 'Dart',         icon: <SiDart color="#0175C2" /> },
  { name: 'React',        icon: <SiReact color="#61DAFB" /> },
  { name: 'TypeScript',   icon: <SiTypescript color="#3178C6" /> },
  { name: 'JavaScript',   icon: <SiJavascript color="#F7DF1E" /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss color="#06B6D4" /> },
  { name: 'Next.js',      icon: <SiNextdotjs color="#000000" /> },
  { name: 'Node.js',      icon: <SiNodedotjs color="#339933" /> },
  { name: 'Git',          icon: <SiGit color="#F05032" /> },
  { name: 'Figma',        icon: <SiFigma color="#F24E1E" /> },
  { name: 'Firebase',     icon: <SiFirebase color="#FFCA28" /> },
  { name: 'SQLite',       icon: <SiSqlite color="#003B57" /> },
];

/* ── StatBox with CountUp ── */
const StatBox = ({ stat, inView, delay }) => {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, delay]);

  const count = useCountUp(stat.target ?? 0, 1400, started);
  const display = stat.display ?? `${count}${stat.suffix}`;

  return (
    <div style={{ padding: '36px 28px', background: '#EBEBEB', textAlign: 'center' }}>
      <div style={{ overflow: 'hidden' }}>
        <motion.div
          initial={{ y: '100%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 0.7, delay: delay / 1000 + 0.3, ease: [0.76, 0, 0.24, 1] }}
          style={{
            fontFamily: 'Josefin Sans, sans-serif',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 800,
            color: '#111',
            letterSpacing: '-2px',
            lineHeight: 1,
            marginBottom: '8px',
          }}
        >
          {display}
        </motion.div>
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {stat.label}
      </div>
    </div>
  );
};

const About = () => {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })
  const bioRef = useRef(null)
  const bioInView = useInView(bioRef, { once: true, margin: '-80px' })
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })
  const marqueeRef = useRef(null)
  const marqueeInView = useInView(marqueeRef, { once: true, margin: '-80px' })

  return (
    <section id="about" style={{ background: '#EBEBEB', overflow: 'hidden' }}>

      {/* Content area */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '100px 80px 72px',
        }}
      >
        {/* Huge title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 60 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{ marginBottom: '60px' }}
        >
          <h2
            style={{
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: 'clamp(60px, 9vw, 112px)',
              fontWeight: 800,
              color: '#111',
              letterSpacing: '-4px',
              lineHeight: 0.88,
              margin: 0,
            }}
          >
            About<br />Me
          </h2>
        </motion.div>

        {/* Bio + Photo */}
        <motion.div
          ref={bioRef}
          initial={{ opacity: 0, y: 60 }}
          animate={bioInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '60px',
            alignItems: 'center',
            margin: '60px 0',
          }}
        >
          {/* LEFT: Photo */}
          <div
            style={{
              width: '280px',
              height: '340px',
              borderRadius: '200px 200px 0 0',
              overflow: 'hidden',
              border: '1px solid #ddd',
              flexShrink: 0,
            }}
          >
            <img
              src={profileImg}
              alt="Afriansyah"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
            />
          </div>

          {/* RIGHT: Bio + stats */}
          <div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                color: '#444',
                lineHeight: 1.85,
                margin: '0 0 24px',
              }}
            >
              Saya mahasiswa Pendidikan Teknik Elektro di Universitas Negeri Padang
              angkatan 2025. Passionate membangun aplikasi mobile dan web yang accessible,
              performant, dan beautiful — fokus pada Flutter dan React.js untuk menciptakan
              solusi teknologi nyata bagi masyarakat.
            </p>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                color: '#444',
                lineHeight: 1.85,
                margin: 0,
              }}
            >
              Saya percaya bahwa teknologi yang baik harus bisa diakses oleh semua orang.
              Setiap project selalu mempertimbangkan user experience, performa, dan kemudahan
              penggunaan — dari desain UI hingga arsitektur kode yang bersih dan scalable.
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 60 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: '#d0d0d0',
            border: '1px solid #d0d0d0',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '0',
          }}
        >
          {[
            { target: 2025, suffix: '',  label: 'Angkatan UNP' },
            { target: 6,    suffix: '+', label: 'Projects Shipped' },
            { target: 12,   suffix: '+', label: 'Technologies' },
            { target: null, display: '#1', label: 'Flutter Focus' },
          ].map((s, i) => (
            <StatBox key={i} stat={s} inView={statsInView} delay={i * 150} />
          ))}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.76, 0, 0.24, 1] }}
          style={{ marginTop: '60px' }}
        >
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#888', marginBottom: '24px', fontFamily: 'Inter, sans-serif', margin: '0 0 24px' }}>TECH STACK</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {techs.map(tech => (
              <div
                key={tech.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '100px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontFamily: 'Inter, sans-serif',
                  color: '#333',
                  background: '#fff',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#111'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = '#ddd'; }}
              >
                <span style={{ fontSize: '16px', display: 'flex' }}>{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Marquee rows */}
      <motion.div
        ref={marqueeRef}
        initial={{ opacity: 0 }}
        animate={marqueeInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Row 1 — light bg */}
        <div
          style={{
            overflow: 'hidden',
            borderTop: '1px solid #d0d0d0',
            borderBottom: '1px solid #d0d0d0',
            padding: '24px 0',
            background: '#EBEBEB',
          }}
        >
          <div className="marquee-about-track">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'Josefin Sans, sans-serif',
                  fontSize: 'clamp(28px, 4vw, 56px)',
                  fontWeight: 800,
                  color: '#111',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-1px',
                  paddingRight: '80px',
                }}
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — dark bg */}
        <div
          style={{
            overflow: 'hidden',
            borderBottom: '1px solid #2a2a2a',
            padding: '24px 0',
            background: '#111',
          }}
        >
          <div className="marquee-about-track-rev">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'Josefin Sans, sans-serif',
                  fontSize: 'clamp(28px, 4vw, 56px)',
                  fontWeight: 800,
                  color: '#EBEBEB',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-1px',
                  paddingRight: '80px',
                }}
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>

        {/* Row 3 — light bg muted */}
        <div
          style={{
            overflow: 'hidden',
            borderBottom: '1px solid #d0d0d0',
            padding: '24px 0',
            background: '#EBEBEB',
          }}
        >
          <div className="marquee-about-track">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'Josefin Sans, sans-serif',
                  fontSize: 'clamp(28px, 4vw, 56px)',
                  fontWeight: 800,
                  color: '#c8c8c8',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-1px',
                  paddingRight: '80px',
                }}
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;

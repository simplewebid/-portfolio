import React, { useEffect, useState, useRef } from 'react';
import profileImg from '../assets/profile.jpg';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

/* ── Typing Effect Hook ── */
const useTyping = (words, typeSpeed = 90, deleteSpeed = 45, pause = 2200) => {
  const [text, setText]       = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx % words.length];
    let timeout;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === '') {
      setDeleting(false);
      setWordIdx(i => i + 1);
    } else {
      timeout = setTimeout(() => {
        setText(deleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1)
        );
      }, deleting ? deleteSpeed : typeSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIdx, words, typeSpeed, deleteSpeed, pause]);

  return text;
};

/* ── 3D Lanyard + ID Card with spring physics ── */
const Lanyard3D = ({ profileImg }) => {
  const [{ rotateZ, rotateX }, api] = useSpring(() => ({
    rotateZ: 0,
    rotateX: 8,
    config: { mass: 2, tension: 120, friction: 18 },
  }));

  const bind = useGesture({
    onDrag: ({ movement: [mx, my], down }) => {
      api.start({
        rotateZ: down ? mx * 0.3 : 0,
        rotateX: down ? 8 + my * 0.1 : 8,
        immediate: down,
        config: down
          ? { tension: 800, friction: 40 }
          : { mass: 2, tension: 120, friction: 18 },
      });
    },
  });

  return (
    <div style={{
      perspective: '1000px',
      perspectiveOrigin: 'top center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '0px',
      cursor: 'grab',
    }}>

      {/* 3D rope segments */}
      <div style={{ position: 'relative', height: '140px', width: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Ceiling anchor bar */}
        <div style={{
          width: '30px', height: '10px',
          background: 'linear-gradient(180deg, #444, #222)',
          borderRadius: '4px 4px 0 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          position: 'absolute', top: 0,
        }}/>

        {/* Rope knot segments */}
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{
            width: i % 2 === 0 ? '14px' : '12px',
            height: '14px',
            background: 'linear-gradient(90deg, #111, #2a2a2a, #111)',
            borderRadius: '2px',
            marginTop: i === 0 ? '10px' : '0px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.4)',
          }}/>
        ))}

        {/* Metal O-ring */}
        <div style={{
          width: '22px', height: '22px',
          borderRadius: '50%',
          border: '4px solid #666',
          boxShadow: '0 0 0 1px #888 inset, 0 4px 8px rgba(0,0,0,0.8)',
          marginTop: '2px',
          background: 'radial-gradient(circle at 35% 35%, #aaa, #444)',
          flexShrink: 0,
        }}/>
      </div>

      {/* 3D ID Card */}
      <animated.div
        {...bind()}
        style={{
          rotateZ,
          rotateX,
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          width: '220px',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #141414, #0d0d0d)',
          border: '1px solid rgba(255,255,255,0.12)',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)',
          userSelect: 'none',
          touchAction: 'none',
          cursor: 'grab',
        }}
      >
        {/* Hole at top */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px' }}>
          <div style={{
            width: '16px', height: '16px',
            borderRadius: '50%',
            border: '2px solid #333',
            background: '#000',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)',
          }}/>
        </div>

        {/* Top stripe */}
        <div style={{
          background: 'linear-gradient(90deg, #0a0a1a, #111130)',
          padding: '8px 14px',
          display: 'flex', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ fontSize: '6px', letterSpacing: '1.5px', color: '#555', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
            UNIVERSITAS NEGERI PADANG
          </span>
          <span style={{ fontSize: '9px', color: '#444', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>2025</span>
        </div>

        {/* Photo */}
        <div style={{ padding: '14px 14px 6px', display: 'flex', justifyContent: 'center' }}>
          <img src={profileImg} alt="Afri Ansyah" style={{
            width: '130px', height: '155px',
            objectFit: 'cover', objectPosition: 'top center',
            borderRadius: '8px',
            border: '2px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
            display: 'block',
          }}/>
        </div>

        {/* Name & Info */}
        <div style={{ padding: '8px 16px', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '13px', fontWeight: 800,
            letterSpacing: '2px', color: '#fff',
            margin: '0 0 3px', fontFamily: 'Josefin Sans, sans-serif',
          }}>AFRI ANSYAH</h3>
          <p style={{ fontSize: '8px', color: '#666', letterSpacing: '2px', margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>
            FRONT-END DEVELOPER
          </p>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 0' }}/>
          <p style={{ fontSize: '9px', color: '#555', fontFamily: 'monospace', margin: '3px 0' }}>
            NIM: 25063002
          </p>
          <p style={{ fontSize: '8px', color: '#444', margin: '2px 0', fontFamily: 'Inter, sans-serif' }}>FT — Teknik Elektro</p>
        </div>

        {/* Barcode */}
        <div style={{ padding: '6px 16px 14px' }}>
          <div style={{
            height: '22px',
            background: 'repeating-linear-gradient(90deg, #2a2a2a 0px, #2a2a2a 2px, transparent 2px, transparent 4px, #222 4px, #222 5px, transparent 5px, transparent 8px)',
            borderRadius: '3px', opacity: 0.4,
          }}/>
        </div>
      </animated.div>
    </div>
  );
};

/* ── Hero Section ── */
const Hero = () => {
  const roles = [
    'Flutter Developer',
    'Front-End Developer',
    'UI Designer',
    'React Developer',
  ];
  const typedRole = useTyping(roles);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#000000' }}
    >

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* ── LEFT: text ── */}
          <div>
            <p
              className="section-label animate-fade-up"
              style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}
            >
              Welcome to my portfolio
            </p>

            <h1
              className="text-5xl md:text-[4.2rem] lg:text-[5rem] font-bold leading-tight mb-5 animate-fade-up delay-100"
              style={{ fontFamily: 'Josefin Sans, sans-serif' }}
            >
              Hi, I'm{' '}
              <span className="gradient-text" style={{ display: 'inline-block' }}>
                Afri Ansyah
              </span>
            </h1>

            {/* Typing role */}
            <div
              className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-7 animate-fade-up delay-200 min-h-[2rem]"
              style={{ fontFamily: 'Josefin Sans, sans-serif', color: '#ffffff' }}
            >
              <span>{typedRole}</span>
              <span className="cursor-blink" />
            </div>

            <p
              className="text-gray-400 text-base md:text-lg leading-relaxed mb-10 animate-fade-up delay-300 max-w-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Mahasiswa Pendidikan Teknik Elektro di Universitas Negeri Padang angkatan 2025.
              Passionate membangun aplikasi mobile &amp; web yang accessible, performant, dan
              beautiful — fokus pada <span style={{ color: '#ffffff', fontWeight: 600 }}>Flutter</span> dan{' '}
              <span style={{ color: '#c0c0c0', fontWeight: 600 }}>React.js</span>.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up delay-400">
              <button
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                className="gradient-btn px-8 py-4 rounded-full font-semibold text-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                View My Work →
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
                style={{
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  color: '#ffffff',
                  fontFamily: 'Inter, sans-serif',
                  background: 'rgba(255,255,255,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.15)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                Let's Talk
              </button>
            </div>

            {/* Social quick links */}
            <div className="flex items-center gap-4 mt-10 animate-fade-up delay-500">
              <span className="text-gray-600 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>FIND ME ON</span>
              {[
                { label: 'GH', href: 'https://github.com/Afriansyah', title: 'GitHub' },
                { label: 'LI', href: 'https://www.linkedin.com/in/afri-ansyah-400a963b4', title: 'LinkedIn' },
                { label: 'IG', href: 'https://www.instagram.com/afriansyahh', title: 'Instagram' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.title}
                  className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white social-btn"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── RIGHT: 3D lanyard + ID card ── */}
          <div className="flex justify-center items-start pt-8 animate-fade-up delay-500" style={{ minHeight: '480px' }}>
            <Lanyard3D profileImg={profileImg} />
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 animate-bounce">
        <span className="text-gray-600 text-xs tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
          SCROLL
        </span>
        <div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }}
        />
      </div>
    </section>
  );
};

export default Hero;

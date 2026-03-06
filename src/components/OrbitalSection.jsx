import React, { useState } from 'react';

/* ── Tech data ── */
const orbitTechs = [
  { name: 'React',      color: '#61DAFB', symbol: 'R',  ring: 1 },
  { name: 'Flutter',   color: '#54C5F8', symbol: 'Fl', ring: 1 },
  { name: 'JavaScript',color: '#F7DF1E', symbol: 'JS', ring: 2 },
  { name: 'Next.js',   color: '#ffffff', symbol: 'N',  ring: 2 },
  { name: 'Node.js',   color: '#68A063', symbol: 'No', ring: 2 },
  { name: 'Figma',     color: '#F24E1E', symbol: 'Fi', ring: 3 },
  { name: 'Git',       color: '#F05032', symbol: 'G',  ring: 3 },
  { name: 'Tailwind',  color: '#38BDF8', symbol: 'Tw', ring: 3 },
  { name: 'MongoDB',   color: '#47A248', symbol: 'M',  ring: 3 },
];

const RING_META = [
  { size: 300, duration: '8s',  reverse: false, borderColor: 'rgba(97, 218, 251, 0.15)',  layerClass: 'ring-layer-1' },
  { size: 500, duration: '14s', reverse: true,  borderColor: 'rgba(247, 223, 30, 0.10)',  layerClass: 'ring-layer-2' },
  { size: 700, duration: '20s', reverse: false, borderColor: 'rgba(255, 255, 255, 0.06)', layerClass: 'ring-layer-3' },
];

/* Build RINGS by grouping orbitTechs per ring number and distributing angles */
const RINGS = RING_META.map((meta, idx) => {
  const ringNum = idx + 1;
  const techs   = orbitTechs.filter(t => t.ring === ringNum);
  const icons   = techs.map((t, i) => ({ ...t, angle: (360 / techs.length) * i }));
  return { ...meta, icons };
});

/* ────────────────────────────────────────────────
   Single orbit icon node — own hover state
   ──────────────────────────────────────────────── */
const OrbIcon = ({ tech, r, counterAnim }) => {
  const [hovered, setHovered] = useState(false);
  /* parse hex color for rgba glow */
  const col = tech.color;
  return (
    <div
      style={{
        position: 'absolute',
        width: '40px', height: '40px',
        top: '50%', left: '50%',
        marginTop: '-20px', marginLeft: '-20px',
        transform: `rotate(${tech.angle}deg) translateX(${r}px)`,
      }}
    >
      {/* counter-rotation wrapper — keeps icon facing camera */}
      <div style={{ width: '40px', height: '40px', animation: counterAnim }}>
        {/* hover-scale + glow layer */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '40px', height: '40px',
            borderRadius: '50%',
            background: '#111111',
            border: `1px solid ${col}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: hovered
              ? `0 0 18px ${col}, 0 0 35px ${col}88`
              : `0 0 10px ${col}80`,
            transform: hovered ? 'scale(1.3)' : 'scale(1)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            cursor: 'default',
            position: 'relative',
            zIndex: hovered ? 30 : 'auto',
          }}
        >
          <span style={{
            color: col,
            fontWeight: 700,
            fontSize: '11px',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: 0,
            lineHeight: 1,
            userSelect: 'none',
          }}>
            {tech.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────
   SVG Connector Lines
   ──────────────────────────────────────────────── */
const ConnectorLines = () => (
  <svg
    style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '100%', height: '50%',
      pointerEvents: 'none',
      zIndex: 2,
      overflow: 'visible',
    }}
    preserveAspectRatio="none"
  >
    <defs>
      <style>{`
        @keyframes dashFlow {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0;  }
        }
        .flow-line {
          stroke-dasharray: 6 5;
          animation: dashFlow 2.4s linear infinite;
        }
      `}</style>
    </defs>
    {[12, 25, 38, 50, 62, 75, 88].map((xPct, i) => (
      <line
        key={i}
        x1={`${xPct}%`} y1="0"
        x2="50%"         y2="100%"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth="0.5"
        className="flow-line"
        style={{ animationDelay: `${i * 0.28}s` }}
      />
    ))}
  </svg>
);

/* ────────────────────────────────────────────────
   Central Glowing Orb — 80 px
   ──────────────────────────────────────────────── */
const CentralOrb = () => (
  <div
    style={{
      position: 'absolute',
      width: '80px', height: '80px',
      left: '50%', top: '50%',
      marginLeft: '-40px', marginTop: '-40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #333333 0%, #1a1a1a 50%, #0d0d0d 100%)',
      animation: 'orbGlow 3s ease-in-out infinite',
      zIndex: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    {/* Pulsing outer glow disc */}
    <div
      style={{
        position: 'absolute',
        width: '130px', height: '130px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(97,218,251,0.15) 0%, rgba(255,255,255,0.06) 45%, transparent 70%)',
        animation: 'orbGlowOuter 3s ease-in-out infinite',
        zIndex: -1,
      }}
    />

    {/* Dark inner circle */}
    <div
      style={{
        width: '62px', height: '62px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.30)',
      }}
    >
      <span
        style={{
          fontFamily: 'Josefin Sans, sans-serif',
          fontSize: '1.2rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #ffffff, #888888)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}
      >
        AF
      </span>
    </div>
  </div>
);

/* ────────────────────────────────────────────────
   Single Orbit Ring
   ──────────────────────────────────────────────── */
const OrbitRing = ({ size, duration, reverse, borderColor, layerClass, icons }) => {
  const r = size / 2;
  const spinAnim    = reverse
    ? `orbSpinRev ${duration} linear infinite`
    : `orbSpin    ${duration} linear infinite`;
  const counterAnim = reverse
    ? `orbSpin    ${duration} linear infinite`
    : `orbSpinRev ${duration} linear infinite`;

  return (
    /* ① Tilt wrapper — static rotateX(70deg) */
    <div
      style={{
        position: 'absolute',
        width: `${size}px`, height: `${size}px`,
        left: `${-r}px`, top: `${-r}px`,
        transform: 'rotateX(70deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* ② Spin ring */}
      <div
        className={layerClass}
        style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          border: `1px solid ${borderColor}`,
          animation: spinAnim,
          position: 'relative',
          boxShadow: `0 0 ${size * 0.045}px ${borderColor}`,
          transition: 'border-color 0.4s ease',
        }}
      >
        {/* ③ Icon nodes */}
        {icons.map(tech => (
          <OrbIcon
            key={tech.name}
            tech={tech}
            r={r}
            counterAnim={counterAnim}
          />
        ))}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────
   Orbital Section
   ──────────────────────────────────────────────── */
const OrbitalSection = () => (
  <section
    className="orbital-section"
    style={{
      background: 'radial-gradient(circle at 50% 55%, #0f0f0f 0%, #000000 68%)',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    {/* Top separator */}
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.25) 70%, transparent)',
        opacity: 0.4,
      }}
    />

    {/* Section heading */}
    <div className="relative z-10 text-center pt-20 pb-2">
      <p
        className="section-label reveal"
        style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}
      >
        SKILLS IN MOTION
      </p>
      <h2
        className="text-4xl md:text-5xl font-bold text-white mt-2 reveal"
        style={{ fontFamily: 'Josefin Sans, sans-serif' }}
      >
        Tech <span className="gradient-text">Orbit</span>
      </h2>
      <p
        className="text-gray-500 text-sm mt-3 reveal"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Technologies orbiting in my daily workflow
      </p>
    </div>

    {/* 600 px orbital stage */}
    <div
      className="orbital-zone"
      style={{ height: '600px', position: 'relative', overflow: 'visible' }}
    >
      {/* Flowing connector lines */}
      <ConnectorLines />

      {/* Perspective layer */}
      <div
        style={{
          position: 'absolute', inset: 0,
          perspective: '1100px',
          perspectiveOrigin: '50% 44%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="orbital-rings-root"
          style={{ position: 'relative', width: 0, height: 0, transformStyle: 'preserve-3d' }}
        >
          {RINGS.map(ring => (
            <OrbitRing key={ring.size} {...ring} />
          ))}
        </div>
      </div>

      {/* Central orb */}
      <CentralOrb />

      {/* Ambient ground glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%', left: '50%',
          transform: 'translateX(-50%)',
          width: '500px', height: '180px',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>

    {/* Floating skill labels */}
    <div className="relative z-10 pb-20 px-6">
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
        {[
          'Flutter', 'Dart', 'React.js', 'Next.js',
          'TypeScript', 'Tailwind CSS', 'SQLite', 'Git',
        ].map((label, i) => (
          <span
            key={label}
            className="tech-tag reveal"
            style={{ transitionDelay: `${i * 0.07}s`, animationDelay: `${i * 0.07}s` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>

    {/* Bottom separator */}
    <div
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.18) 70%, transparent)',
        opacity: 0.35,
      }}
    />
  </section>
);

export default OrbitalSection;


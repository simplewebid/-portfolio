import React, { useState, useEffect, useCallback } from 'react';

/* ── Real project screenshots ── */
import saku1 from '../assets/Saku1.png';
import saku2 from '../assets/saku2.png';
import saku3 from '../assets/saku3.png';
import saku4 from '../assets/saku4.png';
import saku5 from '../assets/saku5.png';
import saku6 from '../assets/saku6.png';
import kue1  from '../assets/kua1.png';
import kue2  from '../assets/kue2.png';
import kue3  from '../assets/kue3.png';
import kue4  from '../assets/kue4.png';

/* ── Icons ── */
const GithubIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LinkIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ── Image Slider ── */
const ImageSlider = ({ images, title }) => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setTransitioning(false), 320);
  }, [transitioning]);

  const prev = () => goTo((current - 1 + images.length) % images.length);
  const next = useCallback(() => goTo((current + 1) % images.length), [current, goTo, images.length]);

  /* Auto-slide every 3 s */
  useEffect(() => {
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div style={{ width: '100%' }}>
      {/* ── Main image ── */}
      <div
        className="relative group"
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
        }}
      >
        <img
          src={images[current]}
          alt={`${title} screenshot ${current + 1}`}
          className="project-main-image"
          style={{
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.28s ease',
          }}
        />

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
        />

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center
                     text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
        >
          <ChevronLeft />
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center
                     text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
        >
          <ChevronRight />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                borderRadius: '9999px',
                background: i === current ? '#ffffff' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Counter badge */}
        <div
          className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(0,0,0,0.60)',
            color: 'rgba(255,255,255,0.70)',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          {current + 1} / {images.length}
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`View screenshot ${i + 1}`}
            style={{
              width: '80px',
              height: '45px',
              borderRadius: '6px',
              overflow: 'hidden',
              flexShrink: 0,
              padding: 0,
              cursor: 'pointer',
              border: i === current
                ? '2px solid rgba(255,255,255,0.80)'
                : '1px solid rgba(255,255,255,0.12)',
              background: '#0a0a0a',
              transition: 'border-color 0.2s ease',
            }}
          >
            <img
              src={img}
              alt={`thumb ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── Projects data ── */
const PROJECTS = [
  {
    id: 1,
    title: 'Aplikasi Saku',
    subtitle: 'Mobile App — Android',
    description:
      'Aplikasi manajemen keuangan Android khusus mahasiswa Universitas Negeri Padang. Dilengkapi fitur login menggunakan NIM, pencatatan transaksi harian, pengelolaan budget per kategori, dan laporan keuangan berupa grafik interaktif.',
    tech: ['Flutter', 'Dart', 'SQLite', 'Provider'],
    images: [saku1, saku2, saku3, saku4, saku5, saku6],
    github: 'https://github.com/Afriansyah',
    demo: '#',
  },
  {
    id: 2,
    title: 'Kue By Tys',
    subtitle: 'Web — React',
    description:
      'Website toko kue online modern dengan tampilan elegan. Menampilkan katalog produk kue, section promo, testimoni pelanggan, dan Instagram feed. Dibangun dengan React TypeScript dan Tailwind CSS.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    images: [kue1, kue2, kue3, kue4],
    github: 'https://github.com/Afriansyah',
    demo: '#',
  },
];

/* ── Work Section ── */
const Work = () => (
  <section
    id="work"
    className="py-32 relative overflow-hidden"
    style={{ background: 'linear-gradient(180deg, #000000 0%, #080808 60%, #000000 100%)' }}
  >
    {/* Ambient blob */}
    <div
      className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', filter: 'blur(90px)' }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-6">

      {/* Section heading */}
      <div className="text-center mb-20">
        <p className="section-label reveal" style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}>
          PORTFOLIO
        </p>
        <h2
          className="text-4xl md:text-6xl font-bold text-white reveal"
          style={{ fontFamily: 'Josefin Sans, sans-serif' }}
        >
          Recent <span className="gradient-text">Work</span>
        </h2>
        <div className="heading-divider reveal" />
      </div>

      {/* Project rows */}
      <div>
        {PROJECTS.map((project, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={project.id}
              className="project-card"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                alignItems: 'center',
                padding: '80px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Image side — left on even, right on odd */}
              <div
                className={`reveal-${isEven ? 'left' : 'right'}`}
                style={{ order: isEven ? 1 : 2 }}
              >
                <ImageSlider images={project.images} title={project.title} />
              </div>

              {/* Text side — right on even, left on odd */}
              <div
                className={`reveal-${isEven ? 'right' : 'left'}`}
                style={{ order: isEven ? 2 : 1 }}
              >
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: '#888888', fontFamily: 'Inter, sans-serif', letterSpacing: '0.25em' }}
                >
                  Featured Project — {project.subtitle}
                </span>

                <h3
                  className="text-3xl md:text-4xl font-bold text-white mt-3 mb-5"
                  style={{ fontFamily: 'Josefin Sans, sans-serif' }}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <div className="glass-card project-card-glow p-6 rounded-2xl mb-6">
                  <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {project.description}
                  </p>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map(t => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>

                {/* Action links */}
                <div className="flex items-center gap-6">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium group"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Source Code
                  </a>
                  <a
                    href={project.demo}
                    className="flex items-center gap-2 font-semibold text-sm transition-all duration-200 hover:gap-3 group"
                    style={{ color: '#c0c0c0', fontFamily: 'Inter, sans-serif' }}
                  >
                    <LinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View all CTA */}
      <div className="text-center mt-20 reveal">
        <a
          href="https://github.com/Afriansyah"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
          style={{
            border: '1.5px solid rgba(255,255,255,0.30)',
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            background: 'rgba(255,255,255,0.04)',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 25px rgba(255,255,255,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
        >
          <GithubIcon className="w-5 h-5" />
          View All Projects on GitHub
        </a>
      </div>
    </div>
  </section>
);

export default Work;

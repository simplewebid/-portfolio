import React, { useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

import saku1    from '../assets/Saku1.png';
import saku2    from '../assets/saku2.png';
import saku3    from '../assets/saku3.png';
import saku4    from '../assets/saku4.png';
import saku5    from '../assets/saku5.png';
import saku6    from '../assets/saku6.png';
import kue1     from '../assets/kua1.png';
import kue2     from '../assets/kue2.png';
import kue3     from '../assets/kue3.png';
import kue4     from '../assets/kue4.png';
import kostin1  from '../assets/kostin1.png';
import kostin2  from '../assets/kostin2.png';
import kostin3  from '../assets/kostin3.png';
import kostin4  from '../assets/kostin4.png';
import joki1    from '../assets/joki1.png';
import joki2    from '../assets/joki2.png';
import joki3    from '../assets/joki3.png';
import joki4    from '../assets/joki4.png';
import volt1    from '../assets/Web Pengukuran Tegangan AC dan DC 1.jpeg';
import volt2    from '../assets/Web Pengukuran Tegangan AC dan DC 2.jpeg';
import volt3    from '../assets/Web Pengukuran Tegangan AC dan DC 3.jpeg';
import volt4    from '../assets/Web Pengukuran Tegangan AC dan DC 5.jpeg';
import smk1     from '../assets/WEB SMK N 2 SAROLANGUN 1.jpeg';
import smk2     from '../assets/WEB SMK N 2 SAROLANGUN 2.jpeg';
import smk3     from '../assets/WEB SMK N 2 SAROLANGUN 3.jpeg';
import smk4     from '../assets/WEB SMK N 2 SAROLANGUN 4.jpeg';

const PROJECTS = [
  {
    id: 1,
    title: 'Aplikasi Saku UNP',
    subtitle: 'Mobile App — Android',
    description: 'Aplikasi manajemen keuangan Android khusus mahasiswa Universitas Negeri Padang. Dilengkapi fitur login menggunakan NIM, pencatatan transaksi harian, pengelolaan budget per kategori, dan laporan keuangan berupa grafik interaktif.',
    tech: ['Flutter', 'Dart', 'SQLite', 'sqflite', 'Provider', 'Material Design'],
    images: [saku1, saku2, saku3, saku4, saku5, saku6],
  },
  {
    id: 2,
    title: 'Aplikasi kost.in UNP',
    subtitle: 'Mobile App — Flutter',
    description: 'Aplikasi mobile untuk pencarian dan manajemen kost di sekitar Universitas Negeri Padang. Dilengkapi fitur pencarian kost, detail lokasi, kontak pemilik via WhatsApp, dan peta lokasi. Dibangun dengan Flutter dan database lokal SQLite.',
    tech: ['Flutter', 'Dart', 'SQLite', 'Provider', 'url_launcher'],
    images: [kostin1, kostin2, kostin3, kostin4],
  },
  {
    id: 3,
    title: 'Web Kue By Tys',
    subtitle: 'Web — React',
    description: 'Website toko kue online modern dengan tampilan elegan. Menampilkan katalog produk kue, section promo, testimoni pelanggan. Dibangun dengan React TypeScript dan Tailwind CSS.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    images: [kue1, kue2, kue3, kue4],
  },
  {
    id: 4,
    title: 'web Joki Tugas Website',
    subtitle: 'Web — HTML/CSS/JS',
    description: 'Website jasa penyelesaian tugas akademik terpercaya. Dilengkapi hero section animasi, carousel testimoni, halaman kontak, dan garansi 100% original dengan revisi gratis.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'AOS Animation'],
    images: [joki1, joki2, joki3, joki4],
  },
  {
    id: 7,
    title: 'Web Pengukuran Tegangan AC dan DC',
    subtitle: 'Web — Instrumentation',
    description: 'Web untuk menampilkan hasil pengukuran tegangan AC dan DC. Menyajikan visualisasi data yang rapi dan mudah dibaca, dengan tampilan modern dan responsif.',
    tech: ['Web', 'UI/UX', 'Responsive'],
    images: [volt1, volt2, volt3, volt4],
  },
  {
    id: 8,
    title: 'WEB SMK N 2 SAROLANGUN',
    subtitle: 'Web — School Profile',
    description: 'Website profil sekolah SMK Negeri 2 Sarolangun dengan tampilan modern dan informasi yang mudah diakses.',
    tech: ['Web', 'UI/UX', 'Responsive'],
    images: [smk1, smk2, smk3, smk4],
  },
];

const MARQUEE_NAMES = 'APLIKASI SAKU UNP \u2022 APLIKASI KOST.IN UNP \u2022 WEB KUE BY TYS \u2022 JOKI TUGAS \u2022 WEB PENGUKURAN TEGANGAN AC & DC \u2022 WEB SMK N 2 SAROLANGUN \u2022 ';

/* ── Single project row ── */
const ProjectRow = ({ project, index }) => {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, margin: '-80px' });

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ borderBottom: '1px solid #d0d0d0', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Row header (clickable) */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          padding: '28px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#aaa',
              letterSpacing: '1px',
              minWidth: '28px',
              flexShrink: 0,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          {/* Title with overflow:hidden clip reveal + hover stretch */}
          <div style={{ overflow: 'hidden' }}>
            <motion.span
              initial={{ y: '110%' }}
              animate={isInView ? { y: '0%' } : {}}
              transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: [0.76, 0, 0.24, 1] }}
              style={{
                display: 'block',
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: 'clamp(24px, 3.5vw, 52px)',
                fontWeight: 800,
                color: '#111',
                letterSpacing: hovered ? '0px' : '-1.5px',
                lineHeight: 1,
                transition: 'letter-spacing 0.4s cubic-bezier(0.76,0,0.24,1)',
              }}
            >
              {project.title}
            </motion.span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, marginLeft: '20px' }}>
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#888',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            {project.subtitle}
          </motion.span>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: `1px solid ${open ? '#111' : '#d0d0d0'}`,
              background: open ? '#111' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.25s, border-color 0.25s, transform 0.35s',
              transform: open ? 'rotate(45deg)' : 'none',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={open ? 'white' : '#111'} strokeWidth={2} strokeLinecap="round" width="14" height="14">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
      </button>

      {/* Floating preview image on hover */}
      <AnimatePresence>
        {hovered && !open && project.images[0] && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              left: mousePos.x + 24,
              top: mousePos.y - 90,
              width: '240px',
              height: '155px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #d0d0d0',
              pointerEvents: 'none',
              zIndex: 200,
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            }}
          >
            <img
              src={project.images[0]}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded details */}
      {open && (
        <div
          className="work-detail-grid"
        >
          {/* Images */}
          <div>
            <div
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #d0d0d0',
                marginBottom: '12px',
              }}
            >
              <img
                src={project.images[0]}
                alt={project.title}
                style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </div>
            {project.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {project.images.slice(1, 4).map((img, i) => (
                  <div
                    key={i}
                    style={{
                      width: '80px',
                      height: '56px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid #d0d0d0',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#444',
                lineHeight: 1.85,
                marginBottom: '24px',
              }}
            >
              {project.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.tech.map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ── Work Section ── */
const Work = () => {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' });

  return (
  <section id="work" style={{ background: '#EBEBEB', overflow: 'hidden' }}>

    {/* Black marquee strip */}
    <div
      style={{
        background: '#111',
        overflow: 'hidden',
        padding: '18px 0',
        borderTop: '1px solid #222',
        borderBottom: '1px solid #222',
      }}
    >
      <div className="marquee-work-track">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '13px',
              letterSpacing: '4px',
              color: '#555',
              whiteSpace: 'nowrap',
              paddingRight: '60px',
              textTransform: 'uppercase',
            }}
          >
            {MARQUEE_NAMES}
          </span>
        ))}
      </div>
    </div>

    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 80px',
      }}
    >
      {/* Header row */}
      <div
        ref={titleRef}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '56px',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          {['My', 'Work'].map((word, i) => (
            <div key={word} style={{ overflow: 'hidden', lineHeight: 0.88 }}>
              <motion.h2
                initial={{ y: '110%' }}
                animate={titleInView ? { y: '0%' } : {}}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                style={{
                  fontFamily: 'Josefin Sans, sans-serif',
                  fontSize: 'clamp(52px, 8vw, 104px)',
                  fontWeight: 800,
                  color: '#111',
                  letterSpacing: '-3px',
                  lineHeight: 0.88,
                  margin: 0,
                }}
              >
                {word}
              </motion.h2>
            </div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#666',
            maxWidth: '300px',
            textAlign: 'right',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          A selection of projects I've built — from mobile apps to web experiences.
          Click any row to explore details.
        </motion.p>
      </div>

      {/* Projects list */}
      <div style={{ borderTop: '1px solid #d0d0d0' }}>
        {PROJECTS.map((project, idx) => (
          <ProjectRow key={project.id} project={project} index={idx} />
        ))}
      </div>

      {/* GitHub CTA */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <a
          href="https://github.com/simplewebid"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            color: '#111',
            border: '1px solid #d0d0d0',
            borderRadius: '999px',
            padding: '12px 32px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0d0d0'; e.currentTarget.style.background = 'transparent'; }}
        >
          View All on GitHub ↗
        </a>
      </div>
    </div>
  </section>
  );
};

export default Work;

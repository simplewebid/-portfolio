import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import emailjs from '@emailjs/browser';

const SERVICE_ID  = 'service_e5pxh3o';
const TEMPLATE_ID = 'template_wzrfyhj';
const PUBLIC_KEY  = 'xC0MtDrHjaEktFDxD';
const WHATSAPP_NUMBER = '6285840017984';

const Contact = () => {
  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus]     = useState(null);   // 'success' | 'error' | 'empty' | null
  const [loading, setLoading]   = useState(false);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleEmail = async e => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('empty'); return;
    }
    setLoading(true);
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Halo Afri! Saya ${formData.name || 'tertarik'} ingin tahu lebih lanjut tentang layananmu.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  /* ── small input styles ── */
  const inputStyle = {
    width: '100%',
    padding: '14px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  /* ── contact link card ── */
  const LinkCard = ({ label, value, href, icon }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        textDecoration: 'none',
        group: true,
      }}
      onMouseEnter={e => e.currentTarget.querySelector('.lc-value').style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.querySelector('.lc-value').style.color = '#aaa'}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#888',
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>
          {label}
        </div>
        <div
          className="lc-value"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#aaa', transition: 'color 0.2s' }}
        >
          {value}
        </div>
      </div>
    </a>
  );

  return (
    <section
      id="contact"
      style={{ background: '#111', overflow: 'hidden' }}
    >
      <div
        ref={sectionRef}
        className="contact-section-grid"
      >
        {/* ── LEFT: info ── */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              padding: '6px 14px',
              marginBottom: '40px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Available for work
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: 'clamp(48px, 6.5vw, 88px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-3px',
              lineHeight: 0.9,
              margin: '0 0 32px',
            }}
          >
            Let's<br />Work<br />Together
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#777',
              lineHeight: 1.85,
              maxWidth: '380px',
              marginBottom: '48px',
            }}
          >
            Ada proyek menarik? Saya terbuka untuk kolaborasi, freelance, maupun
            diskusi ide. Kirim pesan dan saya akan merespons dalam 24 jam.
          </p>

          {/* Contact links */}
          <div>
            <LinkCard
              label="Email"
              value="afriansyah@student.unp.ac.id"
              href="mailto:afriansyah@student.unp.ac.id"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="16" height="16">
                  <path d="M4 4h16v16H4zM4 4l8 9 8-9" />
                </svg>
              }
            />
            <LinkCard
              label="WhatsApp"
              value="+62 858-4001-7984"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="16" height="16">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              }
            />
            <LinkCard
              label="LinkedIn"
              value="Afriansyah"
              href="https://www.linkedin.com/in/afriansyah"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="16" height="16">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                </svg>
              }
            />
            <LinkCard
              label="Location"
              value="Padang, Sumatera Barat — Indonesia"
              href="https://maps.google.com/?q=Padang,West+Sumatra"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="16" height="16">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              }
            />
          </div>
        </motion.div>

        {/* ── RIGHT: form ── */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <form ref={formRef} onSubmit={handleEmail} noValidate>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Your Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama kamu"
                style={inputStyle}
                onFocus={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@contoh.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tulis pesanmu di sini..."
                rows={5}
                style={{
                  ...inputStyle,
                  resize: 'none',
                  lineHeight: 1.7,
                }}
                onFocus={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                onBlur={e => e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            {/* Status messages */}
            {status === 'success' && (
              <div style={{ marginBottom: '20px', padding: '12px 16px', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#4ade80' }}>
                Pesan terkirim! Terima kasih, saya akan segera merespons. ✓
              </div>
            )}
            {status === 'error' && (
              <div style={{ marginBottom: '20px', padding: '12px 16px', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#f87171' }}>
                Gagal mengirim. Coba lagi atau hubungi via WhatsApp.
              </div>
            )}
            {status === 'empty' && (
              <div style={{ marginBottom: '20px', padding: '12px 16px', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#fbbf24' }}>
                Lengkapi semua field terlebih dahulu.
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  minWidth: '160px',
                  padding: '14px 28px',
                  background: '#fff',
                  color: '#111',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '999px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 0.2s, transform 0.2s',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {loading ? 'Mengirim...' : 'Kirim Email →'}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                style={{
                  flex: 1,
                  minWidth: '160px',
                  padding: '14px 28px',
                  background: 'transparent',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >
                WhatsApp ↗
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import emailjs from '@emailjs/browser';

const SERVICE_ID      = 'service_e5pxh3o'
const TEMPLATE_ID     = 'template_wzrfyhj'
const PUBLIC_KEY      = 'xC0MtDrHjaEktFDxD'
const WHATSAPP_NUMBER = '6285840017984'

/* ── Contact info items ── */
const INFO = [
  {
    icon: <Mail className="w-5 h-5" style={{ color: '#c0c0c0' }} />,
    label: 'Email',
    value: 'afriansyah@student.unp.ac.id',
    href: 'mailto:afriansyah@student.unp.ac.id',
  },
  {
    icon: <Phone className="w-5 h-5" style={{ color: '#c0c0c0' }} />,
    label: 'WhatsApp',
    value: '+62 858-4001-7984',
    href: 'https://wa.me/6285840017984',
  },
  {
    icon: <MapPin className="w-5 h-5" style={{ color: '#c0c0c0' }} />,
    label: 'Lokasi',
    value: 'Padang, Indonesia',
    href: 'https://maps.google.com/?q=Padang,+West+Sumatra,+Indonesia',
  },
  {
    icon: <Linkedin className="w-5 h-5" style={{ color: '#c0c0c0' }} />,
    label: 'LinkedIn',
    value: '/in/afri-ansyah-400a963b4',
    href: 'https://www.linkedin.com/in/afri-ansyah-400a963b4',
  },
];

/* ── Input component ── */
const Field = ({ label, children }) => (
  <div>
    <label
      className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {label}
    </label>
    {children}
  </div>
);

/* ── Contact Section ── */
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading]   = useState(false)
  const [status, setStatus]     = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEmail = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('empty')
      return
    }
    setLoading(true)
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name:  formData.name,
        from_email: formData.email,
        message:    formData.message,
        name:       formData.name,
        email:      formData.email,
      }, PUBLIC_KEY)
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setStatus('error')
    }
    setLoading(false)
  }

  const handleWhatsApp = () => {
    if (!formData.name || !formData.message) {
      setStatus('empty')
      return
    }
    const text = `Halo Afri! Saya ${formData.name}.\n\n${formData.message}\n\nEmail: ${formData.email}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <section
      id="contact"
      className="py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0d0d0d 50%, #000000 100%)' }}
    >
      {/* bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.06), transparent 70%)', filter: 'blur(30px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Heading ── */}
        <div className="text-center mb-20">
          <p className="section-label reveal" style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}>
            GET IN TOUCH
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-white reveal"
            style={{ fontFamily: 'Josefin Sans, sans-serif' }}
          >
            Contact <span className="gradient-text">Me</span>
          </h2>
          <div className="heading-divider reveal" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: Contact Info ── */}
          <div className="reveal-left">
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'Josefin Sans, sans-serif' }}
            >
              Let's Build Something{' '}
              <span className="gradient-text">Amazing</span>
            </h3>
            <p
              className="text-gray-400 text-base leading-relaxed mb-10 max-w-md"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Have a project in mind, a job opportunity, or just want to say hi?
              Send me a message and I'll get back to you as soon as possible.
            </p>

            <div className="space-y-5">
              {INFO.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center glass-card shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p
                      className="text-gray-500 text-xs mb-0.5 uppercase tracking-wider"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-sm font-medium transition-colors duration-200 group-hover:text-white"
                      style={{ color: '#c0c0c0', fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability badge */}
            <div
              className="inline-flex items-center gap-3 mt-10 px-5 py-3 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: 'rgba(255,255,255,0.8)' }}
                />
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: '#ffffff' }} />
              </span>
              <span className="text-sm font-medium" style={{ color: '#e0e0e0', fontFamily: 'Inter, sans-serif' }}>
                Open for Collaboration &amp; Freelance
              </span>
            </div>
          </div>

          {/* ── Right: Form / Success ── */}
          <div className="reveal-right">
            <form
              onSubmit={handleEmail}
              className="glass-card p-8 md:p-10 rounded-3xl space-y-6"
              style={{ border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <h3
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: 'Josefin Sans, sans-serif' }}
              >
                Send Me a Message
              </h3>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your Name">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="dark-input"
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="dark-input"
                  />
                </Field>
              </div>

              <Field label="Subject">
                <input
                  type="text"
                  name="subject"
                  placeholder="Project Proposal / Job Offer / Just saying hi…"
                  className="dark-input"
                />
              </Field>

              <Field label="Message">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, timeline, and budget…"
                  rows={5}
                  className="dark-input resize-none"
                />
              </Field>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  onClick={handleEmail}
                  disabled={loading}
                  style={{
                    background: loading ? '#333' : '#fff',
                    color: '#000', padding: '12px 28px',
                    border: 'none', borderRadius: '8px',
                    fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {loading ? 'Sending...' : 'Send Email'}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  style={{
                    background: '#25D366', color: '#fff',
                    padding: '12px 28px', border: 'none',
                    borderRadius: '8px', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  WhatsApp
                </button>
              </div>

              {status === 'success' && <p style={{ color: '#4ade80', marginTop: '12px', fontFamily: 'Inter, sans-serif' }}>✓ Pesan terkirim ke email!</p>}
              {status === 'error'   && <p style={{ color: '#f87171', marginTop: '12px', fontFamily: 'Inter, sans-serif' }}>✗ Gagal kirim, coba WhatsApp.</p>}
              {status === 'empty'   && <p style={{ color: '#fbbf24', marginTop: '12px', fontFamily: 'Inter, sans-serif' }}>⚠ Isi semua field dulu!</p>}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;

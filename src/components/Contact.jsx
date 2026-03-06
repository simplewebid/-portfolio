import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

/* ── Claude API helper (re-used from About) ── */
const callClaude = async (apiKey, prompt) => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'API error');
  return data.content?.[0]?.text || '';
};

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
const Contact = ({ apiKey }) => {
  const INIT = { name: '', email: '', message: '' };
  const [form, setForm]           = useState(INIT);
  const [loading, setLoading]     = useState(false);
  const [reply, setReply]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let autoReply = `Thank you for reaching out, ${form.name}! I've received your message and will get back to you within 24 hours. Looking forward to connecting! — Afri Ansyah`;

    if (apiKey) {
      try {
        const prompt = `Generate a warm, professional auto-reply email for a portfolio contact form.

Sender name: ${form.name}
Sender email: ${form.email}
Message: ${form.message}

Write a friendly, concise auto-reply (3–4 sentences). Acknowledge their specific message, tell them Afri Ansyah will respond within 24 hours, and express genuine enthusiasm. Sign off as "Afri Ansyah". Keep the tone professional but human — no clichés.`;
        autoReply = await callClaude(apiKey, prompt);
      } catch (err) {
        // Use fallback reply silently
        console.warn('Claude API error, using fallback reply:', err.message);
      }
    }

    setReply(autoReply);
    setSubmitted(true);
    setLoading(false);
  };

  const reset = () => { setSubmitted(false); setForm(INIT); setReply(''); setError(''); };

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
            {submitted ? (
              <div
                className="glass-card p-8 md:p-10 rounded-3xl text-center success-card"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center mx-auto mb-4" style={{ border: '1px solid rgba(255,255,255,0.20)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-6 h-6"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: 'Josefin Sans, sans-serif' }}
                >
                  Message Sent!
                </h3>
                <p className="text-gray-400 text-xs mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Here's your auto-reply (powered by Claude AI):
                </p>
                <div
                  className="text-left p-5 rounded-2xl mb-6 text-sm text-gray-300 leading-relaxed whitespace-pre-line"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {reply}
                </div>
                <button
                  onClick={reset}
                  className="gradient-btn px-7 py-3 rounded-full text-sm font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
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
                      value={form.name}
                      onChange={onChange}
                      required
                      placeholder="John Doe"
                      className="dark-input"
                    />
                  </Field>
                  <Field label="Email Address">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      required
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
                    value={form.message}
                    onChange={onChange}
                    required
                    placeholder="Tell me about your project, timeline, and budget…"
                    rows={5}
                    className="dark-input resize-none"
                  />
                </Field>

                {error && (
                  <p className="text-red-400 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-btn w-full py-4 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending…
                    </span>
                  ) : 'Send Message'}
                </button>

                <p className="text-center text-gray-600 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {apiKey
                    ? 'Auto-reply powered by Claude AI'
                    : 'Set your API key to enable AI auto-reply'}
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;

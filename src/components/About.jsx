import React, { useState } from 'react';
import {
  Smartphone, Target, Atom, Triangle, Code2, FileCode,
  Database, Wind, GitBranch, Github, Monitor, Figma,
  GraduationCap, Rocket, Layers, Cpu,
} from 'lucide-react';

/* ── Skills data ── */
const SKILLS = [
  { name: 'Flutter',      Icon: Smartphone,  color: '#e0e0e0' },
  { name: 'Dart',         Icon: Target,      color: '#c8c8c8' },
  { name: 'React.js',     Icon: Atom,        color: '#e0e0e0' },
  { name: 'Next.js',      Icon: Triangle,    color: '#ffffff' },
  { name: 'JavaScript',   Icon: Code2,       color: '#d4d4d4' },
  { name: 'TypeScript',   Icon: FileCode,    color: '#c8c8c8' },
  { name: 'SQLite',       Icon: Database,    color: '#d0d0d0' },
  { name: 'Tailwind CSS', Icon: Wind,        color: '#e0e0e0' },
  { name: 'Git',          Icon: GitBranch,   color: '#d4d4d4' },
  { name: 'GitHub',       Icon: Github,      color: '#f0f0f0' },
  { name: 'VS Code',      Icon: Monitor,     color: '#d0d0d0' },
  { name: 'Figma',        Icon: Figma,       color: '#c8c8c8' },
];

const STATS = [
  { Icon: GraduationCap, value: '2025', label: 'Angkatan UNP'    },
  { Icon: Rocket,        value: '3+',   label: 'Projects Shipped' },
  { Icon: Layers,        value: '12+',  label: 'Technologies'     },
  { Icon: Cpu,           value: '#1',   label: 'Flutter Focus'    },
];


/* ── Claude API call helper ── */
const callClaude = async (apiKey, prompt) => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'x-api-key':     apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'API error');
  return data.content?.[0]?.text || '';
};

/* ── About Section ── */
const About = ({ apiKey }) => {
  const DEFAULT_BIO = `Saya mahasiswa Pendidikan Teknik Elektro di Universitas Negeri Padang angkatan 2025. Saya passionate dalam membangun aplikasi mobile dan web yang accessible, performant, dan beautiful. Fokus pada Flutter dan React.js untuk menciptakan solusi teknologi nyata bagi masyarakat.

Saya percaya bahwa teknologi yang baik harus bisa diakses oleh semua orang. Setiap project yang saya kerjakan selalu mempertimbangkan user experience, performa, dan kemudahan penggunaan — dari desain UI hingga arsitektur kode yang bersih.

Di luar coding, saya aktif mengeksplorasi open-source tools, mengikuti perkembangan ekosistem Flutter dan React, serta berkolaborasi dengan rekan-rekan di kampus untuk membangun produk digital yang berdampak.`;

  const [bio, setBio]               = useState(DEFAULT_BIO);
  const [userInfo, setUserInfo]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [open, setOpen]             = useState(false);
  const [error, setError]           = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGenerate = async () => {
    if (!userInfo.trim()) return;
    if (!apiKey) { setError('Please set your Claude API key first (see the floating panel).'); return; }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const prompt = `Write a professional, engaging personal bio for a developer's portfolio website.

Here's information about the person:
${userInfo}

Requirements:
- 2–3 concise paragraphs
- First-person voice, warm but professional tone
- Highlight skills, years of experience, and personality
- End with a personal touch (hobbies / interests)
- No bullet points — flowing prose only`;

      const text = await callClaude(apiKey, prompt);
      setBio(text);
      setSuccessMsg('✅ Bio generated! You can still edit it below.');
      setOpen(false);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="about"
      className="py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0d0d0d 50%, #000000 100%)' }}
    >
      {/* ambient blobs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 1 }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,200,200,0.04) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 1 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ── Section heading ── */}
        <div className="text-center mb-20">
          <p className="section-label reveal" style={{ color: '#888888', fontFamily: 'Inter, sans-serif' }}>
            GET TO KNOW ME
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-white reveal"
            style={{ fontFamily: 'Josefin Sans, sans-serif' }}
          >
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="heading-divider reveal" />
        </div>

        {/* ── Bio + Stats row ── */}
        <div className="grid lg:grid-cols-5 gap-14 items-start mb-20">

          {/* Bio (3 cols) */}
          <div className="lg:col-span-3 reveal-left">
            <p
              className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line mb-8"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {bio}
            </p>

            {/* AI Generate Bio button */}
            <button
              onClick={() => setOpen(!open)}
              className="gradient-btn px-6 py-3 rounded-full text-sm font-semibold"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {open ? 'Hide Generator' : 'Generate My Bio with AI'}
            </button>

            {/* Generator panel */}
            {open && (
              <div className="mt-6 glass-card p-6 rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-white text-sm font-semibold mb-1" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                  Claude AI Bio Generator
                </p>
                <p className="text-gray-500 text-xs mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tell Claude a bit about yourself and it'll write a professional bio.
                </p>
                <textarea
                  value={userInfo}
                  onChange={e => setUserInfo(e.target.value)}
                  placeholder="e.g. I'm Afriansyah, a 5-year React & Node.js developer from Jakarta. I love building dashboards and open-source tools. Outside work I play guitar and contribute to OSS..."
                  rows={4}
                  className="dark-input mb-4 resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
                {error && (
                  <p className="text-red-400 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
                )}
                {successMsg && (
                  <p className="text-emerald-400 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>{successMsg}</p>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={loading || !userInfo.trim()}
                  className="gradient-btn px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Generating…
                    </span>
                  ) : 'Generate Bio'}
                </button>
              </div>
            )}
          </div>

          {/* Stats (2 cols) */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 reveal-right">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="glass-card skill-card p-6 rounded-2xl text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex justify-center mb-3">
                  <s.Icon className="w-7 h-7" style={{ color: '#c0c0c0' }} />
                </div>
                <div
                  className="text-4xl font-bold gradient-text mb-1"
                  style={{ fontFamily: 'Josefin Sans, sans-serif' }}
                >
                  {s.value}
                </div>
                <div
                  className="text-gray-400 text-xs leading-snug"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skills Grid ── */}
        <div className="reveal">
          <h3
            className="text-2xl md:text-3xl font-bold text-white text-center mb-10"
            style={{ fontFamily: 'Josefin Sans, sans-serif' }}
          >
            Tech <span className="gradient-text">Stack</span>
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {SKILLS.map((skill, i) => (
              <div
                key={skill.name}
                className="glass-card skill-card p-4 md:p-5 rounded-2xl text-center cursor-default reveal"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  transitionDelay: `${i * 0.08}s`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex justify-center mb-2">
                  <skill.Icon className="w-6 h-6" style={{ color: skill.color }} />
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: skill.color, fontFamily: 'Inter, sans-serif' }}
                >
                  {skill.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import React, { useState, useEffect, useRef } from 'react';
import {
  SiFigma, SiReact, SiNodedotjs, SiFlutter,
  SiJavascript, SiCss, SiNextdotjs, SiGatsby,
  SiTailwindcss, SiExpress, SiMongodb, SiTypescript,
} from 'react-icons/si';
import { GraduationCap, Rocket, Layers, Cpu } from 'lucide-react';

/* ── Tech stack data ── */
const techs = [
  { name: 'Flutter',    icon: SiFlutter,    color: '#54C5F8' },
  { name: 'React',      icon: SiReact,      color: '#61DAFB' },
  { name: 'Node.js',    icon: SiNodedotjs,  color: '#68A063' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'CSS3',       icon: SiCss,        color: '#264DE4' },
  { name: 'Next.js',    icon: SiNextdotjs,  color: '#ffffff' },
  { name: 'Gatsby',     icon: SiGatsby,     color: '#663399' },
  { name: 'Tailwind',   icon: SiTailwindcss,color: '#38BDF8' },
  { name: 'Express',    icon: SiExpress,    color: '#ffffff' },
  { name: 'MongoDB',    icon: SiMongodb,    color: '#47A248' },
  { name: 'Figma',      icon: SiFigma,      color: '#F24E1E' },
];

const STATS = [
  { Icon: GraduationCap, value: '2025', label: 'Angkatan UNP'    },
  { Icon: Rocket,        value: '3+',   label: 'Projects Shipped' },
  { Icon: Layers,        value: '12+',  label: 'Technologies'     },
  { Icon: Cpu,           value: '#1',   label: 'Flutter Focus'    },
];

/* ── Tech Globe ── */
const TechGlobe = () => {
  const canvasRef = useRef(null)
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0.3, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  const techLabels = [
    'Flutter', 'React', 'Node.js', 'JavaScript', 'TypeScript',
    'Next.js', 'Tailwind', 'MongoDB', 'Express', 'Figma',
    'Git', 'CSS3', 'Dart', 'Firebase', 'Redux'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width = 500
    const H = canvas.height = 500
    const cx = W / 2
    const cy = H / 2
    const R = 180

    // Generate points on sphere
    const points = techLabels.map((label, i) => {
      const phi = Math.acos(-1 + (2 * i) / techLabels.length)
      const theta = Math.sqrt(techLabels.length * Math.PI) * phi
      return {
        label,
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      }
    })

    // Add extra dot points for globe mesh
    const dotPoints = []
    for (let lat = -90; lat <= 90; lat += 18) {
      for (let lng = 0; lng < 360; lng += 18) {
        const phi = (90 - lat) * Math.PI / 180
        const theta = lng * Math.PI / 180
        dotPoints.push({
          x: Math.sin(phi) * Math.cos(theta),
          y: Math.cos(phi),
          z: Math.sin(phi) * Math.sin(theta),
        })
      }
    }

    const rotatePoint = (p, rx, ry) => {
      // Rotate Y
      let x = p.x * Math.cos(ry) + p.z * Math.sin(ry)
      let z = -p.x * Math.sin(ry) + p.z * Math.cos(ry)
      let y = p.y
      // Rotate X
      let y2 = y * Math.cos(rx) - z * Math.sin(rx)
      let z2 = y * Math.sin(rx) + z * Math.cos(rx)
      return { x, y: y2, z: z2 }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const rx = rotation.current.x
      const ry = rotation.current.y

      // Draw dot mesh
      dotPoints.forEach(p => {
        const r = rotatePoint(p, rx, ry)
        const scale = (r.z + 1.5) / 2.5
        const px = cx + r.x * R
        const py = cy + r.y * R
        const alpha = scale * 0.3
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })

      // Draw tech labels
      const sorted = points
        .map(p => ({ ...p, r: rotatePoint(p, rx, ry) }))
        .sort((a, b) => a.r.z - b.r.z)

      sorted.forEach(({ label, r }) => {
        const scale = (r.z + 1.5) / 2.5
        const px = cx + r.x * R
        const py = cy + r.y * R
        const alpha = Math.max(0.1, scale)
        const fontSize = Math.floor(10 + scale * 6)

        // Background pill
        ctx.font = `${fontSize}px "Josefin Sans", sans-serif`
        const tw = ctx.measureText(label).width
        const pad = 8
        const bw = tw + pad * 2
        const bh = fontSize + pad

        ctx.beginPath()
        ctx.roundRect(px - bw/2, py - bh/2, bw, bh, 6)
        ctx.fillStyle = `rgba(20,20,20,${alpha * 0.8})`
        ctx.fill()
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.2})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Text
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, px, py)
      })

      // Auto rotate when not dragging
      if (!isDragging.current) {
        velocity.current.y += 0.001
        velocity.current.x *= 0.95
        velocity.current.y *= 0.95
      }
      rotation.current.x += velocity.current.x
      rotation.current.y += velocity.current.y

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    // Mouse events
    const getPos = (e) => ({
      x: e.touches ? e.touches[0].clientX : e.clientX,
      y: e.touches ? e.touches[0].clientY : e.clientY,
    })

    const onDown = (e) => {
      isDragging.current = true
      const pos = getPos(e)
      lastMouse.current = pos
      velocity.current = { x: 0, y: 0 }
      canvas.style.cursor = 'grabbing'
    }

    const onMove = (e) => {
      if (!isDragging.current) return
      e.preventDefault()
      const pos = getPos(e)
      const dx = pos.x - lastMouse.current.x
      const dy = pos.y - lastMouse.current.y
      velocity.current.x = dy * 0.005
      velocity.current.y = dx * 0.005
      rotation.current.x += velocity.current.x
      rotation.current.y += velocity.current.y
      lastMouse.current = pos
    }

    const onUp = () => {
      isDragging.current = false
      canvas.style.cursor = 'grab'
    }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('touchstart', onDown, { passive: false })
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('touchstart', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#444', marginBottom: '8px' }}>DRAG TO EXPLORE</p>
      <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
        Tech <span style={{ color: '#555' }}>Universe</span>
      </h2>
      <p style={{ color: '#444', fontSize: '13px', marginBottom: '40px' }}>Technologies I work with</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{
            cursor: 'grab',
            maxWidth: '100%',
          }}
        />
      </div>
    </div>
  )
}

/* ── About Section ── */
const About = () => {
  const DEFAULT_BIO = `Saya mahasiswa Pendidikan Teknik Elektro di Universitas Negeri Padang angkatan 2025. Saya passionate dalam membangun aplikasi mobile dan web yang accessible, performant, dan beautiful. Fokus pada Flutter dan React.js untuk menciptakan solusi teknologi nyata bagi masyarakat.

Saya percaya bahwa teknologi yang baik harus bisa diakses oleh semua orang. Setiap project yang saya kerjakan selalu mempertimbangkan user experience, performa, dan kemudahan penggunaan — dari desain UI hingga arsitektur kode yang bersih.

Di luar coding, saya aktif mengeksplorasi open-source tools, mengikuti perkembangan ekosistem Flutter dan React, serta berkolaborasi dengan rekan-rekan di kampus untuk membangun produk digital yang berdampak.`;

  const [bio]             = useState(DEFAULT_BIO);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const calculateLines = () => {
      const container  = document.getElementById('skills-robot-container');
      const robotChest = document.getElementById('robot-chest');
      const iconEls    = document.querySelectorAll('.skill-icon-item');
      if (!container || !robotChest || iconEls.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const chestRect     = robotChest.getBoundingClientRect();
      const chestX = chestRect.left - containerRect.left + chestRect.width  / 2;
      const chestY = chestRect.top  - containerRect.top  + chestRect.height / 2;

      const newLines = [];
      iconEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width  / 2;
        const y = rect.top  - containerRect.top  + rect.height / 2;
        newLines.push({ x1: x, y1: y, x2: chestX, y2: chestY, id: i });
      });
      setLines(newLines);
    };

    const t = setTimeout(calculateLines, 600);
    window.addEventListener('resize', calculateLines);
    window.addEventListener('scroll', calculateLines, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', calculateLines);
      window.removeEventListener('scroll', calculateLines);
    };
  }, []);

  return (
    <section
      id="about"
      className="py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0d0d0d 50%, #000000 100%)' }}
    >
      {/* ambient blobs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,200,200,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }}
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

          {/* Bio */}
          <div className="lg:col-span-3 reveal-left">
            <p
              className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-line"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {bio}
            </p>
          </div>

          {/* Stats */}
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
                <div className="text-4xl font-bold gradient-text mb-1" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                  {s.value}
                </div>
                <div className="text-gray-400 text-xs leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech Globe ── */}
        <div className="reveal">
          <TechGlobe />
        </div>

        {/* ── Tech Stack + Robot ── */}
        <div className="reveal">
          <div
            id="skills-robot-container"
            style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}
          >

            {/* SVG connector lines */}
            <svg style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 2, overflow: 'visible',
            }}>
              {lines.map(line => (
                <line
                  key={line.id}
                  x1={line.x1} y1={line.y1}
                  x2={line.x2} y2={line.y2}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0" to="24"
                    dur={`${2 + line.id * 0.15}s`}
                    repeatCount="indefinite"
                  />
                </line>
              ))}
            </svg>

            {/* Tech stack icons */}
            <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', paddingBottom: '60px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#555', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
                TOOLS &amp; TECHNOLOGIES
              </p>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '40px', fontFamily: 'Josefin Sans, sans-serif' }}>
                Tech Stack
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                {techs.map((t, i) => (
                  <div
                    key={i}
                    id={`skill-${i}`}
                    className="skill-icon-item"
                    style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: '#0d0d0d', border: `1px solid ${t.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 10px ${t.color}22`,
                      transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.15)';
                      e.currentTarget.style.boxShadow = `0 0 20px ${t.color}66`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = `0 0 10px ${t.color}22`;
                    }}
                  >
                    <t.icon size={26} color={t.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* CSS Robot */}
            <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', paddingBottom: '60px' }}>
              <div style={{ animation: 'robot-float 3s ease-in-out infinite' }}>
                {/* Antenna */}
                <div style={{ width: '3px', height: '28px', background: '#333', margin: '0 auto' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 12px #fff', margin: '-2px auto 2px' }} />
                {/* Head */}
                <div style={{
                  width: '75px', height: '65px', background: '#111',
                  border: '1px solid #2a2a2a', borderRadius: '12px',
                  margin: '0 auto', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '12px',
                  animation: 'robot-head 4s ease-in-out infinite',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}>
                  <div style={{ width: '15px', height: '9px', background: '#fff', borderRadius: '3px', boxShadow: '0 0 10px #fff' }} />
                  <div style={{ width: '15px', height: '9px', background: '#fff', borderRadius: '3px', boxShadow: '0 0 10px #fff' }} />
                </div>
                {/* Neck */}
                <div style={{ width: '18px', height: '12px', background: '#1a1a1a', margin: '0 auto', borderRadius: '3px' }} />
                {/* Body */}
                <div style={{
                  width: '95px', height: '105px', background: '#111',
                  border: '1px solid #2a2a2a', borderRadius: '12px',
                  margin: '0 auto', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                }}>
                  {/* Chest glow — connector target */}
                  <div id="robot-chest" style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: '#fff', boxShadow: '0 0 20px #fff, 0 0 40px rgba(255,255,255,0.4)',
                  }} />
                  {/* Left arm */}
                  <div style={{
                    position: 'absolute', left: '-22px', top: '12px',
                    width: '20px', height: '65px', background: '#111',
                    border: '1px solid #222', borderRadius: '8px',
                    animation: 'robot-arm-left 2s ease-in-out infinite',
                    transformOrigin: 'top center',
                  }} />
                  {/* Right arm */}
                  <div style={{
                    position: 'absolute', right: '-22px', top: '12px',
                    width: '20px', height: '65px', background: '#111',
                    border: '1px solid #222', borderRadius: '8px',
                    animation: 'robot-arm-right 2s ease-in-out infinite',
                    transformOrigin: 'top center',
                  }} />
                </div>
                {/* Legs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '4px' }}>
                  <div style={{ width: '26px', height: '65px', background: '#111', border: '1px solid #222', borderRadius: '6px', animation: 'robot-leg-left 2s ease-in-out infinite', transformOrigin: 'top center' }} />
                  <div style={{ width: '26px', height: '65px', background: '#111', border: '1px solid #222', borderRadius: '6px', animation: 'robot-leg-right 2s ease-in-out infinite', transformOrigin: 'top center' }} />
                </div>
                {/* Feet */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '34px', height: '14px', background: '#111', border: '1px solid #222', borderRadius: '5px' }} />
                  <div style={{ width: '34px', height: '14px', background: '#111', border: '1px solid #222', borderRadius: '5px' }} />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default About;

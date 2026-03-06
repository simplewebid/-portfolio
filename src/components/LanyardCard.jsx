import React, { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import profileImg from '../assets/profile.jpg';

const ROPE_SEGMENTS  = 20;
const SEGMENT_LENGTH = 15;
const CARD_W         = 220;
const CARD_H         = 300;

/* ─── Catmull-Rom spline through rope segment positions ─── */
function drawCatmullRom(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  ctx.stroke();
}

const LanyardCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);

  /* physics refs */
  const engineRef      = useRef<Matter.Engine | null>(null);
  const runnerRef      = useRef<Matter.Runner | null>(null);
  const ropeSegsRef    = useRef<Matter.Body[]>([]);
  const cardBodyRef    = useRef<Matter.Body | null>(null);
  const anchorPosRef   = useRef({ x: 0, y: 0 });
  const rafRef         = useRef<number>(0);

  /* drag refs */
  const isDraggingRef  = useRef(false);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);

  /* ── Build / rebuild physics world ── */
  const buildWorld = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;
    const anchorX = W / 2;
    const anchorY = 18; // small offset from top
    anchorPosRef.current = { x: anchorX, y: anchorY };

    /* Tear down previous world */
    if (runnerRef.current)  Matter.Runner.stop(runnerRef.current);
    if (engineRef.current)  Matter.World.clear(engineRef.current.world, false);
    if (engineRef.current)  Matter.Engine.clear(engineRef.current);

    /* Engine */
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 2 } });
    engineRef.current = engine;

    const world = engine.world;

    /* ── Rope segments ── */
    const segments: Matter.Body[] = [];
    for (let i = 0; i <= ROPE_SEGMENTS; i++) {
      const seg = Matter.Bodies.circle(
        anchorX,
        anchorY + i * SEGMENT_LENGTH,
        3,
        {
          mass: 0.1,
          frictionAir: 0.04,
          collisionFilter: { mask: 0 }, // rope doesn't collide with anything
          render: { visible: false },
          label: 'rope-seg',
        },
      );
      segments.push(seg);
    }
    ropeSegsRef.current = segments;
    Matter.World.add(world, segments);

    /* Anchor – pin first segment */
    const anchorConstraint = Matter.Constraint.create({
      pointA:  { x: anchorX, y: anchorY },
      bodyB:   segments[0],
      pointB:  { x: 0, y: 0 },
      stiffness: 1,
      damping: 1,
      length: 0,
    });
    Matter.World.add(world, anchorConstraint);

    /* Segment-to-segment constraints */
    for (let i = 0; i < segments.length - 1; i++) {
      const c = Matter.Constraint.create({
        bodyA:    segments[i],
        bodyB:    segments[i + 1],
        stiffness: 0.9,
        damping:   0.1,
        length:    SEGMENT_LENGTH,
      });
      Matter.World.add(world, c);
    }

    /* ── Card body ── */
    const cardStartY = anchorY + (ROPE_SEGMENTS + 1) * SEGMENT_LENGTH + CARD_H / 2;
    const card = Matter.Bodies.rectangle(anchorX, cardStartY, CARD_W, CARD_H, {
      mass: 8,
      friction: 0.3,
      restitution: 0.2,
      frictionAir: 0.04,
      collisionFilter: { mask: 0 },
      label: 'card',
    });
    cardBodyRef.current = card;
    Matter.World.add(world, card);

    /* Last rope segment → card top-center */
    const ropeToCard = Matter.Constraint.create({
      bodyA:   segments[segments.length - 1],
      bodyB:   card,
      pointB:  { x: 0, y: -CARD_H / 2 },
      stiffness: 0.9,
      damping:   0.1,
      length: 2,
    });
    Matter.World.add(world, ropeToCard);

    /* ── Mouse constraint for drag ── */
    const canvas = canvasRef.current!;
    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.1,
        render: { visible: false },
      } as Matter.IConstraintDefinition,
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.World.add(world, mouseConstraint);

    /* Track dragging state for cursor */
    Matter.Events.on(mouseConstraint, 'startdrag', () => {
      isDraggingRef.current = true;
      if (cardRef.current) cardRef.current.style.cursor = 'grabbing';
    });
    Matter.Events.on(mouseConstraint, 'enddrag', () => {
      isDraggingRef.current = false;
      if (cardRef.current) cardRef.current.style.cursor = 'grab';
    });

    /* ── Runner ── */
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    /* ── Render loop ── */
    const renderLoop = () => {
      drawRope();
      updateCardDOM();
      rafRef.current = requestAnimationFrame(renderLoop);
    };
    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  /* ── Draw rope on canvas ── */
  const drawRope = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const segs  = ropeSegsRef.current;
    const card  = cardBodyRef.current;
    if (!segs.length || !card) return;

    const points = [
      anchorPosRef.current,
      ...segs.map(s => ({ x: s.position.x, y: s.position.y })),
      {
        x: card.position.x + (-CARD_H / 2) * Math.sin(card.angle),
        y: card.position.y + (-CARD_H / 2) * Math.cos(card.angle),
      },
    ];

    ctx.save();
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth   = 4;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.shadowColor  = 'rgba(30,58,138,0.35)';
    ctx.shadowBlur   = 4;
    drawCatmullRom(ctx, points);
    ctx.restore();
  }, []);

  /* ── Sync card DOM element to physics body ── */
  const updateCardDOM = useCallback(() => {
    const card    = cardBodyRef.current;
    const cardDiv = cardRef.current;
    if (!card || !cardDiv) return;

    const { x, y } = card.position;
    const angle     = card.angle;

    cardDiv.style.left      = `${x - CARD_W / 2}px`;
    cardDiv.style.top       = `${y - CARD_H / 2}px`;
    cardDiv.style.transform = `rotate(${angle}rad)`;
  }, []);

  /* ── Init on mount, rebuild on resize ── */
  useEffect(() => {
    buildWorld();

    const onResize = () => {
      const canvas    = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width  = container.clientWidth;
      canvas.height = container.clientHeight;
      buildWorld();
    };

    /* Set canvas size */
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      canvas.width  = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      if (runnerRef.current)  Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [buildWorld]);

  /* ── Touch support: forward touch events to Matter mouse ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: TouchEvent) => {
      const rect  = canvas.getBoundingClientRect();
      const touch = e.touches[0] ?? e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const mc = mouseConstraintRef.current;
      if (!mc) return;
      const pos = getPos(e);
      (mc.mouse as any).position = pos;
      (mc.mouse as any).mousedownPosition = pos;
      Matter.Events.trigger(mc, 'mousedown', { mouse: mc.mouse });
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const mc = mouseConstraintRef.current;
      if (!mc) return;
      const pos = getPos(e);
      (mc.mouse as any).position = pos;
      Matter.Events.trigger(mc, 'mousemove', { mouse: mc.mouse });
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const mc = mouseConstraintRef.current;
      if (!mc) return;
      const pos = getPos(e);
      (mc.mouse as any).position = pos;
      (mc.mouse as any).mouseupPosition = pos;
      Matter.Events.trigger(mc, 'mouseup', { mouse: mc.mouse });
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd,   { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '560px',
        overflow: 'hidden',
      }}
    >
      {/* Canvas – rope drawing layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'auto',
          zIndex: 1,
        }}
      />

      {/* Anchor dot */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4B5563, #1F2937)',
        border: '2px solid #6B7280',
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* ID Card DOM element – positioned by physics */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          width: `${CARD_W}px`,
          height: `${CARD_H}px`,
          cursor: 'grab',
          zIndex: 3,
          userSelect: 'none',
          touchAction: 'none',
          willChange: 'transform',
        }}
      >
        {/* Card shell */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          background: '#FFFFFF',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
        }}>
          {/* Lanyard hole */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '10px 0 4px',
            background: '#1E3A8A',
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.8)',
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)',
            }} />
          </div>

          {/* Header stripe */}
          <div style={{
            background: '#1E3A8A',
            padding: '6px 14px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '6px',
              letterSpacing: '1.2px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
            }}>
              Universitas Negeri Padang
            </span>
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>2025</span>
          </div>

          {/* Photo */}
          <div style={{ padding: '12px 14px 8px', display: 'flex', justifyContent: 'center' }}>
            <img
              src={profileImg}
              alt="Afri Ansyah"
              style={{
                width: '120px',
                height: '140px',
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: '10px',
                border: '3px solid #E5E7EB',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                display: 'block',
              }}
            />
          </div>

          {/* Name & role */}
          <div style={{ padding: '2px 16px 0', textAlign: 'center', flex: 1 }}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              color: '#1E3A8A',
              margin: '0 0 2px',
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
            }}>
              Afri Ansyah
            </h3>
            <p style={{
              fontSize: '9px',
              color: '#6B7280',
              letterSpacing: '0.5px',
              margin: '0 0 8px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Flutter &amp; Web Dev
            </p>
            <div style={{ height: '1px', background: '#E5E7EB', margin: '4px 0' }} />
            <p style={{ fontSize: '9px', color: '#9CA3AF', fontFamily: 'monospace', margin: '3px 0' }}>
              NIM: 25063002
            </p>

            {/* UNP badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: '#DBEAFE',
              color: '#1E3A8A',
              fontSize: '7.5px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '999px',
              marginTop: '6px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.5px',
            }}>
              ● UNP — FT Elektro
            </div>
          </div>

          {/* Bottom navy stripe */}
          <div style={{
            background: '#1E3A8A',
            height: '28px',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Barcode-style decoration */}
            <div style={{
              width: '120px',
              height: '12px',
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 2px, transparent 2px, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 5px, transparent 5px, transparent 8px)',
              borderRadius: '2px',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanyardCard;

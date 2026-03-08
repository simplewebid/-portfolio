import React, { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import profileImg from '../assets/profile.jpg';

const ROPE_SEGMENTS  = 28;
const SEGMENT_LENGTH = 14;
const CARD_W         = 220;
const CARD_H         = 300;

function drawCatmullRom(ctx, points) {
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

const LanyardCard = () => {
  const containerRef       = useRef(null);
  const canvasRef          = useRef(null);
  const cardRef            = useRef(null);
  const engineRef          = useRef(null);
  const runnerRef          = useRef(null);
  const ropeSegsRef        = useRef([]);
  const cardBodyRef        = useRef(null);
  const anchorPosRef       = useRef({ x: 0, y: 0 });
  const rafRef             = useRef(0);
  const mouseConstraintRef = useRef(null);
  const isDraggingRef      = useRef(false);

  const drawRope = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const segs = ropeSegsRef.current;
    const card = cardBodyRef.current;
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
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth   = 7;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur  = 10;
    drawCatmullRom(ctx, points);
    ctx.restore();

    const grad = ctx.createLinearGradient(
      anchorPosRef.current.x, anchorPosRef.current.y,
      points[points.length - 1].x, points[points.length - 1].y,
    );
    grad.addColorStop(0,   '#1a1a2e');
    grad.addColorStop(0.5, '#2d3561');
    grad.addColorStop(1,   '#4B5563');

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 4;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    drawCatmullRom(ctx, points);
    ctx.restore();
  }, []);

  const updateCardDOM = useCallback(() => {
    const card    = cardBodyRef.current;
    const cardDiv = cardRef.current;
    if (!card || !cardDiv) return;
    const { x, y } = card.position;
    cardDiv.style.left      = `${x - CARD_W / 2}px`;
    cardDiv.style.top       = `${y - CARD_H / 2}px`;
    cardDiv.style.transform = `rotate(${card.angle}rad)`;
  }, []);

  const buildWorld = useCallback(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const W = container.clientWidth;
    const H = container.clientHeight;
    canvas.width  = W;
    canvas.height = H;

    const anchorX = W / 2;
    const anchorY = 20;
    anchorPosRef.current = { x: anchorX, y: anchorY };

    cancelAnimationFrame(rafRef.current);
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
    }

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.8 } });
    engineRef.current = engine;
    const world = engine.world;

    const segments = [];
    for (let i = 0; i <= ROPE_SEGMENTS; i++) {
      segments.push(Matter.Bodies.circle(
        anchorX, anchorY + i * SEGMENT_LENGTH, 4,
        { mass: 0.05, frictionAir: 0.035, collisionFilter: { mask: 0 }, label: 'rope-seg' }
      ));
    }
    ropeSegsRef.current = segments;
    Matter.World.add(world, segments);

    Matter.World.add(world, Matter.Constraint.create({
      pointA: { x: anchorX, y: anchorY }, bodyB: segments[0],
      stiffness: 1, damping: 1, length: 0,
    }));

    for (let i = 0; i < segments.length - 1; i++) {
      Matter.World.add(world, Matter.Constraint.create({
        bodyA: segments[i], bodyB: segments[i + 1],
        stiffness: 0.6, damping: 0.08, length: SEGMENT_LENGTH,
      }));
    }

    const cardStartY = anchorY + (ROPE_SEGMENTS + 1) * SEGMENT_LENGTH + CARD_H / 2;
    const cardBody = Matter.Bodies.rectangle(anchorX, cardStartY, CARD_W, CARD_H, {
      mass: 5, friction: 0.3, restitution: 0.3, frictionAir: 0.06,
      collisionFilter: { mask: 0 }, label: 'card',
    });
    cardBodyRef.current = cardBody;
    Matter.World.add(world, cardBody);

    Matter.World.add(world, Matter.Constraint.create({
      bodyA: segments[segments.length - 1], bodyB: cardBody,
      pointB: { x: 0, y: -CARD_H / 2 },
      stiffness: 0.6, damping: 0.08, length: 2,
    }));

    // ✅ Mouse attached to canvas — koordinat selalu akurat
    const mouse = Matter.Mouse.create(canvas);
    Matter.Mouse.setScale(mouse, { x: 1, y: 1 });
    Matter.Mouse.setOffset(mouse, { x: 0, y: 0 });

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.World.add(world, mouseConstraint);

    Matter.Events.on(mouseConstraint, 'startdrag', () => {
      isDraggingRef.current = true;
      canvas.style.cursor = 'grabbing';
    });
    Matter.Events.on(mouseConstraint, 'enddrag', () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'grab';
    });

    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (isDraggingRef.current) return;
      const t = Date.now();
      segments.forEach((seg, i) => {
        if (i > 6 && i < ROPE_SEGMENTS - 4) {
          Matter.Body.applyForce(seg, seg.position, {
            x: Math.sin(t / 1800 + i * 0.3) * 0.00012,
            y: 0,
          });
        }
      });
    });

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    const loop = () => {
      drawRope();
      updateCardDOM();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [drawRope, updateCardDOM]);

  useEffect(() => {
    buildWorld();
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildWorld, 300);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [buildWorld]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e) => {
      const rect  = canvas.getBoundingClientRect();
      const touch = e.touches[0] ?? e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top)  * (canvas.height / rect.height),
      };
    };

    const onTouchStart = (e) => {
      e.preventDefault();
      const mc = mouseConstraintRef.current;
      if (!mc) return;
      const pos = getPos(e);
      mc.mouse.position          = pos;
      mc.mouse.mousedownPosition = pos;
      Matter.Events.trigger(mc, 'mousedown', { mouse: mc.mouse });
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      const mc = mouseConstraintRef.current;
      if (!mc) return;
      mc.mouse.position = getPos(e);
      Matter.Events.trigger(mc, 'mousemove', { mouse: mc.mouse });
    };
    const onTouchEnd = (e) => {
      e.preventDefault();
      const mc = mouseConstraintRef.current;
      if (!mc) return;
      const pos = getPos(e);
      mc.mouse.position        = pos;
      mc.mouse.mouseupPosition = pos;
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
      style={{ position: 'relative', width: '100%', minHeight: '600px', overflow: 'hidden' }}
    >
      {/* Anchor ring */}
      <div style={{
        position: 'absolute', top: '8px', left: '50%',
        transform: 'translateX(-50%)',
        width: '20px', height: '20px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #6B7280, #1F2937)',
        border: '3px solid #9CA3AF',
        boxShadow: '0 2px 10px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.2)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Card DOM — physics moves this */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          width: `${CARD_W}px`, height: `${CARD_H}px`,
          zIndex: 3, userSelect: 'none', touchAction: 'none',
          willChange: 'transform, left, top',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          width: '100%', height: '100%', borderRadius: '16px',
          background: '#FFFFFF',
          boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 4px 20px rgba(0,0,0,0.3)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px', background: '#1E3A8A' }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.85)', border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9)',
            }} />
          </div>
          <div style={{ background: '#1E3A8A', padding: '6px 14px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '6px', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase' }}>
              Universitas Negeri Padang
            </span>
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>2025</span>
          </div>
          <div style={{ padding: '12px 14px 8px', display: 'flex', justifyContent: 'center' }}>
            <img src={profileImg} alt="Afri Ansyah" style={{
              width: '120px', height: '140px', objectFit: 'cover', objectPosition: 'top center',
              borderRadius: '10px', border: '3px solid #E5E7EB',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)', display: 'block',
            }} />
          </div>
          <div style={{ padding: '2px 16px 0', textAlign: 'center', flex: 1 }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1.5px', color: '#1E3A8A', margin: '0 0 2px', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase' }}>
              Afri Ansyah
            </h3>
            <p style={{ fontSize: '9px', color: '#6B7280', letterSpacing: '0.5px', margin: '0 0 8px', fontFamily: 'Inter, sans-serif' }}>
              Flutter &amp; Web Dev
            </p>
            <div style={{ height: '1px', background: '#E5E7EB', margin: '4px 0' }} />
            <p style={{ fontSize: '9px', color: '#9CA3AF', fontFamily: 'monospace', margin: '3px 0' }}>NIM: 25063002</p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: '#DBEAFE', color: '#1E3A8A', fontSize: '7.5px', fontWeight: 700,
              padding: '3px 8px', borderRadius: '999px', marginTop: '6px',
              fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px',
            }}>● UNP — FT Elektro</div>
          </div>
          <div style={{ background: '#1E3A8A', height: '28px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '120px', height: '12px', borderRadius: '2px',
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 2px, transparent 2px, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 5px, transparent 5px, transparent 8px)',
            }} />
          </div>
        </div>
      </div>

      {/* Canvas — on top, handles all mouse events + draws rope */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          cursor: 'grab',
          zIndex: 10,
          touchAction: 'none',
        }}
      />
    </div>
  );
};

export default LanyardCard;
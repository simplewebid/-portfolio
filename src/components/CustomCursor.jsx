import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor — main dot (instant) + ring (lag-smooth trail).
 * Disabled automatically on touch/coarse-pointer devices.
 */
const CustomCursor = () => {
  const dotRef    = useRef(null);
  const ringRef   = useRef(null);
  const trailPos  = useRef({ x: -100, y: -100 });
  const mousePos  = useRef({ x: -100, y: -100 });
  const rafId     = useRef(null);
  const [visible, setVisible]   = useState(false);
  const [hovering, setHovering] = useState(false);

  /* ── detect coarse pointer (touch) → don't mount cursor ── */
  const [isFine] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: fine)').matches
      : false
  );

  useEffect(() => {
    if (!isFine) return;

    /* ── Hide native cursor ── */
    document.body.style.cursor = 'none';

    /* ── Track mouse ── */
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      /* Instant dot */
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      }
    };

    /* ── Hover detection: enlarge ring over interactive elements ── */
    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.closest('a, button, [role="button"], input, textarea, select, label');
      setHovering(!!isInteractive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener('mousemove',  onMove,      { passive: true });
    document.addEventListener('mouseover',  onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    /* ── Smooth trailing ring animation ── */
    const LERP = 0.10;
    const animate = () => {
      const { x: tx, y: ty } = trailPos.current;
      const { x: px, y: py } = mousePos.current;
      const nx = tx + (px - tx) * LERP;
      const ny = ty + (py - ty) * LERP;
      trailPos.current = { x: nx, y: ny };

      if (ringRef.current) {
        const offset = hovering ? 27.5 : 20;          // half of ring size
        ringRef.current.style.transform =
          `translate(${nx - offset}px, ${ny - offset}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseover',  onMouseOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [isFine, hovering]);         // re-run when hovering changes to resize ring

  if (!isFine) return null;

  return (
    <>
      {/* ── Main dot ── */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* ── Trailing ring ── */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${hovering ? 'hovering' : ''}`}
        style={{
          opacity: visible ? 0.85 : 0,
          width:  hovering ? '55px' : '40px',
          height: hovering ? '55px' : '40px',
          transition: 'opacity 0.2s, width 0.25s ease, height 0.25s ease, border-color 0.25s',
        }}
      />
    </>
  );
};

export default CustomCursor;

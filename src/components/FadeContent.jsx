import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * FadeContent — faithful replica of the Reactbits FadeContent component.
 * Fades children in (opacity + translateY) when they enter the viewport.
 */
const FadeContent = ({
  children,
  blur = false,
  duration = 0.8,
  delay = 0,
  ease = 'power2.out',
  threshold = 0.15,
  initialOpacity = 0,
  className = '',
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power2.in',
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial state
    gsap.set(el, {
      opacity: initialOpacity,
      y: 32,
      filter: blur ? 'blur(8px)' : 'none',
    });

    let disappearTimer = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration,
            delay,
            ease,
          });

          if (disappearAfter > 0) {
            disappearTimer = setTimeout(() => {
              gsap.to(el, {
                opacity: 0,
                duration: disappearDuration,
                ease: disappearEase,
              });
            }, (delay + duration + disappearAfter) * 1000);
          }
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (disappearTimer) clearTimeout(disappearTimer);
    };
  }, [blur, duration, delay, ease, threshold, initialOpacity, disappearAfter, disappearDuration, disappearEase]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'opacity, transform' }}>
      {children}
    </div>
  );
};

export default FadeContent;

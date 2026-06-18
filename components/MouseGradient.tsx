"use client";

import { useEffect, useRef } from "react";

/**
 * Smooth lerp mouse-follow gradient — two layered radials:
 *  - Inner: tight bright core (indigo)
 *  - Outer: wide soft halo (violet)
 * Uses rAF + lerp so movement feels springy without Framer Motion overhead.
 */
export default function MouseGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    let tx = window.innerWidth  / 2;
    let ty = window.innerHeight / 2;
    let cx = tx, cy = ty;

    const SPEED = 0.055;
    const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      cx = lerp(cx, tx, SPEED);
      cy = lerp(cy, ty, SPEED);

      if (ref.current) {
        ref.current.style.background = [
          `radial-gradient(320px circle at ${cx}px ${cy}px, rgba(99,102,241,0.11) 0%, transparent 70%)`,
          `radial-gradient(700px circle at ${cx}px ${cy}px, rgba(139,92,246,0.055) 0%, transparent 70%)`,
        ].join(", ");
      }

      raf = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-[2]" aria-hidden />;
}

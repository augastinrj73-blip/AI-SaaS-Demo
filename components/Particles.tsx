"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  drift: number;       // horizontal drift magnitude
  driftPhase: number;  // sine phase offset
  opacity: number;
  maxOpacity: number;
  life: number;        // 0→1→0 normalized lifecycle
  lifeSpeed: number;
  hue: number;         // colour tint
}

const COUNT = 65;

function makeParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: height + Math.random() * height,
    size: Math.random() * 1.8 + 0.4,
    speedY: -(Math.random() * 0.35 + 0.1),
    drift: (Math.random() - 0.5) * 0.6,
    driftPhase: Math.random() * Math.PI * 2,
    opacity: 0,
    maxOpacity: Math.random() * 0.35 + 0.08,
    life: Math.random(),        // start at random phase
    lifeSpeed: Math.random() * 0.0008 + 0.0003,
    hue: Math.random() < 0.5 ? 245 : 270,  // indigo / violet
  };
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    let t = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();

    const particles: Particle[] = Array.from({ length: COUNT }, () =>
      makeParticle(width, height)
    );

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 1;

      for (const p of particles) {
        // Lifecycle: triangle wave 0→1→0
        p.life += p.lifeSpeed;
        if (p.life > 1) {
          // reset at bottom
          p.life = 0;
          p.x = Math.random() * width;
          p.y = height + 10;
        }
        const fade = p.life < 0.15
          ? p.life / 0.15
          : p.life > 0.8
          ? (1 - p.life) / 0.2
          : 1;
        p.opacity = fade * p.maxOpacity;

        // Position
        p.y += p.speedY;
        p.x += Math.sin(t * 0.01 + p.driftPhase) * p.drift * 0.15;

        // Wrap horizontally
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        grad.addColorStop(0, `hsla(${p.hue},80%,70%,${p.opacity})`);
        grad.addColorStop(1, `hsla(${p.hue},80%,70%,0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden
    />
  );
}

"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * Glow stored as { rgb: "r,g,b", alpha: number } so the spotlight computation
 * is a single, correct rgba() interpolation — no fragile string.replace().
 */
const features = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    label: "Performance",
    title: "Responses in milliseconds",
    desc: "Edge-deployed inference across 30+ regions. P99 latency under 100ms globally with automatic fallback and zero cold starts.",
    glow: { rgb: "251,191,36", alpha: 0.16 },
    borderRgb: "251,191,36",
    bg: "from-yellow-500/[0.06] to-orange-500/[0.03]",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    label: "Security",
    title: "SOC 2 Type II certified",
    desc: "End-to-end encryption, RBAC, audit logs, and SSO out of the box. Your data never trains our models. HIPAA and GDPR ready.",
    glow: { rgb: "16,185,129", alpha: 0.15 },
    borderRgb: "16,185,129",
    bg: "from-emerald-500/[0.06] to-teal-500/[0.03]",
  },
  {
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    label: "Model access",
    title: "40+ frontier models, one API",
    desc: "Claude, GPT-4o, Gemini Ultra, Llama 3 — unified behind a single REST endpoint. Switch models in one line of code.",
    glow: { rgb: "99,102,241", alpha: 0.18 },
    borderRgb: "99,102,241",
    bg: "from-indigo-500/[0.06] to-violet-500/[0.03]",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    label: "Observability",
    title: "Real-time analytics",
    desc: "Token usage, cost breakdown, latency histograms, error rates — live. Set alerts, export to Datadog, build custom dashboards.",
    glow: { rgb: "6,182,212", alpha: 0.15 },
    borderRgb: "6,182,212",
    bg: "from-cyan-500/[0.06] to-blue-500/[0.03]",
  },
  {
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    label: "Developer experience",
    title: "SDKs for every stack",
    desc: "TypeScript, Python, Go, and Rust — all with full type safety. Streaming, function calling, vision, and embeddings built in.",
    glow: { rgb: "217,70,239", alpha: 0.14 },
    borderRgb: "217,70,239",
    bg: "from-fuchsia-500/[0.06] to-pink-500/[0.03]",
  },
  {
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    label: "Fine-tuning",
    title: "Models that know your domain",
    desc: "Upload training data, trigger a run, deploy in minutes. Continuous evaluation pipelines keep model quality high automatically.",
    glow: { rgb: "139,92,246", alpha: 0.16 },
    borderRgb: "139,92,246",
    bg: "from-violet-500/[0.06] to-purple-500/[0.03]",
  },
] as const;

/* ─── Spotlight card ──────────────────────────────────────────────────────────── */
function FeatureCard({ f, index }: { f: (typeof features)[number]; index: number }) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const rawX       = useMotionValue(0);
  const rawY       = useMotionValue(0);
  const rawO       = useMotionValue(0);
  const springX    = useSpring(rawX, { stiffness: 180, damping: 22 });
  const springY    = useSpring(rawY, { stiffness: 180, damping: 22 });
  const springO    = useSpring(rawO, { stiffness: 100, damping: 20 });

  const glowBg = useTransform(
    [springX, springY, springO],
    ([x, y, o]: number[]) =>
      `radial-gradient(200px circle at ${x}px ${y}px, rgba(${f.glow.rgb},${(f.glow.alpha * o).toFixed(3)}), transparent 70%)`
  );

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(e.clientX - r.left);
    rawY.set(e.clientY - r.top);
    rawO.set(1);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.065, duration: 0.52, ease: EASE }}
      onMouseMove={onMove}
      onMouseLeave={() => rawO.set(0)}
      whileHover={{
        y: -4,
        borderColor: `rgba(${f.borderRgb},0.28)`,
        boxShadow: `0 0 0 1px rgba(${f.borderRgb},0.2), 0 20px 60px rgba(0,0,0,0.45)`,
        transition: { duration: 0.22 },
      }}
      className={`group relative p-6 rounded-2xl border border-white/[0.07]
                  overflow-hidden cursor-default bg-gradient-to-br ${f.bg}`}
      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.025) inset" }}
    >
      {/* Spotlight follow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ background: glowBg }}
        aria-hidden
      />

      <div className="relative z-10">
        <div
          className="w-10 h-10 rounded-xl glass border border-white/[0.09] mb-5
                     flex items-center justify-center text-white/55 group-hover:text-white
                     transition-colors duration-300"
          aria-hidden
        >
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
          </svg>
        </div>

        <span className="block text-[10px] uppercase tracking-[0.14em] text-white/25 font-semibold mb-2">
          {f.label}
        </span>
        <h3 className="text-[15px] font-semibold text-white leading-snug mb-2.5">
          {f.title}
        </h3>
        <p className="text-[13px] text-white/38 leading-relaxed group-hover:text-white/55 transition-colors duration-300">
          {f.desc}
        </p>

        <div className="mt-5 flex items-center gap-1 text-[11px] text-white/22 group-hover:text-indigo-400 transition-colors duration-300">
          <span>Learn more</span>
          <svg
            className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────────── */
export default function Features() {
  return (
    <section id="features" className="relative py-28 px-4" aria-labelledby="features-heading">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[700px] h-[350px] bg-indigo-500/[0.04] blur-[100px] rounded-full"
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-center mb-16"
        >
          <span className="section-label glass border border-indigo-500/20 text-indigo-400">
            Platform
          </span>
          <h2
            id="features-heading"
            className="text-[clamp(30px,4.5vw,52px)] font-bold text-white leading-tight tracking-[-0.025em] mb-4"
          >
            Everything you need to ship{" "}
            <span className="gradient-text">AI products</span>
          </h2>
          <p className="text-white/38 text-[15px] max-w-[400px] mx-auto leading-relaxed">
            Stop stitching together ten different tools. One platform, from
            prototype to production.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import DashboardPreview from "./DashboardPreview";

const EASE = [0.22, 1, 0.36, 1] as const;

// Structured so each line is visually self-contained at all viewport widths
const lines = [
  { words: ["The AI platform"], highlight: [] },
  { words: ["built for",  "scale."], highlight: [1] },
];

const stats = [
  { value: "2,400+", label: "Teams shipping" },
  { value: "1.2B",   label: "Tokens / month" },
  { value: "99.99%", label: "Uptime SLA"     },
  { value: "<100ms", label: "Avg latency"    },
];

// Social proof avatars shown adjacent to the CTA
const avatarColors = [
  "bg-indigo-500", "bg-violet-500", "bg-cyan-500",
  "bg-fuchsia-500", "bg-emerald-500",
];

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeIn = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.62, ease: EASE },
        };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-28 pb-0 bg-grid"
      aria-label="Hero"
    >
      {/* Decorative rings — aria-hidden */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <div className="w-[800px] h-[800px] rounded-full border border-white/[0.016] animate-spin-slow" />
        <div className="absolute w-[1100px] h-[1100px] rounded-full border border-white/[0.008] animate-spin-rev" />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl mx-auto">

        {/* Announcement badge */}
        <motion.div
          {...(prefersReducedMotion ? {} : {
            initial: { opacity: 0, y: -12, scale: 0.94 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { duration: 0.5, ease: EASE },
          })}
          className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full glass border border-white/[0.09] cursor-default"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-ring shrink-0" />
          <span className="text-[12px] text-white/55 font-medium tracking-tight">
            Series A · $24M raised
          </span>
          <span className="text-white/20">·</span>
          <span className="text-[12px] text-indigo-400 font-semibold">Now in public beta</span>
        </motion.div>

        {/* Headline — each line overflow-hidden so letters clip cleanly */}
        <h1 className="text-[clamp(44px,8vw,92px)] font-bold tracking-[-0.03em] leading-[1.04] text-white mb-6">
          {lines.map((line, li) => (
            <span key={li} className="block overflow-hidden leading-[1.1]">
              {line.words.map((word, wi) => {
                const isHighlight = line.highlight.includes(wi);
                return (
                  <motion.span
                    key={wi}
                    {...(prefersReducedMotion ? {} : {
                      initial: { y: "110%", opacity: 0 },
                      animate: { y: 0, opacity: 1 },
                      transition: {
                        delay: 0.05 + li * 0.11 + wi * 0.04,
                        duration: 0.68,
                        ease: EASE,
                      },
                    })}
                    className={`inline-block mr-[0.22em] last:mr-0 ${
                      isHighlight ? "gradient-text" : ""
                    }`}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          {...fadeIn(0.46)}
          className="text-[clamp(15px,1.8vw,19px)] text-white/45 max-w-[500px] leading-[1.7] mb-10"
        >
          One unified API. Every frontier model. Real-time analytics and
          enterprise-grade security — without the infra headache.
        </motion.p>

        {/* CTAs + social proof row */}
        <motion.div {...fadeIn(0.56)} className="flex flex-col items-center gap-4 mb-14">

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/login"
              className="btn-primary px-7 py-3.5 rounded-2xl text-[15px] inline-flex items-center gap-2 shadow-2xl shadow-indigo-500/25"
            >
              Start building free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="btn-ghost px-7 py-3.5 rounded-2xl text-[15px] inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              See how it works
            </Link>
          </div>

          {/* Social proof micro-element */}
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {avatarColors.map((c, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 border-[#030305] ${c} text-[8px] font-bold text-white flex items-center justify-center`}
                  aria-hidden
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-[12px] text-white/35">
              <span className="text-white/60 font-semibold">2,400+ teams</span> already building
            </p>
          </div>
        </motion.div>

        {/* Stats — 2×2 on mobile, 4 columns on sm+ */}
        <motion.div
          {...fadeIn(0.68)}
          className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.07] mb-16"
          role="list"
          aria-label="Platform metrics"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              role="listitem"
              className="flex flex-col items-center gap-1 bg-[#030305] px-4 py-4"
            >
              <span className="text-[20px] font-bold gradient-text leading-none">{s.value}</span>
              <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-medium text-center">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          {...(prefersReducedMotion ? {} : {
            initial: { opacity: 0, y: 48 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.82, duration: 0.9, ease: EASE },
          })}
          className="w-full"
        >
          <DashboardPreview />
        </motion.div>
      </div>

      {/* Bottom section fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48
          bg-gradient-to-t from-[#030305] via-[rgba(3,3,5,0.55)] to-transparent z-20"
        aria-hidden
      />
    </section>
  );
}

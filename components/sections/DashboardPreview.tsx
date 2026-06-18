"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Animated counter ───────────────────────────────────────────────────────── */
function Counter({ to, prefix = "", suffix = "", decimals = 0 }: {
  to: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const count  = useMotionValue(0);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, { duration: 1.8, ease: "easeOut" });
    const unsub = count.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent =
          prefix + v.toFixed(decimals) + suffix;
      }
    });
    return () => { controls.stop(); unsub(); };
  }, [inView, count, to, prefix, suffix, decimals]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/* ─── SVG animated line chart ───────────────────────────────────────────────── */
function LiveChart() {
  const inView = useInView(useRef(null), { once: true });
  const pathRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);

  // Smooth cubic bezier path — upward trend with natural variance
  const linePath =
    "M0,108 C18,104 35,94 55,88 C75,82 88,96 108,90 C128,84 145,70 165,62 C185,54 200,68 222,58 C244,48 262,36 285,28 C308,20 325,32 348,22 C368,14 390,8 420,5";
  const fillPath = linePath + " L420,130 L0,130 Z";

  useEffect(() => {
    if (!inView || !pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    const path = pathRef.current;
    const fill = fillRef.current;
    path.style.strokeDasharray  = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.style.transition = "stroke-dashoffset 2.2s cubic-bezier(0.22,1,0.36,1) 0.4s";
    if (fill) { fill.style.opacity = "0"; fill.style.transition = "opacity 0.8s ease 1.8s"; }
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = "0";
      if (fill) fill.style.opacity = "1";
    });
  }, [inView]);

  const ref = useRef(null);
  useInView(ref, { once: true });

  // Weekly data points for dots
  const points = [
    [0, 108], [55, 88], [108, 90], [165, 62],
    [222, 58], [285, 28], [348, 22], [420, 5],
  ];

  return (
    <div ref={ref} className="relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pb-5 pr-2">
        {["100K", "75K", "50K", "25K", "0"].map((l) => (
          <span key={l} className="text-[9px] text-white/20 leading-none">{l}</span>
        ))}
      </div>

      <svg
        viewBox="0 0 420 140"
        className="w-full"
        style={{ marginLeft: 28, width: "calc(100% - 28px)" }}
        overflow="visible"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="50%"  stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0"    />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[28, 56, 84, 112].map((y) => (
          <line key={y} x1="0" y1={y} x2="420" y2={y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* Fill area */}
        <path ref={fillRef} d={fillPath} fill="url(#fillGrad)" style={{ opacity: 0 }} />

        {/* Line */}
        <path
          ref={pathRef}
          d={linePath}
          stroke="url(#lineGrad)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Data dots — appear after line finishes */}
        {points.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r="3.5"
            fill="#030305"
            stroke="url(#lineGrad)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2.4 + i * 0.06, duration: 0.3, ease: EASE }}
          />
        ))}

        {/* Tooltip on last point */}
        <motion.g
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 3.0, duration: 0.4, ease: EASE }}
        >
          <rect x="382" y="-22" width="52" height="18" rx="4"
            fill="rgba(99,102,241,0.9)" />
          <text x="408" y="-9" textAnchor="middle" fill="white"
            fontSize="9" fontWeight="600">$84.2K</text>
        </motion.g>
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 pl-7">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((m) => (
          <span key={m} className="text-[9px] text-white/20">{m}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Activity row ───────────────────────────────────────────────────────────── */
function ActivityRow({ dot, label, time, i }: {
  dot: string; label: string; time: string; i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 + i * 0.08, duration: 0.4, ease: EASE }}
      className="flex items-center gap-2.5 py-1.5"
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="text-[11px] text-white/50 flex-1 truncate">{label}</span>
      <span className="text-[10px] text-white/25 shrink-0">{time}</span>
    </motion.div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────────── */
export default function DashboardPreview() {
  const wrapRef = useRef(null);
  const inView  = useInView(wrapRef, { once: true, margin: "-100px" });
  const [live, setLive] = useState(1284);

  // Tick "live" counter
  useEffect(() => {
    const id = setInterval(() => setLive((n) => n + Math.floor(Math.random() * 3 + 1)), 1800);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { label: "Revenue",  val: 284920,   prefix: "$",  suffix: "",   decimals: 0, change: "+12.4%", up: true  },
    { label: "Requests", val: 8.3,      prefix: "",   suffix: "M",  decimals: 1, change: "+8.1%",  up: true  },
    { label: "Latency",  val: 148,      prefix: "",   suffix: "ms", decimals: 0, change: "−5.7%",  up: false },
  ];

  const activity = [
    { dot: "bg-emerald-400", label: "alice@acme.com  ·  API key created",        time: "2m"  },
    { dot: "bg-indigo-400",  label: "bob@acme.com  ·  Fine-tune completed",       time: "14m" },
    { dot: "bg-violet-400",  label: "carol@acme.com  ·  Deployment pushed",       time: "1h"  },
    { dot: "bg-amber-400",   label: "dave@acme.com  ·  Rate limit warning",       time: "3h"  },
  ];

  return (
    <div ref={wrapRef} style={{ perspective: "1200px" }} className="w-full">
      <motion.div
        initial={{ rotateX: 22, y: 60, opacity: 0, scale: 0.94 }}
        animate={inView ? { rotateX: 6, y: 0, opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative mx-auto max-w-5xl"
      >
        {/* Glow underneath */}
        <div
          className="animate-glow-pulse absolute -inset-px rounded-[20px] opacity-60"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 50%, rgba(6,182,212,0.1) 100%)",
            filter: "blur(20px)",
            zIndex: -1,
          }}
        />

        {/* Browser chrome */}
        <div className="rounded-[18px] overflow-hidden border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]">
          {/* Title bar */}
          <div className="h-9 bg-[rgba(12,12,18,0.98)] flex items-center gap-3 px-4 border-b border-white/[0.05]">
            {/* Traffic lights */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            {/* URL bar */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.05] text-[10px] text-white/30">
                <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                app.ai-saas.com/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard body */}
          <div className="flex bg-[rgba(6,6,10,0.97)]" style={{ minHeight: 380 }}>
            {/* Sidebar */}
            <div className="w-12 border-r border-white/[0.05] flex flex-col items-center py-4 gap-3 shrink-0">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-2">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              {[
                "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
                "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
                "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10",
              ].map((d, i) => (
                <button
                  key={i}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    i === 0
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "text-white/20 hover:text-white/40 hover:bg-white/[0.04]"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
                  </svg>
                </button>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 overflow-hidden">
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-white">Analytics</h3>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-medium">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse-ring" />
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/25 font-mono">{live.toLocaleString()} reqs</span>
                  <button className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/30">
                    Jun 2025 ▾
                  </button>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.45, ease: EASE }}
                    className="rounded-xl p-3 border border-white/[0.06] bg-white/[0.025]"
                  >
                    <div className="text-[9px] text-white/30 uppercase tracking-wider mb-1">{s.label}</div>
                    <div className="text-[15px] font-bold text-white leading-none mb-1">
                      <Counter to={s.val} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                    </div>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      s.up
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {s.change}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/30 font-medium">Revenue over time</span>
                  <div className="flex gap-2">
                    {["1W","1M","3M","YTD"].map((t, i) => (
                      <button key={t} className={`text-[9px] px-1.5 py-0.5 rounded ${
                        i === 2 ? "text-indigo-400 bg-indigo-500/10" : "text-white/20 hover:text-white/40"
                      }`}>{t}</button>
                    ))}
                  </div>
                </div>
                <LiveChart />
              </div>

              {/* Activity */}
              <div className="border-t border-white/[0.04] pt-3">
                <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Recent activity</div>
                {activity.map((a, i) => (
                  <ActivityRow key={i} {...a} i={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

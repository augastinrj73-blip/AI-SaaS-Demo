"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const EASE = [0.22, 1, 0.36, 1] as const;

const NAV = [
  { label: "Overview",  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg> },
  { label: "API Keys",  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg> },
  { label: "Models",    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
  { label: "Analytics", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { label: "Settings",  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

const STATS = [
  { label: "Total Requests", value: "1,284,920", change: "+12.4%", up: true,  border: "border-indigo-500/20",  bg: "from-indigo-500/[0.07] to-violet-500/[0.03]" },
  { label: "Tokens Used",    value: "8.3M",      change: "+8.1%",  up: true,  border: "border-cyan-500/20",    bg: "from-cyan-500/[0.07] to-blue-500/[0.03]"   },
  { label: "Active Users",   value: "342",        change: "-2.3%",  up: false, border: "border-fuchsia-500/20", bg: "from-fuchsia-500/[0.07] to-pink-500/[0.03]"},
  { label: "Avg Latency",    value: "148ms",      change: "-5.7%",  up: true,  border: "border-amber-500/20",   bg: "from-amber-500/[0.07] to-orange-500/[0.03]"},
];

const ACTIVITY = [
  { user: "alice@acme.com",  action: "API key created",      model: "claude-sonnet-4-6", time: "2m ago",  dot: "bg-emerald-400" },
  { user: "bob@acme.com",    action: "Fine-tune completed",   model: "claude-haiku-4-5",  time: "14m ago", dot: "bg-indigo-400"  },
  { user: "carol@acme.com",  action: "Webhook triggered",     model: "claude-sonnet-4-6", time: "1h ago",  dot: "bg-violet-400"  },
  { user: "dave@acme.com",   action: "Rate limit hit",        model: "claude-opus-4-8",   time: "3h ago",  dot: "bg-red-400"     },
  { user: "eve@acme.com",    action: "New deployment",        model: "claude-sonnet-4-6", time: "5h ago",  dot: "bg-cyan-400"    },
];

const CHART_BARS = [40, 65, 45, 80, 55, 70, 83];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DashboardClient({ user }: { user: User }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [activeNav, setActiveNav] = useState("Overview");

  const displayName = user.user_metadata?.full_name
    ?? user.email?.split("@")[0]
    ?? "You";
  const initials = displayName.slice(0, 2).toUpperCase();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-[#030305] text-white">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="w-60 shrink-0 glass-strong border-r border-white/[0.06] flex flex-col"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden>
                <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fillOpacity="0.9" />
                <path d="M8 6L11 7.75V11.25L8 13L5 11.25V7.75L8 6Z" fill="white" fillOpacity="0.4" />
              </svg>
            </div>
            <span className="text-[14px] font-semibold text-white tracking-tight">NexusAI</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Dashboard navigation">
          {NAV.map((item) => {
            const active = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                aria-current={active ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-white/35 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <span className={active ? "text-indigo-400" : "text-white/25"}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}

          {/* Builder — route-based link */}
          <div className="pt-2 mt-2 border-t border-white/[0.05]">
            <Link
              href="/dashboard/builder"
              aria-current={pathname.startsWith("/dashboard/builder") ? "page" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                pathname.startsWith("/dashboard/builder")
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-white/35 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <span className={pathname.startsWith("/dashboard/builder") ? "text-indigo-400" : "text-white/25"}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              Builder
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">{displayName}</p>
              <p className="text-[11px] text-white/28 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/[0.05]"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-grid" id="main-content">
        <div className="max-w-5xl px-8 py-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-xl font-bold text-white">Overview</h1>
              <p className="text-sm text-white/30 mt-0.5">
                Welcome back, {displayName}. Here&apos;s what&apos;s happening today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost px-4 py-2 rounded-xl text-sm">Export</button>
              <button className="btn-primary px-4 py-2 rounded-xl text-sm">+ New project</button>
            </div>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.45, ease: EASE }}
                className={`rounded-2xl p-5 glass border ${s.border} bg-gradient-to-br ${s.bg}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider font-medium">{s.label}</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    s.up
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {s.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {/* Token usage + bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.45, ease: EASE }}
              className="lg:col-span-2 glass border border-white/[0.06] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-semibold text-white text-[15px]">Token Usage</h2>
                  <p className="text-xs text-white/28 mt-0.5">Pro plan · 10M tokens / month</p>
                </div>
                <span className="text-sm font-bold gradient-text">83%</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "83%" }}
                  transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                />
              </div>
              <div className="flex justify-between text-[11px] text-white/18 mb-6">
                <span>8.3M used</span>
                <span>1.7M remaining</span>
              </div>

              <div className="flex items-end gap-1.5 h-20">
                {CHART_BARS.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.65 + i * 0.04, duration: 0.4, ease: EASE }}
                    className="flex-1 rounded-sm bg-gradient-to-t from-indigo-500/50 to-indigo-500/15"
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-white/15 mt-1.5">
                {DAYS.map((d) => <span key={d}>{d}</span>)}
              </div>
            </motion.div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.45, ease: EASE }}
              className="glass border border-white/[0.06] rounded-2xl p-6"
            >
              <h2 className="font-semibold text-white text-[15px] mb-4">Quick Actions</h2>
              <div className="space-y-1.5">
                {[
                  { label: "Create API key",  path: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
                  { label: "Run evaluation", path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
                  { label: "Start fine-tune", path: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
                  { label: "View docs",       path: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                ].map((a) => (
                  <button
                    key={a.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/45 hover:text-white/75 hover:bg-white/[0.04] transition-all text-left"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={a.path} />
                    </svg>
                    {a.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.05]">
                <p className="text-[11px] text-white/20 mb-1 uppercase tracking-wider">Current plan</p>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white">Pro</span>
                  <button className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">
                    Upgrade →
                  </button>
                </div>
                <div className="mt-2 w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full w-[83%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Activity table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.45, ease: EASE }}
            className="glass border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
              <h2 className="font-semibold text-white text-[15px]">Recent Activity</h2>
              <button className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">
                View all →
              </button>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {ACTIVITY.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.58 + i * 0.05, duration: 0.35 }}
                  className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/[0.015] transition-colors"
                >
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full glass border border-white/[0.08] flex items-center justify-center text-xs font-bold text-white/45">
                      {item.user[0].toUpperCase()}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${item.dot} border-2 border-[#030305]`} aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white/75">{item.action}</p>
                    <p className="text-[11px] text-white/22 truncate">{item.user}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full glass border border-white/[0.06] text-white/22 whitespace-nowrap hidden sm:inline">
                    {item.model}
                  </span>
                  <span className="text-[11px] text-white/18 whitespace-nowrap">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

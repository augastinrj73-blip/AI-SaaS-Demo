"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    // Simulate network delay — replace with your real signup endpoint
    await new Promise((r) => setTimeout(r, 900));
    setState("done");
  }

  return (
    <section
      id="cta"
      className="relative py-28 px-4 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="w-[700px] h-[350px] bg-indigo-600/[0.07] blur-[120px] rounded-full" />
      </div>

      {/* Gradient border card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: EASE }}
        className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(6,182,212,0.05) 100%)",
          boxShadow: "0 0 0 1px rgba(99,102,241,0.2), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="relative z-10 px-8 py-14 sm:px-14 text-center">

          {/* Label */}
          <div className="inline-flex items-center gap-1.5 mb-6 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/[0.07]">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" aria-hidden />
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-[0.1em]">
              Free forever · No card required
            </span>
          </div>

          <h2
            id="cta-heading"
            className="text-[clamp(28px,4.5vw,48px)] font-bold text-white leading-tight tracking-[-0.025em] mb-4"
          >
            Start building your{" "}
            <span className="gradient-text">AI product</span> today
          </h2>

          <p className="text-[15px] text-white/38 leading-relaxed mb-10 max-w-md mx-auto">
            Join 2,400+ teams shipping with NexusAI. 14-day Pro trial on sign-up,
            no commitment.
          </p>

          {/* Email capture — highest-converting element on a SaaS landing page */}
          {state !== "done" ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
              aria-label="Sign up with email"
            >
              <label htmlFor="cta-email" className="sr-only">
                Work email
              </label>
              <input
                ref={inputRef}
                id="cta-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                className="input-dark flex-1 px-4 py-3 rounded-xl text-[14px]
                           focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40
                           disabled:opacity-50"
                disabled={state === "loading"}
                suppressHydrationWarning
              />
              <button
                type="submit"
                disabled={state === "loading" || !email.trim()}
                className="btn-primary px-6 py-3 rounded-xl text-[14px] font-semibold
                           disabled:opacity-40 disabled:cursor-not-allowed
                           min-w-[140px] flex items-center justify-center gap-2"
              >
                {state === "loading" ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none" viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing up…
                  </>
                ) : (
                  <>
                    Get started free
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col items-center gap-3"
              role="status"
              aria-live="polite"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-white">You&apos;re on the list!</p>
              <p className="text-[13px] text-white/38">Check {email} for your activation link.</p>
            </motion.div>
          )}

          {/* Trust signals */}
          {state !== "done" && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                "No credit card required",
                "SOC 2 certified",
                "Cancel anytime",
              ].map((label) => (
                <div key={label} className="flex items-center gap-1.5 text-[11px] text-white/25">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Corner gradient accents */}
        <div
          className="pointer-events-none absolute top-0 left-0 w-64 h-64 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}
          aria-hidden
        />
      </motion.div>
    </section>
  );
}

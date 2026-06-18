"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * Pricing redesign principles (Stripe/Linear benchmark):
 * — Never show what a plan doesn't include. Show only what it does.
 * — "Everything in Starter, plus:" structure signals upgrade value, not exclusion.
 * — Enterprise gets an anchor price — "Custom" with no number kills enterprise leads.
 * — The toggle is a pill with a sliding indicator, not just two buttons.
 */
const plans = [
  {
    name: "Starter",
    monthly: 29,
    annual: 23,
    description: "For solo developers and weekend projects.",
    features: [
      "1M tokens / month",
      "3 AI models",
      "REST API",
      "Community support",
      "Basic analytics",
      "99.9% uptime SLA",
    ],
    cta: "Start for free",
    highlight: false,
    badge: null,
    accentRgb: "255,255,255",
  },
  {
    name: "Pro",
    monthly: 99,
    annual: 79,
    description: "For teams shipping AI features at scale.",
    features: [
      "Everything in Starter, plus:",
      "10M tokens / month",
      "All 40+ AI models",
      "REST + WebSocket API",
      "Priority support (4 hr SLA)",
      "Advanced analytics",
      "99.99% uptime SLA",
      "Custom fine-tuning",
    ],
    cta: "Start 14-day trial",
    highlight: true,
    badge: "Most popular",
    accentRgb: "99,102,241",
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    anchorFrom: "499",
    description: "Dedicated infrastructure and white-glove support.",
    features: [
      "Everything in Pro, plus:",
      "Unlimited tokens",
      "Private model deployment",
      "Dedicated GPU cluster",
      "24 / 7 support + TAM",
      "SSO / SAML / SCIM",
      "Custom SLA up to 99.999%",
      "On-premise / BYOC option",
    ],
    cta: "Talk to sales",
    highlight: false,
    badge: null,
    accentRgb: "255,255,255",
  },
];

function Check({ highlight }: { highlight: boolean }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 ${highlight ? "text-indigo-400" : "text-white/30"}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="relative py-28 px-4 overflow-hidden"
      aria-labelledby="pricing-heading"
    >
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2
                   w-[600px] h-[260px] bg-indigo-500/[0.05] blur-[80px] rounded-full"
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-center mb-12"
        >
          <span className="section-label glass border border-cyan-500/20 text-cyan-400">Pricing</span>
          <h2
            id="pricing-heading"
            className="text-[clamp(30px,4.5vw,52px)] font-bold text-white leading-tight tracking-[-0.025em] mb-4"
          >
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-white/38 text-[15px] mb-8">
            Start free. Scale as you grow. No surprise bills.
          </p>

          {/* Pill toggle with sliding indicator */}
          <div
            className="inline-flex items-center p-1 rounded-full glass border border-white/[0.07]"
            role="group"
            aria-label="Billing period"
          >
            <button
              role="radio"
              aria-checked={!annual}
              onClick={() => setAnnual(false)}
              className={`relative px-5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                !annual ? "text-white" : "text-white/38 hover:text-white/60"
              }`}
            >
              {!annual && (
                <motion.span
                  layoutId="pill"
                  className="absolute inset-0 bg-white/[0.09] rounded-full"
                  transition={{ duration: 0.22, ease: EASE }}
                />
              )}
              <span className="relative">Monthly</span>
            </button>
            <button
              role="radio"
              aria-checked={annual}
              onClick={() => setAnnual(true)}
              className={`relative flex items-center gap-1.5 px-5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                annual ? "text-white" : "text-white/38 hover:text-white/60"
              }`}
            >
              {annual && (
                <motion.span
                  layoutId="pill"
                  className="absolute inset-0 bg-white/[0.09] rounded-full"
                  transition={{ duration: 0.22, ease: EASE }}
                />
              )}
              <span className="relative">Annual</span>
              <span className="relative text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                −20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans grid — 3 cols on lg, stacked on md/sm */}
        <div className="grid md:grid-cols-3 gap-4 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? "border border-indigo-500/35 shadow-[0_0_60px_rgba(99,102,241,0.13),inset_0_1px_0_rgba(99,102,241,0.15)] bg-gradient-to-b from-indigo-500/[0.08] via-indigo-500/[0.04] to-transparent"
                  : "glass border-white/[0.07] hover:border-white/[0.12] transition-colors duration-300"
              }`}
            >
              {/* "Most popular" badge */}
              {plan.badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full
                             text-white text-[11px] font-semibold whitespace-nowrap
                             shadow-lg shadow-indigo-500/30"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan name + description */}
              <div className="mb-5">
                <h3 className="text-[16px] font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-[13px] text-white/38">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6 min-h-[60px]">
                <AnimatePresence mode="wait">
                  {plan.monthly !== null ? (
                    <motion.div
                      key={annual ? "a" : "m"}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: EASE }}
                    >
                      <div className="flex items-end gap-1">
                        <span className="text-[38px] font-bold text-white leading-none">
                          ${annual ? plan.annual : plan.monthly}
                        </span>
                        <span className="text-white/28 text-[13px] mb-1.5">/ mo</span>
                      </div>
                      {annual && (
                        <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                          Billed annually · Save $
                          {((plan.monthly! - plan.annual!) * 12).toLocaleString()} / yr
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="text-[38px] font-bold text-white leading-none">Custom</span>
                      </div>
                      <p className="text-[11px] text-white/30 mt-1">
                        From ${plan.anchorFrom} / mo · Volume discounts available
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA */}
              <Link
                href={plan.cta === "Talk to sales" ? "#" : "/login"}
                className={`mb-6 py-2.5 rounded-xl text-[13px] font-semibold text-center transition-all duration-200 ${
                  plan.highlight ? "btn-primary" : "btn-ghost"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div className="border-t border-white/[0.06] mb-5" />

              {/* Features list */}
              <ul className="space-y-2.5" aria-label={`${plan.name} plan features`}>
                {plan.features.map((feat, fi) => {
                  const isHeader = feat.startsWith("Everything in");
                  return (
                    <li key={fi} className={`flex items-start gap-2.5 ${
                      isHeader ? "text-white/50 font-medium text-[12px] -mb-0.5 mt-0.5" : "text-[13px] text-white/55"
                    }`}>
                      {!isHeader && <Check highlight={plan.highlight} />}
                      {isHeader && <span className="w-4 shrink-0" aria-hidden />}
                      <span>{feat}</span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center text-[12px] text-white/22 mt-8"
        >
          14-day free trial on all plans · No credit card required · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}

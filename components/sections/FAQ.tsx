"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "How is NexusAI different from calling model APIs directly?",
    a: "Direct API calls mean you own retries, fallbacks, rate limits, cost tracking, and compliance. NexusAI abstracts all of that into one endpoint: built-in observability, automatic provider fallback, unified billing, and enterprise compliance — so your team focuses on the product, not the plumbing.",
  },
  {
    q: "Which AI models are supported?",
    a: "40+ models including the full Claude family (Haiku, Sonnet, Opus), GPT-4o and o1, Gemini Ultra and Flash, Llama 3 (8B / 70B / 405B), Mistral Large, Command R+, and purpose-built embedding and vision models. New models are added within 48 hours of public release.",
  },
  {
    q: "Does my data train your models?",
    a: "Never. Your prompts, completions, and fine-tuning data are exclusively yours. We do not use customer data to train or improve any model. You can also enable zero-data-retention mode, where nothing is stored on our infrastructure at all.",
  },
  {
    q: "What does fine-tuning cost?",
    a: "Fine-tuning costs are token-based. Starter plans include 100 K training tokens / month; Pro plans include 2 M; Enterprise is unlimited. We display a detailed cost estimate in the dashboard before any job starts — no hidden charges.",
  },
  {
    q: "What is your uptime SLA?",
    a: "Starter: 99.9% SLA (~8.7 hrs downtime / yr). Pro: 99.99% (~52 min / yr). Enterprise: up to 99.999%, negotiated per contract. All SLA credits are issued automatically — no support ticket required.",
  },
  {
    q: "Can I self-host or run on-premise?",
    a: "Yes. Enterprise customers can deploy NexusAI into their own AWS, GCP, or Azure account via our Bring-Your-Own-Cloud (BYOC) option, or request a fully air-gapped on-premise deployment. Contact sales to discuss architecture.",
  },
  {
    q: "Is there a free tier?",
    a: "Every new account starts with a 14-day Pro trial — no credit card required. After the trial you can continue on Starter ($29 / mo), upgrade to Pro, or contact us about a free tier for qualifying open-source projects.",
  },
];

function FAQItem({ item, index }: { item: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: EASE }}
      className="border-b border-white/[0.06] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-5 text-left gap-5 group"
      >
        <span
          className={`text-[14px] font-medium leading-snug transition-colors duration-200 ${
            open ? "text-white" : "text-white/55 group-hover:text-white/80"
          }`}
        >
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="shrink-0 w-5 h-5 rounded-full glass border border-white/[0.09]
                     flex items-center justify-center text-white/38"
          aria-hidden
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="text-[13px] text-white/40 leading-relaxed pb-5 max-w-2xl">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-28 px-4" aria-labelledby="faq-heading">
      <div
        className="pointer-events-none absolute left-0 bottom-0
                   w-[400px] h-[400px] bg-violet-600/[0.04] blur-[100px] rounded-full"
        aria-hidden
      />

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-center mb-12"
        >
          <span className="section-label glass border border-fuchsia-500/20 text-fuchsia-400">FAQ</span>
          <h2
            id="faq-heading"
            className="text-[clamp(30px,4.5vw,52px)] font-bold text-white leading-tight tracking-[-0.025em] mb-3"
          >
            Questions &amp; answers
          </h2>
          <p className="text-white/38 text-[15px]">
            Everything you need to make a decision.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="glass rounded-2xl border border-white/[0.07] px-5 sm:px-8 py-1">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} item={faq} index={i} />
          ))}
        </div>

        {/* Support CTA — critical for conversion, not just aesthetics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <div className="text-[13px] text-white/35 text-center">
            Still have questions?
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-[13px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Read the docs →
            </a>
            <span className="text-white/15">|</span>
            <Link
              href="#"
              className="text-[13px] text-white/50 hover:text-white transition-colors font-medium"
            >
              Chat with sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

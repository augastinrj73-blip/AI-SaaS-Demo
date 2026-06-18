"use client";

import { motion } from "framer-motion";

const logos = [
  "Anthropic", "Stripe", "Vercel", "Linear", "Notion",
  "Figma", "GitHub", "Resend", "Supabase", "Planetscale",
  "Anthropic", "Stripe", "Vercel", "Linear", "Notion",
  "Figma", "GitHub", "Resend", "Supabase", "Planetscale",
];

export default function LogoBar() {
  return (
    <section className="relative py-16 overflow-hidden border-y border-white/[0.04]">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-xs uppercase tracking-[0.2em] text-white/25 font-medium mb-8"
      >
        Trusted by teams at world-class companies
      </motion.p>

      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#030305] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#030305] to-transparent pointer-events-none" />

      <div className="flex overflow-hidden">
        <div className="flex animate-marquee shrink-0">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-8 text-white/20 text-sm font-semibold tracking-wide uppercase whitespace-nowrap hover:text-white/40 transition-colors duration-300 cursor-default select-none"
              style={{ minWidth: "120px" }}
            >
              {logo}
            </div>
          ))}
        </div>
        <div className="flex animate-marquee shrink-0" aria-hidden>
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-8 text-white/20 text-sm font-semibold tracking-wide uppercase whitespace-nowrap"
              style={{ minWidth: "120px" }}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

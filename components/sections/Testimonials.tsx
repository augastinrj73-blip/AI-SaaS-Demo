"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const all = [
  { quote: "We migrated our entire AI pipeline in a weekend. Latency dropped 60%, bill down 40%. Wish we'd switched sooner.", name: "Sarah Chen",    role: "CTO",               co: "Meridian AI",    av: "SC", c: "bg-indigo-500"  },
  { quote: "The analytics dashboard alone is worth it. We finally understand what our users are asking and can iterate with real data.", name: "Marcus Rivera", role: "Head of Product",   co: "Fold Finance",   av: "MR", c: "bg-violet-500"  },
  { quote: "SOC 2 compliance was a blocker for enterprise deals. AI SaaS handled it out of the box. Closed three Fortune 500s next quarter.", name: "Aisha Patel",   role: "CEO",               co: "DataBridge",     av: "AP", c: "bg-emerald-500" },
  { quote: "Switching between Claude and GPT-4 used to require a full refactor. Now it's a one-line config change. Genuinely brilliant.", name: "Tom Nakamura",  role: "Staff Engineer",    co: "Orbit Labs",     av: "TN", c: "bg-cyan-500"    },
  { quote: "Fine-tuning used to take weeks. The automated pipeline trains, evals, and deploys overnight. We move at a completely different speed.", name: "Elena Volkov",  role: "ML Lead",           co: "Synthex",        av: "EV", c: "bg-fuchsia-500" },
  { quote: "TypeScript types are perfect, streaming just works, and support responds in under 10 minutes. Exceptional DX.", name: "James O'Brien",  role: "Founding Engineer", co: "Cascade",        av: "JO", c: "bg-orange-500"  },
  { quote: "We run 50M+ inferences per day through NexusAI. Zero downtime in 18 months. The reliability is genuinely unmatched.", name: "Priya Sharma",  role: "VP Engineering",    co: "Nexus AI",       av: "PS", c: "bg-rose-500"    },
  { quote: "The cost breakdown per model is eye-opening. We reallocated 30% of budget to actually building product features.", name: "Luca Ferrari",   role: "Founder",           co: "Forma Studio",   av: "LF", c: "bg-amber-500"   },
  { quote: "From API key to first production response in 4 minutes. I've never onboarded faster to any infrastructure tool.", name: "Yuki Tanaka",   role: "Senior Developer",  co: "Hoshi Systems", av: "YT", c: "bg-teal-500"    },
  { quote: "Webhook reliability is 99.999%. Our previous provider dropped ~2% of events. That was costing us real money every day.", name: "Omar Hassan",   role: "Backend Lead",      co: "Atlas Cloud",    av: "OH", c: "bg-blue-500"    },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-3" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3 h-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Card({ t }: { t: typeof all[0] }) {
  return (
    <figure
      className="shrink-0 w-[296px] sm:w-[316px] glass-card rounded-2xl p-5 mx-2.5
                 border border-white/[0.07] hover:border-white/[0.14]
                 transition-[border-color] duration-300 cursor-default"
    >
      <Stars />
      <blockquote className="text-[13px] text-white/52 leading-relaxed mb-4 line-clamp-4">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-full ${t.c} flex items-center justify-center
                      text-white text-[11px] font-bold shrink-0`}
          aria-hidden
        >
          {t.av}
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white leading-tight">{t.name}</p>
          <p className="text-[11px] text-white/30">{t.role} · {t.co}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/*
 * Group/hover pauses both rows' CSS animations using Tailwind's group-hover modifier
 * via [animation-play-state:paused]. This is the accessible standard.
 */
function MarqueeRow({ items, reverse }: { items: typeof all; reverse?: boolean }) {
  const animClass = reverse ? "animate-marquee-right" : "animate-marquee";
  return (
    <div className="flex overflow-hidden py-2">
      <div className={`flex ${animClass} shrink-0 group-hover/marquee:[animation-play-state:paused]`}>
        {items.map((t, i) => <Card key={i} t={t} />)}
      </div>
      <div className={`flex ${animClass} shrink-0 group-hover/marquee:[animation-play-state:paused]`} aria-hidden>
        {items.map((t, i) => <Card key={i} t={t} />)}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const row1 = all.slice(0, 5);
  const row2 = all.slice(5);

  return (
    <section
      id="testimonials"
      className="relative py-28 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-36 z-10 bg-gradient-to-r from-[#030305] to-transparent" aria-hidden />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-36 z-10 bg-gradient-to-l from-[#030305] to-transparent" aria-hidden />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
        <div className="w-[600px] h-[280px] bg-violet-500/[0.04] blur-[90px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-center px-4 mb-14"
        >
          <span className="section-label glass border border-violet-500/20 text-violet-400">
            Testimonials
          </span>
          <h2
            id="testimonials-heading"
            className="text-[clamp(30px,4.5vw,52px)] font-bold text-white leading-tight tracking-[-0.025em] mb-3"
          >
            Trusted by teams at{" "}
            <span className="gradient-text-warm">world-class</span>
            <br className="hidden sm:block" /> companies
          </h2>
          <p className="text-white/38 text-[15px]">
            From YC startups to Fortune 500s —&nbsp;
            <span className="text-white/60">2,400+ teams</span> ship with NexusAI.
          </p>
        </motion.div>

        {/* Dual marquee — hover anywhere to pause both */}
        <div className="group/marquee">
          <MarqueeRow items={row1} />
          <MarqueeRow items={row2} reverse />
        </div>

        {/* Pause hint */}
        <p className="text-center text-[11px] text-white/18 mt-4 tracking-wide" aria-live="polite">
          Hover to pause
        </p>
      </div>
    </section>
  );
}

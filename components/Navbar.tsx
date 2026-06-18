"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { label: "Features",     href: "#features"     },
  { label: "Testimonials", href: "#testimonials"  },
  { label: "Pricing",      href: "#pricing"       },
  { label: "FAQ",          href: "#faq"           },
  { label: "Docs",         href: "#"              },
];

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeSection,  setActiveSection]  = useState("");

  const updateState = useCallback(() => {
    setScrolled(window.scrollY > 24);

    // Determine active section from registered section ids
    const sectionIds = navLinks
      .map((l) => l.href.replace("#", ""))
      .filter((id) => id !== "");

    let current = "";
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 90) current = id;
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateState, { passive: true });
    updateState();
    return () => window.removeEventListener("scroll", updateState);
  }, [updateState]);

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(3,3,5,0.82)] backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      }`}
    >
      {/* Skip navigation — accessibility */}
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
                   btn-primary px-4 py-2 rounded-lg text-sm"
      >
        Skip to content
      </a>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30
                       group-hover:shadow-indigo-500/50 transition-shadow"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden>
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fillOpacity="0.9" />
              <path d="M8 6L11 7.75V11.25L8 13L5 11.25V7.75L8 6Z" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">NexusAI</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-0.5"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            const id     = link.href.replace("#", "");
            const active = activeSection === id;
            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? "text-white"
                    : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400"
                    transition={{ duration: 0.25, ease: EASE }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[13px] text-white/45 hover:text-white/85 transition-colors px-2 py-1.5 font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="btn-primary px-4 py-2 rounded-xl text-[13px]"
          >
            Get started free
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="block h-[1.5px] bg-white/70 rounded-full"
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
              transition={{ duration: 0.18 }}
              className="block h-[1.5px] bg-white/70 rounded-full"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="block h-[1.5px] bg-white/70 rounded-full"
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="md:hidden overflow-hidden bg-[rgba(3,3,5,0.96)] backdrop-blur-2xl border-b border-white/[0.06]"
          >
            <div className="px-4 py-3 flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const id     = link.href.replace("#", "");
                const active = activeSection === id;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all ${
                      active
                        ? "text-white bg-white/[0.05]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {active && <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />}
                    {link.label}
                  </a>
                );
              })}
              <div className="border-t border-white/[0.06] mt-2 pt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary px-4 py-2.5 rounded-xl text-sm text-center"
                >
                  Get started free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

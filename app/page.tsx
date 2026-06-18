import Aurora from "@/components/Aurora";
import Particles from "@/components/Particles";
import MouseGradient from "@/components/MouseGradient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import LogoBar from "@/components/sections/LogoBar";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030305] text-white overflow-x-hidden">
      {/* Global atmospheric layers — fixed, beneath everything */}
      <Aurora />
      <Particles />
      <MouseGradient />

      {/* Page content — z-index above atmospheric layers */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <LogoBar />
          <Features />
          <Testimonials />
          <Pricing />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}

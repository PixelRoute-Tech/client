import { useEffect } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { ScreenshotsSection } from "@/components/landing/ScreenshotsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function LandingPage() {
  useEffect(() => {
    document.title = "Vericore Inspections ERP - All-in-One Enterprise Resource Planning Solution";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", 
        "Transform your business operations with Vericore ERP. Comprehensive client management, job tracking, workflow automation, and advanced reporting. Trusted by 500+ enterprises."
      );
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0f172a", color: "white", fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        :root {
          color-scheme: dark;
        }

        body {
          background-color: #0f172a;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Professional Typography */
        h1, h2, h3, h4, h5, h6 {
          letter-spacing: -0.02em;
          font-weight: 700;
          color: #f8fafc;
        }

        p {
          color: #94a3b8;
          line-height: 1.6;
        }

        /* Clean Section Transitions */
        section {
          opacity: 0;
          transform: translateY(10px);
          animation: sectionFadeIn 0.6s ease-out forwards;
        }

        @keyframes sectionFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Staggered load */
        section:nth-of-type(1) { animation-delay: 0.1s; }
        section:nth-of-type(2) { animation-delay: 0.15s; }
        section:nth-of-type(3) { animation-delay: 0.2s; }
        section:nth-of-type(4) { animation-delay: 0.25s; }

        /* Custom Scrollbar - Substrate Style */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border: 2px solid #0f172a;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }

        /* Grounded Section Elements */
        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #38bdf8;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.03em;
          margin: 0 0 16px;
          line-height: 1.1;
          text-align: center;
        }

        .section-sub {
          font-size: 18px;
          font-weight: 400;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.6;
          text-align: center;
        }

        /* Professional Utility Glass */
        .utility-glass {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.2);
        }

        /* Subtle Background Gradients */
        .bg-glow {
          position: absolute;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.03) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      
      <LandingHeader />
      <main style={{ position: "relative" }}>
        <div className="bg-glow" style={{ top: "5%", right: "-10%" }} />
        <div className="bg-glow" style={{ top: "40%", left: "-15%" }} />
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <PricingSection />
        <ScreenshotsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}

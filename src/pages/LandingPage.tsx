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
    <div className="min-h-screen" style={{ background: "#0a0a12", color: "white", fontFamily: '"SF Pro Display", "SF Pro", system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap');

        /* Global Liquid Glass Styles */
        :root {
          color-scheme: dark;
        }

        body {
          background-color: #0a0a12;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          letter-spacing: -0.01em;
          font-weight: 200;
        }

        /* Base section transitions */
        section {
          opacity: 0;
          transform: translateY(20px);
          animation: sectionFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes sectionFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Staggered load for sections */
        section:nth-of-type(1) { animation-delay: 0.1s; }
        section:nth-of-type(2) { animation-delay: 0.2s; }
        section:nth-of-type(3) { animation-delay: 0.3s; }
        section:nth-of-type(4) { animation-delay: 0.4s; }
        section:nth-of-type(5) { animation-delay: 0.5s; }
        section:nth-of-type(6) { animation-delay: 0.6s; }
        section:nth-of-type(7) { animation-delay: 0.7s; }
        section:nth-of-type(8) { animation-delay: 0.8s; }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a12;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Global utility for section labels */
        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(168, 85, 247, 0.12);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 50px;
          font-size: 12px;
          font-weight: 500;
          color: #c084fc;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: clamp(32px, 4vw, 56px);
          font-weight: 200;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: -0.01em;
          margin: 0 0 16px;
          line-height: 1.15;
          text-align: center;
        }

        .section-sub {
          font-size: 16px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.5);
          max-width: 480px;
          margin: 0 auto 48px;
          line-height: 1.7;
          text-align: center;
        }

        /* Standard fadeUpIn animation for elements */
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes orbDrift1 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(80px, 120px) scale(1.15); }
        }
        @keyframes orbDrift2 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-100px, -60px) scale(1.1); }
        }
        @keyframes orbDrift3 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-60px, -100px) scale(1.2); }
        }
        @keyframes orbDrift4 {
          from { transform: translate(0, 0) scale(0.9); }
          to   { transform: translate(120px, 80px) scale(1.1); }
        }
      `}</style>
      
      <LandingHeader />
      <main>
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

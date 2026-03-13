import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", background: "#0f172a", padding: "120px 24px 80px" }}>
      <style>{`
        .hero-layout {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .hero-layout { grid-template-columns: 1fr; text-align: center; }
          .hero-cta-group { justify-content: center; }
          .hero-benefits { justify-content: center; }
        }

        .hero-h1 {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 800;
          color: #f8fafc;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 24px;
        }
        .hero-h1 span {
          color: #38bdf8;
        }

        .hero-p {
          font-size: 20px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 600px;
        }
        @media (max-width: 1024px) {
          .hero-p { margin-left: auto; margin-right: auto; }
        }

        .hero-cta-group {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .hero-btn-primary {
          background: #38bdf8;
          color: #0f172a;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .hero-btn-primary:hover {
          background: #7dd3fc;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(56, 189, 248, 0.2);
        }
        .hero-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .hero-benefits {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
        }
        .benefit-icon {
          color: #38bdf8;
        }

        .hero-visual {
          position: relative;
          z-index: 1;
        }
        .hero-mockup {
          background: #1e293b;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          aspect-ratio: 4/3;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .mockup-header {
          height: 32px;
          background: #334155;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 6px;
        }
        .mockup-dot { width: 8px; height: 8px; border-radius: 50%; background: #475569; }
        .mockup-content {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mockup-line { height: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; }
        .mockup-box { height: 80px; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.1); border-radius: 8px; }

        .hero-visual::before {
          content: '';
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
          filter: blur(40px);
          z-index: -1;
        }
      `}</style>

      <div className="hero-layout">
        <div className="hero-content">
          <div className="section-label">Enterprise-Grade Solution</div>
          <h1 className="hero-h1">
            Modernize Your <span>Field Operations</span> at Scale
          </h1>
          <p className="hero-p">
            The all-in-one ERP designed for inspection-heavy industries. Streamline workflows, 
            automate reporting, and gain real-time visibility into every field project.
          </p>

          <div className="hero-cta-group">
            <button className="hero-btn-primary" onClick={() => scrollToSection("#contact")}>
              Book a Demo
              <ArrowRight size={18} />
            </button>
            <button className="hero-btn-secondary" onClick={() => scrollToSection("#features")}>
              View Features
            </button>
          </div>

          <div className="hero-benefits">
            <div className="benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>Full Data Ownership</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>SOC2 Compliant</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 size={16} className="benefit-icon" />
              <span>99.9% Uptime SLA</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dot" />
              <div className="mockup-dot" />
              <div className="mockup-dot" />
            </div>
            <div className="mockup-content">
              <div style={{ display: "flex", gap: "12px" }}>
                <div className="mockup-box" style={{ flex: 1, height: "120px" }} />
                <div className="mockup-box" style={{ flex: 1, height: "120px" }} />
              </div>
              <div className="mockup-line" style={{ width: "40%" }} />
              <div className="mockup-line" style={{ width: "70%" }} />
              <div className="mockup-box" style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: "12px" }}>
                <div className="mockup-line" style={{ flex: 1 }} />
                <div className="mockup-line" style={{ flex: 1 }} />
                <div className="mockup-line" style={{ flex: 1 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

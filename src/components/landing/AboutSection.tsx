import { CheckCircle2, Shield, Zap, Globe } from "lucide-react";

const highlights = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for seamless operations at any scale.",
    grad: "linear-gradient(135deg, #EAB308, #FB923C)",
    glow: "rgba(234,179,8,0.3)",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption (AES-256) and full compliance.",
    grad: "linear-gradient(135deg, #0EA5E9, #6B21FF)",
    glow: "rgba(14,165,233,0.3)",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Multi-region deployment with full localization support.",
    grad: "linear-gradient(135deg, #2DD4BF, #0EA5E9)",
    glow: "rgba(45,212,191,0.3)",
  },
];

const checkItems = [
  "Scalable infrastructure for any business size",
  "Customizable workflows to match your needs",
  "Real-time analytics and reporting",
  "Secure data management with full compliance",
];

export function AboutSection() {
  return (
    <section id="about" style={{ position: "relative", background: "#0a0a12", padding: "120px 20px", overflow: "hidden" }}>
      <style>{`
        .about-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .about-layout { grid-template-columns: 1fr; gap: 40px; }
        }
        .about-content-side {}
        .about-check-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.7);
          margin-bottom: 14px;
        }
        .about-check-icon {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #A855F7, #6B21FF);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(107,33,255,0.4);
        }
        .about-glass-card {
          position: relative;
          padding: 36px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12);
          overflow: hidden;
          animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
        }
        .about-glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }
        .highlight-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: all 0.25s ease;
        }
        .highlight-row:first-child { padding-top: 0; }
        .highlight-row:last-child { border-bottom: none; padding-bottom: 0; }
        .highlight-row:hover .highlight-icon { transform: scale(1.1); }
        .highlight-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .highlight-title {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin: 0 0 4px;
        }
        .highlight-desc {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          margin: 0;
          line-height: 1.6;
        }
        .about-orb {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%);
          filter: blur(100px);
          left: -100px; bottom: 0;
          pointer-events: none;
          animation: orbDrift1 38s ease-in-out infinite alternate;
        }
      `}</style>

      <div className="about-orb" />

      <div className="about-layout" style={{ position: "relative", zIndex: 1 }}>
        {/* Content side */}
        <div className="about-content-side" style={{ animation: "fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both" }}>
          <span className="section-label">✦ About Our Platform</span>
          <h2 className="section-title" style={{ textAlign: "left", marginBottom: "20px" }}>
            Simplify Your<br />Business Operations
          </h2>
          <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "16px" }}>
            Vericore ERP is designed to transform how enterprises manage their operations.
            Our platform seamlessly integrates all aspects of your business — from client
            management and job requests to workflow automation and comprehensive reporting.
          </p>
          <p style={{ fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "36px" }}>
            Built for scalability, our solution adapts to businesses of all sizes. Whether
            you're a growing startup or an established enterprise, Vericore provides the
            flexibility and power you need to stay ahead.
          </p>

          <div>
            {checkItems.map((item, i) => (
              <div key={i} className="about-check-item">
                <div className="about-check-icon">
                  <CheckCircle2 size={12} color="white" strokeWidth={2.5} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Glass card */}
        <div className="about-glass-card">
          {highlights.map((h, i) => (
            <div key={i} className="highlight-row">
              <div
                className="highlight-icon"
                style={{ background: h.grad, boxShadow: `0 8px 24px ${h.glow}` }}
              >
                <h.icon size={22} color="white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="highlight-title">{h.title}</p>
                <p className="highlight-desc">{h.description}</p>
              </div>
            </div>
          ))}

          {/* Corner glow orbs */}
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(107,33,255,0.2)", filter: "blur(40px)", top: -20, right: -20 }} />
          <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "rgba(14,165,233,0.15)", filter: "blur(40px)", bottom: -20, left: -20 }} />
        </div>
      </div>
    </section>
  );
}

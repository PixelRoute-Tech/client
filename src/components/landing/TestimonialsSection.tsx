import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Operations Director",
    company: "TechFlow Inc.",
    content: "Vericore ERP transformed how we manage our operations. The workflow automation alone saved us 20+ hours per week. Absolutely game-changing.",
    rating: 5,
    initials: "SJ",
    avatarGrad: "linear-gradient(135deg, #6B21FF, #A855F7)",
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "GrowthWave Solutions",
    content: "We evaluated 10+ ERP solutions before choosing Vericore. The intuitive interface and powerful features made the decision easy. Our team adopted it within days.",
    rating: 5,
    initials: "MC",
    avatarGrad: "linear-gradient(135deg, #0EA5E9, #6B21FF)",
  },
  {
    name: "Emily Rodriguez",
    role: "CFO",
    company: "Nexus Enterprises",
    content: "The reporting capabilities are exceptional. Real-time financial insights have helped us make better decisions and improve our bottom line significantly.",
    rating: 5,
    initials: "ER",
    avatarGrad: "linear-gradient(135deg, #EC4899, #A855F7)",
  },
];

const clientLogos = ["TechFlow Inc.", "GrowthWave", "Nexus Ent.", "DataSync", "CloudFirst", "Innovate Co."];

export function TestimonialsSection() {
  return (
    <section style={{ position: "relative", background: "#0a0a12", padding: "120px 20px", overflow: "hidden" }}>
      <style>{`
        .testi-orb-1 {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%);
          filter: blur(100px);
          top: 0; left: -100px;
          pointer-events: none;
          animation: orbDrift3 36s ease-in-out infinite alternate;
        }
        .testi-orb-2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,33,255,0.16) 0%, transparent 70%);
          filter: blur(100px);
          bottom: 0; right: -60px;
          pointer-events: none;
          animation: orbDrift2 42s ease-in-out infinite alternate;
        }
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 64px auto 0;
        }
        @media (max-width: 1024px) { .testi-grid { grid-template-columns: 1fr; max-width: 440px; } }
        @media (max-width: 768px) { .testi-grid { grid-template-columns: 1fr; max-width: 440px; } }

        .testi-card {
          position: relative;
          padding: 32px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          animation: fadeUpIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
          overflow: hidden;
        }
        .testi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }
        .testi-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .testi-quote-mark {
          font-size: 72px;
          line-height: 1;
          color: rgba(168,85,247,0.25);
          font-family: Georgia, serif;
          margin: -16px 0 8px;
          display: block;
        }
        .testi-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 16px;
        }
        .testi-content {
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.7);
          line-height: 1.75;
          margin: 0 0 24px;
          font-style: italic;
        }
        .testi-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .testi-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: white;
          border: 1.5px solid rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        .testi-name {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin: 0 0 2px;
        }
        .testi-meta {
          font-size: 12px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          margin: 0;
        }
        .client-logos-strip {
          max-width: 1100px;
          margin: 72px auto 0;
          padding-top: 48px;
          border-top: 1px solid rgba(255,255,255,0.08);
          text-align: center;
        }
        .client-logos-label {
          font-size: 12px;
          font-weight: 400;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
        }
        .client-logos-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        .client-logo-chip {
          padding: 8px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.4);
          transition: all 0.25s ease;
          cursor: default;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .client-logo-chip:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="testi-orb-1" />
      <div className="testi-orb-2" />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <span className="section-label">✦ Testimonials</span>
        <h2 className="section-title">Loved by Businesses<br />Worldwide</h2>
        <p className="section-sub">
          See what our customers say about their experience with Vericore ERP.
        </p>
      </div>

      <div className="testi-grid" style={{ position: "relative", zIndex: 1 }}>
        {testimonials.map((t, index) => (
          <div key={index} className="testi-card" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
            <span className="testi-quote-mark">"</span>

            <div className="testi-stars">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={13} fill="#FBBF24" color="#FBBF24" />
              ))}
            </div>

            <p className="testi-content">{t.content}</p>

            <div className="testi-author">
              <div className="testi-avatar" style={{ background: t.avatarGrad }}>
                {t.initials}
              </div>
              <div>
                <p className="testi-name">{t.name}</p>
                <p className="testi-meta">{t.role} · {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="client-logos-strip" style={{ position: "relative", zIndex: 1 }}>
        <p className="client-logos-label">Trusted by leading companies worldwide</p>
        <div className="client-logos-row">
          {clientLogos.map((logo, i) => (
            <span key={i} className="client-logo-chip">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

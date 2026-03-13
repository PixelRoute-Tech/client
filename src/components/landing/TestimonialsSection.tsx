import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Operations Director",
    company: "Standard Inspection Group",
    content: "The workflow engine is exceptionally robust. We've managed to migrate 100% of our paper-based field forms into digital processes without losing any data integrity.",
  },
  {
    name: "Michael Chen",
    role: "Senior Project Manager",
    company: "Nexus Engineering",
    content: "Reporting that used to take us 3 days now happens automatically as field data is synced. The ROI on time-savings alone was evident within the first month.",
  },
  {
    name: "Emily Rodriguez",
    role: "Compliance Officer",
    company: "Global Safety Ltd",
    content: "Security was our primary concern when moving to a cloud ERP. Vericore's SOC2 compliance and transparent data ownership policies made them the clear choice.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ background: "#0f172a", padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <style>{`
        .testi-container { max-width: 1200px; margin: 0 auto; }
        .testi-grid-alt {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 64px;
        }
        @media (max-width: 1024px) { .testi-grid-alt { grid-template-columns: 1fr; max-width: 600px; margin: 0 auto; } }

        .trust-card {
          padding: 40px;
          background: #1e293b;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
        }
        .quote-icon-wrap { color: #38bdf8; opacity: 0.3; margin-bottom: 24px; }
        .testi-text {
          font-size: 16px;
          color: #cbd5e1;
          line-height: 1.7;
          font-style: italic;
          margin: 0 0 32px;
          flex-grow: 1;
        }
        .testi-profile { display: flex; align-items: center; gap: 16px; }
        .testi-profile-info { }
        .profile-name { display: block; font-size: 16px; font-weight: 700; color: #f8fafc; }
        .profile-role { font-size: 13px; color: #64748b; }
      `}</style>

      <div className="testi-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-label">Validation</span>
          <h2 className="section-title">High-Trust Partnerships</h2>
          <p className="section-sub">
            We work with the world's most demanding inspection and field service teams.
          </p>
        </div>

        <div className="testi-grid-alt">
          {testimonials.map((t, i) => (
            <div key={i} className="trust-card">
              <div className="quote-icon-wrap"><Quote size={32} /></div>
              <p className="testi-text">"{t.content}"</p>
              <div className="testi-profile">
                <div className="testi-profile-info">
                  <span className="profile-name">{t.name}</span>
                  <span className="profile-role">{t.role} · {t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

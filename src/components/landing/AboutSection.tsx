import { ShieldCheck, BarChart3, Workflow, Users2 } from "lucide-react";

const valueProps = [
  {
    icon: Workflow,
    title: "Integrated Workflows",
    description: "End-to-end management of jobs, from initial request to final report generation.",
  },
  {
    icon: BarChart3,
    title: "Actionable Insights",
    description: "Real-time dashboards that provide visibility into technician performance and job status.",
  },
  {
    icon: Users2,
    title: "Client Transparency",
    description: "Dedicated client portals that build trust through real-time updates and documentation access.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "AES-256 encryption and role-based access control to keep your business data secure.",
  },
];

export function AboutSection() {
  return (
    <section id="about" style={{ background: "#0f172a", padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <style>{`
        .about-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .about-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .about-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 48px;
        }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; }
        }

        .value-card {
          display: flex;
          gap: 20px;
          padding: 24px;
          border-radius: 12px;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .value-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56, 189, 248, 0.2);
        }
        .value-icon-wrap {
          width: 48px; height: 48px;
          border-radius: 10px;
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .value-title {
          font-size: 18px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 8px;
        }
        .value-desc {
          font-size: 15px;
          color: #94a3b8;
          margin: 0;
          line-height: 1.6;
        }

        .trust-banner {
          margin-top: 100px;
          padding: 48px;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        @media (max-width: 900px) {
          .trust-banner { flex-direction: column; text-align: center; }
        }
        .trust-content h3 {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 12px;
          color: #f8fafc;
        }
        .trust-stats {
          display: flex;
          gap: 40px;
        }
        .stat-item { text-align: center; }
        .stat-value {
          display: block;
          font-size: 32px;
          font-weight: 800;
          color: #38bdf8;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="about-container">
        <div className="about-header">
          <span className="section-label">Our Philosophy</span>
          <h2 className="section-title">Built for Performance, Not Fluff</h2>
          <p className="section-sub">
            Vericore was founded on a simple principle: enterprise management should be 
            efficient, transparent, and absolutely reliable.
          </p>
        </div>

        <div className="about-grid">
          {valueProps.map((prop, i) => (
            <div key={i} className="value-card">
              <div className="value-icon-wrap">
                <prop.icon size={24} />
              </div>
              <div>
                <h3 className="value-title">{prop.title}</h3>
                <p className="value-desc">{prop.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="trust-banner">
          <div className="trust-content">
            <h3>Reliability You Can Count On</h3>
            <p style={{ margin: 0 }}>We prioritize uptime and data integrity above all else.</p>
          </div>
          <div className="trust-stats">
            <div className="stat-item">
              <span className="stat-value">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">256-bit</span>
              <span className="stat-label">Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

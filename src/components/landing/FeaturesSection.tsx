import { UserPlus, ClipboardList, Wrench, FileBarChart, Users, Globe } from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "Onboarding System",
    description: "Multi-step client registration with built-in validation and automated verification flows.",
  },
  {
    icon: ClipboardList,
    title: "Job Lifecycle Tracking",
    description: "End-to-end project management with real-time status updates and priority queuing.",
  },
  {
    icon: Wrench,
    title: "Workflow Engine",
    description: "Define custom operational logic and data collection requirements for every field service type.",
  },
  {
    icon: FileBarChart,
    title: "Automated Reporting",
    description: "Generate compliant, professional reports instantly from field data collection points.",
  },
  {
    icon: Users,
    title: "Resource Allocation",
    description: "Assign technicians and equipment based on skill tags, availability, and geographic proximity.",
  },
  {
    icon: Globe,
    title: "Global Compliance",
    description: "Handle multi-currency, multi-language, and regional regulatory requirements out of the box.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" style={{ background: "#0f172a", padding: "120px 24px" }}>
      <style>{`
        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 64px;
        }
        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
        }

        .feature-box {
          padding: 32px;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .feature-box:hover {
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
        }
        .feature-icon-circle {
          width: 44px; height: 44px;
          border-radius: 8px;
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .feature-box-title {
          font-size: 18px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 12px;
          letter-spacing: -0.01em;
        }
        .feature-box-desc {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>

      <div className="features-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-label">Core Capabilities</span>
          <h2 className="section-title">Engineered for Complexity</h2>
          <p className="section-sub">
            The platform provides a suite of deeply integrated tools to manage every aspect of
            your enterprise operations with precision.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-box">
              <div className="feature-icon-circle">
                <f.icon size={20} />
              </div>
              <h3 className="feature-box-title">{f.title}</h3>
              <p className="feature-box-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

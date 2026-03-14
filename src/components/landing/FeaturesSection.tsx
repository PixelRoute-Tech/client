import { UserPlus, ClipboardList, Wrench, FileBarChart, Users, Settings } from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "Easy Client Onboarding",
    description: "Simple and fast client registration with automated workflows. Streamline your intake process at scale.",
    glow: "rgba(107,33,255,0.4)",
    iconBg: "linear-gradient(135deg, #6B21FF, #A855F7)",
  },
  {
    icon: ClipboardList,
    title: "Easy Job Request",
    description: "Create, track, and manage job requests effortlessly. Never lose sight of important tasks and deadlines.",
    glow: "rgba(14,165,233,0.4)",
    iconBg: "linear-gradient(135deg, #0EA5E9, #38bdf8)",
  },
  {
    icon: Wrench,
    title: "Customisable Work Builder",
    description: "Flexible workflow builder to match your unique business needs. Create templates and automate processes.",
    glow: "rgba(168,85,247,0.4)",
    iconBg: "linear-gradient(135deg, #A855F7, #EC4899)",
  },
  {
    icon: FileBarChart,
    title: "Report Generation",
    description: "Generate detailed operational and financial reports. Make data-driven decisions with powerful analytics.",
    glow: "rgba(251,146,60,0.4)",
    iconBg: "linear-gradient(135deg, #FB923C, #F43F5E)",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "Manage staff, roles, attendance, and performance. Keep your team organized and productive.",
    glow: "rgba(45,212,191,0.35)",
    iconBg: "linear-gradient(135deg, #2DD4BF, #0EA5E9)",
  },
  {
    icon: Settings,
    title: "System Integration",
    description: "Connect with your existing tools and platforms. Seamless API integrations for maximum efficiency.",
    glow: "rgba(148,163,184,0.3)",
    iconBg: "linear-gradient(135deg, #64748B, #94A3B8)",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" style={{ position: "relative", background: "#0a0a12", padding: "120px 20px", overflow: "hidden" }}>
      <style>{`
        .features-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .features-bg-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(107,33,255,0.2) 0%, transparent 70%);
          top: 0; right: -100px;
          animation: orbDrift2 40s ease-in-out infinite alternate;
        }
        .features-bg-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%);
          bottom: 0; left: -80px;
          animation: orbDrift1 34s ease-in-out infinite alternate;
        }
        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(168,85,247,0.12);
          border: 1px solid rgba(168,85,247,0.3);
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
          color: rgba(255,255,255,0.95);
          letter-spacing: -0.01em;
          margin: 0 0 16px;
          line-height: 1.15;
        }
        .section-sub {
          font-size: 16px;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 64px auto 0;
        }
        @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .features-grid { grid-template-columns: 1fr; } }

        .feature-card {
          position: relative;
          padding: 32px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
          cursor: default;
          animation: fadeUpIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
        }
        /* Shimmer sweep */
        .feature-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
          background-size: 200% 100%;
          background-position: 200% 0;
          transition: background-position 0.7s ease;
          border-radius: 24px;
          pointer-events: none;
        }
        .feature-card:hover::after {
          background-position: -200% 0;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .feature-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        .feature-card:hover .feature-icon-wrap {
          transform: scale(1.12);
        }
        .feature-title {
          font-size: 17px;
          font-weight: 500;
          color: rgba(255,255,255,0.92);
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }
        .feature-desc {
          font-size: 14px;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          margin: 0;
        }
        /* Glow on hover using CSS var */
        .feature-card:hover .feature-glow {
          opacity: 1;
        }
        .feature-glow {
          position: absolute;
          bottom: -60px; left: 50%;
          transform: translateX(-50%);
          width: 160px; height: 120px;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
      `}</style>

      <div className="features-bg-orb features-bg-orb-1" />
      <div className="features-bg-orb features-bg-orb-2" />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <span className="section-label">✦ Features</span>
        <h2 className="section-title">Everything You Need<br />to Succeed</h2>
        <p className="section-sub">
          Powerful tools designed to streamline your business operations and drive growth.
        </p>
      </div>

      <div className="features-grid" style={{ position: "relative", zIndex: 1 }}>
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            style={{ animationDelay: `${0.1 + index * 0.08}s` }}
          >
            <div
              className="feature-icon-wrap"
              style={{ background: feature.iconBg, boxShadow: `0 8px 24px ${feature.glow}` }}
            >
              <feature.icon size={24} color="white" strokeWidth={1.5} />
            </div>

            <div
              className="feature-glow"
              style={{ background: feature.glow }}
            />

            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

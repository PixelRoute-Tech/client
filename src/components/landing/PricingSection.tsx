import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Growth",
    description: "For scaling teams needing core automation",
    monthlyPrice: "$49",
    annualPrice: "$39",
    features: [
      "Up to 10 active technicians",
      "Full Job Request Lifecycle",
      "Standard Report Templates",
      "5GB Secure Document storage",
      "Core API access",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Pro",
    description: "Advanced controls for established firms",
    monthlyPrice: "$99",
    annualPrice: "$79",
    features: [
      "Up to 50 active technicians",
      "Custom Workflow Builder",
      "Advanced Analytics Engine",
      "50GB Secure Document storage",
      "Full API & Webhooks Access",
      "Priority Support (4h SLA)",
      "Employee Performance Tracking",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Enterprise",
    description: "Maximum control and custom delivery",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    features: [
      "Unlimited users & storage",
      "On-premise deployment option",
      "White-label capabilities",
      "Custom integration dev",
      "Dedicated Account Manager",
      "99.99% Uptime SLA",
      "SSO & Directory Sync",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" style={{ background: "#0f172a", padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <style>{`
        .pricing-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 64px;
        }
        @media (max-width: 1024px) {
          .pricing-grid { grid-template-columns: 1fr; max-width: 500px; margin-left: auto; margin-right: auto; }
        }

        .pricing-tier {
          padding: 40px;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .pricing-tier.highlight {
          border-color: #38bdf8;
          box-shadow: 0 20px 40px -20px rgba(56, 189, 248, 0.3);
          background: #1e293b;
        }
        .highlight-tag {
          position: absolute;
          top: -12px; left: 50%;
          transform: translateX(-50%);
          background: #38bdf8;
          color: #0f172a;
          padding: 2px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .plan-header h3 { font-size: 20px; font-weight: 700; color: #f8fafc; margin: 0 0 8px; }
        .plan-header p { font-size: 14px; color: #94a3b8; margin: 0 0 24px; line-height: 1.4; }

        .plan-price-wrap { display: flex; align-items: baseline; gap: 4px; margin-bottom: 32px; }
        .price-val { font-size: 40px; font-weight: 800; color: #f8fafc; letter-spacing: -0.02em; }
        .price-term { font-size: 14px; color: #64748b; font-weight: 500; }

        .feature-list { list-style: none; padding: 0; margin: 0 0 40px; display: flex; flex-direction: column; gap: 14px; flex-grow: 1; }
        .feature-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: #cbd5e1; }
        .check-icon { color: #38bdf8; flex-shrink: 0; margin-top: 2px; }

        .pricing-cta-btn {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
        }
        .pricing-cta-btn:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); }
        
        .pricing-tier.highlight .pricing-cta-btn {
          background: #38bdf8;
          color: #0f172a;
          border: none;
        }
        .pricing-tier.highlight .pricing-cta-btn:hover { background: #7dd3fc; }
      `}</style>

      <div className="pricing-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-label">Pricing Plans</span>
          <h2 className="section-title">Transparent & Scalable</h2>
          <p className="section-sub">
            No hidden fees. Choose a plan that fits your current needs and scale when you're ready.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`pricing-tier ${plan.highlight ? "highlight" : ""}`}>
              {plan.highlight && <div className="highlight-tag">Recommended</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>

              <div className="plan-price-wrap">
                <span className="price-val">{plan.monthlyPrice}</span>
                {plan.monthlyPrice !== "Custom" && <span className="price-term">/month/seat</span>}
              </div>

              <ul className="feature-list">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="feature-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button className="pricing-cta-btn">
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

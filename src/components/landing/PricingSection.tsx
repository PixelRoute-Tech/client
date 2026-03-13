import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Gold",
    tagline: "Perfect for small teams",
    price: "$49",
    period: "/month",
    features: [
      "Core ERP features",
      "Up to 5 users",
      "Standard support",
      "5 GB storage",
      "Email notifications",
      "Basic reporting",
    ],
    cta: "Start Free Trial",
    popular: false,
    glowColor: "rgba(234,179,8,0.25)",
    accentColor: "#EAB308",
  },
  {
    name: "Diamond",
    tagline: "Best for growing businesses",
    price: "$99",
    period: "/month",
    features: [
      "Advanced ERP features",
      "Up to 25 users",
      "Priority support",
      "50 GB storage",
      "Advanced analytics",
      "Custom workflows",
      "API access",
      "Team collaboration",
    ],
    cta: "Subscribe Now",
    popular: true,
    glowColor: "rgba(107,33,255,0.35)",
    accentColor: "#A855F7",
  },
  {
    name: "Platinum",
    tagline: "For large enterprises",
    price: "Custom",
    period: "",
    features: [
      "Full ERP features",
      "Unlimited users",
      "Dedicated support",
      "Unlimited storage",
      "Custom integrations",
      "White-label option",
      "SLA guarantee",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    popular: false,
    glowColor: "rgba(148,163,184,0.2)",
    accentColor: "#94A3B8",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" style={{ position: "relative", background: "#0a0a12", padding: "120px 20px", overflow: "hidden" }}>
      <style>{`
        .pricing-orb-1 {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,33,255,0.18) 0%, transparent 70%);
          filter: blur(100px);
          top: -100px; left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          animation: orbDrift1 38s ease-in-out infinite alternate;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1060px;
          margin: 64px auto 0;
          align-items: center;
        }
        @media (max-width: 1024px) { .pricing-grid { grid-template-columns: 1fr; max-width: 440px; } }

        .pricing-card {
          position: relative;
          padding: 36px 32px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          animation: fadeUpIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
          overflow: hidden;
        }
        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }
        .pricing-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .pricing-card.popular {
          background: rgba(255,255,255,0.09);
          border-color: rgba(168,85,247,0.35);
          transform: scale(1.04);
          box-shadow: 0 24px 80px rgba(107,33,255,0.3), inset 0 1px 0 rgba(255,255,255,0.14);
        }
        .pricing-card.popular:hover {
          transform: scale(1.04) translateY(-6px);
        }
        .popular-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          background: linear-gradient(135deg, rgba(107,33,255,0.5), rgba(168,85,247,0.5));
          border: 1px solid rgba(168,85,247,0.4);
          border-radius: 50px;
          font-size: 11px;
          font-weight: 600;
          color: #e9d5ff;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .plan-name {
          font-size: 28px;
          font-weight: 200;
          color: rgba(255,255,255,0.92);
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .plan-tagline {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          margin: 0 0 28px;
        }
        .plan-price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .plan-price {
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 200;
          color: rgba(255,255,255,0.95);
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }
        .plan-period {
          font-size: 14px;
          font-weight: 300;
          color: rgba(255,255,255,0.4);
        }
        .plan-features {
          list-style: none;
          padding: 0; margin: 0 0 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .plan-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
        }
        .plan-feature-check {
          width: 18px; height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .plan-cta {
          width: 100%;
          padding: 13px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          letter-spacing: 0.01em;
          border: none;
        }
        .plan-cta.solid {
          background: rgba(255,255,255,0.88);
          color: #0a0a12;
          box-shadow: 0 0 30px rgba(255,255,255,0.1);
        }
        .plan-cta.solid:hover {
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255,255,255,0.2);
        }
        .plan-cta.ghost {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .plan-cta.ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }
        .plan-cta:active { transform: scale(0.97) !important; }

        .pricing-footer-strip {
          max-width: 1060px;
          margin: 48px auto 0;
          text-align: center;
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.35);
        }
      `}</style>

      <div className="pricing-orb-1" />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <span className="section-label">✦ Pricing</span>
        <h2 className="section-title">Choose Your Plan</h2>
        <p className="section-sub">
          Flexible pricing designed to scale with your business needs.
        </p>
      </div>

      <div className="pricing-grid" style={{ position: "relative", zIndex: 1 }}>
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card ${plan.popular ? "popular" : ""}`}
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="popular-badge">
                <Sparkles size={10} />
                Most Popular
              </div>
            )}

            <h3 className="plan-name">{plan.name}</h3>
            <p className="plan-tagline">{plan.tagline}</p>

            <div className="plan-price-row">
              <span className="plan-price">{plan.price}</span>
              <span className="plan-period">{plan.period}</span>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, fi) => (
                <li key={fi} className="plan-feature">
                  <span
                    className="plan-feature-check"
                    style={{ background: `${plan.accentColor}22`, boxShadow: `0 0 8px ${plan.glowColor}` }}
                  >
                    <Check size={11} color={plan.accentColor} strokeWidth={2.5} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`plan-cta ${plan.popular ? "solid" : "ghost"}`}>
              {plan.cta}
            </button>

            {/* Ambient glow */}
            <div style={{
              position: "absolute",
              bottom: -40, left: "50%",
              transform: "translateX(-50%)",
              width: 200, height: 80,
              borderRadius: "50%",
              background: plan.glowColor,
              filter: "blur(40px)",
              pointerEvents: "none",
            }} />
          </div>
        ))}
      </div>

      <p className="pricing-footer-strip">
        All plans include a 14-day free trial. No credit card required.
      </p>
    </section>
  );
}

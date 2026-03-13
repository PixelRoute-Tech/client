import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#0a0a12", paddingTop: "80px" }}>
      <style>{`
        /* ─── Animated gradient orbs ─── */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          will-change: transform;
        }
        .hero-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(107,33,255,0.55) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: orbDrift1 35s ease-in-out infinite alternate;
        }
        .hero-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 70%);
          top: 30%; right: -80px;
          animation: orbDrift2 42s ease-in-out infinite alternate;
        }
        .hero-orb-3 {
          width: 450px; height: 450px;
          background: radial-gradient(circle, rgba(236,72,153,0.35) 0%, transparent 70%);
          bottom: -80px; left: 30%;
          animation: orbDrift3 28s ease-in-out infinite alternate;
        }
        .hero-orb-4 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%);
          top: 50%; left: 10%;
          animation: orbDrift4 38s ease-in-out infinite alternate;
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

        /* ─── Grain texture ─── */
        .hero-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ─── Floating particles ─── */
        .hero-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          pointer-events: none;
          animation: particleFloat linear infinite;
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }

        /* ─── Glass card ─── */
        .hero-glass-card {
          position: relative;
          max-width: 700px;
          width: 100%;
          padding: 60px 48px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 32px;
          box-shadow:
            0 32px 80px rgba(0,0,0,0.4),
            0 2px 0 rgba(255,255,255,0.08) inset,
            0 0 0 1px rgba(255,255,255,0.06) inset;
          text-align: center;
          animation: heroCardIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
          overflow: hidden;
        }
        @keyframes heroCardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        /* Specular highlight */
        .hero-glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        }
        /* Inner shimmer sweep on hover */
        .hero-glass-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%);
          background-size: 200% 100%;
          background-position: 200% 0;
          transition: background-position 0.8s ease;
          border-radius: 32px;
          pointer-events: none;
        }
        .hero-glass-card:hover::after {
          background-position: -200% 0;
        }

        /* ─── Pill badges ─── */
        .hero-badges {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 32px;
          animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.02em;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          display: inline-block;
        }
        .hero-badge-dot.purple { background: #A855F7; box-shadow: 0 0 8px #A855F7; }
        .hero-badge-dot.mint   { background: #2dd4bf; box-shadow: 0 0 8px #2dd4bf; }

        /* ─── Headline ─── */
        .hero-headline {
          font-size: clamp(42px, 6vw, 80px);
          font-weight: 200;
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: rgba(255,255,255,0.95);
          margin: 0 0 20px;
          animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
        }
        .hero-headline-accent {
          font-weight: 300;
          background: linear-gradient(135deg, #c084fc, #38bdf8, #fb7185);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% auto;
          animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both, gradientShift 6s ease infinite alternate;
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        /* ─── Subheadline ─── */
        .hero-sub {
          font-size: clamp(15px, 2vw, 18px);
          font-weight: 300;
          color: rgba(255,255,255,0.55);
          margin: 0 0 40px;
          line-height: 1.7;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
        }

        /* ─── CTA Buttons ─── */
        .hero-ctas {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both;
        }
        .btn-primary-glass {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: rgba(255,255,255,0.88);
          color: #0a0a12;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 30px rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.3);
          letter-spacing: 0.01em;
        }
        .btn-primary-glass:hover {
          background: #ffffff;
          box-shadow: 0 0 50px rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.4);
          transform: translateY(-2px);
        }
        .btn-primary-glass:active { transform: scale(0.97) translateY(0); }
        .btn-ghost-glass {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          letter-spacing: 0.01em;
        }
        .btn-ghost-glass:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.35);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .btn-ghost-glass:active { transform: scale(0.97) translateY(0); }

        /* ─── Stats bar ─── */
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-top: 48px;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.1);
          animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;
        }
        .hero-stat {
          text-align: center;
          position: relative;
        }
        .hero-stat:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0; top: 15%; bottom: 15%;
          width: 1px;
          background: rgba(255,255,255,0.1);
        }
        .hero-stat-value {
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 200;
          color: rgba(255,255,255,0.95);
          letter-spacing: -0.02em;
          display: block;
          font-variant-numeric: tabular-nums;
        }
        .hero-stat-label {
          font-size: 12px;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
          display: block;
        }

        /* ─── Scroll indicator ─── */
        .scroll-indicator {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: fadeUpIn 1s ease 1.2s both;
          cursor: pointer;
        }
        .scroll-mouse {
          width: 24px; height: 40px;
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }
        .scroll-dot {
          width: 3px; height: 8px;
          background: rgba(255,255,255,0.5);
          border-radius: 2px;
          animation: scrollBounce 2s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.4; }
        }
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .hero-glass-card { padding: 40px 24px; border-radius: 24px; }
          .hero-stats { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .hero-stat:not(:last-child)::after { display: none; }
        }
      `}</style>

      {/* Gradient orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="hero-orb hero-orb-4" />

      {/* Grain texture */}
      <div className="hero-grain" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="hero-particle"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${8 + i * 8}%`,
            bottom: `${10 + (i % 4) * 15}%`,
            animationDuration: `${8 + i * 1.4}s`,
            animationDelay: `${i * 0.6}s`,
            opacity: 0,
          }}
        />
      ))}

      {/* Main glass card */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", padding: "0 20px", display: "flex", justifyContent: "center" }}>
        <div className="hero-glass-card">
          {/* Pill badges */}
          <div className="hero-badges">
            <span className="hero-badge">
              <span className="hero-badge-dot mint" />
              Trusted by 500+ Enterprises
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            The Smarter Way to{" "}
            <span className="hero-headline-accent">Run Your Enterprise</span>
          </h1>

          {/* Sub */}
          <p className="hero-sub">
            Streamline operations, automate workflows, and gain real-time insights.
            Vericore Inspections ERP brings everything together — beautifully.
          </p>

          {/* CTAs */}
          <div className="hero-ctas">
            <button className="btn-primary-glass" onClick={() => scrollToSection("#contact")}>
              Book a Demo
              <ArrowRight size={16} />
            </button>
            <button className="btn-ghost-glass" onClick={() => scrollToSection("#features")}>
              <Sparkles size={15} />
              Explore Features
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { value: "500+", label: "Enterprises" },
              { value: "99.9%", label: "Uptime" },
              { value: "50+", label: "Integrations" },
              { value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-value">{stat.value}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" onClick={() => scrollToSection("#features")}>
        <div className="scroll-mouse">
          <div className="scroll-dot" />
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        .nav-pill {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%) scale(0.96);
          z-index: 100;
          animation: navPillIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
          opacity: 0;
          width: calc(100% - 40px);
          max-width: 900px;
        }
        @keyframes navPillIn {
          to { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        .nav-inner {
          background: rgba(10, 10, 18, 0.55);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 100px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.4s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.14);
          position: relative;
          overflow: hidden;
        }
        .nav-inner::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        }
        .nav-inner.scrolled {
          background: rgba(10, 10, 18, 0.8);
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6B21FF, #A855F7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: white;
          box-shadow: 0 0 20px rgba(107,33,255,0.5);
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.95);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 13.5px;
          font-weight: 400;
          padding: 6px 14px;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .nav-link-btn:hover {
          color: rgba(255,255,255,0.95);
          background: rgba(255,255,255,0.08);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-login-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 400;
          padding: 6px 12px;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-login-btn:hover {
          color: rgba(255,255,255,0.95);
        }
        .nav-cta {
          background: rgba(255,255,255,0.9);
          color: #0a0a12;
          border: none;
          border-radius: 50px;
          padding: 7px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 12px rgba(255,255,255,0.2);
          white-space: nowrap;
        }
        .nav-cta:hover {
          background: #ffffff;
          transform: scale(1.04);
          box-shadow: 0 4px 20px rgba(255,255,255,0.3);
        }
        .nav-cta:active { transform: scale(0.97); }
        .mobile-menu-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.8);
          transition: all 0.2s ease;
        }
        .mobile-menu-btn:hover {
          background: rgba(255,255,255,0.14);
        }
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 20px;
          right: 20px;
          z-index: 99;
          background: rgba(10, 10, 18, 0.85);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
          animation: mobileMenuIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .mobile-nav-link {
          display: block;
          width: 100%;
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          font-size: 15px;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.08);
        }
        .mobile-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 8px 0;
        }
        .mobile-cta {
          width: 100%;
          background: rgba(255,255,255,0.9);
          color: #0a0a12;
          border: none;
          border-radius: 12px;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-top: 4px;
        }
        .mobile-cta:hover { background: #fff; }
        @media (min-width: 1024px) {
          .mobile-menu-btn { display: none; }
          .nav-links { display: flex; }
        }
        @media (max-width: 1023px) {
          .nav-links { display: none; }
          .nav-actions { display: none; }
        }
        @media (max-width: 640px) {
          .nav-logo-text { display: none; }
        }
      `}</style>

      <nav className="nav-pill">
        <div className={`nav-inner ${isScrolled ? "scrolled" : ""}`}>
          <div className="nav-logo">
            <div className="nav-logo-icon">V</div>
            <span className="nav-logo-text">Vericore Inspections</span>
          </div>

          <div className="nav-links">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="nav-link-btn"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="nav-login-btn">
                <LogIn size={14} />
                Login
              </button>
            </Link>
            <button className="nav-cta" onClick={() => scrollToSection("#pricing")}>
              Get Started
            </button>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              className="mobile-nav-link"
            >
              {item.label}
            </button>
          ))}
          <div className="mobile-divider" />
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button className="mobile-nav-link">Login →</button>
          </Link>
          <button className="mobile-cta" onClick={() => { setIsMobileMenuOpen(false); scrollToSection("#pricing"); }}>
            Get Started
          </button>
        </div>
      )}
    </>
  );
}

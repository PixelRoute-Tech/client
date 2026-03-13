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
      setIsScrolled(window.scrollY > 10);
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
        .header-main {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }
        .header-main.scrolled {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 0;
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .v-logo-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-weight: 800;
          font-size: 20px;
          margin-right: 12px;
        }
        .v-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-link-item {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-link-item:hover {
          color: #f8fafc;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .btn-secondary {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #f8fafc;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .btn-primary {
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          background: #38bdf8;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: #7dd3fc;
          transform: translateY(-1px);
        }

        .mobile-toggle {
          display: none;
          color: #94a3b8;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .nav-links-desktop, .nav-actions { display: none; }
          .mobile-toggle { display: block; }
        }

        .mobile-nav-panel {
          position: fixed;
          top: 0; left: 0; bottom: 0; right: 0;
          background: #0f172a;
          z-index: 200;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <header className={`header-main ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <div style={{ display: "flex", alignItems: "center" }} onClick={() => scrollToSection("#hero")}>
            <div className="v-logo-icon">V</div>
            <span className="v-logo-text">Vericore</span>
          </div>

          <nav className="nav-links-desktop">
            {navItems.map((item) => (
              <button key={item.label} onClick={() => scrollToSection(item.href)} className="nav-link-item">
                {item.label}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="btn-secondary">
                <LogIn size={14} />
                Sign In
              </button>
            </Link>
            <button className="btn-primary" onClick={() => scrollToSection("#pricing")}>
              Get Started
            </button>
          </div>

          <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-nav-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="v-logo-icon">V</div>
              <span className="v-logo-text">Vericore</span>
            </div>
            <X size={24} color="#94a3b8" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px" }}>
            {navItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => scrollToSection(item.href)} 
                className="nav-link-item" 
                style={{ fontSize: "18px", textAlign: "left", padding: "12px 0" }}>
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "auto" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
                Sign In
              </button>
            </Link>
            <button className="btn-primary" style={{ width: "100%", padding: "14px" }} onClick={() => scrollToSection("#pricing")}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import { Link } from "react-router-dom";
import { Linkedin, Twitter, Facebook, Github, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Case Studies", href: "#testimonials" },
    { label: "Documentation", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Security", href: "#support" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "API Status", href: "#" },
    { label: "System Uptime", href: "#" },
    { label: "Contact Sales", href: "#contact" },
  ],
};

export function FooterSection() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer style={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px 40px" }}>
      <style>{`
        .footer-wrap { max-width: 1200px; margin: 0 auto; }
        .footer-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 64px;
          margin-bottom: 80px;
        }
        @media (max-width: 1024px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr; gap: 48px; }
        }
        @media (max-width: 640px) {
          .footer-main-grid { grid-template-columns: 1fr; }
        }

        .footer-brand { }
        .footer-logo-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .f-logo-box {
          width: 32px; height: 32px; border-radius: 6px; background: #38bdf8;
          display: flex; align-items: center; justify-content: center;
          color: #0f172a; font-weight: 800; font-size: 18px;
        }
        .f-logo-text { font-size: 20px; font-weight: 700; color: #f8fafc; letter-spacing: -0.02em; }
        .footer-desc { font-size: 14px; color: #64748b; line-height: 1.6; max-width: 300px; margin-bottom: 24px; }

        .footer-col-head {
          font-size: 12px; font-weight: 700; color: #f8fafc; text-transform: uppercase;
          letter-spacing: 0.1em; margin-bottom: 24px;
        }
        .footer-nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .footer-nav-link {
          font-size: 14px; color: #64748b; text-decoration: none; transition: color 0.2s;
          background: none; border: none; cursor: pointer; text-align: left; padding: 0;
        }
        .footer-nav-link:hover { color: #38bdf8; }

        .footer-social-strip {
          display: flex; gap: 12px;
        }
        .social-link-btn {
          width: 36px; height: 36px; border-radius: 6px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05); color: #64748b;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .social-link-btn:hover { background: #38bdf8; color: #0f172a; border-color: #38bdf8; }

        .footer-bottom-strip {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #475569;
          font-size: 13px;
        }
        @media (max-width: 640px) {
          .footer-bottom-strip { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="footer-wrap">
        <div className="footer-main-grid">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <div className="f-logo-box">V</div>
              <span className="f-logo-text">Vericore</span>
            </div>
            <p className="footer-desc">
              The modern operating system for field-heavy enterprises. Engineered for 
              reliability, transparency, and architectural excellence.
            </p>
            <div className="footer-social-strip">
              <a href="#" className="social-link-btn"><Linkedin size={18} /></a>
              <a href="#" className="social-link-btn"><Twitter size={18} /></a>
              <a href="#" className="social-link-btn"><Github size={18} /></a>
              <a href="#" className="social-link-btn"><Mail size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-head">Product</h4>
            <ul className="footer-nav-list">
              {footerLinks.product.map((l, i) => (
                <li key={i}><button onClick={() => scrollToSection(l.href)} className="footer-nav-link">{l.label}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-col-head">Company</h4>
            <ul className="footer-nav-list">
              {footerLinks.company.map((l, i) => (
                <li key={i}><button onClick={() => scrollToSection(l.href)} className="footer-nav-link">{l.label}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-col-head">Support</h4>
            <ul className="footer-nav-list">
              {footerLinks.support.map((l, i) => (
                <li key={i}><button onClick={() => scrollToSection(l.href)} className="footer-nav-link">{l.label}</button></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom-strip">
          <span>© {new Date().getFullYear()} Vericore Operations Corp. All rights reserved.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <button className="footer-nav-link">Privacy</button>
            <button className="footer-nav-link">Terms</button>
            <button className="footer-nav-link">Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";
import { Linkedin, Twitter, Facebook, Youtube, Github } from "lucide-react";

const footerLinks = {
  product: [
    { label: "About ERP", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Book a Demo", href: "#contact" },
  ],
  documentation: [
    { label: "User Guide", href: "#documentation" },
    { label: "API Documentation", href: "#documentation" },
    { label: "Setup & Installation", href: "#documentation" },
    { label: "Release Notes", href: "#documentation" },
  ],
  support: [
    { label: "Help Center", href: "#support" },
    { label: "FAQs", href: "#support" },
    { label: "Contact Support", href: "#contact" },
    { label: "Raise a Ticket", href: "#contact" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function FooterSection() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="documentation" style={{ position: "relative", background: "#0a0a12", borderTop: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
      <style>{`
        .footer-glass-inner {
          position: relative;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
        .footer-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .footer-orb-1 {
          width: 400px; height: 300px;
          background: radial-gradient(circle, rgba(107,33,255,0.12) 0%, transparent 70%);
          top: -80px; right: 10%;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          padding: 72px 40px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; padding: 48px 24px 40px; gap: 32px; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; padding: 40px 20px 32px; }
        }
        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .footer-brand-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6B21FF, #A855F7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: white;
          box-shadow: 0 0 20px rgba(107,33,255,0.4);
          flex-shrink: 0;
        }
        .footer-brand-name {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          letter-spacing: -0.01em;
        }
        .footer-brand-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.04em;
        }
        .footer-brand-desc {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.4);
          line-height: 1.75;
          margin: 0 0 20px;
          max-width: 300px;
        }
        .footer-contact-line {
          font-size: 12px;
          font-weight: 300;
          color: rgba(255,255,255,0.35);
          line-height: 1.8;
          margin: 0;
        }
        .footer-contact-line a {
          color: #c084fc;
          text-decoration: none;
        }
        .footer-col-title {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 20px;
        }
        .footer-link-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-link-btn {
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 0;
          text-align: left;
          transition: color 0.2s ease;
          letter-spacing: 0.01em;
        }
        .footer-link-btn:hover { color: rgba(255,255,255,0.8); }
        .footer-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 40px;
          max-width: calc(1200px - 80px);
          margin-left: auto;
          margin-right: auto;
        }
        @media (max-width: 640px) {
          .footer-divider { margin: 0 20px; }
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding: 24px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 640px) {
          .footer-bottom { padding: 20px; flex-direction: column; align-items: flex-start; }
        }
        .footer-copyright {
          font-size: 12px;
          font-weight: 300;
          color: rgba(255,255,255,0.3);
        }
        .footer-legal {
          display: flex;
          gap: 16px;
        }
        .footer-legal-btn {
          background: none;
          border: none;
          font-size: 12px;
          font-weight: 300;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .footer-legal-btn:hover { color: rgba(255,255,255,0.7); }
        .footer-socials {
          display: flex;
          gap: 8px;
        }
        .footer-social-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: all 0.25s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .footer-social-icon:hover {
          background: rgba(107,33,255,0.3);
          border-color: rgba(168,85,247,0.4);
          color: rgba(255,255,255,0.9);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(107,33,255,0.3);
        }
      `}</style>

      <div className="footer-glass-inner">
        <div className="footer-orb footer-orb-1" />

        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-logo">
              <div className="footer-brand-icon">V</div>
              <div>
                <div className="footer-brand-name">Vericore Inspections</div>
                <div className="footer-brand-sub">ERP Solution</div>
              </div>
            </div>
            <p className="footer-brand-desc">
              Streamline your business operations with our comprehensive ERP platform.
              From client management to advanced analytics — all in one place.
            </p>
            <p className="footer-contact-line">
              123 Business Avenue, Suite 500<br />
              San Francisco, CA 94102<br />
              <a href="mailto:sales@vericore-erp.com">sales@vericore-erp.com</a><br />
              +1 (800) VERICOR-1
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-link-list">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <button onClick={() => scrollToSection(link.href)} className="footer-link-btn">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="footer-col-title">Documentation</h4>
            <ul className="footer-link-list">
              {footerLinks.documentation.map((link) => (
                <li key={link.label}>
                  <button onClick={() => scrollToSection(link.href)} className="footer-link-btn">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer-col-title">Support & Help</h4>
            <ul className="footer-link-list">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <button onClick={() => scrollToSection(link.href)} className="footer-link-btn">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Vericore Inspections ERP. All rights reserved.
          </p>
          <div className="footer-legal">
            <button className="footer-legal-btn">Terms & Conditions</button>
            <button className="footer-legal-btn">Privacy Policy</button>
          </div>
          <div className="footer-socials">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} className="footer-social-icon" aria-label={s.label}>
                <s.icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

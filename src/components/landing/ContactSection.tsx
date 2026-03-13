import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="contact" style={{ position: "relative", background: "#0a0a12", padding: "120px 20px", overflow: "hidden" }}>
      <style>{`
        .contact-orb {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%);
          filter: blur(100px);
          bottom: -100px; left: -100px;
          pointer-events: none;
          animation: orbDrift1 45s ease-in-out infinite alternate;
        }
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 64px;
          max-width: 1100px;
          margin: 64px auto 0;
          align-items: center;
        }
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr; gap: 48px; }
        }
        .contact-info-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .contact-info-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
        }
        .contact-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(107,33,255,0.2), rgba(168,85,247,0.2));
          border: 1px solid rgba(168,85,247,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #c084fc;
        }
        .contact-info-title {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin: 0 0 4px;
        }
        .contact-info-text {
          font-size: 14px;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        a.contact-info-text:hover { color: #c084fc; }

        .contact-form-card {
          position: relative;
          padding: 40px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 32px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12);
          overflow: hidden;
        }
        .contact-form-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        }
        .contact-input-group { margin-bottom: 20px; }
        .contact-label {
          display: block;
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.7);
          margin-bottom: 8px;
          padding-left: 4px;
        }
        .contact-input, .contact-textarea {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          color: white;
          transition: all 0.3s ease;
          outline: none;
          font-family: inherit;
        }
        .contact-input:focus, .contact-textarea:focus {
          background: rgba(0,0,0,0.4);
          border-color: rgba(168,85,247,0.5);
          box-shadow: 0 0 0 4px rgba(168,85,247,0.1);
        }
        .contact-input::placeholder, .contact-textarea::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .contact-textarea { resize: vertical; min-height: 100px; }
        .contact-submit-btn {
          width: 100%;
          padding: 16px;
          background: rgba(255,255,255,0.9);
          color: #0a0a12;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
        }
        .contact-submit-btn:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,255,255,0.2);
        }
        .contact-submit-btn:active { transform: scale(0.98); }
        .contact-success-state {
          text-align: center;
          padding: 40px 20px;
          animation: fadeUpIn 0.5s ease both;
        }
        .contact-success-icon {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(45,212,191,0.15);
          border: 1px solid rgba(45,212,191,0.3);
          color: #2dd4bf;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 0 32px rgba(45,212,191,0.2);
        }
      `}</style>

      <div className="contact-orb" />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <span className="section-label">✦ Get In Touch</span>
        <h2 className="section-title">Book a Demo</h2>
        <p className="section-sub">
          Ready to transform your business operations? Schedule a personalized demo today.
        </p>
      </div>

      <div className="contact-layout" style={{ position: "relative", zIndex: 1 }}>
        <div>
          <div className="contact-info-card">
            <div className="contact-icon-wrap"><Mail size={20} /></div>
            <div>
              <p className="contact-info-title">Email Us</p>
              <a href="mailto:sales@vericore-erp.com" className="contact-info-text">sales@vericore-erp.com</a>
            </div>
          </div>
          
          <div className="contact-info-card">
            <div className="contact-icon-wrap"><Phone size={20} /></div>
            <div>
              <p className="contact-info-title">Call Us</p>
              <a href="tel:+1-800-VERICOR" className="contact-info-text">+1 (800) VERICOR-1</a>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon-wrap"><MapPin size={20} /></div>
            <div>
              <p className="contact-info-title">Visit Us</p>
              <p className="contact-info-text">123 Business Avenue, Suite 500<br/>San Francisco, CA 94102</p>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          {isSubmitted ? (
            <div className="contact-success-state">
              <div className="contact-success-icon">
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: "28px", fontWeight: 200, color: "white", marginBottom: "16px" }}>Thank You!</h3>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.6 }}>
                Your demo request has been submitted. Our team will reach out within 24 hours.
              </p>
              <button 
                className="contact-submit-btn" 
                style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "none" }}
                onClick={() => setIsSubmitted(false)}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="contact-input-group">
                  <label className="contact-label">First Name</label>
                  <input type="text" className="contact-input" placeholder="John" required />
                </div>
                <div className="contact-input-group">
                  <label className="contact-label">Last Name</label>
                  <input type="text" className="contact-input" placeholder="Doe" required />
                </div>
              </div>

              <div className="contact-input-group">
                <label className="contact-label">Work Email</label>
                <input type="email" className="contact-input" placeholder="john@company.com" required />
              </div>
              
              <div className="contact-input-group">
                <label className="contact-label">Company Name</label>
                <input type="text" className="contact-input" placeholder="Your Company" required />
              </div>

              <div className="contact-input-group">
                <label className="contact-label">Message (Optional)</label>
                <textarea className="contact-textarea" placeholder="Tell us about your needs..." rows={4}></textarea>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : <><Send size={18} /> Request Demo</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

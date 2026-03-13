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
    <section id="contact" style={{ background: "#0f172a", padding: "120px 24px" }}>
      <style>{`
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 80px;
        }
        @media (max-width: 900px) {
          .contact-container { grid-template-columns: 1fr; gap: 48px; }
        }

        .contact-content h2 {
          font-size: 36px;
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 16px;
        }
        .contact-content p {
          font-size: 18px;
          color: #94a3b8;
          margin: 0 0 48px;
        }

        .contact-method {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }
        .method-icon {
          width: 40px; height: 40px;
          border-radius: 8px;
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .method-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        .method-value {
          font-size: 16px;
          color: #cbd5e1;
          text-decoration: none;
        }

        .contact-form-box {
          background: #1e293b;
          padding: 40px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .input-group { margin-bottom: 16px; }
        .input-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #94a3b8;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .form-input:focus { border-color: #38bdf8; }
        .form-textarea { min-height: 120px; resize: vertical; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #38bdf8;
          color: #0f172a;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .submit-btn:hover { background: #7dd3fc; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .success-wrapper {
          text-align: center;
          padding: 24px 0;
        }
        .success-icon-bg {
          width: 64px; height: 64px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
      `}</style>

      <div className="contact-container">
        <div className="contact-content">
          <span className="section-label">Contact Us</span>
          <h2>Schedule a Professional Demo</h2>
          <p>
            Learn how Vericore can be tailored to your specific operational scale. 
            No marketing pressure—just solutions.
          </p>

          <div className="contact-method">
            <div className="method-icon"><Mail size={20} /></div>
            <div>
              <span className="method-label">Email</span>
              <a href="mailto:solutions@vericore.com" className="method-value">solutions@vericore.com</a>
            </div>
          </div>

          <div className="contact-method">
            <div className="method-icon"><Phone size={20} /></div>
            <div>
              <span className="method-label">Direct Line</span>
              <span className="method-value">+1 (888) 555-0123</span>
            </div>
          </div>

          <div className="contact-method">
            <div className="method-icon"><MapPin size={20} /></div>
            <div>
              <span className="method-label">Headquarters</span>
              <span className="method-value">Tech Center Plaza, San Francisco</span>
            </div>
          </div>
        </div>

        <div className="contact-form-box">
          {isSubmitted ? (
            <div className="success-wrapper">
              <div className="success-icon-bg"><CheckCircle2 size={32} /></div>
              <h3 style={{ fontSize: "24px", color: "white", marginBottom: "12px" }}>Request Received</h3>
              <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
                A solutions engineer will reach out to you within one business day to schedule your demo.
              </p>
              <button className="submit-btn" style={{ background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }} onClick={() => setIsSubmitted(false)}>
                Submit New Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="John Carter" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Work Email</label>
                  <input type="email" className="form-input" placeholder="john@company.com" required />
                </div>
              </div>
              
              <div className="input-group">
                <label className="input-label">Company Name</label>
                <input type="text" className="form-input" placeholder="Enterprise Corp Ltd" required />
              </div>

              <div className="input-group">
                <label className="input-label">Desired Outcome</label>
                <textarea className="form-input form-textarea" placeholder="Tell us about your current operational challenges..."></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : <><Send size={18} /> Schedule Technical Demo</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

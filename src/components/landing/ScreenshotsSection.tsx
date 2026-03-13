import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const screenshots = [
  {
    title: "Project Control Center",
    description: "Full visibility into job status, technician progress, and field data in real-time.",
    category: "Operations",
    image: "/screenshots/dashboard.png",
  },
  {
    title: "Dynamic Workflow Builder",
    description: "Create custom data capture forms and logic gates for complex field service types.",
    category: "Configuration",
    image: "/screenshots/worksheet-builder.png",
  },
  {
    title: "Automated Reporting",
    description: "Generate professional, compliant project reports instantly from field observations.",
    category: "Compliance",
    image: "/screenshots/report.png",
  },
];

export function ScreenshotsSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="screenshots" style={{ background: "#0f172a", padding: "120px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <style>{`
        .screen-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .screen-grid-alt {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 64px;
        }
        @media (max-width: 900px) {
          .screen-grid-alt { grid-template-columns: 1fr; }
        }

        .product-card {
          cursor: pointer;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .product-card:hover { border-color: #38bdf8; transform: translateY(-4px); }

        .product-img-box {
          aspect-ratio: 16/10;
          background: #0f172a;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .product-img-box img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transition: opacity 0.3s;
        }
        .product-card:hover .product-img-box img { opacity: 1; }

        .product-zoom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .product-card:hover .product-zoom-overlay { opacity: 1; }

        .product-info-box { padding: 24px; }
        .product-cat {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #38bdf8;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
          display: block;
        }
        .product-card-title { font-size: 18px; font-weight: 700; color: #f8fafc; margin: 0 0 8px; }
        .product-card-desc { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0; }

        .lb-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        .lb-close { position: absolute; top: 40px; right: 40px; color: white; cursor: pointer; }
        .lb-img { max-width: 100%; max-height: 80vh; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); }
      `}</style>

      <div className="screen-container">
        <div style={{ textAlign: "center" }}>
          <span className="section-label">Capabilities</span>
          <h2 className="section-title">Built for Real-World Usage</h2>
          <p className="section-sub">
            Direct glimpses into the platform interface designed for power users and precision.
          </p>
        </div>

        <div className="screen-grid-alt">
          {screenshots.map((s, i) => (
            <div key={i} className="product-card" onClick={() => openLightbox(i)}>
              <div className="product-img-box">
                <img src={s.image} alt={s.title} />
                <div className="product-zoom-overlay">
                  <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px", borderRadius: "50%" }}>
                    <Maximize2 size={24} color="white" />
                  </div>
                </div>
              </div>
              <div className="product-info-box">
                <span className="product-cat">{s.category}</span>
                <h3 className="product-card-title">{s.title}</h3>
                <p className="product-card-desc">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div className="lb-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="lb-close"><X size={32} /></div>
          <img src={screenshots[currentIndex].image} className="lb-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

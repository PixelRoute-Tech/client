import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

const screenshots = [
  {
    title: "Dashboard Overview",
    description: "Real-time insights and key metrics at a glance",
    category: "Application",
    placeholder: "Dashboard with charts, stats, and activity feed",
    image: "/screenshots/dashboard.png",
  },
  {
    title: "Client Onboarding",
    description: "Streamlined client registration process",
    category: "Application",
    placeholder: "Client form with validation and progress steps",
    image: "/screenshots/client-onboarding.png",
  },
  {
    title: "Job Request Management",
    description: "Track and manage all job requests efficiently",
    category: "Application",
    placeholder: "Kanban board with job cards and status columns",
    image: "/screenshots/job-request.png",
  },
  {
    title: "Work Builder Interface",
    description: "Custom workflow creation made easy",
    category: "Worksheet",
    placeholder: "Edit workflow builder with nodes",
    image: "/screenshots/worksheet-builder.png",
  },
  {
    title: "Profile Overview",
    description: "Manage your personal details, preferences, and account settings",
    category: "User",
    placeholder: "User information with editable profile sections",
    image: "/screenshots/profile.png",
  },
  {
    title: "Reports",
    description: "View and analyze detailed system reports and summaries",
    category: "Reports",
    placeholder: "Tabular data and summary charts",
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
  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <section id="screenshots" style={{ position: "relative", background: "#0a0a12", padding: "120px 20px", overflow: "hidden" }}>
      <style>{`
        .screen-orb {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%);
          filter: blur(100px);
          top: 0; right: -100px;
          pointer-events: none;
          animation: orbDrift1 36s ease-in-out infinite alternate;
        }
        .screen-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1200px;
          margin: 64px auto 0;
        }
        @media (max-width: 1024px) { .screen-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
        @media (max-width: 640px) { .screen-grid { grid-template-columns: 1fr; } }
        
        .screen-card {
          cursor: pointer;
          animation: fadeUpIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .screen-img-wrap {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, border-color 0.4s ease;
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }
        .screen-card:hover .screen-img-wrap {
          transform: translateY(-8px);
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset;
        }
        .screen-img {
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.8;
          transition: opacity 0.4s ease, transform 0.6s ease;
        }
        .screen-card:hover .screen-img {
          opacity: 1;
          transform: scale(1.05);
        }
        .screen-placeholder {
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
          color: rgba(255,255,255,0.3);
          font-size: 13px;
          font-weight: 300;
          text-align: center;
          padding: 20px;
        }
        .screen-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .screen-card:hover .screen-overlay { opacity: 1; }
        .screen-play-btn {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(20px);
          transform: scale(0.8);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .screen-card:hover .screen-play-btn { transform: scale(1); }
        .screen-category-badge {
          position: absolute;
          top: 16px; left: 16px;
          padding: 4px 12px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50px;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          z-index: 2;
        }
        .screen-info {
          margin-top: 20px;
          padding-left: 8px;
        }
        .screen-title {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin: 0 0 6px;
          transition: color 0.3s ease;
        }
        .screen-card:hover .screen-title { color: #38bdf8; }
        .screen-desc {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: fadeUpIn 0.3s ease both;
        }
        .lightbox-close {
          position: absolute;
          top: 32px; right: 32px;
          width: 48px; height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .lightbox-close:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .lightbox-nav.prev { left: 40px; }
        .lightbox-nav.next { right: 40px; }
        .lightbox-nav:hover { background: rgba(255,255,255,0.2); transform: translateY(-50%) scale(1.1); }
        .lightbox-content {
          max-width: 90vw;
          max-height: 80vh;
          position: relative;
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 70vh;
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.1);
          object-fit: contain;
        }
        .lightbox-info {
          text-align: center;
          margin-top: 24px;
        }
        .lightbox-title { font-size: 20px; font-weight: 500; color: white; margin: 0 0 8px; }
        .lightbox-desc { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; }
        
        @media (max-width: 768px) {
          .lightbox-nav { display: none; }
          .lightbox-close { top: 16px; right: 16px; width: 40px; height: 40px; }
        }
      `}</style>

      <div className="screen-orb" />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <span className="section-label">✦ Interface</span>
        <h2 className="section-title">See It In Action</h2>
        <p className="section-sub">
          Explore our intuitive interface designed for maximum productivity and elegance.
        </p>
      </div>

      <div className="screen-grid" style={{ position: "relative", zIndex: 1 }}>
        {screenshots.map((s, index) => (
          <div key={index} className="screen-card" style={{ animationDelay: `${0.1 + index * 0.1}s` }} onClick={() => openLightbox(index)}>
            <div className="screen-img-wrap">
              <span className="screen-category-badge">{s.category}</span>
              {Boolean(s.image) ? (
                <img src={s.image} alt={s.title} className="screen-img" />
              ) : (
                <div className="screen-placeholder">{s.placeholder}</div>
              )}
              <div className="screen-overlay">
                <div className="screen-play-btn"><Play fill="white" size={20} /></div>
              </div>
            </div>
            <div className="screen-info">
              <h3 className="screen-title">{s.title}</h3>
              <p className="screen-desc">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}><X size={24} /></button>
          
          <button className="lightbox-nav prev" onClick={prevImage}><ChevronLeft size={28} /></button>
          <button className="lightbox-nav next" onClick={nextImage}><ChevronRight size={28} /></button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {Boolean(screenshots[currentIndex].image) ? (
              <img src={screenshots[currentIndex].image} alt={screenshots[currentIndex].title} className="lightbox-img" />
            ) : (
              <div className="lightbox-img" style={{ width: '800px', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
                {screenshots[currentIndex].placeholder}
              </div>
            )}
            <div className="lightbox-info">
              <h3 className="lightbox-title">{screenshots[currentIndex].title}</h3>
              <p className="lightbox-desc">{screenshots[currentIndex].description}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>{currentIndex + 1} / {screenshots.length}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

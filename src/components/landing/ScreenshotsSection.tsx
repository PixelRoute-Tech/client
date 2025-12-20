import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const screenshots = [
  {
    title: "Dashboard Overview",
    description: "Real-time insights and key metrics at a glance",
    category: "Application",
    placeholder: "Dashboard with charts, stats, and activity feed",
  },
  {
    title: "Client Onboarding",
    description: "Streamlined client registration process",
    category: "Application",
    placeholder: "Client form with validation and progress steps",
  },
  {
    title: "Job Request Management",
    description: "Track and manage all job requests efficiently",
    category: "Application",
    placeholder: "Kanban board with job cards and status columns",
  },
  {
    title: "Work Builder Interface",
    description: "Custom workflow creation made easy",
    category: "Application",
    placeholder: "Drag-and-drop workflow builder with nodes",
  },
  {
    title: "Analytics Dashboard",
    description: "Comprehensive business analytics and reports",
    category: "Reports",
    placeholder: "Multiple charts showing business metrics",
  },
  {
    title: "Financial Reports",
    description: "Detailed financial insights and projections",
    category: "Reports",
    placeholder: "Financial tables and revenue graphs",
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

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <section className="py-20 lg:py-32 bg-background" id="screenshots">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Screenshots
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            See It in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our intuitive interface designed for maximum productivity.
          </p>
        </div>

        {/* Screenshots Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-xl border border-border bg-muted/50 aspect-video">
                {/* Placeholder image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 p-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-primary/40 rounded-lg" />
                    </div>
                    <p className="text-slate-400 text-sm">{screenshot.placeholder}</p>
                  </div>
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-black/90 rounded-full p-3">
                    <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs text-white font-medium">
                    {screenshot.category}
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {screenshot.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {screenshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white hover:bg-white/10"
            onClick={prevImage}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="max-w-4xl w-full">
            <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-10 h-10 bg-primary/40 rounded-lg" />
                </div>
                <p className="text-slate-400">{screenshots[currentIndex].placeholder}</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-xl font-semibold text-white">
                {screenshots[currentIndex].title}
              </h3>
              <p className="text-slate-400 mt-2">
                {screenshots[currentIndex].description}
              </p>
              <p className="text-slate-500 text-sm mt-4">
                {currentIndex + 1} / {screenshots.length}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white hover:bg-white/10"
            onClick={nextImage}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}
    </section>
  );
}

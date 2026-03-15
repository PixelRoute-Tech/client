import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Diamond } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-[var(--body-bg)] transition-opacity duration-300",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      <div className="text-center space-y-8 flex flex-col items-center justify-center">
        {/* Glow and Logo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-primary/30 rounded-full blur-[40px] animate-pulse"></div>
          <Diamond className="w-16 h-16 text-primary relative z-10" />
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-light text-[var(--text-primary)] tracking-wider">
            VeriCore Inspections
          </h1>
        </div>

        {/* Progress bar container */}
        <div className="w-64 h-1 bg-[var(--glass-input-bg)] rounded-full overflow-hidden mt-6">
          <div 
            className="h-full rounded-full w-full"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6), hsl(var(--info)))',
              animation: 'loadProgress 2s ease-in-out forwards'
            }}
          ></div>
        </div>
      </div>
      <style>{`
        @keyframes loadProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
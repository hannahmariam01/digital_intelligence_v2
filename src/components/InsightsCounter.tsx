import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

interface InsightsCounterProps {
  opacity: number;
}

const InsightsCounter: React.FC<InsightsCounterProps> = ({ opacity }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const animationStartedRef = useRef(false);
  const targetValue = 124;

  useEffect(() => {
    // Start animation when component becomes sufficiently visible
    if (opacity > 0.1 && !animationStartedRef.current) {
      animationStartedRef.current = true;
      let startTimestamp: number | null = null;
      const duration = 2000; // 2 seconds animation

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // easeOutQuart easing function
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easedProgress * targetValue);

        setDisplayCount(currentCount);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }

    // Reset when faded out so it can animate again on return
    if (opacity <= 0) {
      animationStartedRef.current = false;
      setDisplayCount(0);
    }
  }, [opacity]);

  if (opacity <= 0.01) return null;

  return (
    <div
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-end pointer-events-none transition-opacity duration-150"
    >
      {/* Deep Shadow Backdrop for Text Legibility */}
      <div className="absolute inset-y-0 right-0 w-3/5 bg-gradient-to-l from-black/80 via-black/40 to-transparent z-0" />

      <div className="relative z-10 max-w-xl pr-12 md:pr-24 space-y-4 text-right pointer-events-auto">
        <h2 className="text-9xl md:text-[200px] font-tech font-bold text-white leading-none tracking-tighter drop-shadow-[0_15px_45px_rgba(0,0,0,1)]">
          {displayCount}
        </h2>
        <div className="space-y-10">
          <p className="text-3xl md:text-4xl font-light text-white leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            Business intelligence <br />
            <span className="text-slate-200">insights generated</span>
          </p>
          <div className="flex justify-end pt-6">
            <button className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-all group text-xl font-medium tracking-widest uppercase">
              <span className="drop-shadow-md">View Insights Dashboard</span>
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsCounter;

import React, { useState, useEffect, useRef } from "react";
import Globe from "./components/Globe";
import UIOverlay from "./components/UIOverlay";
import BusinessEcosystem from "./components/BusinessEcosystem";
import AbstractLayers from "./components/AbstractLayers";
import TrendsView from "./components/TrendsView";
import InsightsCounter from "./components/InsightsCounter";
import ReactDOM from "react-dom";
import {
  Sparkles,
  Lightbulb,
  ClipboardList,
  TrendingUp,
  BarChart3,
  X,
  Zap,
  LayoutDashboard,
} from "lucide-react";

// Helper to keep values within 0-1 range
const clamp = (val: number) => Math.min(Math.max(val, 0), 1);

// SHARED MODAL STYLES (Synchronized with requested screenshot)
const modalBgClass =
  "bg-[#0b1224] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden";
const headerClass =
  "flex items-center justify-between p-4 md:p-5 border-b border-white/5 bg-white/[0.01]";
const sectionTitleClass =
  "flex items-center gap-2 text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]";
const insightCardClass =
  "bg-[#131b2e] p-3 md:p-4 rounded-xl text-slate-300 text-xs md:text-sm leading-relaxed border border-white/[0.03] hover:border-white/10 transition-colors";
const actionCardClass =
  "bg-[#131b2e]/60 p-3 md:p-4 rounded-xl border border-blue-500/10 hover:border-blue-500/20 transition-colors";

// STRATEGIC MODAL COMPONENT
const StrategicModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-sm"
      style={{ zIndex: 99999, pointerEvents: "auto" }}
    >
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      <div
        className={`relative w-full max-w-2xl ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={headerClass}>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-base md:text-lg font-tech font-bold text-white tracking-widest uppercase">
              Strategic Alignment & Drift
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
          <section className="space-y-3">
            <div className={sectionTitleClass}>
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Insights
            </div>
            <div className="grid gap-2">
              {[
                "A subset of departments is pursuing initiatives that optimize local outcomes rather than domain-level impact.",
                "High-priority strategic domains are underrepresented in the current initiative portfolio, while lower-impact areas show disproportionate activity.",
                "Several departmental KPIs track delivery and compliance rather than strategic results, masking early signs of misalignment.",
              ].map((text, i) => (
                <div key={i} className={insightCardClass}>
                  {text}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-1">
            <div className={sectionTitleClass}>
              <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
              Recommended Actions
            </div>
            <div className="grid gap-2">
              {[
                {
                  title: "Re-anchor Initiatives to Enterprise Priorities",
                  desc: "Require explicit linkage between every active initiative and a validated enterprise or domain objective.",
                },
                {
                  title: "Rebalance the Initiative Portfolio",
                  desc: "Redirect investment and leadership attention toward underpowered priority domains and pause initiatives with limited strategic contribution.",
                },
              ].map((item, i) => (
                <div key={i} className={actionCardClass}>
                  <p className="text-blue-400 font-bold mb-1 text-xs md:text-sm">
                    {i + 1}. {item.title}
                  </p>
                  <p className="text-slate-400 leading-relaxed text-xs md:text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 pt-3">
            <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#3b82f6] text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20">
              <TrendingUp className="w-4 h-4" />
              Explore Strategy Coverage
            </button>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95">
              <BarChart3 className="w-4 h-4" />
              Alignment Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

// EXECUTION CONSTRAINTS MODAL COMPONENT
const ExecutionConstraintsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-sm"
      style={{ zIndex: 99999, pointerEvents: "auto" }}
    >
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      <div
        className={`relative w-full max-w-2xl ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={headerClass}>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-base md:text-lg font-tech font-bold text-white tracking-widest uppercase">
              Execution Constraints
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
          <section className="space-y-3">
            <div className={sectionTitleClass}>
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Insights
            </div>
            <div className="grid gap-2">
              {[
                "Critical initiatives are experiencing delays due to resource bottlenecks, with 60% of teams reporting insufficient engineering capacity to meet current commitments.",
                "Cross-functional dependencies and approval workflows are adding an average of 3-4 weeks to initiative timelines, creating cascading delays across the portfolio.",
                "Legacy infrastructure and technical debt are constraining delivery velocity, with 40% of sprint capacity consumed by maintenance and remediation work.",
              ].map((text, i) => (
                <div key={i} className={insightCardClass}>
                  {text}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-1">
            <div className={sectionTitleClass}>
              <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
              Recommended Actions
            </div>
            <div className="grid gap-2">
              {[
                {
                  title: "Capacity Planning Framework",
                  desc: "Implement allocation frameworks to prevent over-commitment and ensure critical initiatives have required resources.",
                },
                {
                  title: "Friction Reduction",
                  desc: "Reduce dependency chain friction by consolidating approval gates and empowering teams with decision authority.",
                },
              ].map((item, i) => (
                <div key={i} className={actionCardClass}>
                  <p className="text-blue-400 font-bold mb-1 text-xs md:text-sm">
                    {i + 1}. {item.title}
                  </p>
                  <p className="text-slate-400 leading-relaxed text-xs md:text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 pt-3">
            <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#3b82f6] text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20">
              <TrendingUp className="w-4 h-4" />
              View Resource Allocation
            </button>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95">
              <LayoutDashboard className="w-4 h-4" />
              Capacity Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

// INTELLIGENCE & DECISION BLIND SPOTS MODAL COMPONENT
const IntelligenceBlindSpotsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-sm"
      style={{ zIndex: 99999, pointerEvents: "auto" }}
    >
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      <div
        className={`relative w-full max-w-2xl ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={headerClass}>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-base md:text-lg font-tech font-bold text-white tracking-widest uppercase">
              Intelligence & Decision Blind Spots
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-4 max-h-[90vh] overflow-y-auto hide-scrollbar">
          <section className="space-y-3">
            <div className={sectionTitleClass}>
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Insights
            </div>
            <div className="grid gap-2">
              {[
                "Leadership teams are making critical portfolio decisions without access to real-time performance metrics, relying on quarterly reviews that lag actual market conditions by 8-12 weeks.",
                "Data fragmentation across 15+ disconnected systems prevents unified visibility into initiative health, with teams unable to correlate customer behavior, operational metrics, and financial outcomes.",
                "Key stakeholder groups lack shared understanding of success criteria, with 70% of strategic decisions made using inconsistent or anecdotal evidence rather than validated insights.",
              ].map((text, i) => (
                <div key={i} className={insightCardClass}>
                  {text}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-1">
            <div className={sectionTitleClass}>
              <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
              Recommended Actions
            </div>
            <div className="grid gap-2">
              {[
                {
                  title: "Consolidate Data Sources",
                  desc: "Consolidate data sources into a single source of truth with real-time dashboards and automated reporting to enable evidence-based decision making.",
                },
                {
                  title: "Standardize Criteria",
                  desc: "Create standardized criteria and metrics for evaluating initiatives, ensuring all stakeholders use consistent data and methodology.",
                },
              ].map((item, i) => (
                <div key={i} className={actionCardClass}>
                  <p className="text-blue-400 font-bold mb-1 text-xs md:text-sm">
                    {i + 1}. {item.title}
                  </p>
                  <p className="text-slate-400 leading-relaxed text-xs md:text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 pt-3">
            <button className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#3b82f6] text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20">
              <TrendingUp className="w-4 h-4" />
              View Analytics Dashboard
            </button>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95">
              <BarChart3 className="w-4 h-4" />
              Data Insights Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentView, setCurrentView] = useState<"main" | "trends">("main");
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [subScrollProgress, setSubScrollProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConstraintModalOpen, setIsConstraintModalOpen] = useState(false);
  const [isBlindSpotsModalOpen, setIsBlindSpotsModalOpen] = useState(false);

  // Keep track of where we were before opening an overlay
  const savedScrollRef = useRef(0);

  // Sync scroll progress when the window scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (currentView !== "main") return;

      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? clamp(scrolled / maxScroll) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentView]);

  // When opening an overlay, we "lock" the current scroll progress if needed
  useEffect(() => {
    if (activeOverlay) {
      savedScrollRef.current = scrollProgress;
    }
  }, [activeOverlay]);

  const goToTrends = () => {
    setCurrentView("trends");
  };

  const backToMain = () => {
    setCurrentView("main");
    setActiveOverlay(null);
    setSubScrollProgress(0);

    // Restore scroll position
    setTimeout(() => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: maxScroll,
        behavior: "instant",
      });
      setScrollProgress(1);
    }, 0);
  };

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
    setSubScrollProgress(0);
    setTimeout(() => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll, behavior: "instant" });
      setScrollProgress(1);
    }, 0);
  };

  const handleGoToDashboard = () => {
    setCurrentView("main");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectOverlayFromEcosystem = (name: string) => {
    setActiveOverlay(name);
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll, behavior: "smooth" });
  };

  /**
   * LAYER TRANSITION CALCULATIONS
   */
  const layer1Opacity = clamp(1 - (scrollProgress - 0.15) * 10);
  const insightsFadeIn = clamp((scrollProgress - 0.2) * 10);
  const insightsFadeOut = clamp(1 - (scrollProgress - 0.45) * 10);
  const insightsOpacity = insightsFadeIn * insightsFadeOut;
  const l2FadeIn = clamp((scrollProgress - 0.5) * 10);
  const l2FadeOut = clamp(1 - (scrollProgress - 0.75) * 10);
  const layer2Opacity = l2FadeIn * l2FadeOut;
  const layer3Opacity = clamp((scrollProgress - 0.8) * 10);

  // --- LITERAL CAMERA ZOOM LOGIC ---
  const baseZoom = 1 + Math.pow(scrollProgress * 2.8, 2.5);
  const subProgressEased = Math.pow(subScrollProgress, 5);
  const detailZoom = activeOverlay ? subProgressEased * 70 : 0;
  const zoomLevel = baseZoom + detailZoom;

  return (
    <main
      className={`relative w-full bg-[#050507] font-sans text-white transition-colors duration-700`}
    >
      <StrategicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ExecutionConstraintsModal
        isOpen={isConstraintModalOpen}
        onClose={() => setIsConstraintModalOpen(false)}
      />

      <IntelligenceBlindSpotsModal
        isOpen={isBlindSpotsModalOpen}
        onClose={() => setIsBlindSpotsModalOpen(false)}
      />

      <div
        className={`w-full ${
          currentView === "main" ? "h-[800vh]" : "h-screen pointer-events-none"
        }`}
      />

      <div
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${
          currentView === "trends" ? "opacity-30 blur-sm" : "opacity-100"
        }`}
      >
        <Globe zoom={zoomLevel} />
      </div>

      {currentView === "trends" && (
        <div className="fixed inset-0 z-[100] bg-[#020c14]/90 backdrop-blur-sm animate-in fade-in duration-500">
          <TrendsView onBack={backToMain} />
        </div>
      )}

      <div className="fixed top-0 left-0 h-screen w-full overflow-hidden pointer-events-none">
        {/* Layer 4: Abstract Spheres */}
        <div
          style={{
            opacity: layer3Opacity,
            pointerEvents: layer3Opacity > 0.1 ? "auto" : "none",
            transform: `translateZ(0) scale(${0.9 + layer3Opacity * 0.1})`,
            zIndex: layer3Opacity > 0.1 ? 50 : 10,
          }}
          className="absolute inset-0"
        >
          <AbstractLayers
            scrollProgress={scrollProgress}
            onExplore={goToTrends}
            activeOverlay={activeOverlay}
            setActiveOverlay={setActiveOverlay}
            onSubScroll={(p) => setSubScrollProgress(p)}
            onCloseOverlay={handleCloseOverlay}
            onGoToDashboard={handleGoToDashboard}
          />
        </div>

        {/* Layer 3: Ecosystem */}
        <div
          style={{
            opacity: layer2Opacity,
            pointerEvents: layer2Opacity > 0.1 ? "auto" : "none",
            transform: `translateZ(0) scale(${0.9 + layer2Opacity * 0.1})`,
            zIndex: 20,
          }}
          className="absolute inset-0"
        >
          <BusinessEcosystem
            scrollProgress={scrollProgress}
            hideHeaderFooter={false}
            onSelectOverlay={handleSelectOverlayFromEcosystem}
          />
        </div>

        {/* Layer 2: Insights */}
        <div style={{ zIndex: 30 }}>
          <InsightsCounter opacity={insightsOpacity} />
        </div>

        {/* Layer 1: Dashboard */}
        <div
          style={{
            opacity: layer1Opacity,
            transform: `translateZ(0) scale(${1 + (1 - layer1Opacity) * 0.1})`,
            pointerEvents: layer1Opacity > 0.1 ? "auto" : "none",
            zIndex: 40,
          }}
          className="absolute inset-0"
        >
          <UIOverlay
            scrollProgress={scrollProgress}
            hideHeaderFooter={false}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setIsConstraintModalOpen={setIsConstraintModalOpen}
            setIsBlindSpotsModalOpen={setIsBlindSpotsModalOpen}
            onGoToDashboard={handleGoToDashboard}
          />
        </div>
      </div>
    </main>
  );
}

export default App;

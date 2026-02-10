import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Bell,
  Sparkles,
  ArrowLeft,
  Filter,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Scan,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";
import { fetchDigitalInsight } from "../geminiService";
import * as THREE from "three";
import TrendsView from "./TrendsView";

interface AbstractLayersProps {
  scrollProgress?: number;
  onExplore?: () => void;
  activeOverlay: string | null;
  setActiveOverlay: (val: string | null) => void;
  onSubScroll?: (progress: number) => void;
  onCloseOverlay?: () => void;
  onGoToDashboard?: () => void;
}

const CapabilityCard: React.FC<{
  title: string;
  count: string;
  items: string[];
  accentColor: string;
  glowColor: string;
}> = ({ title, count, items, accentColor, glowColor }) => (
  <div className="relative bg-slate-950/60 backdrop-blur-xl rounded border border-slate-800 transition-all duration-300 hover:border-slate-500 group flex flex-col h-full shadow-2xl">
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover:block z-[999] pointer-events-none animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300">
      <div className="bg-slate-900/98 border border-cyan-400/50 px-4 py-2 rounded shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-2xl ring-1 ring-white/10 min-w-max">
        <p className="text-[10px] text-white font-tech uppercase tracking-[0.2em] whitespace-nowrap leading-tight">
          {title}
        </p>
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 bg-slate-900 border-r border-b border-cyan-400/50 transform rotate-45" />
    </div>

    <div
      className={`w-full h-9 ${accentColor} px-3 flex items-center justify-between shrink-0 relative rounded-t-[3px] border-b border-white/5`}
    >
      <h4 className="text-[10px] font-tech font-bold text-white tracking-[0.05em] uppercase truncate max-w-[82%]">
        {title}
      </h4>
      <span className="text-[10px] font-tech text-white/90 font-bold opacity-70">
        {count}
      </span>
    </div>

    <div className="p-3 grid grid-cols-2 gap-2 flex-1 items-start overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className={`bg-white/95 border border-slate-700/30 p-2 rounded-sm flex items-center justify-center text-center min-h-[36px] shadow-sm ${
            item === "" ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-[8px] leading-tight text-slate-800 font-bold tracking-tight uppercase font-sans">
            {item}
          </span>
        </div>
      ))}
    </div>
    <div
      className={`absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity ${glowColor} blur-xl rounded`}
    />
  </div>
);

const SectionHeader: React.FC<{ label: string; colorClass: string }> = ({
  label,
  colorClass,
}) => (
  <div className="absolute top-[-18px] left-0 right-0 flex items-center gap-4 z-20 px-8">
    <div
      className={`h-[1px] flex-1 bg-gradient-to-r from-transparent to-${colorClass.replace(
        "text-",
        ""
      )}/40`}
    />
    <div className="flex flex-col items-center">
      <div
        className={`text-[11px] font-tech font-bold text-slate-200 uppercase tracking-[0.5em] px-8 py-2 bg-[#020617] border border-white/10 rounded-full shadow-lg backdrop-blur-md whitespace-nowrap ${colorClass}`}
      >
        {label}
      </div>
    </div>
    <div
      className={`h-[1px] flex-1 bg-gradient-to-l from-transparent to-${colorClass.replace(
        "text-",
        ""
      )}/40`}
    />
  </div>
);

const DomainTile: React.FC<{ title: string; count: string }> = ({
  title,
  count,
}) => (
  <div className="flex flex-col items-center group cursor-pointer w-full">
    <div className="relative w-full aspect-[16/10] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
      <div className="absolute top-[60%] w-[60%] h-[40%] bg-blue-500/15 blur-3xl rounded-full transform rotate-[15deg] opacity-0 group-hover:opacity-100 transition-opacity" />

      <svg
        viewBox="0 0 200 130"
        className="w-full h-full drop-shadow-[0_15px_40px_rgba(0,0,0,0.7)] overflow-visible"
      >
        <defs>
          <linearGradient id="domainCubeTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4186f5" />
            <stop offset="100%" stopColor="#2b6edc" />
          </linearGradient>
        </defs>

        {/* Enlarged Isometric Platform */}
        <path
          d="M 100 45 L 160 70 L 100 95 L 40 70 Z"
          fill="rgba(30, 41, 59, 0.5)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="0.75"
        />
        <path
          d="M 40 70 L 40 78 L 100 103 L 100 95 Z"
          fill="rgba(15, 23, 42, 0.85)"
        />
        <path
          d="M 100 95 L 100 103 L 160 78 L 160 70 Z"
          fill="rgba(2, 6, 23, 0.95)"
        />

        {/* Enlarged Blue Cube */}
        <g transform="translate(80, 30) scale(1.3)">
          <path
            d="M 15 0 L 30 7.5 L 15 15 L 0 7.5 Z"
            fill="url(#domainCubeTop)"
          />
          <path d="M 0 7.5 L 15 15 L 15 30 L 0 22.5 Z" fill="#1e40af" />
          <path d="M 15 15 L 30 7.5 L 30 22.5 L 15 30 Z" fill="#1d3557" />
          {/* Nudged baseline y from 10.5 to 9.2 to pull text away from bottom edge */}
          <text
            x="15"
            y="9.2"
            fontSize="6"
            fill="white"
            textAnchor="middle"
            fontWeight="800"
            className="font-tech opacity-95 select-none tracking-tight"
          >
            {count}
          </text>
        </g>
      </svg>
    </div>

    <div className="-mt-4 md:-mt-6 text-center w-full px-2 transition-all duration-300 transform group-hover:translate-y-0.5 relative z-10">
      <p className="text-[10px] md:text-[12px] font-tech font-bold text-blue-100/80 uppercase tracking-[0.12em] leading-tight transition-colors group-hover:text-cyan-400 whitespace-pre-wrap">
        {title}
      </p>
    </div>
  </div>
);

const StrategicLandscapeView: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [assistantMessage, setAssistantMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const domains = [
    "Business Transformation",
    "Stakeholder engagement\n& Support",
    "Budgeting & Resource\nmanagemnt",
    "Financial Governance &\nOversight",
    "Risk Management &\nAssurance",
    "Financial operation &\nsystem",
  ];

  // Restricted random counts to range 01-10 as requested
  const randomizedCounts = useMemo(() => {
    return domains.map(() => {
      const num = Math.floor(Math.random() * 10) + 1;
      return num.toString().padStart(2, "0");
    });
  }, [domains.length]);

  const handleOrbClick = async () => {
    if (loading) return;
    setLoading(true);
    setAssistantMessage("Analyzing strategic alignment...");
    try {
      const insight = await fetchDigitalInsight();
      setAssistantMessage(`${insight.title}: ${insight.content}`);
    } catch (e) {
      setAssistantMessage("Neural link check failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#020617] flex flex-col font-sans animate-in fade-in duration-700 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,132,255,0.05)_0%,_transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top Header */}
      <div className="flex justify-between items-center px-12 py-5 relative z-20 shrink-0">
        <div className="flex items-center gap-8">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-cyan-400 bg-slate-900/50 border border-slate-800 transition-all group shadow-2xl"
          >
            <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-3xl font-tech font-bold text-white tracking-widest uppercase leading-none">
              Strategic Landscape
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <LayoutGrid className="w-4 h-4 text-cyan-500" />
              <p className="text-[10px] text-cyan-500/60 font-tech tracking-[0.3em] uppercase font-bold">
                Domains
              </p>
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-900/50 rounded-full border border-slate-800">
          <Bell className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-12 pb-6 relative z-10 overflow-hidden">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-6xl mt-0 shrink-0 mb-4">
          {[
            { label: "TOTAL DOMAINS", value: "34" },
            { label: "DOMAIN GROUPS", value: "06" },
            { label: "PRIORITY AREAS", value: "12" },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-slate-900/40 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-slate-800/50 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-800/50 hover:border-slate-700 shadow-2xl"
            >
              <p className="text-3xl md:text-5xl font-tech font-bold text-white mb-1 tracking-tighter">
                {card.value}
              </p>
              <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-cyan-500/60 font-bold">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* Isometric Grid Content - Centered and Enlarged to fit one screen */}
        <div className="flex-1 w-full max-w-[1100px] flex items-center justify-center py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-14 w-full">
            {domains.map((domain, i) => (
              <DomainTile key={i} title={domain} count={randomizedCounts[i]} />
            ))}
          </div>
        </div>
      </div>

      {/* Assistant Orb - Fixed at bottom right */}
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end gap-3">
        {assistantMessage && (
          <div className="bg-slate-900/95 backdrop-blur-2xl text-slate-300 text-xs p-4 rounded-3xl rounded-br-none w-64 shadow-2xl animate-float border border-slate-700/50 leading-relaxed">
            {assistantMessage}
            <div className="absolute -bottom-2 right-0 w-3 h-3 bg-slate-900 border-r border-b border-slate-700/50 transform skew-x-12" />
          </div>
        )}
        <button
          onClick={handleOrbClick}
          className={`w-20 h-20 rounded-full relative group transition-transform hover:scale-110 active:scale-95 flex items-center justify-center ${
            loading ? "cursor-wait" : "cursor-pointer"
          }`}
        >
          <div className="absolute inset-[-10px] bg-cyan-500/30 rounded-full blur-3xl opacity-40 animate-pulse transition-opacity duration-1000"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-2xl bg-slate-800">
            <img
              src="https://raw.githubusercontent.com/hannahmariam01/images/main/ai-assistant%20(1).gif"
              alt="Assistant Orb"
              className={`w-full h-full object-cover select-none ${
                loading ? "animate-pulse opacity-80" : "animate-none"
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

const CapabilitiesDashboard: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [assistantMessage, setAssistantMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const contentRef = useRef<HTMLDivElement>(null);

  const handleOrbClick = async () => {
    if (loading) return;
    setLoading(true);
    setAssistantMessage("Accessing architecture data...");
    try {
      const insight = await fetchDigitalInsight();
      setAssistantMessage(`${insight.title}: ${insight.content}`);
    } catch (e) {
      setAssistantMessage("System alignment check failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.2, 0.4);
      if (next < 0.8) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleFitToScreen = () => {
    setZoom(0.7);
    setPan({ x: 0, y: 0 });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 0.8) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const coreCapabilities = [
    { title: "Strategy Formulation", items: ["Plan", "Align"] },
    { title: "Enterprise Planning", items: ["Vision", "Goal"] },
    { title: "Portfolio Management", items: ["Budget", "Focus"] },
    { title: "Initiative & Program Oversight", items: ["Scale", "Track"] },
    { title: "Performance Management", items: ["KPI", "ROI"] },
    { title: "Benefits Realisation", items: ["Value", "Growth"] },
    { title: "Governance & Decision Management", items: ["Policy", "Audit"] },
    { title: "Risk & Dependency Management", items: ["Mitigate", "Alert"] },
    { title: "Resource & Capacity Management", items: ["Talent", "Load"] },
    {
      title: "Stakeholder Alignment & Communication",
      items: ["Sync", "Connect"],
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#020617] text-white font-tech animate-in fade-in duration-700 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,132,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Header */}
      <div className="flex justify-between items-center px-12 py-8 relative z-50 shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-cyan-400 bg-slate-900/50 border border-slate-800 transition-all group shadow-2xl"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-white tracking-[0.2em] uppercase leading-none">
              Operating Model
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-[12px] text-cyan-400/80 tracking-[0.4em] uppercase font-bold">
                Capabilities
              </p>
            </div>
          </div>
        </div>
        <button className="p-2.5 text-slate-400 hover:text-white transition-colors bg-slate-900/50 rounded-full border border-slate-800 shadow-xl">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Control Bar - Repositioned to be a bit lower than exact center */}
      <div className="fixed top-[55%] -translate-y-1/2 left-10 flex flex-col items-center gap-2.5 bg-white/10 backdrop-blur-2xl border border-white/20 p-2 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 transition-all hover:scale-105">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-[18px] text-white hover:bg-white/30 transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-[18px] text-white hover:bg-white/30 transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitToScreen}
          title="Fit to Screen"
          className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-[18px] text-white hover:bg-white/30 transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset View"
          className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-[18px] text-white hover:bg-white/30 transition-all"
        >
          <Scan className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto relative hide-scrollbar p-12 transition-all ${
          zoom > 0.8 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center top",
            transition: isDragging
              ? "none"
              : "transform 0.4s cubic-bezier(0.2, 0, 0, 1)",
          }}
          className="flex flex-col gap-24 w-full max-w-7xl mx-auto will-change-transform"
        >
          {/* Core Section */}
          <div className="relative border border-blue-500/30 rounded-lg p-10 pt-20 bg-slate-900/10 mt-10">
            <SectionHeader
              label="Core Capability Groups"
              colorClass="text-blue-400"
            />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-y-16 gap-x-8">
              {coreCapabilities.map((cap, i) => (
                <CapabilityCard
                  key={i}
                  title={cap.title}
                  count={(i + 1).toString().padStart(2, "0")}
                  accentColor="bg-blue-600/80"
                  glowColor="bg-blue-500"
                  items={cap.items}
                />
              ))}
            </div>
          </div>

          {/* Enabling & Market Intel Group Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 relative border border-cyan-500/30 rounded-lg p-10 pt-20 bg-slate-900/10">
              <SectionHeader
                label="Enabling Capability Groups"
                colorClass="text-cyan-400"
              />
              <div className="grid grid-cols-3 gap-8">
                <CapabilityCard
                  title="Data & Insights Management"
                  count="01"
                  accentColor="bg-cyan-700/70"
                  glowColor="bg-cyan-500"
                  items={["Analytics", "Governance"]}
                />
                <CapabilityCard
                  title="Digital Platforms & Integration"
                  count="02"
                  accentColor="bg-cyan-700/70"
                  glowColor="bg-cyan-500"
                  items={["Cloud", "Connectivity"]}
                />
                <CapabilityCard
                  title="People, Roles & Operating Model"
                  count="03"
                  accentColor="bg-cyan-700/70"
                  glowColor="bg-cyan-500"
                  items={["Culture", "Structure"]}
                />
              </div>
            </div>
            <div className="relative border border-indigo-500/30 rounded-lg p-10 pt-20 bg-slate-900/10">
              <SectionHeader
                label="Market Intel Group"
                colorClass="text-indigo-400"
              />
              <CapabilityCard
                title="Strategic & Market Intelligence"
                count="04"
                accentColor="bg-indigo-700/70"
                glowColor="bg-indigo-500"
                items={["Pop Health", "Trends", "Forecasts", "Risk Insight"]}
              />
            </div>
          </div>

          {/* Strategic & Adaptive Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-32">
            <div className="lg:col-span-2 relative border border-slate-500/30 rounded-lg p-10 pt-20 bg-slate-900/10">
              <SectionHeader
                label="Strategic Capability Groups"
                colorClass="text-slate-400"
              />
              <div className="grid grid-cols-3 gap-8">
                <CapabilityCard
                  title="Strategic Foresight & Scenario Planning"
                  count="05"
                  accentColor="bg-slate-700/70"
                  glowColor="bg-slate-500"
                  items={["Futures", "Impact"]}
                />
                <CapabilityCard
                  title="Priority Setting & Investment Alignment"
                  count="06"
                  accentColor="bg-slate-700/70"
                  glowColor="bg-slate-500"
                  items={["Strategic", "Budget"]}
                />
                <CapabilityCard
                  title="Policy & Outcome Design"
                  count="07"
                  accentColor="bg-slate-700/70"
                  glowColor="bg-slate-500"
                  items={["Intent", "Result"]}
                />
              </div>
            </div>
            <div className="relative border border-blue-400/30 rounded-lg p-10 pt-20 bg-slate-900/10">
              <SectionHeader
                label="Adaptive Capability Group"
                colorClass="text-blue-300"
              />
              <CapabilityCard
                title="Adaptive Strategy & Continuous Optimization"
                count="08"
                accentColor="bg-blue-600/70"
                glowColor="bg-blue-400"
                items={["Change", "Response"]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Assistant Orb */}
      <div className="fixed bottom-10 right-10 z-[1000] flex flex-col items-end gap-3 pointer-events-none">
        {assistantMessage && (
          <div className="bg-slate-900/95 backdrop-blur-2xl text-slate-300 text-[10px] p-4 rounded-2xl rounded-br-none w-56 shadow-2xl animate-float border border-slate-700/50 pointer-events-auto leading-relaxed">
            {assistantMessage}
            <div className="absolute -bottom-2 right-0 w-3 h-3 bg-slate-900 border-r border-b border-slate-700/50 transform skew-x-12" />
          </div>
        )}
        <button
          onClick={handleOrbClick}
          className={`w-20 h-20 rounded-full relative group transition-transform hover:scale-110 active:scale-95 flex items-center justify-center pointer-events-auto ${
            loading ? "cursor-wait" : "cursor-pointer"
          }`}
        >
          <div className="absolute inset-[-10px] bg-cyan-500/10 rounded-full blur-xl opacity-40 animate-pulse duration-[3000ms]"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-2xl bg-slate-800">
            <img
              src="https://raw.githubusercontent.com/hannahmariam01/images/main/ai-assistant%20(1).gif"
              alt="Assistant Orb"
              className={`w-full h-full object-cover select-none ${
                loading ? "animate-pulse opacity-80" : "animate-none"
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

const GlassCubeWithCircuits: React.FC<{ isHovered: boolean }> = ({
  isHovered,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    ref.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 64, 64, 64);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        breathe: { value: 0 },
        hover: { value: 0 },
      },
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform float breathe;
        uniform float hover;

        void main() {
          vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0) - vPosition);
          float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
          
          vec3 deepBlue = vec3(0.15, 0.35, 0.7);
          vec3 cyan = vec3(0.2, 0.6, 0.9);
          vec3 magenta = vec3(0.8, 0.2, 0.7);
          vec3 brightPurple = vec3(0.6, 0.3, 0.9);
          
          float gradientX = (vPosition.x + 0.75) / 1.5;
          float gradientY = (vPosition.y + 0.75) / 1.5;
          
          vec3 gradient = mix(cyan, magenta, gradientX);
          gradient = mix(gradient, brightPurple, gradientY * 0.5);
          gradient = mix(gradient, deepBlue, (1.0 - gradientX) * 0.3);
          
          gradient = mix(gradient, deepBlue, (1.0 - breathe) * 0.2);
          gradient = mix(gradient, gradient * 1.5, hover * 0.4);
          
          vec3 glassColor = vec3(0.01, 0.01, 0.05);
          vec3 color = glassColor * 0.4;
          color += gradient * (0.6 + hover * 0.3);
          color += gradient * fresnel * (0.8 + hover * 0.5) * breathe;
          
          float faceLighting = abs(dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))));
          faceLighting = faceLighting * 0.4 + 0.6;
          color *= faceLighting;
          
          float alpha = 0.4 + fresnel * 0.5 + hover * 0.2;
          alpha *= (0.8 + breathe * 0.2);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      side: THREE.DoubleSide,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const resize = () => {
      if (!ref.current) return;
      const size = ref.current.clientWidth;
      if (size === 0) return;
      renderer.setSize(size, size);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(ref.current);

    window.addEventListener("resize", resize);

    let frame: number;
    let currentHover = 0;
    const targetHover = () => (isHovered ? 1 : 0);

    const animate = () => {
      material.uniforms.time.value += 0.012;
      currentHover += (targetHover() - currentHover) * 0.1;
      material.uniforms.hover.value = currentHover;
      const breatheSpeed = 0.8;
      material.uniforms.breathe.value =
        Math.sin(material.uniforms.time.value * breatheSpeed) * 0.5 + 0.5;

      sphere.rotation.y += 0.004;
      sphere.rotation.x += 0.003;
      sphere.rotation.z += 0.002;

      const scale =
        1.0 + material.uniforms.breathe.value * 0.03 + currentHover * 0.1;
      sphere.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      if (ref.current) {
        try {
          ref.current.removeChild(renderer.domElement);
        } catch (e) {}
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [isHovered]);

  return <div ref={ref} className="w-full aspect-square" />;
};

const LayerDetailOverlay: React.FC<{
  type: string;
  onClose: () => void;
  onScrollClose: () => void;
  onExplore?: () => void;
  onExploreSandbox?: () => void;
  onSubScroll?: (progress: number) => void;
  onGoToDashboard?: () => void;
  setActiveOverlay: (val: string | null) => void;
}> = ({
  type,
  onClose,
  onScrollClose,
  onExplore,
  onSubScroll,
  onGoToDashboard,
  setActiveOverlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    if (containerRef.current) {
      const viewportHeight = window.innerHeight;
      const initialScroll = viewportHeight * 0.5;
      containerRef.current.scrollTop = initialScroll;
      // Initialize scrollY state immediately to prevent blank first frame
      setScrollY(initialScroll);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let closeTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = (e: Event) => {
      const top = container.scrollTop;
      setScrollY(top);

      if (top <= 20) {
        if (closeTimeout) clearTimeout(closeTimeout);
        setIsClosing(true);
        closeTimeout = setTimeout(() => {
          setActiveOverlay(null);
          if (onSubScroll) onSubScroll(0);
          setIsClosing(false);
        }, 200);
      } else {
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
        setIsClosing(false);
      }

      if (onSubScroll && top > 20) {
        const viewportHeight = window.innerHeight;
        const p = Math.min((top - viewportHeight * 0.5) / viewportHeight, 1);
        onSubScroll(Math.max(0, p));
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (closeTimeout) clearTimeout(closeTimeout);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [onSubScroll, setActiveOverlay]);

  const scrollToDeepLayer = () => {
    if (containerRef.current) {
      const viewportHeight = window.innerHeight;
      containerRef.current.scrollTo({
        top: viewportHeight * 1.5,
        behavior: "smooth",
      });
    }
  };

  const handleBackToDetail = () => {
    if (containerRef.current) {
      const viewportHeight = window.innerHeight;
      containerRef.current.scrollTo({
        top: viewportHeight * 0.5,
        behavior: "smooth",
      });
    }
  };

  const contentMap: Record<
    string,
    {
      title: React.ReactNode;
      description: React.ReactNode;
      stats: { label: string; value: string }[];
    }
  > = {
    "Operating Environment": {
      title: (
        <h2 className="text-5xl md:text-7xl font-tech text-white tracking-tight leading-none uppercase">
          Operating <br /> Environment
        </h2>
      ),
      description: (
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
          The{" "}
          <span className="font-bold text-white">Operating Environment</span>{" "}
          represents the external and internal forces that shape how the
          organization must operate and evolve. It captures key{" "}
          <span className="font-bold text-white">trends</span>—regulatory,
          technological, economic, societal, and organizational—that influence
          risk, opportunity, and strategic direction.
        </p>
      ),
      stats: [
        { label: "Total Trends", value: "34" },
        { label: "Opportunities", value: "25" },
        { label: "Threats", value: "09" },
      ],
    },
    "Operating Model": {
      title: (
        <h2 className="text-5xl md:text-7xl font-tech text-white tracking-tight leading-none uppercase">
          Operating <br /> Model
        </h2>
      ),
      description: (
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
          An <span className="font-bold text-white">Operating Model</span>{" "}
          describes how an organization turns strategy into execution—through
          the capabilities, structures, and ways of working that enable
          consistent decisions and outcomes.
        </p>
      ),
      stats: [
        { label: "Total Capabilities", value: "34" },
        { label: "Core Capabilities", value: "25" },
        { label: "Enabling Capabilities", value: "09" },
      ],
    },
    "Strategic Landscape": {
      title: (
        <h2 className="text-5xl md:text-7xl font-tech text-white tracking-tight leading-none uppercase">
          Strategic <br /> Landscape
        </h2>
      ),
      description: (
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
          A <span className="font-bold text-white">Strategic Landscape</span>{" "}
          defines the key domains where the organization focuses its effort to
          achieve outcomes and create value. It clarifies{" "}
          <span className="italic">
            where to compete, invest, and prioritize
          </span>
          , aligning initiatives and decisions to the areas that matter most
          strategically.
        </p>
      ),
      stats: [
        { label: "Total Domains", value: "34" },
        { label: "Domain Groups", value: "06" },
      ],
    },
  };

  const currentContent =
    contentMap[type] || contentMap["Operating Environment"];

  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 1000;
  const bufferHeight = viewportHeight * 0.5;

  const reverseProgress =
    bufferHeight > 0
      ? Math.max(0, Math.min(1, (bufferHeight - scrollY) / bufferHeight))
      : 0;

  const adjustedScrollY = Math.max(0, scrollY - bufferHeight);
  const progress = Math.min(adjustedScrollY / viewportHeight, 1);

  const reverseScale = 1 - reverseProgress * 0.3;
  const reverseOpacity = 1 - reverseProgress;
  const reverseBlur = reverseProgress * 10;

  const contentScale = 1 + Math.pow(progress, 2.5) * 15;
  const contentBlur = progress * 30;
  const contentOpacity = progress > 0.8 ? 0 : 1 - Math.pow(progress * 1.3, 2);
  const contentTranslateY = -progress * 300;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-50 overflow-y-auto pointer-events-auto hide-scrollbar transition-opacity duration-300 bg-[#020c14] ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      style={{
        scrollBehavior: "smooth",
        overscrollBehavior: "none",
      }}
    >
      <div
        ref={contentWrapperRef}
        className="relative w-full overflow-hidden"
        style={{ height: "250vh" }}
      >
        <div className="h-[50vh] w-full bg-[#050507]" />

        <div
          className="h-screen relative flex flex-col will-change-transform overflow-hidden bg-[#050507]"
          style={{
            opacity: reverseProgress > 0 ? reverseOpacity : contentOpacity,
            transform:
              reverseProgress > 0
                ? `scale(${reverseScale}) translateY(0)`
                : `scale(${contentScale}) translateY(${contentTranslateY}px)`,
            transformOrigin: "center center",
            filter:
              reverseProgress > 0
                ? `blur(${reverseBlur}px)`
                : `blur(${contentBlur}px)`,
            pointerEvents:
              reverseProgress > 0.5 || progress > 0.6 ? "none" : "auto",
            transition:
              reverseProgress > 0
                ? "transform 0.3s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out"
                : "none",
          }}
        >
          <div className="flex justify-between items-start p-8 md:p-12 relative z-10 shrink-0">
            <div className="flex items-start gap-6">
              <button
                onClick={onClose}
                className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 shadow-lg backdrop-blur-md"
              >
                <ArrowLeft className="w-6 h-6 text-white transition-transform group-hover:-translate-x-1" />
              </button>
              <div className="cursor-pointer group" onClick={onGoToDashboard}>
                <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">
                  DOH AUSTRALIA
                </h1>
                <p className="text-lg text-slate-400 font-normal mt-0.5 group-hover:text-slate-200 transition-colors">
                  Experience Gateway
                </p>
              </div>
            </div>
            <button className="text-slate-500 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10 px-8 md:px-24">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative flex items-center justify-center">
                <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] flex items-center justify-center">
                  <div
                    className="absolute inset-[-60px] rounded-full blur-3xl opacity-30"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 60%), radial-gradient(circle at 70% 70%, #ef4444 0%, transparent 60%)`,
                    }}
                  />
                  <GlassCubeWithCircuits isHovered={true} />
                </div>
              </div>

              <div className="space-y-12 max-w-2xl text-left">
                <div className="space-y-6">
                  {currentContent.title}
                  {currentContent.description}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentContent.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-md"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-tech text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={scrollToDeepLayer}
                  className="flex items-center gap-2 text-blue-400 font-bold tracking-[0.2em] uppercase text-xs hover:gap-4 transition-all"
                >
                  Explore...
                </button>
              </div>
            </div>
          </div>

          <div className="p-12 flex justify-between items-end relative z-10 shrink-0">
            <a
              href="https://www.gravityone.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase hover:text-blue-500 transition-colors pointer-events-auto mb-6"
            >
              powered by GravityONE
            </a>
          </div>
        </div>

        <div
          className="relative z-20 h-screen overflow-hidden bg-[#020c14]"
          style={{
            opacity: Math.max(0, (progress - 0.7) * 5),
            transform: `scale(${0.85 + progress * 0.15}) translateY(${
              (1 - progress) * 150
            }px)`,
            transformOrigin: "center center",
            pointerEvents: progress > 0.9 ? "auto" : "none",
          }}
        >
          {type === "Operating Model" ? (
            <CapabilitiesDashboard onBack={handleBackToDetail} />
          ) : type === "Strategic Landscape" ? (
            <StrategicLandscapeView onBack={handleBackToDetail} />
          ) : (
            <TrendsView onBack={handleBackToDetail} />
          )}
        </div>
      </div>
    </div>
  );
};

const NeonSphereItem: React.FC<{
  title: string;
  onClick: (title: string) => void;
}> = ({ title, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group flex flex-col items-center gap-12 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(title)}
    >
      <div className="w-64 md:w-80 aspect-square relative flex items-center justify-center">
        <div
          className={`absolute inset-[-40px] rounded-full transition-all duration-1000 blur-3xl ${
            isHovered ? "opacity-60 scale-125" : "opacity-30 scale-100"
          }`}
          style={{
            background: `radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 60%), radial-gradient(circle at 70% 70%, #ef4444 0%, transparent 60%)`,
          }}
        />
        <GlassCubeWithCircuits isHovered={isHovered} />
      </div>

      <div className="text-center">
        <h3 className="text-base md:text-lg font-tech text-white/50 whitespace-nowrap tracking-wide transition-all duration-700 group-hover:text-white group-hover:tracking-widest group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] uppercase font-medium">
          {title}
        </h3>
      </div>
    </div>
  );
};

const AbstractLayers: React.FC<AbstractLayersProps> = ({
  scrollProgress,
  onExplore,
  activeOverlay,
  setActiveOverlay,
  onSubScroll,
  onCloseOverlay,
  onGoToDashboard,
}) => {
  const [assistantMessage, setAssistantMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scrollProgress && scrollProgress < 0.6) {
      setActiveOverlay(null);
    }
  }, [scrollProgress, setActiveOverlay]);

  const handleOrbClick = async () => {
    if (loading) return;
    setLoading(true);
    setAssistantMessage("Analyzing enterprise data streams...");
    try {
      const insight = await fetchDigitalInsight();
      setAssistantMessage(`${insight.title}: ${insight.content}`);
    } catch (e) {
      setAssistantMessage("System alignment check failed.");
    } finally {
      setLoading(false);
    }
  };

  const items = [
    "Operating Environment",
    "Operating Model",
    "Strategic Landscape",
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 md:p-12 bg-[#050507] relative pointer-events-auto overflow-hidden">
      {activeOverlay && (
        <LayerDetailOverlay
          type={activeOverlay}
          setActiveOverlay={setActiveOverlay}
          onClose={() => {
            setActiveOverlay(null);
            if (onSubScroll) onSubScroll(0);
          }}
          onScrollClose={() => {
            setActiveOverlay(null);
            if (onSubScroll) onSubScroll(0);
          }}
          onExplore={onExplore}
          onSubScroll={onSubScroll}
          onGoToDashboard={onGoToDashboard}
        />
      )}

      <div className={`${activeOverlay ? "hidden" : "contents"}`}>
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[30%] left-[15%] w-[1px] h-[1px] bg-white shadow-[0_0_300px_200px_rgba(59,130,246,0.03)] opacity-40" />
          <div className="absolute bottom-[30%] right-[15%] w-[1px] h-[1px] bg-white shadow-[0_0_300px_200px_rgba(239,68,68,0.03)] opacity-40" />
        </div>

        <div className="flex justify-between items-start">
          <div className="cursor-pointer group" onClick={onGoToDashboard}>
            <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">
              DOH AUSTRALIA
            </h1>
            <p className="text-lg text-gray-400 font-normal mt-0.5 group-hover:text-gray-200 transition-colors">
              Experience Gateway
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <button className="flex items-center gap-2 bg-gray-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 hover:bg-gray-800 transition-colors">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-gray-200 font-medium">Org Summary</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-32 w-full max-w-7xl">
            {items.map((title) => (
              <NeonSphereItem
                key={title}
                title={title}
                onClick={setActiveOverlay}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <a
            href="https://www.gravityone.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase hover:text-blue-500 transition-colors pointer-events-auto"
          >
            powered by GravityONE
          </a>
          <div className="flex flex-col items-end gap-2 relative">
            {assistantMessage && (
              <div className="bg-zinc-900/90 backdrop-blur-xl text-zinc-300 text-base p-5 rounded-2xl rounded-br-none max-w-sm shadow-2xl relative animate-float border border-zinc-700/50">
                {assistantMessage}
                <div className="absolute -bottom-2 right-0 w-4 h-4 bg-zinc-900/90 border-r border-b border-zinc-700/50 transform skew-x-12" />
              </div>
            )}
            <button
              onClick={handleOrbClick}
              className={`w-20 h-20 rounded-full relative group transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                loading ? "cursor-wait" : "cursor-pointer"
              }`}
            >
              <div className="absolute inset-[-10px] bg-blue-500/20 rounded-full blur-2xl opacity-60 group-hover:opacity-90 animate-pulse transition-opacity duration-1000"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-white/20 group-hover:border-white/40">
                <img
                  src="https://raw.githubusercontent.com/hannahmariam01/images/main/ai-assistant%20(1).gif"
                  alt="Assistant Orb"
                  className={`w-full h-full object-cover select-none ${
                    loading ? "animate-pulse opacity-80" : "animate-none"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbstractLayers;

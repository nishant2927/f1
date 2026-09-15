"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Gauge, Wind, Zap, ArrowUp, RotateCcw, Timer, ChevronRight } from "lucide-react";
import { TelemetryMode, TelemetryState } from "@/types";

const telemetryConfigs: Record<TelemetryMode, TelemetryState> = {
  default: {
    mode: "default",
    speed: 285,
    rpm: 10500,
    downforce: 72,
    dragReduction: 0,
    enginePower: 850,
    brakeBias: 56,
    ersDeployment: 40,
  },
  drs: {
    mode: "drs",
    speed: 332,
    rpm: 12200,
    downforce: 48,
    dragReduction: 35,
    enginePower: 910,
    brakeBias: 55,
    ersDeployment: 70,
  },
  topSpeed: {
    mode: "topSpeed",
    speed: 372,
    rpm: 15000,
    downforce: 38,
    dragReduction: 22,
    enginePower: 1050,
    brakeBias: 54,
    ersDeployment: 100,
  },
  highDownforce: {
    mode: "highDownforce",
    speed: 245,
    rpm: 9800,
    downforce: 96,
    dragReduction: -12,
    enginePower: 800,
    brakeBias: 58,
    ersDeployment: 30,
  },
  quali: {
    mode: "quali",
    speed: 355,
    rpm: 14500,
    downforce: 82,
    dragReduction: 10,
    enginePower: 1000,
    brakeBias: 55,
    ersDeployment: 90,
  },
};

const modeButtons = [
  { mode: "drs" as TelemetryMode, label: "DRS Active", icon: Wind, color: "#27F4D2", desc: "Rear wing open — minimal drag" },
  { mode: "topSpeed" as TelemetryMode, label: "V-Max Mode", icon: ArrowUp, color: "#E8002D", desc: "Maximum velocity — full ERS deploy" },
  { mode: "highDownforce" as TelemetryMode, label: "High Downforce", icon: RotateCcw, color: "#FF8000", desc: "Maximum grip — Monaco setup" },
  { mode: "quali" as TelemetryMode, label: "Qualifying", icon: Timer, color: "#3671C6", desc: "Low fuel — push mode activated" },
];

function F1CarSVG({ state }: { state: TelemetryState }) {
  const flapAngle = state.mode === "drs" ? 42 : 0;
  const bodyGlow = state.mode === "topSpeed" ? 0.7 : state.mode === "quali" ? 0.5 : 0.2;
  const wheelSpin = state.rpm / 300;
  const downforceArrows = Math.floor(state.downforce / 15);
  const rearWingAngle = state.mode === "highDownforce" ? -10 : 0;
  const exhaustGlow = state.rpm > 12000 ? 0.9 : state.rpm > 10000 ? 0.5 : 0.25;
  const ersGlow = state.ersDeployment / 100;

  const teamAccent = useMemo(() => {
    switch (state.mode) {
      case "drs": return "#27F4D2";
      case "topSpeed": return "#E8002D";
      case "highDownforce": return "#FF8000";
      case "quali": return "#3671C6";
      default: return "#E8002D";
    }
  }, [state.mode]);

  return (
    <svg viewBox="0 0 800 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#111520" />
          <stop offset="40%" stopColor="#161b28" />
          <stop offset="100%" stopColor="#111520" />
        </linearGradient>
        <linearGradient id="nose-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1f2e" />
          <stop offset="100%" stopColor="#0e1118" />
        </linearGradient>
        <filter id="glow-sm">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-lg">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="exhaust-f">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <radialGradient id="ers-aura">
          <stop offset="0%" stopColor={teamAccent} stopOpacity={ersGlow * 0.3} />
          <stop offset="100%" stopColor={teamAccent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="400" cy="262" rx="290" ry="12" fill="rgba(0,0,0,0.25)" />

      {/* ERS aura around car */}
      {state.ersDeployment > 50 && (
        <ellipse cx="400" cy="190" rx="220" ry="60" fill="url(#ers-aura)">
          <animate attributeName="rx" values="210;230;210" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
      )}

      {/* Floor / diffuser */}
      <path d="M165,232 L170,248 L630,248 L635,232 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

      {/* Exhaust flames */}
      <g filter="url(#exhaust-f)">
        <ellipse cx="148" cy="212" rx="18" ry="5" fill="#E8002D" opacity={exhaustGlow * 0.5}>
          <animate attributeName="rx" values="14;22;14" dur="0.35s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="148" cy="212" rx="11" ry="3" fill="#FF8000" opacity={exhaustGlow * 0.7}>
          <animate attributeName="rx" values="8;15;8" dur="0.25s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="148" cy="212" rx="6" ry="1.5" fill="#FFF0D0" opacity={exhaustGlow * 0.9}>
          <animate attributeName="rx" values="4;8;4" dur="0.2s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Main body shell */}
      <path
        d="M185,212 L195,172 L225,142 L310,122 L430,117 L560,120 L625,132 L655,162 L665,202 L665,232 L185,232 Z"
        fill="url(#body-grad)"
        stroke={`${teamAccent}`}
        strokeWidth="0.8"
        strokeOpacity={bodyGlow}
        filter="url(#glow-sm)"
      />

      {/* Body highlight line */}
      <path d="M210,165 Q400,150 640,168" fill="none" stroke={teamAccent} strokeWidth="1" opacity={bodyGlow * 0.6} />

      {/* Nose cone */}
      <path d="M665,178 L725,187 L735,191 L725,196 L665,202 Z" fill="url(#nose-grad)" stroke={teamAccent} strokeWidth="1" opacity="0.9" />

      {/* Nose tip LED */}
      <circle cx="730" cy="191" r="2.5" fill={teamAccent}>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="r" values="2;3;2" dur="1.2s" repeatCount="indefinite" />
      </circle>

      {/* Cockpit / halo */}
      <path d="M505,120 L535,112 L585,110 L615,117 L625,132 L560,120 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

      {/* Halo device */}
      <path d="M520,115 Q560,100 605,112" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <path d="M520,115 Q560,100 605,112" fill="none" stroke={teamAccent} strokeWidth="0.5" opacity="0.3" />

      {/* Driver helmet */}
      <ellipse cx="565" cy="114" rx="14" ry="9" fill="#1a1a2e" stroke={teamAccent} strokeWidth="0.6" opacity="0.8" />
      <ellipse cx="565" cy="114" rx="10" ry="6" fill="#0d0d14" />
      <path d="M558,111 L572,111" stroke={teamAccent} strokeWidth="0.3" opacity="0.5" />

      {/* Sidepod intakes */}
      <path d="M355,142 L365,137 L405,135 L405,158 L365,158 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

      {/* Sidepod surface lines */}
      <path d="M365,142 L510,140" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M365,150 L510,148" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

      {/* Engine cover / shark fin */}
      <path d="M285,132 L305,97 L425,95 L445,132 Z" fill="#111520" stroke={teamAccent} strokeWidth="0.6" opacity="0.5" />

      {/* T-cam strip */}
      <path d="M310,97 L420,95" fill="none" stroke={teamAccent} strokeWidth="2" opacity="0.3" />

      {/* Rear wing endplates */}
      <rect x="162" y="102" width="5" height="102" rx="1.5" fill="#1a1f2e" stroke={teamAccent} strokeWidth="0.5" opacity="0.6" />

      {/* Rear wing — animated for DRS / downforce */}
      <g transform={`rotate(${rearWingAngle}, 200, 152)`}>
        <rect x="168" y="107" width="68" height="8" rx="2" fill="#111520" stroke={teamAccent} strokeWidth="1" />
        <rect x="168" y="122" width="68" height="6" rx="2" fill="#111520" stroke={teamAccent} strokeWidth="0.8" opacity="0.8" />
        <rect x="170" y="114" width="64" height="3" rx="1" fill={teamAccent} opacity="0.15" />
      </g>

      {/* DRS flap indicator */}
      <AnimatePresence>
        {state.mode === "drs" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <rect x="170" y={107 - flapAngle * 0.3} width="64" height="3.5" rx="1" fill="#27F4D2" opacity="0.9">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.8s" repeatCount="indefinite" />
            </rect>
            <text x="202" y={102 - flapAngle * 0.3} textAnchor="middle" fill="#27F4D2" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
              DRS OPEN
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Front wing */}
      <path d="M665,178 L705,168 L735,163 L745,165 L735,172 L705,180 L665,188 Z" fill="#111520" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <path d="M685,170 L725,164 L735,165 L725,169 L685,175 Z" fill="none" stroke={teamAccent} strokeWidth="0.4" opacity="0.4" />

      {/* Rear wheels */}
      <g transform="translate(225, 228)">
        <circle r="26" fill="#0d0d0d" stroke="#222" strokeWidth="2" />
        <circle r="21" fill="#080808" stroke="#333" strokeWidth="0.8" />
        <g style={{ transform: `rotate(${wheelSpin}deg)`, transformOrigin: "center" }}>
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line key={angle} x1="0" y1="-6" x2="0" y2="-19" stroke="#444" strokeWidth="1.5" transform={`rotate(${angle})`} />
          ))}
          <circle r="8" fill="none" stroke={teamAccent} strokeWidth="0.3" opacity="0.3" />
        </g>
        <circle r="5" fill="#222" stroke="#444" strokeWidth="1" />
        {state.mode === "topSpeed" && (
          <circle r="28" fill="none" stroke="#E8002D" strokeWidth="0.5" opacity="0.4">
            <animate attributeName="r" values="26;32;26" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="0.4s" repeatCount="indefinite" />
          </circle>
        )}
      </g>

      {/* Front wheels */}
      <g transform="translate(625, 228)">
        <circle r="23" fill="#0d0d0d" stroke="#222" strokeWidth="2" />
        <circle r="18" fill="#080808" stroke="#333" strokeWidth="0.8" />
        <g style={{ transform: `rotate(${wheelSpin}deg)`, transformOrigin: "center" }}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <line key={angle} x1="0" y1="-4" x2="0" y2="-16" stroke="#444" strokeWidth="1.5" transform={`rotate(${angle})`} />
          ))}
        </g>
        <circle r="4" fill="#222" stroke="#444" strokeWidth="1" />
      </g>

      {/* Downforce visualization — arrows for high downforce mode */}
      {state.mode === "highDownforce" && (
        <g opacity="0.5">
          {[...Array(downforceArrows)].map((_, i) => (
            <motion.g key={i} initial={{ opacity: 0, y: -15 }} animate={{ opacity: 0.5, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
              <line x1={250 + i * 38} y1={75} x2={250 + i * 38} y2={108} stroke="#FF8000" strokeWidth="1" />
              <polygon points={`${246 + i * 38},112 ${250 + i * 38},122 ${254 + i * 38},112`} fill="#FF8000" opacity="0.35" />
            </motion.g>
          ))}
        </g>
      )}

      {/* Speed lines for high speed */}
      {state.speed > 300 && (
        <g opacity="0.25">
          {[...Array(8)].map((_, i) => (
            <line key={i} x1={100 - i * 15} y1={165 + i * 10} x2={135 - i * 15} y2={165 + i * 10} stroke={teamAccent} strokeWidth="0.8">
              <animate attributeName="x1" values={`${100 - i * 15};${85 - i * 15};${100 - i * 15}`} dur="0.25s" repeatCount="indefinite" />
              <animate attributeName="x2" values={`${135 - i * 15};${120 - i * 15};${135 - i * 15}`} dur="0.25s" repeatCount="indefinite" />
            </line>
          ))}
        </g>
      )}

      {/* Qualifying lightning bolts */}
      {state.mode === "quali" && (
        <g opacity="0.4">
          {[200, 400, 600].map((x) => (
            <g key={x}>
              <path d={`M${x},80 L${x + 5},95 L${x - 2},95 L${x + 3},115`} fill="none" stroke="#3671C6" strokeWidth="1" strokeLinecap="round">
                <animate attributeName="opacity" values="0;0.6;0" dur={`${0.8 + Math.random()}s`} repeatCount="indefinite" />
              </path>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

function TelemetryGauge({
  label, value, max, unit, color, icon: Icon,
}: {
  label: string; value: number; max: number; unit: string; color: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
}) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-5 group hover:border-white/8 transition-all duration-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em]">{label}</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color }}>{unit}</span>
      </div>

      <div className="flex items-end gap-3">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none" stroke={color}
              strokeWidth="4" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-mono opacity-50" style={{ color }}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-2xl font-black tracking-tight font-mono" style={{ color }}>
            {value.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-3 h-1 bg-white/[0.03] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function CarVisualizer() {
  const [mode, setMode] = useState<TelemetryMode>("default");
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentState = telemetryConfigs[mode];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 0]);

  return (
    <section id="car-visualizer" ref={sectionRef} className="relative py-24 sm:py-36">
      {/* Premium background glow */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#E8002D]/5 blur-[100px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8002D]/10 border border-[#E8002D]/20 text-[10px] font-mono text-[#E8002D] tracking-[0.2em] uppercase mb-5">
            <Gauge className="w-3 h-3" />
            Real-Time Telemetry
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Car Telemetry
            <span className="text-gradient-red"> Visualizer</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-sm leading-relaxed">
            Toggle performance modes to see real-time telemetry data dynamically animate across the car vector visualization.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2.5 mb-10"
        >
          <button
            onClick={() => setMode("default")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium transition-all duration-500 ${
              mode === "default"
                ? "bg-white/10 border border-white/15 text-white shadow-lg shadow-white/5"
                : "bg-white/[0.02] border border-white/[0.04] text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Standard
          </button>
          {modeButtons.map((btn) => (
            <motion.button
              key={btn.mode}
              onClick={() => setMode(btn.mode)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium transition-all duration-500 overflow-hidden ${
                mode === btn.mode
                  ? "text-white shadow-lg"
                  : "bg-white/[0.02] border border-white/[0.04] text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
              }`}
              style={
                mode === btn.mode
                  ? {
                      backgroundColor: `${btn.color}12`,
                      borderColor: `${btn.color}35`,
                      boxShadow: `0 0 30px ${btn.color}15, 0 8px 24px ${btn.color}10`,
                    }
                  : undefined
              }
            >
              {mode === btn.mode && (
                <motion.div
                  layoutId="mode-glow"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `radial-gradient(circle at center, ${btn.color}10, transparent)` }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <btn.icon className="w-3.5 h-3.5 relative z-10" style={mode === btn.mode ? { color: btn.color } : undefined} />
              <span className="relative z-10">{btn.label}</span>
              {mode === btn.mode && <ChevronRight className="w-3 h-3 relative z-10 opacity-50" />}
            </motion.button>
          ))}
        </motion.div>

        {/* Mode description */}
        <AnimatePresence mode="wait">
          {mode !== "default" && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="text-center mb-6"
            >
              <span className="text-xs font-mono text-white/25">
                {modeButtons.find((b) => b.mode === mode)?.desc}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Car Visualization */}
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass-card p-4 sm:p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <div className="relative aspect-[8/3] min-h-[220px]">
            <F1CarSVG state={currentState} />

            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: currentState.mode === "drs" ? "#27F4D2" : currentState.mode === "topSpeed" ? "#E8002D" : currentState.mode === "highDownforce" ? "#FF8000" : currentState.mode === "quali" ? "#3671C6" : "#444",
                  boxShadow: `0 0 8px ${currentState.mode === "drs" ? "#27F4D2" : currentState.mode === "topSpeed" ? "#E8002D" : currentState.mode === "highDownforce" ? "#FF8000" : currentState.mode === "quali" ? "#3671C6" : "#444"}40`,
                }}
              />
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em]">
                {mode === "default" ? "Standard" : mode === "drs" ? "DRS Open" : mode === "topSpeed" ? "V-Max" : mode === "highDownforce" ? "Max Downforce" : "Quali Push"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Telemetry Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TelemetryGauge label="Speed" value={currentState.speed} max={400} unit="km/h" color="#E8002D" icon={ArrowUp} />
          <TelemetryGauge label="RPM" value={currentState.rpm} max={15000} unit="rev/min" color="#3671C6" icon={Gauge} />
          <TelemetryGauge label="Downforce" value={currentState.downforce} max={100} unit="%" color="#FF8000" icon={RotateCcw} />
          <TelemetryGauge label="Power" value={currentState.enginePower} max={1100} unit="bhp" color="#27F4D2" icon={Zap} />
        </div>

        {/* Extra telemetry row */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="text-[10px] font-mono text-white/30 uppercase">ERS Deploy</div>
            <div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#27F4D2]"
                initial={{ width: 0 }}
                animate={{ width: `${currentState.ersDeployment}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="text-sm font-mono font-bold text-[#27F4D2]">{currentState.ersDeployment}%</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="text-[10px] font-mono text-white/30 uppercase">Brake Bias</div>
            <div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#FF8000]"
                initial={{ width: 0 }}
                animate={{ width: `${(currentState.brakeBias / 70) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="text-sm font-mono font-bold text-[#FF8000]">{currentState.brakeBias}% F</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

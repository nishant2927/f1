"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Wind, Zap, ArrowUp, RotateCcw } from "lucide-react";
import { TelemetryMode, TelemetryState } from "@/types";

const telemetryConfigs: Record<TelemetryMode, TelemetryState> = {
  default: {
    mode: "default",
    speed: 280,
    rpm: 10500,
    downforce: 70,
    dragReduction: 0,
    enginePower: 850,
  },
  drs: {
    mode: "drs",
    speed: 330,
    rpm: 12000,
    downforce: 50,
    dragReduction: 35,
    enginePower: 900,
  },
  topSpeed: {
    mode: "topSpeed",
    speed: 370,
    rpm: 15000,
    downforce: 40,
    dragReduction: 20,
    enginePower: 1050,
  },
  highDownforce: {
    mode: "highDownforce",
    speed: 240,
    rpm: 9800,
    downforce: 95,
    dragReduction: -10,
    enginePower: 800,
  },
};

const modeButtons = [
  { mode: "drs" as TelemetryMode, label: "DRS Active", icon: Wind, color: "#00F5D4" },
  { mode: "topSpeed" as TelemetryMode, label: "Top Speed", icon: ArrowUp, color: "#E5053A" },
  { mode: "highDownforce" as TelemetryMode, label: "High Downforce", icon: RotateCcw, color: "#FF8000" },
];

function F1CarSVG({ state, scrollProgress }: { state: TelemetryState; scrollProgress: number }) {
  const flapAngle = state.mode === "drs" ? 45 : 0;
  const bodyGlow = state.mode === "topSpeed" ? 0.6 : 0.2;
  const wheelSpin = state.rpm / 500;
  const downforceArrows = Math.floor(state.downforce / 20);
  const rearWingAngle = state.mode === "highDownforce" ? -8 : 0;
  const exhaustGlow = state.rpm > 11000 ? 0.8 : 0.3;

  return (
    <svg viewBox="0 0 800 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="body-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="50%" stopColor="#16213e" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
        <linearGradient id="engine-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E5053A" stopOpacity={exhaustGlow} />
          <stop offset="100%" stopColor="#E5053A" stopOpacity="0" />
        </linearGradient>
        <filter id="car-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="exhaust-filter">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <clipPath id="car-clip">
          <rect x="120" y="80" width="560" height="160" />
        </clipPath>
      </defs>

      <g transform={`translate(${scrollProgress * -20}, 0)`}>
        {/* Shadow */}
        <ellipse cx="400" cy="260" rx="280" ry="15" fill="rgba(0,0,0,0.3)" />

        {/* Floor tray / diffuser */}
        <path
          d="M160,230 L165,245 L635,245 L640,230 Z"
          fill="#0d1117"
          stroke="#ffffff08"
          strokeWidth="0.5"
        />

        {/* Exhaust flames */}
        <g filter="url(#exhaust-filter)">
          <ellipse cx="145" cy="210" rx="18" ry="6" fill="#E5053A" opacity={exhaustGlow * 0.6}>
            <animate attributeName="rx" values="16;20;16" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="145" cy="210" rx="12" ry="3" fill="#FF8000" opacity={exhaustGlow * 0.8}>
            <animate attributeName="rx" values="10;14;10" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Main body */}
        <path
          d="M180,210 L190,170 L220,140 L300,120 L420,115 L550,118 L620,130 L650,160 L660,200 L660,230 L180,230 Z"
          fill="url(#body-gradient)"
          stroke={`rgba(229,5,58,${bodyGlow})`}
          strokeWidth="1.5"
          filter="url(#car-glow)"
        />

        {/* Nose cone */}
        <path
          d="M660,175 L720,185 L730,190 L720,195 L660,200 Z"
          fill="#1a1a2e"
          stroke="#E5053A"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* Nose tip accent */}
        <circle cx="725" cy="190" r="2" fill="#E5053A">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Cockpit */}
        <path
          d="M500,118 L530,110 L580,108 L610,115 L620,130 L550,118 Z"
          fill="#0a0d12"
          stroke="#ffffff10"
          strokeWidth="0.5"
        />

        {/* Driver helmet */}
        <ellipse cx="560" cy="112" rx="15" ry="10" fill="#2a2a3e" stroke="#00F5D4" strokeWidth="0.8" opacity="0.8" />

        {/* Sidepod intakes */}
        <path
          d="M350,140 L360,135 L400,133 L400,155 L360,155 Z"
          fill="#0d1117"
          stroke="#ffffff08"
          strokeWidth="0.5"
        />

        {/* Sidepod surface detail */}
        <path
          d="M360,140 L500,138 L500,150 L360,152 Z"
          fill="none"
          stroke="#ffffff08"
          strokeWidth="0.5"
        />

        {/* Engine cover fin */}
        <path
          d="M280,130 L300,95 L420,93 L440,130 Z"
          fill="#1a1a2e"
          stroke="#E5053A"
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* Rear wing endplates */}
        <rect x="160" y="100" width="5" height="100" rx="1" fill="#2a2a3e" stroke="#E5053A" strokeWidth="0.5" />

        {/* Rear wing main plane */}
        <g transform={`rotate(${rearWingAngle}, 200, 150)`}>
          <rect x="165" y="105" width="70" height="8" rx="2" fill="#1a1a2e" stroke="#E5053A" strokeWidth="1" />
          <rect x="165" y="120" width="70" height="6" rx="2" fill="#1a1a2e" stroke="#E5053A" strokeWidth="0.8" />
        </g>

        {/* DRS flap indicator */}
        <AnimatePresence>
          {state.mode === "drs" && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <rect
                x="168"
                y={105 - flapAngle * 0.3}
                width="64"
                height="4"
                rx="1"
                fill="#00F5D4"
                opacity="0.8"
              />
              <text x="200" y={100 - flapAngle * 0.3} textAnchor="middle" fill="#00F5D4" fontSize="8" fontFamily="monospace">
                DRS
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Front wing */}
        <path
          d="M660,175 L700,165 L730,160 L740,162 L730,170 L700,178 L660,185 Z"
          fill="#1a1a2e"
          stroke="#ffffff10"
          strokeWidth="0.5"
        />

        {/* Front wing flaps */}
        <path
          d="M680,167 L720,160 L730,161 L720,166 L680,173 Z"
          fill="none"
          stroke="#00F5D4"
          strokeWidth="0.5"
          opacity="0.5"
        />

        {/* Rear wheels */}
        <g transform="translate(220, 225)">
          <circle r="25" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
          <circle r="20" fill="#0d0d0d" stroke="#444" strokeWidth="1" />
          <g style={{ transform: `rotate(${wheelSpin}deg)`, transformOrigin: "center" }}>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line key={angle} x1="0" y1="-5" x2="0" y2="-18" stroke="#555" strokeWidth="1.5"
                transform={`rotate(${angle})`} />
            ))}
          </g>
          <circle r="5" fill="#333" stroke="#555" strokeWidth="1" />
          {state.mode === "topSpeed" && (
            <circle r="27" fill="none" stroke="#E5053A" strokeWidth="0.5" opacity="0.5">
              <animate attributeName="r" values="25;30;25" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="0.5s" repeatCount="indefinite" />
            </circle>
          )}
        </g>

        {/* Front wheels */}
        <g transform="translate(620, 225)">
          <circle r="22" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
          <circle r="17" fill="#0d0d0d" stroke="#444" strokeWidth="1" />
          <g style={{ transform: `rotate(${wheelSpin}deg)`, transformOrigin: "center" }}>
            {[0, 72, 144, 216, 288].map((angle) => (
              <line key={angle} x1="0" y1="-4" x2="0" y2="-15" stroke="#555" strokeWidth="1.5"
                transform={`rotate(${angle})`} />
            ))}
          </g>
          <circle r="4" fill="#333" stroke="#555" strokeWidth="1" />
        </g>

        {/* Downforce visualization arrows */}
        {state.mode === "highDownforce" && (
          <g opacity="0.6">
            {[...Array(downforceArrows)].map((_, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <line
                  x1={250 + i * 40}
                  y1={80}
                  x2={250 + i * 40}
                  y2={110}
                  stroke="#FF8000"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead)"
                />
                <polygon
                  points={`${245 + i * 40},115 ${250 + i * 40},125 ${255 + i * 40},115`}
                  fill="#FF8000"
                  opacity="0.4"
                />
              </motion.g>
            ))}
          </g>
        )}

        {/* Speed lines */}
        {state.speed > 300 && (
          <g opacity="0.3">
            {[...Array(5)].map((_, i) => (
              <line
                key={i}
                x1={100 - i * 20}
                y1={170 + i * 12}
                x2={140 - i * 20}
                y2={170 + i * 12}
                stroke="#00F5D4"
                strokeWidth="1"
              >
                <animate
                  attributeName="x1"
                  values={`${100 - i * 20};${80 - i * 20};${100 - i * 20}`}
                  dur="0.3s"
                  repeatCount="indefinite"
                />
              </line>
            ))}
          </g>
        )}

        {/* Team color accent line on body */}
        <path
          d="M200,200 Q400,185 640,195"
          fill="none"
          stroke="#E5053A"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </g>
    </svg>
  );
}

function TelemetryGauge({
  label,
  value,
  max,
  unit,
  color,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-white/40 uppercase tracking-wider">{label}</span>
        <span className="text-xs font-mono" style={{ color }}>
          {unit}
        </span>
      </div>
      <div className="text-2xl font-mono font-bold mb-2" style={{ color }}>
        {value.toLocaleString()}
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function CarVisualizer() {
  const [mode, setMode] = useState<TelemetryMode>("default");
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentState = telemetryConfigs[mode];

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section
      id="car-visualizer"
      ref={sectionRef}
      className="relative py-20 sm:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ferrari-red/10 border border-ferrari-red/20 text-xs font-mono text-ferrari-red tracking-widest uppercase mb-4">
            <Gauge className="w-3 h-3" />
            Interactive Telemetry
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mb-4">
            Car Telemetry
            <span className="text-ferrari-red"> Visualizer</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Toggle performance modes to see real-time telemetry data change across the car vector visualization
          </p>
        </motion.div>

        {/* Mode Toggle Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <button
            onClick={() => setMode("default")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              mode === "default"
                ? "bg-white/10 border border-white/20 text-white shadow-lg"
                : "bg-white/5 border border-white/5 text-white/40 hover:text-white/70 hover:bg-white/8"
            }`}
          >
            <Zap className="w-4 h-4" />
            Standard Mode
          </button>
          {modeButtons.map((btn) => (
            <button
              key={btn.mode}
              onClick={() => setMode(btn.mode)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                mode === btn.mode
                  ? "border shadow-lg"
                  : "bg-white/5 border border-white/5 text-white/40 hover:text-white/70 hover:bg-white/8"
              }`}
              style={
                mode === btn.mode
                  ? {
                      backgroundColor: `${btn.color}15`,
                      borderColor: `${btn.color}40`,
                      color: btn.color,
                      boxShadow: `0 0 20px ${btn.color}20`,
                    }
                  : undefined
              }
            >
              <btn.icon className="w-4 h-4" />
              {btn.label}
            </button>
          ))}
        </motion.div>

        {/* Car Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass-card p-4 sm:p-8 mb-8"
        >
          <div className="relative aspect-[8/3] min-h-[200px]">
            <F1CarSVG state={currentState} scrollProgress={scrollProgress} />

            {/* Mode indicator overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentState.mode === "drs" ? "#00F5D4" : currentState.mode === "topSpeed" ? "#E5053A" : currentState.mode === "highDownforce" ? "#FF8000" : "#666" }}
              />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                {mode === "default" ? "Standard" : mode === "drs" ? "DRS Open" : mode === "topSpeed" ? "V-Max" : "Max Downforce"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Telemetry Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TelemetryGauge label="Speed" value={currentState.speed} max={400} unit="km/h" color="#E5053A" />
          <TelemetryGauge label="RPM" value={currentState.rpm} max={15000} unit="rev/min" color="#0600EF" />
          <TelemetryGauge label="Downforce" value={currentState.downforce} max={100} unit="%" color="#FF8000" />
          <TelemetryGauge label="Engine Power" value={currentState.enginePower} max={1100} unit="bhp" color="#00F5D4" />
        </div>

        {/* Drag Reduction Indicator */}
        {currentState.dragReduction !== 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 glass-card p-4 flex items-center gap-3"
          >
            <Wind className="w-5 h-5 text-mercedes-cyan" />
            <div>
              <span className="text-sm text-white/60">Drag Reduction: </span>
              <span className="text-sm font-mono font-bold text-mercedes-cyan">
                {currentState.dragReduction > 0 ? "+" : ""}{currentState.dragReduction}%
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

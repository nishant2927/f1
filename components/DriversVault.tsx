"use client";

import { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { X, Trophy, Target, Timer, Droplets, Car, ChevronRight } from "lucide-react";
import { drivers } from "@/data/drivers";
import { Driver, DriverSkillMetrics } from "@/types";

function RadarChart({
  skills,
  color,
  size = 240,
}: {
  skills: DriverSkillMetrics;
  color: string;
  size?: number;
}) {
  const center = size / 2;
  const radius = size * 0.36;
  const labels = [
    { key: "qualifyingPace", label: "Quali", angle: -90 },
    { key: "racecraft", label: "Race", angle: -30 },
    { key: "tireManagement", label: "Tires", angle: 30 },
    { key: "wetWeather", label: "Wet", angle: 90 },
    { key: "overtaking", label: "Over.", angle: 150 },
    { key: "consistency", label: "Cons.", angle: 210 },
  ];

  const getPoint = (angle: number, value: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  };

  const skillValues = labels.map((l) => ({
    ...l,
    value: skills[l.key as keyof DriverSkillMetrics],
  }));

  const polygonPoints = skillValues
    .map((s) => { const p = getPoint(s.angle, s.value); return `${p.x},${p.y}`; })
    .join(" ");

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      <defs>
        <radialGradient id={`rf-${color.replace("#", "")}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.03" />
        </radialGradient>
      </defs>

      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={skillValues.map((s) => {
            const p = getPoint(s.angle, 100 * level);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.5"
        />
      ))}

      {skillValues.map((s) => {
        const p = getPoint(s.angle, 100);
        return (
          <line key={s.key} x1={center} y1={center} x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        );
      })}

      <motion.polygon
        points={polygonPoints}
        fill={`url(#rf-${color.replace("#", "")})`}
        stroke={color}
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {skillValues.map((s) => {
        const p = getPoint(s.angle, s.value);
        return (
          <g key={s.key}>
            <circle cx={p.x} cy={p.y} r="3" fill={color} stroke="#080a0f" strokeWidth="1.5" />
            <circle cx={p.x} cy={p.y} r="5" fill={color} opacity="0.15">
              <animate attributeName="r" values="4;7;4" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0;0.15" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {skillValues.map((s) => {
        const p = getPoint(s.angle, 122);
        return (
          <text key={s.key} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
            {s.label}
          </text>
        );
      })}

      <circle cx={center} cy={center} r="1.5" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function DriverCard({ driver, index }: { driver: Driver; index: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.03);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="glass-card cursor-pointer group hover:border-white/8 transition-all duration-500 relative overflow-hidden"
          onClick={() => setIsModalOpen(true)}
          data-cursor="View"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] opacity-60" style={{ backgroundColor: driver.teamColor }} />

          <div className="p-5 sm:p-6 relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-mono font-black text-base relative overflow-hidden"
                  style={{
                    backgroundColor: `${driver.teamColor}12`,
                    color: driver.teamColor,
                    border: `1px solid ${driver.teamColor}20`,
                  }}
                >
                  {driver.number}
                  <div className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{driver.name}</h3>
                  <p className="text-[10px] text-white/25">{driver.nationality} · {driver.team}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { value: driver.worldChampionships, label: "Titles", color: "#C9A94E" },
                { value: driver.raceWins, label: "Wins", color: driver.teamColor },
                { value: driver.podiums, label: "Podiums", color: "#fff" },
                { value: driver.polePositions, label: "Poles", color: "#fff" },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-2 rounded-lg bg-white/[0.02]">
                  <div className="text-base font-black" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-[8px] font-mono text-white/20 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-1 mb-3">
              {Object.values(driver.skills).map((val, i) => (
                <div key={i} className="flex-1 h-1 rounded-full bg-white/[0.03] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: driver.teamColor }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${val}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/20">
              <span>Since {driver.careerStart}</span>
              <span className="flex items-center gap-1 group-hover:gap-2 transition-all duration-300" style={{ color: driver.teamColor }}>
                Profile <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(to right, ${driver.teamColor}, transparent)` }}
              />

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-7">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono font-black text-2xl"
                      style={{
                        backgroundColor: `${driver.teamColor}15`,
                        color: driver.teamColor,
                        border: `1px solid ${driver.teamColor}25`,
                      }}
                    >
                      {driver.number}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight">{driver.name}</h2>
                      <p className="text-xs text-white/30">
                        {driver.nationality} · {driver.team} · Born {driver.dateOfBirth}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/30" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-7">
                  {[
                    { icon: Trophy, value: driver.worldChampionships, label: "Titles", color: "#C9A94E" },
                    { icon: Target, value: driver.raceWins, label: "Wins", color: "#E8002D" },
                    { icon: Car, value: driver.podiums, label: "Podiums", color: "#27F4D2" },
                    { icon: Timer, value: driver.polePositions, label: "Poles", color: "#3671C6" },
                    { icon: Droplets, value: driver.fastestLaps, label: "FL", color: "#FF8000" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center py-3 rounded-xl bg-white/[0.02]">
                      <stat.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: stat.color }} />
                      <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-[8px] font-mono text-white/20 uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-5">
                  <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Performance Radar</h3>
                  <div className="w-full max-w-[300px] mx-auto">
                    <RadarChart skills={driver.skills} color={driver.teamColor} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(driver.skills).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-[9px] text-white/25 uppercase mb-1.5 tracking-wider">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: driver.teamColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1.2, delay: 0.3 }}
                        />
                      </div>
                      <div className="text-[10px] font-mono mt-1" style={{ color: driver.teamColor }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function DriversVault() {
  return (
    <section id="drivers" className="relative py-24 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#27F4D2]/10 border border-[#27F4D2]/20 text-[10px] font-mono text-[#27F4D2] tracking-[0.2em] uppercase mb-5">
            <Target className="w-3 h-3" />
            Driver Analytics
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Drivers
            <span className="text-[#27F4D2]"> Vault</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-sm leading-relaxed">
            Deep-dive into each driver&apos;s performance metrics with interactive radar charts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" style={{ perspective: "1200px" }}>
          {drivers.map((driver, index) => (
            <DriverCard key={driver.id} driver={driver} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

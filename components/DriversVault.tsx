"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Target, Timer, Droplets, Car } from "lucide-react";
import { drivers } from "@/data/drivers";
import { Driver, DriverSkillMetrics } from "@/types";

function RadarChart({
  skills,
  color,
  size = 200,
}: {
  skills: DriverSkillMetrics;
  color: string;
  size?: number;
}) {
  const center = size / 2;
  const radius = size * 0.38;
  const labels = [
    { key: "qualifyingPace", label: "Qualifying", angle: -90 },
    { key: "racecraft", label: "Racecraft", angle: -30 },
    { key: "tireManagement", label: "Tires", angle: 30 },
    { key: "wetWeather", label: "Wet", angle: 90 },
    { key: "overtaking", label: "Overtaking", angle: 150 },
    { key: "consistency", label: "Consistency", angle: 210 },
  ];

  const getPoint = (angle: number, value: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const skillValues = labels.map((l) => ({
    ...l,
    value: skills[l.key as keyof DriverSkillMetrics],
  }));

  const polygonPoints = skillValues
    .map((s) => {
      const p = getPoint(s.angle, s.value);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      <defs>
        <radialGradient id={`radar-fill-${color.replace("#", "")}`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>

      {/* Grid rings */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={skillValues
            .map((s) => {
              const p = getPoint(s.angle, 100 * level);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />
      ))}

      {/* Axis lines */}
      {skillValues.map((s) => {
        const p = getPoint(s.angle, 100);
        return (
          <line
            key={s.key}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill={`url(#radar-fill-${color.replace("#", "")})`}
        stroke={color}
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* Data points */}
      {skillValues.map((s) => {
        const p = getPoint(s.angle, s.value);
        return (
          <g key={s.key}>
            <circle cx={p.x} cy={p.y} r="3" fill={color} stroke="#0B0E14" strokeWidth="1.5" />
            <circle cx={p.x} cy={p.y} r="5" fill={color} opacity="0.2">
              <animate
                attributeName="r"
                values="4;7;4"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0;0.2"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}

      {/* Labels */}
      {skillValues.map((s) => {
        const p = getPoint(s.angle, 118);
        return (
          <text
            key={s.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(255,255,255,0.4)"
            fontSize="7"
            fontFamily="monospace"
          >
            {s.label}
          </text>
        );
      })}

      {/* Center dot */}
      <circle cx={center} cy={center} r="2" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

function DriverCard({ driver, index }: { driver: Driver; index: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className="glass-card-hover cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-lg"
                style={{
                  backgroundColor: `${driver.teamColor}15`,
                  color: driver.teamColor,
                  border: `1px solid ${driver.teamColor}30`,
                }}
              >
                {driver.number}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">{driver.name}</h3>
                <p className="text-xs text-white/30">{driver.nationality} · {driver.team}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-center py-2 rounded-lg bg-white/3">
              <div className="text-lg font-black" style={{ color: driver.teamColor }}>
                {driver.worldChampionships}
              </div>
              <div className="text-[9px] font-mono text-white/30 uppercase">Titles</div>
            </div>
            <div className="text-center py-2 rounded-lg bg-white/3">
              <div className="text-lg font-black text-white">{driver.raceWins}</div>
              <div className="text-[9px] font-mono text-white/30 uppercase">Wins</div>
            </div>
            <div className="text-center py-2 rounded-lg bg-white/3">
              <div className="text-lg font-black text-white">{driver.podiums}</div>
              <div className="text-[9px] font-mono text-white/30 uppercase">Podiums</div>
            </div>
            <div className="text-center py-2 rounded-lg bg-white/3">
              <div className="text-lg font-black text-white">{driver.polePositions}</div>
              <div className="text-[9px] font-mono text-white/30 uppercase">Poles</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/30">
            <span>Since {driver.careerStart}</span>
            <span
              className="group-hover:translate-x-1 transition-transform"
              style={{ color: driver.teamColor }}
            >
              View Profile →
            </span>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono font-black text-2xl"
                      style={{
                        backgroundColor: `${driver.teamColor}15`,
                        color: driver.teamColor,
                        border: `1px solid ${driver.teamColor}30`,
                      }}
                    >
                      {driver.number}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">{driver.name}</h2>
                      <p className="text-sm text-white/40">
                        {driver.nationality} · {driver.team} · Born {driver.dateOfBirth}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-3 mb-6">
                  {[
                    { icon: Trophy, value: driver.worldChampionships, label: "Championships", color: "#C9A94E" },
                    { icon: Target, value: driver.raceWins, label: "Race Wins", color: "#E5053A" },
                    { icon: Car, value: driver.podiums, label: "Podiums", color: "#00F5D4" },
                    { icon: Timer, value: driver.polePositions, label: "Pole Positions", color: "#0600EF" },
                    { icon: Droplets, value: driver.fastestLaps, label: "Fastest Laps", color: "#FF8000" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center py-3 rounded-xl bg-white/3">
                      <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
                      <div className="text-xl font-black" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                      <div className="text-[8px] font-mono text-white/30 uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-mono text-white/50 uppercase tracking-wider mb-3">
                    Skill Radar
                  </h3>
                  <div className="w-full max-w-[280px] mx-auto">
                    <RadarChart skills={driver.skills} color={driver.teamColor} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(driver.skills).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-white/30 capitalize mb-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: driver.teamColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                      <div className="text-[10px] font-mono mt-1" style={{ color: driver.teamColor }}>
                        {value}/100
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
    <section id="drivers" className="relative py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mercedes-cyan/10 border border-mercedes-cyan/20 text-xs font-mono text-mercedes-cyan tracking-widest uppercase mb-4">
            <Target className="w-3 h-3" />
            Driver Analytics
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mb-4">
            Drivers
            <span className="text-mercedes-cyan"> Vault</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Deep-dive into each driver&apos;s performance metrics with interactive radar charts and detailed career statistics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {drivers.map((driver, index) => (
            <DriverCard key={driver.id} driver={driver} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

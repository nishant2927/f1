"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import { standings2025 } from "@/data/constructors";
import { useRef } from "react";

export default function Standings() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section id="standings" ref={sectionRef} className="relative py-24 sm:py-36">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#27F4D2]/10 border border-[#27F4D2]/20 text-[10px] font-mono text-[#27F4D2] tracking-[0.2em] uppercase mb-5">
            <BarChart3 className="w-3 h-3" />
            2025 Standings
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Driver
            <span className="text-[#27F4D2]"> Standings</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-sm leading-relaxed">
            Current World Championship standings after the latest Grand Prix.
          </p>
        </motion.div>

        <motion.div
          style={{ x: bgX }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card overflow-hidden relative"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#27F4D2]/20 to-transparent" />

          {/* Glow effect */}
          <div className="absolute -top-20 right-0 w-40 h-40 rounded-full bg-[#27F4D2]/5 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_80px_60px_80px] sm:grid-cols-[50px_1fr_100px_80px_80px_100px] gap-2 px-5 py-3 border-b border-white/[0.04] text-[9px] font-mono text-white/20 uppercase tracking-wider">
            <span>Pos</span>
            <span>Driver</span>
            <span className="hidden sm:block">Team</span>
            <span className="text-right">Wins</span>
            <span className="text-right">Points</span>
            <span className="hidden sm:block text-right">Gap</span>
          </div>

          {/* Rows */}
          {standings2025.map((entry, index) => {
            const maxPoints = standings2025[0].points;
            const barWidth = (entry.points / maxPoints) * 100;
            const gap = index === 0 ? "—" : `-${maxPoints - entry.points}`;

            return (
              <motion.div
                key={entry.position}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                className="relative grid grid-cols-[40px_1fr_80px_60px_80px] sm:grid-cols-[50px_1fr_100px_80px_80px_100px] gap-2 px-5 py-3.5 items-center border-b border-white/[0.02] transition-colors group cursor-default"
              >
                {/* Background bar */}
                <div
                  className="absolute left-0 top-0 h-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: entry.teamColor,
                  }}
                />

                {/* Left accent */}
                <div
                  className="absolute left-0 top-0 h-full w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: entry.teamColor }}
                />

                {/* Position */}
                <span className={`text-sm font-black relative z-10 ${
                  entry.position <= 3 ? "text-white" : "text-white/30"
                }`}>
                  {entry.position <= 3 && (
                    <span className="mr-1">
                      {entry.position === 1 ? "🥇" : entry.position === 2 ? "🥈" : "🥉"}
                    </span>
                  )}
                  {entry.position}
                </span>

                {/* Driver */}
                <div className="relative z-10 flex items-center gap-2">
                  <div
                    className="w-1 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.teamColor }}
                  />
                  <div>
                    <span className="text-xs font-bold text-white">{entry.driver}</span>
                    <span className="text-[10px] font-mono text-white/20 ml-1.5">#{entry.driverNumber}</span>
                  </div>
                </div>

                {/* Team */}
                <span className="hidden sm:block text-[10px] text-white/25 relative z-10">{entry.team}</span>

                {/* Wins */}
                <span className="text-right text-xs font-mono text-white/40 relative z-10">
                  {entry.wins > 0 ? entry.wins : "—"}
                </span>

                {/* Points */}
                <span className="text-right text-sm font-black font-mono relative z-10" style={{ color: entry.teamColor }}>
                  {entry.points}
                </span>

                {/* Gap */}
                <span className="hidden sm:block text-right text-[10px] font-mono text-white/20 relative z-10">
                  {gap}
                </span>
              </motion.div>
            );
          })}

          {/* Footer */}
          <div className="px-5 py-3 flex items-center justify-between text-[9px] font-mono text-white/15">
            <span>Provisional standings</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5" />Updated after Round 16</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

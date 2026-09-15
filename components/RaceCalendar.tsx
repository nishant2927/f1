"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Timer } from "lucide-react";
import { raceCalendar2025 } from "@/data/constructors";
import { useRef, useState } from "react";

function RaceCard({ race, index }: { race: typeof raceCalendar2025[0]; index: number }) {
  const isCompleted = new Date(race.date) < new Date("2025-09-15");
  const isNext = !isCompleted && index === raceCalendar2025.findIndex((r) => new Date(r.date) >= new Date("2025-09-15"));
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--mouse-x", `${x}%`);
    cardRef.current.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.08 }}
      onMouseMove={handleMouseMove}
      className={`premium-card p-4 group hover:border-white/10 transition-all duration-500 ${
        isNext ? "ring-1 ring-[#E8002D]/30" : ""
      }`}
    >
      {isNext && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E8002D] to-[#FF8000]" />
      )}

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
          isCompleted ? "bg-white/[0.03]" : isNext ? "bg-[#E8002D]/15" : "bg-white/[0.03]"
        }`}>
          {race.flag}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono text-white/20">R{race.round.toString().padStart(2, "0")}</span>
            {isNext && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#E8002D]/20 text-[#E8002D]">NEXT</span>}
            {isCompleted && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/20">DONE</span>}
          </div>
          <h4 className="text-xs font-bold text-white truncate">{race.name}</h4>
          <p className="text-[10px] text-white/25">{race.location}, {race.country}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-[9px] text-white/20 font-mono">
        <span className="flex items-center gap-1"><Timer className="w-2.5 h-2.5" />{race.length}</span>
        <span>{race.laps} laps</span>
        <span>{new Date(race.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>
    </motion.div>
  );
}

export default function RaceCalendar() {
  const [filter, setFilter] = useState<"all" | "completed" | "upcoming">("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  const filteredRaces = raceCalendar2025.filter((race) => {
    const isCompleted = new Date(race.date) < new Date("2025-09-15");
    if (filter === "completed") return isCompleted;
    if (filter === "upcoming") return !isCompleted;
    return true;
  });

  return (
    <section id="calendar" ref={containerRef} className="relative py-24 sm:py-36">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-[#FF8000]/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8000]/10 border border-[#FF8000]/20 text-[10px] font-mono text-[#FF8000] tracking-[0.2em] uppercase mb-5">
            <Calendar className="w-3 h-3" />
            2025 Season
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Race
            <span className="text-[#FF8000]"> Calendar</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-sm leading-relaxed">
            24 races across 5 continents. The most packed calendar in F1 history.
          </p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-8">
          {(["all", "completed", "upcoming"] as const).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                filter === f
                  ? "bg-white/10 border border-white/10 text-white shadow-lg shadow-white/5"
                  : "bg-white/[0.02] border border-white/[0.04] text-white/30 hover:text-white/60"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredRaces.map((race, index) => (
            <RaceCard key={race.round} race={race} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

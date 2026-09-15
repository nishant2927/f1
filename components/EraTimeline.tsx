"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Trophy, Wrench, Gauge, Zap, Battery } from "lucide-react";
import { eras } from "@/data/eras";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>> = {
  trophy: Trophy,
  wrench: Wrench,
  gauge: Gauge,
  zap: Zap,
  battery: Battery,
};

function EraCard({ era, index }: { era: typeof eras[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = iconMap[era.icon] || Trophy;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-center gap-6 sm:gap-10 ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Content */}
      <div className="flex-1">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 sm:p-8 relative overflow-hidden group hover:border-white/8 transition-all duration-700"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(to right, ${era.color}, transparent)` }} />

          {/* Radial glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle at ${index % 2 === 0 ? "100% 0%" : "0% 0%"}, ${era.color}08, transparent 60%)`,
            }}
          />

          {/* Corner glow */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ backgroundColor: `${era.color}10` }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: `${era.color}12`,
                  border: `1px solid ${era.color}25`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: era.color }} />
              </motion.div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{era.name}</h3>
                <span className="text-xs font-mono tracking-wider" style={{ color: era.color }}>
                  {era.years}
                </span>
              </div>
            </div>

            <p className="text-sm text-white/40 leading-relaxed mb-5">{era.description}</p>

            <div className="mb-4">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">Key Innovations</span>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {era.keyInnovations.map((innovation, i) => (
                  <motion.span
                    key={innovation}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.06)" }}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.04] text-white/35 hover:text-white/60 hover:border-white/10 transition-all duration-300 cursor-default"
                  >
                    {innovation}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-white/25">
              <Trophy className="w-3 h-3" style={{ color: era.color }} />
              <span>Dominant: <span className="text-white/45">{era.dominantTeam}</span></span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline dot */}
      <div className="relative flex-shrink-0 hidden sm:block">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 300 }}
          className="w-6 h-6 rounded-full border-2 relative z-10"
          style={{
            borderColor: era.color,
            backgroundColor: isInView ? era.color : "transparent",
            boxShadow: isInView ? `0 0 20px ${era.color}40, 0 0 40px ${era.color}20` : "none",
          }}
        />
        {/* Pulse ring */}
        {isInView && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${era.color}` }}
          />
        )}
      </div>

      {/* Spacer for alignment */}
      <div className="flex-1 hidden sm:block" />
    </motion.div>
  );
}

export default function EraTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  return (
    <section id="timeline" ref={containerRef} className="relative py-24 sm:py-36">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#FF8000]/3 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8000]/10 border border-[#FF8000]/20 text-[10px] font-mono text-[#FF8000] tracking-[0.2em] uppercase mb-5">
            <Gauge className="w-3 h-3" />
            Heritage
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            F1 Era
            <span className="text-[#FF8000]"> Timeline</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-sm leading-relaxed">
            Journey through the transformative eras that defined Formula 1.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-[1px] bg-white/[0.04] hidden sm:block">
            <motion.div
              className="w-full bg-gradient-to-b from-[#E8002D]/30 via-[#FF8000]/30 to-[#3671C6]/30"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-10 sm:space-y-14">
            {eras.map((era, index) => (
              <EraCard key={era.id} era={era} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = iconMap[era.icon] || Trophy;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-center gap-8 ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Content */}
      <div className="flex-1">
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{ background: `linear-gradient(to right, ${era.color}, transparent)` }}
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(circle at ${index % 2 === 0 ? "100% 0%" : "0% 0%"}, ${era.color}, transparent 60%)`,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${era.color}15`,
                  border: `1px solid ${era.color}30`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: era.color }} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{era.name}</h3>
                <span className="text-xs font-mono" style={{ color: era.color }}>
                  {era.years}
                </span>
              </div>
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-4">{era.description}</p>

            <div className="mb-3">
              <span className="text-xs font-mono text-white/30 uppercase tracking-wider">
                Key Innovations
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {era.keyInnovations.map((innovation) => (
                  <span
                    key={innovation}
                    className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 border border-white/5 text-white/40"
                  >
                    {innovation}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/30">
              <Trophy className="w-3 h-3" style={{ color: era.color }} />
              <span>Dominant: <span className="text-white/50">{era.dominantTeam}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline dot */}
      <div className="relative flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-5 h-5 rounded-full border-2 relative z-10"
          style={{
            borderColor: era.color,
            backgroundColor: isInView ? era.color : "transparent",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: `${era.color}30` }}
          />
        </motion.div>
      </div>

      {/* Spacer for alignment */}
      <div className="flex-1 hidden sm:block" />
    </motion.div>
  );
}

export default function EraTimeline() {
  return (
    <section id="timeline" className="relative py-20 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mclaren-papaya/10 border border-mclaren-papaya/20 text-xs font-mono text-mclaren-papaya tracking-widest uppercase mb-4">
            <Gauge className="w-3 h-3" />
            Heritage
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mb-4">
            F1 Era
            <span className="text-mclaren-papaya"> Timeline</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Journey through the transformative eras that defined Formula 1, from the golden age to the hybrid revolution.
          </p>
        </motion.div>

        {/* Timeline line */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="space-y-12 sm:space-y-16">
            {eras.map((era, index) => (
              <EraCard key={era.id} era={era} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

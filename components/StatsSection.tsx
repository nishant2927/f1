"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

function AnimatedCounter({ from = 0, to, duration = 2, suffix = "", prefix = "", className }: CounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const diff = to - from;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + diff * eased));

      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [from, to, duration, isInView]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const stats = [
    { value: 24, suffix: "", label: "Races Per Season", color: "#E8002D", icon: "🏁" },
    { value: 10, suffix: "", label: "Teams on the Grid", color: "#3671C6", icon: "🏎️" },
    { value: 20, suffix: "", label: "Drivers Competing", color: "#27F4D2", icon: "🏆" },
    { value: 1100, suffix: "+", label: "Grand Prix to Date", color: "#FF8000", icon: "⚡" },
  ];

  return (
    <section ref={sectionRef} className="relative py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: bgY }}
          className="glass-card p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8002D]/5 via-transparent to-[#3671C6]/5" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#E8002D]/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#3671C6]/5 blur-3xl" />
          </div>

          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8002D]/20 to-transparent" />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div
                  className="text-4xl sm:text-5xl font-black tracking-tighter mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} className="" />
                </div>
                <div className="w-8 h-0.5 mx-auto mb-3 rounded-full transition-all duration-500 group-hover:w-12" style={{ backgroundColor: stat.color }} />
                <div className="text-xs font-mono text-white/30 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

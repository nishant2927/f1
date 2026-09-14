"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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
  const stats = [
    { value: 24, suffix: "", label: "Races Per Season", color: "#E8002D" },
    { value: 10, suffix: "", label: "Teams on the Grid", color: "#3671C6" },
    { value: 20, suffix: "", label: "Drivers Competing", color: "#27F4D2" },
    { value: 1100, suffix: "+", label: "Grand Prix to Date", color: "#FF8000" },
  ];

  return (
    <section className="relative py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12">
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8002D]/5 via-transparent to-[#3671C6]/5" />
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-black tracking-tighter mb-2">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} className="" />
                </div>
                <div className="w-8 h-0.5 mx-auto mb-3 rounded-full" style={{ backgroundColor: stat.color }} />
                <div className="text-xs font-mono text-white/30 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

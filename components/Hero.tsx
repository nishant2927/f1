"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { ChevronDown, Zap, Timer, Trophy, ArrowRight } from "lucide-react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function TextScramble({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let iteration = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplay(
          text.split("").map((char, index) => {
            if (index < iteration) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay, isInView]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  const stats = [
    { icon: Zap, value: "350+", label: "km/h Top Speed", color: "#E8002D" },
    { icon: Timer, value: "75", label: "Years of Racing", color: "#27F4D2" },
    { icon: Trophy, value: "1,100+", label: "Grand Prix Races", color: "#FF8000" },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Telemetry SVG lines */}
      <div className="absolute inset-0 z-[1]">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="hero-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8002D" stopOpacity="0" />
              <stop offset="50%" stopColor="#E8002D" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF8000" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(10)].map((_, i) => (
            <path
              key={i}
              d={`M${-100 + i * 40},${800 - i * 55} Q${600 + Math.sin(i * 0.7) * 250},${350 + Math.cos(i * 0.5) * 120} ${1400 + i * 20},${i * 60}`}
              fill="none"
              stroke="url(#hero-line)"
              strokeWidth="0.8"
              className="telemetry-line"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Text readability overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#050709]/60 via-[#050709]/40 to-[#050709]/80" />

      <motion.div style={{ y: springY, opacity, scale }} className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-white/40 tracking-[0.25em] uppercase backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27F4D2] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#27F4D2]" />
            </span>
            Season 2025 Live Telemetry
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <h1 className="text-5xl sm:text-7xl lg:text-[6.5rem] font-black tracking-[-0.04em] mb-2 leading-[0.9]">
            <span className="block text-white">
              <TextScramble text="Formula" delay={1.2} />
            </span>
            <span className="block text-gradient-red">
              <TextScramble text="One" delay={1.6} />
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-10"
        >
          <p className="text-lg sm:text-xl text-white/30 max-w-xl mx-auto font-light leading-relaxed">
            The world&apos;s most prestigious motorsport. Data-driven insights,
            history, and real-time telemetry at your fingertips.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex flex-wrap items-center justify-center gap-5 mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.8 + i * 0.15 }}
              className="glass-card px-6 py-4 flex items-center gap-4 group hover:border-white/10 transition-all duration-500"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}10` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="text-left">
                <div className="text-2xl font-black tracking-tight" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="flex items-center justify-center gap-4"
        >
          <motion.a
            href="#car-visualizer"
            className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E8002D] to-[#FF6B6B] text-white text-sm font-semibold overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Telemetry
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </motion.a>
          <motion.a
            href="#constructors"
            className="px-8 py-3.5 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:text-white hover:border-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Teams
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/15"
        >
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#080a0f] to-transparent z-[3]" />
    </section>
  );
}

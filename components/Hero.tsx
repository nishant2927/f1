"use client";

import { motion } from "framer-motion";
import { ChevronDown, Zap, Timer, Trophy } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg" />

      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E5053A" stopOpacity="0" />
              <stop offset="50%" stopColor="#E5053A" stopOpacity="1" />
              <stop offset="100%" stopColor="#0600EF" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d={`M${-100 + i * 50},${800 - i * 60} Q${600 + Math.sin(i) * 200},${400 + Math.cos(i) * 100} ${1300 + i * 30},${i * 70}`}
              fill="none"
              stroke="url(#line-grad)"
              strokeWidth="1"
              filter="url(#glow)"
              opacity={0.3 + (i % 3) * 0.2}
              className="telemetry-line"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <circle
              key={`dot-${i}`}
              cx={150 + i * 130}
              cy={200 + Math.sin(i * 0.8) * 150}
              r="3"
              fill={["#E5053A", "#0600EF", "#00F5D4", "#FF8000"][i % 4]}
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.8;0.2"
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ferrari-red via-mercedes-cyan to-rb-blue opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/50 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-mercedes-cyan animate-pulse" />
            Live Telemetry Dashboard
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95]"
        >
          <span className="block text-white">Formula 1</span>
          <span className="block bg-gradient-to-r from-ferrari-red via-mclaren-papaya to-mercedes-cyan bg-clip-text text-transparent">
            Fandom & History
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Explore the rich heritage of Formula 1 through interactive telemetry visualizations, 
          team deep-dives, driver analytics, and era-spanning timelines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          {[
            { icon: Zap, label: "Interactive Telemetry", color: "text-ferrari-red" },
            { icon: Timer, label: "75 Years of Racing", color: "text-mercedes-cyan" },
            { icon: Trophy, label: "10 Constructors", color: "text-mclaren-papaya" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5"
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm text-white/60">{item.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="#car-visualizer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="inline-flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.a>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-obsidian to-transparent" />
    </section>
  );
}

"use client";

import { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { ChevronDown, Trophy, Flag, Users, MapPin, Calendar, Zap, ChevronRight } from "lucide-react";
import { constructors } from "@/data/constructors";

function TeamLogo({ teamId, color }: { teamId: string; color: string }) {
  const logos: Record<string, JSX.Element> = {
    ferrari: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <text x="30" y="26" textAnchor="middle" fill={color} fontSize="18" fontWeight="bold" fontFamily="serif">SF</text>
        <text x="30" y="42" textAnchor="middle" fill={color} fontSize="6" fontFamily="monospace" opacity="0.5" letterSpacing="3">FERRARI</text>
      </svg>
    ),
    redbull: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <circle cx="30" cy="26" r="10" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M23,22 Q30,16 37,22 Q34,28 30,26 Q26,28 23,22" fill={color} opacity="0.5" />
        <text x="30" y="48" textAnchor="middle" fill={color} fontSize="5" fontFamily="monospace" opacity="0.5">RED BULL</text>
      </svg>
    ),
    mercedes: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <circle cx="30" cy="28" r="12" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M30,16 L30,28 L42,36" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <text x="30" y="50" textAnchor="middle" fill={color} fontSize="5" fontFamily="monospace" opacity="0.5">MERCEDES</text>
      </svg>
    ),
    mclaren: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <text x="30" y="37" textAnchor="middle" fill={color} fontSize="26" fontWeight="bold" fontFamily="monospace" opacity="0.8">M</text>
        <line x1="15" y1="44" x2="45" y2="44" stroke={color} strokeWidth="0.8" opacity="0.3" />
      </svg>
    ),
    astonmartin: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <path d="M20,36 L30,18 L40,36 Z" fill="none" stroke={color} strokeWidth="1.5" />
        <text x="30" y="48" textAnchor="middle" fill={color} fontSize="5" fontFamily="monospace" opacity="0.5">ASTON</text>
      </svg>
    ),
    rb: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <text x="30" y="37" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold" fontFamily="monospace" opacity="0.8">RB</text>
        <text x="30" y="48" textAnchor="middle" fill={color} fontSize="5" fontFamily="monospace" opacity="0.5">RACING</text>
      </svg>
    ),
    haas: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <text x="30" y="37" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold" fontFamily="monospace" opacity="0.8">H</text>
        <text x="30" y="48" textAnchor="middle" fill={color} fontSize="5" fontFamily="monospace" opacity="0.5">HAAS</text>
      </svg>
    ),
    alpine: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <text x="30" y="37" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold" fontFamily="monospace" opacity="0.8">A</text>
        <text x="30" y="48" textAnchor="middle" fill={color} fontSize="5" fontFamily="monospace" opacity="0.5">ALPINE</text>
      </svg>
    ),
    williams: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <text x="30" y="37" textAnchor="middle" fill={color} fontSize="20" fontWeight="bold" fontFamily="monospace" opacity="0.8">W</text>
        <line x1="18" y1="44" x2="42" y2="44" stroke={color} strokeWidth="0.8" opacity="0.3" />
      </svg>
    ),
    "kick-sauber": (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill={`${color}10`} stroke={color} strokeWidth="1" />
        <text x="30" y="37" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold" fontFamily="monospace" opacity="0.8">S</text>
        <text x="30" y="48" textAnchor="middle" fill={color} fontSize="5" fontFamily="monospace" opacity="0.5">SAUBER</text>
      </svg>
    ),
  };
  return logos[teamId] || <div className="w-full h-full rounded-xl bg-white/5" />;
}

function ConstructorCard({ team, index }: { team: typeof constructors[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const scale = useSpring(1, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card cursor-pointer overflow-hidden group relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 3D glare effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{
            background: useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08), transparent 60%)`,
          }}
        />

        {/* Color glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${team.color}12, transparent 70%)`,
          }}
        />

        {/* Top accent line with glow */}
        <div
          className="absolute top-0 left-0 w-full h-[2px] opacity-80"
          style={{ background: `linear-gradient(to right, transparent, ${team.color}, transparent)` }}
        />

        <div className="p-5 sm:p-6 relative z-20">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                <TeamLogo teamId={team.id} color={team.color} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">{team.name}</h3>
                <p className="text-[10px] text-white/25 font-mono tracking-wider">{team.fullName}</p>
              </div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <ChevronDown className="w-4 h-4 text-white/20" />
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { value: team.worldChampionships, label: "Titles", color: team.color },
              { value: team.raceWins, label: "Wins", color: "#fff" },
              { value: team.polePositions, label: "Poles", color: "#fff" },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-2.5 rounded-xl bg-white/[0.02]">
                <div className="text-xl sm:text-2xl font-black" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[8px] font-mono text-white/25 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/[0.04] mb-3" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-white/30">
              <Users className="w-3 h-3" />
              <span>{team.currentDrivers.join(" · ")}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-white/[0.04] pt-4 relative z-20">
                <p className="text-xs text-white/40 leading-relaxed mb-5">{team.history}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Zap, label: "Engine", value: team.engineSupplier },
                    { icon: Calendar, label: "Founded", value: team.founded.toString() },
                    { icon: MapPin, label: "Base", value: team.base },
                    { icon: Flag, label: "Country", value: team.country },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-[11px] text-white/30">
                      <item.icon className="w-3 h-3 text-white/20" />
                      <span>{item.label}: <span className="text-white/50">{item.value}</span></span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5" style={{ color: team.color }} />
                  <span className="text-[11px] font-mono" style={{ color: team.color }}>
                    {team.worldChampionships} World Championship{team.worldChampionships !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function ConstructorsShowcase() {
  return (
    <section id="constructors" className="relative py-24 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3671C6]/10 border border-[#3671C6]/20 text-[10px] font-mono text-[#3671C6] tracking-[0.2em] uppercase mb-5">
            <Flag className="w-3 h-3" />
            Constructors Championship
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            The
            <span className="text-[#3671C6]"> Constructors</span>
          </h2>
          <p className="text-white/30 max-w-lg mx-auto text-sm leading-relaxed">
            Explore the legendary teams that have shaped Formula 1 history, from Ferrari&apos;s dynasty to the modern era.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: "1200px" }}>
          {constructors.map((team, index) => (
            <ConstructorCard key={team.id} team={team} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trophy, Flag, Users, MapPin, Calendar } from "lucide-react";
import { constructors } from "@/data/constructors";

function TeamLogo({ teamId, color }: { teamId: string; color: string }) {
  const logos: Record<string, JSX.Element> = {
    ferrari: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="12" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
        <text x="30" y="22" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold" fontFamily="serif">SF</text>
        <text x="30" y="42" textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace" opacity="0.7">RACING</text>
        <path d="M15,48 L30,45 L45,48" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      </svg>
    ),
    redbull: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="12" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
        <circle cx="30" cy="28" r="12" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M22,24 Q30,18 38,24 Q34,30 30,28 Q26,30 22,24" fill={color} opacity="0.6" />
        <text x="30" y="48" textAnchor="middle" fill={color} fontSize="6" fontFamily="monospace" opacity="0.7">RBR</text>
      </svg>
    ),
    mercedes: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="12" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
        <circle cx="30" cy="30" r="14" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M30,16 L30,30 L42,38" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <text x="30" y="52" textAnchor="middle" fill={color} fontSize="6" fontFamily="monospace" opacity="0.7">AMG</text>
      </svg>
    ),
    mclaren: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="12" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
        <text x="30" y="35" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold" fontFamily="monospace" opacity="0.9">M</text>
        <line x1="15" y1="42" x2="45" y2="42" stroke={color} strokeWidth="1" opacity="0.4" />
      </svg>
    ),
    astonmartin: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="12" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
        <path d="M20,35 L30,18 L40,35 Z" fill="none" stroke={color} strokeWidth="1.5" />
        <text x="30" y="48" textAnchor="middle" fill={color} fontSize="5" fontFamily="monospace" opacity="0.7">AMR</text>
      </svg>
    ),
    williams: (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="12" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
        <text x="30" y="36" textAnchor="middle" fill={color} fontSize="20" fontWeight="bold" fontFamily="monospace" opacity="0.9">W</text>
        <line x1="18" y1="42" x2="42" y2="42" stroke={color} strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  };

  return logos[teamId] || <div className="w-full h-full rounded-xl bg-white/5" />;
}

function ConstructorCard({ team, index }: { team: typeof constructors[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div
        className="glass-card-hover cursor-pointer overflow-hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                <TeamLogo teamId={team.id} color={team.color} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">{team.name}</h3>
                <p className="text-xs text-white/30 font-mono">{team.fullName}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="mt-1"
            >
              <ChevronDown className="w-5 h-5 text-white/30" />
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-2">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black" style={{ color: team.color }}>
                {team.worldChampionships}
              </div>
              <div className="text-[10px] font-mono text-white/30 uppercase">Titles</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                {team.raceWins}
              </div>
              <div className="text-[10px] font-mono text-white/30 uppercase">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-white">
                {team.polePositions}
              </div>
              <div className="text-[10px] font-mono text-white/30 uppercase">Poles</div>
            </div>
          </div>

          <div className="h-px bg-white/5 my-2" />

          <div className="flex items-center gap-2 text-xs text-white/40">
            <Users className="w-3 h-3" />
            <span>{team.currentDrivers.join(" · ")}</span>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-white/5 pt-4">
                <p className="text-sm text-white/50 leading-relaxed mb-4">{team.history}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Zap className="w-3.5 h-3.5 text-white/30" />
                    <span>Engine: <span className="text-white/60">{team.engineSupplier}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Calendar className="w-3.5 h-3.5 text-white/30" />
                    <span>Founded: <span className="text-white/60">{team.founded}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <MapPin className="w-3.5 h-3.5 text-white/30" />
                    <span>Base: <span className="text-white/60">{team.base}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Flag className="w-3.5 h-3.5 text-white/30" />
                    <span>Country: <span className="text-white/60">{team.country}</span></span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5" style={{ color: team.color }} />
                  <span className="text-xs font-mono" style={{ color: team.color }}>
                    {team.worldChampionships} World Championship{team.worldChampionships !== 1 ? "s" : ""} Won
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ConstructorsShowcase() {
  return (
    <section id="constructors" className="relative py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rb-blue/10 border border-rb-blue/20 text-xs font-mono text-rb-blue tracking-widest uppercase mb-4">
            <Flag className="w-3 h-3" />
            Constructors
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mb-4">
            The
            <span className="text-rb-blue"> Constructors</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Explore the legendary teams that have shaped Formula 1 history, from Ferrari&apos;s seven-decade dynasty to Red Bull&apos;s modern dominance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {constructors.map((team, index) => (
            <ConstructorCard key={team.id} team={team} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

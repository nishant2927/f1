"use client";

import { motion } from "framer-motion";
import { Flag, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-20 border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8002D] to-[#FF8000] flex items-center justify-center">
                <Flag className="w-4 h-4 text-white" />
              </div>
              <span className="font-mono font-bold text-base tracking-[0.15em]">
                F1<span className="text-[#E8002D]">PULSE</span>
              </span>
            </div>
            <p className="text-xs text-white/25 leading-relaxed max-w-xs">
              An immersive tribute to the heritage and electrifying future of Formula 1 racing.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-white/35 uppercase tracking-[0.2em] mb-5">Navigate</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Car Telemetry", href: "#car-visualizer" },
                { label: "Standings", href: "#standings" },
                { label: "Constructors", href: "#constructors" },
                { label: "Drivers Vault", href: "#drivers" },
                { label: "Race Calendar", href: "#calendar" },
                { label: "Era Timeline", href: "#timeline" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-white/25 hover:text-white/60 transition-colors flex items-center gap-2 group"
                  >
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-white/35 uppercase tracking-[0.2em] mb-5">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "React Three Fiber", "Lucide Icons"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="text-[9px] font-mono px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/25"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-white/[0.04] mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/15 font-mono">
            &copy; 2025 F1Pulse &mdash; Built with passion for the sport
          </p>
          <p className="text-[10px] text-white/15 font-mono">
            Data for illustrative purposes
          </p>
        </div>
      </div>
    </footer>
  );
}

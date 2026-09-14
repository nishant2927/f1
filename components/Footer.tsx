"use client";

import { motion } from "framer-motion";
import { Flag, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ferrari-red to-mclaren-papaya flex items-center justify-center">
                <Flag className="w-4 h-4 text-white" />
              </div>
              <span className="font-mono font-bold text-lg tracking-wider">
                F1<span className="text-ferrari-red">PULSE</span>
              </span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">
              An immersive tribute to the rich heritage and electrifying future of Formula 1 racing.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-mono text-white/50 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Car Telemetry", href: "#car-visualizer" },
                { label: "Constructors", href: "#constructors" },
                { label: "Drivers Vault", href: "#drivers" },
                { label: "Era Timeline", href: "#timeline" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-mono text-white/50 uppercase tracking-wider mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Lucide"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/30"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20 font-mono">
            © 2026 F1Pulse — Built with passion for the sport
          </p>
          <p className="text-xs text-white/20 font-mono">
            Data for illustrative purposes only
          </p>
        </div>
      </div>
    </footer>
  );
}

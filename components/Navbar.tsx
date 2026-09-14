"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, Flag, Gauge, Users, Clock, Calendar, BarChart3 } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#hero", icon: Flag },
  { label: "Telemetry", href: "#car-visualizer", icon: Gauge },
  { label: "Standings", href: "#standings", icon: BarChart3 },
  { label: "Teams", href: "#constructors", icon: Users },
  { label: "Drivers", href: "#drivers", icon: Users },
  { label: "Calendar", href: "#calendar", icon: Calendar },
  { label: "Eras", href: "#timeline", icon: Clock },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-xl border-b"
          style={{
            backgroundColor: `rgba(8, 10, 15, ${bgOpacity})`,
            borderColor: `rgba(255, 255, 255, ${borderOpacity * 0.05})`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.a
              href="#hero"
              className="flex items-center gap-2.5 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8002D] to-[#FF8000] flex items-center justify-center overflow-hidden">
                <Flag className="w-4 h-4 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm tracking-[0.2em] leading-none">
                  F1<span className="text-[#E8002D]">PULSE</span>
                </span>
                <span className="text-[8px] font-mono text-white/20 tracking-[0.3em] uppercase">
                  Telemetry
                </span>
              </div>
            </motion.a>

            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeSection === link.href.slice(1)
                      ? "text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeSection === link.href.slice(1) && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/5 rounded-lg border border-white/5"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <link.icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{link.label}</span>
                </motion.a>
              ))}
            </div>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors relative"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="mx-4 glass-card p-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

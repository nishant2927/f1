"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="relative py-2 max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
      />
    </div>
  );
}

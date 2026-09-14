"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="relative py-4">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}

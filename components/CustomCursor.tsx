"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor]")) {
        setIsHovering(true);
        const text = target.closest("[data-cursor]")?.getAttribute("data-cursor") || "";
        setCursorText(text);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setCursorText("");
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: isHovering ? 60 : isClicking ? 6 : 12,
            height: isHovering ? 60 : isClicking ? 6 : 12,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="rounded-full border border-white/60 flex items-center justify-center"
        >
          <AnimatePresence>
            {cursorText && isHovering && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-[8px] font-mono text-white uppercase tracking-wider"
              >
                {cursorText}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: isHovering ? 80 : 0,
            height: isHovering ? 80 : 0,
            opacity: isHovering ? 0.15 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="rounded-full bg-[#E8002D]"
        />
      </motion.div>
    </>
  );
}

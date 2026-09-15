"use client";

import { useState, useCallback, useRef } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  glareX: number;
  glareY: number;
  glareOpacity: number;
}

export function use3DTilt(intensity = 15) {
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setTilt({
        rotateX: (0.5 - y) * intensity,
        rotateY: (x - 0.5) * intensity,
        scale: 1.02,
        glareX: x * 100,
        glareY: y * 100,
        glareOpacity: 0.15,
      });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  }, []);

  const style = {
    transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
    transformStyle: "preserve-3d" as const,
  };

  const glareStyle = {
    position: "absolute" as const,
    inset: 0,
    borderRadius: "inherit",
    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,${tilt.glareOpacity}), transparent 60%)`,
    pointerEvents: "none" as const,
    transition: "opacity 0.4s ease",
    zIndex: 1,
  };

  return { ref, style, glareStyle, handleMouseMove, handleMouseLeave };
}

"use client";

import { useMemo } from "react";

interface LeafConfig {
  id: number;
  left: number; // percentage across screen
  size: number; // width in px
  delay: number; // animation delay in seconds
  duration: number; // animation duration in seconds
  colorType: "mint" | "sage" | "blush" | "fresh";
  blur: number; // px blur for depth
  swayType: number; // 1, 2, or 3 for varied physics
  initialRotation: number;
}

export default function FallingLeaves() {
  // Generate a deterministic set of organic leaves
  const leaves: LeafConfig[] = useMemo(() => [
    { id: 1, left: 6, size: 24, delay: 0, duration: 18, colorType: "mint", blur: 0, swayType: 1, initialRotation: 25 },
    { id: 2, left: 16, size: 18, delay: 4, duration: 22, colorType: "blush", blur: 0.5, swayType: 2, initialRotation: -40 },
    { id: 3, left: 26, size: 28, delay: 8, duration: 25, colorType: "sage", blur: 1, swayType: 3, initialRotation: 60 },
    { id: 4, left: 36, size: 20, delay: 2, duration: 19, colorType: "fresh", blur: 0, swayType: 1, initialRotation: -15 },
    { id: 5, left: 48, size: 26, delay: 11, duration: 24, colorType: "mint", blur: 0.5, swayType: 2, initialRotation: 45 },
    { id: 6, left: 58, size: 16, delay: 6, duration: 21, colorType: "blush", blur: 1, swayType: 3, initialRotation: -50 },
    { id: 7, left: 69, size: 30, delay: 1, duration: 26, colorType: "sage", blur: 0, swayType: 1, initialRotation: 30 },
    { id: 8, left: 79, size: 22, delay: 9, duration: 20, colorType: "fresh", blur: 0.5, swayType: 2, initialRotation: -25 },
    { id: 9, left: 88, size: 25, delay: 5, duration: 23, colorType: "mint", blur: 0, swayType: 3, initialRotation: 55 },
    { id: 10, left: 95, size: 18, delay: 13, duration: 22, colorType: "blush", blur: 1, swayType: 1, initialRotation: -35 },
    { id: 11, left: 21, size: 22, delay: 15, duration: 27, colorType: "fresh", blur: 0.5, swayType: 2, initialRotation: 15 },
    { id: 12, left: 74, size: 20, delay: 14, duration: 20, colorType: "mint", blur: 0, swayType: 3, initialRotation: -45 },
  ], []);

  const colorMap = {
    mint: { fill: "rgba(182, 233, 209, 0.65)", stroke: "rgba(32, 155, 115, 0.45)", vein: "rgba(32, 155, 115, 0.35)" },
    sage: { fill: "rgba(215, 241, 229, 0.70)", stroke: "rgba(22, 77, 60, 0.4)", vein: "rgba(22, 77, 60, 0.3)" },
    blush: { fill: "rgba(245, 213, 227, 0.55)", stroke: "rgba(216, 121, 161, 0.45)", vein: "rgba(216, 121, 161, 0.35)" },
    fresh: { fill: "rgba(200, 243, 220, 0.60)", stroke: "rgba(50, 181, 139, 0.45)", vein: "rgba(50, 181, 139, 0.35)" },
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {leaves.map((leaf) => {
        const colors = colorMap[leaf.colorType];
        return (
          <div
            key={leaf.id}
            className={`leaf-particle leaf-sway-${leaf.swayType}`}
            style={{
              left: `${leaf.left}%`,
              width: `${leaf.size}px`,
              height: `${leaf.size * 1.5}px`,
              animationDelay: `${leaf.delay}s`,
              animationDuration: `${leaf.duration}s`,
              filter: leaf.blur ? `blur(${leaf.blur}px)` : "none",
              transform: `rotate(${leaf.initialRotation}deg)`,
            }}
          >
            <svg
              viewBox="0 0 24 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-2xs opacity-80"
            >
              {/* Organic leaf body */}
              <path
                d="M12 2C7 8 2 16 3 26C3.5 31 7 34 12 34C17 34 20.5 31 21 26C22 16 17 8 12 2Z"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Central Leaf Vein */}
              <path
                d="M12 6V31"
                stroke={colors.vein}
                strokeWidth="1"
                strokeLinecap="round"
              />
              {/* Side Veins */}
              <path
                d="M12 12C15 14 17 15 17 16M12 18C16 20 18 21 18 22M12 14C9 16 7 17 7 18M12 21C8 23 6 24 6 25"
                stroke={colors.vein}
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

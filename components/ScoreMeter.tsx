"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScoreMeterProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
  color?: string;
}

export default function ScoreMeter({
  score,
  label,
  size = "lg",
  color = "#22C55E",
}: ScoreMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = size === "lg" ? 70 : 45;
  const stroke = size === "lg" ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const svgSize = (radius + stroke) * 2 + 10;

  useEffect(() => {
    const timer = setTimeout(() => setDisplayScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (displayScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#22C55E";
    if (s >= 60) return "#EAB308";
    return "#EF4444";
  };

  const activeColor = color === "#22C55E" ? getColor(score) : color;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{
              filter: `drop-shadow(0 0 6px ${activeColor}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold ${size === "lg" ? "text-3xl" : "text-xl"}`}
            style={{ color: activeColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {displayScore}
          </motion.span>
          {size === "lg" && (
            <span className="text-xs text-gray-400 font-medium">/100</span>
          )}
        </div>
      </div>
      <span className={`font-semibold text-gray-600 ${size === "lg" ? "text-sm" : "text-xs"} text-center`}>
        {label}
      </span>
    </div>
  );
}

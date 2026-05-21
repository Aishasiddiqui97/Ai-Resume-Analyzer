"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { AnalysisResult } from "@/lib/types";

interface SkillsChartProps {
  analysis: AnalysisResult;
}

const COLORS = ["#22C55E", "#16A34A", "#0F766E", "#059669", "#10B981", "#34D399"];

export default function SkillsChart({ analysis }: SkillsChartProps) {
  const sectionData = Object.entries(analysis.sections).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    score: value,
    fullMark: 100,
  }));

  const skillData = analysis.skills.technical.slice(0, 8).map((skill, i) => ({
    name: skill.length > 12 ? skill.slice(0, 12) + "…" : skill,
    value: Math.floor(60 + Math.random() * 40),
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 depth-shadow"
      >
        <h3 className="font-bold text-gray-700 mb-4 text-lg">Section Breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={sectionData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#6B7280" }} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#22C55E"
              fill="#22C55E"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-6 depth-shadow"
      >
        <h3 className="font-bold text-gray-700 mb-4 text-lg">Technical Skills</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={skillData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} width={80} />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {skillData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

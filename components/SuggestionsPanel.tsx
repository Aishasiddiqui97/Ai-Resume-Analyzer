"use client";

import { motion } from "framer-motion";
import { FiAlertCircle, FiInfo, FiCheckCircle, FiTag, FiZap } from "react-icons/fi";
import { AnalysisResult } from "@/lib/types";

interface SuggestionsPanelProps {
  analysis: AnalysisResult;
}

const priorityConfig = {
  high: { icon: FiAlertCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  medium: { icon: FiInfo, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" },
  low: { icon: FiCheckCircle, color: "text-green-500", bg: "bg-green-50", border: "border-green-200" },
};

export default function SuggestionsPanel({ analysis }: SuggestionsPanelProps) {
  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 depth-shadow border-l-4 border-green-400"
      >
        <div className="flex items-center gap-2 mb-3">
          <FiZap className="text-green-500 text-xl" />
          <h3 className="font-bold text-gray-800 text-lg">AI Assessment</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{analysis.summary}</p>
      </motion.div>

      {/* Strengths */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 depth-shadow"
      >
        <h3 className="font-bold text-gray-800 text-lg mb-4">✨ Strengths</h3>
        <ul className="space-y-2">
          {analysis.strengths.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-3 text-gray-600"
            >
              <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
              {s}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Improvements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 depth-shadow"
      >
        <h3 className="font-bold text-gray-800 text-lg mb-4">🔧 Improvement Suggestions</h3>
        <div className="space-y-3">
          {analysis.improvements.map((item, i) => {
            const cfg = priorityConfig[item.priority];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}
              >
                <Icon className={`${cfg.color} text-lg mt-0.5 flex-shrink-0`} />
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <p className="text-gray-700 text-sm mt-0.5">{item.suggestion}</p>
                </div>
                <span
                  className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    item.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : item.priority === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.priority}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 depth-shadow"
      >
        <div className="flex items-center gap-2 mb-4">
          <FiTag className="text-teal-500 text-xl" />
          <h3 className="font-bold text-gray-800 text-lg">Recommended Keywords</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.keywords.map((kw, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 rounded-full text-sm font-medium border border-green-200/60 hover:glow-green-sm transition-all cursor-default"
            >
              {kw}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Missing Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 depth-shadow"
      >
        <h3 className="font-bold text-gray-800 text-lg mb-4">⚡ Skills to Add</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.skills.missing.map((skill, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium border border-orange-200"
            >
              + {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

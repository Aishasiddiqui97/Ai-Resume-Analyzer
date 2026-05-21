"use client";

import { motion } from "framer-motion";
import { FiDownload, FiRefreshCw } from "react-icons/fi";
import ScoreMeter from "./ScoreMeter";
import SkillsChart from "./SkillsChart";
import SuggestionsPanel from "./SuggestionsPanel";
import { AnalysisResult } from "@/lib/types";

interface ResultsDashboardProps {
  analysis: AnalysisResult;
  fileName: string;
  onReset: () => void;
}

export default function ResultsDashboard({ analysis, fileName, onReset }: ResultsDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800"
          >
            Analysis Results
          </motion.h2>
          <p className="text-gray-500 text-sm mt-1">📄 {fileName}</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white/60 text-gray-600 hover:bg-white/80 transition-all text-sm font-medium"
          >
            <FiRefreshCw className="text-sm" /> Analyze Another
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium glow-green-sm hover:glow-green transition-all"
          >
            <FiDownload className="text-sm" /> Export Report
          </motion.button>
        </div>
      </div>

      {/* Score cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8 depth-shadow"
      >
        <h3 className="font-bold text-gray-700 text-lg mb-6 text-center">Overall Performance</h3>
        <div className="flex flex-wrap justify-center gap-10">
          <ScoreMeter score={analysis.overallScore} label="Overall Score" size="lg" />
          <ScoreMeter score={analysis.atsScore} label="ATS Score" size="lg" color="#0F766E" />
          <ScoreMeter score={analysis.jobReadinessScore} label="Job Readiness" size="lg" color="#16A34A" />
        </div>
      </motion.div>

      {/* Skills found */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 depth-shadow"
      >
        <h3 className="font-bold text-gray-700 text-lg mb-4">Detected Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Technical</p>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.technical.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200/60"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Soft Skills</p>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.soft.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium border border-teal-200/60"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <SkillsChart analysis={analysis} />

      {/* Suggestions */}
      <SuggestionsPanel analysis={analysis} />
    </motion.div>
  );
}

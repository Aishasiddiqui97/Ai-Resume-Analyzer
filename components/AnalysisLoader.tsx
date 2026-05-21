"use client";

import { motion } from "framer-motion";

const steps = [
  "Extracting resume content...",
  "Parsing skills & experience...",
  "Running AI analysis...",
  "Calculating ATS score...",
  "Generating suggestions...",
];

interface AnalysisLoaderProps {
  currentStep: number;
}

export default function AnalysisLoader({ currentStep }: AnalysisLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center gap-8 py-12"
    >
      {/* Animated AI orb — stable with locked dimensions */}
      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-full" style={{ aspectRatio: "1" }}>
        {/* Ring pulse animations — constrained with willChange */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-green-400/60"
            animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
            style={{ willChange: "transform, opacity", transformOrigin: "center" }}
          />
        ))}
        {/* Rotating gradient sphere */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-green-400 to-teal-500 glow-green"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        />
        {/* Brain emoji center — fixed position */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
          <motion.span
            className="text-3xl flex-shrink-0"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ willChange: "transform" }}
          >
            🧠
          </motion.span>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">AI is analyzing your resume</h3>
        <p className="text-gray-500">This takes just a few seconds...</p>
      </div>

      {/* Steps — stable with fixed sizing */}
      <div className="w-full max-w-sm space-y-3" style={{ overflow: "hidden" }}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-3"
            style={{ willChange: "opacity, transform" }}
          >
            {/* Step indicator badge — fixed dimensions */}
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                i < currentStep
                  ? "bg-green-500"
                  : i === currentStep
                  ? "bg-green-400 glow-green-sm"
                  : "bg-gray-200"
              }`}
              style={{ aspectRatio: "1", minWidth: "1.25rem", minHeight: "1.25rem" }}
            >
              {i < currentStep ? (
                <span className="text-white text-xs flex-shrink-0">✓</span>
              ) : i === currentStep ? (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full flex-shrink-0"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ willChange: "transform" }}
                />
              ) : null}
            </div>
            <span
              className={`text-sm flex-1 ${
                i <= currentStep ? "text-gray-700 font-medium" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Progress bar — stable container */}
      <div className="w-full max-w-sm bg-gray-200 rounded-full h-2 overflow-hidden" style={{ minHeight: "0.5rem" }}>
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ willChange: "width" }}
        />
      </div>
    </motion.div>
  );
}

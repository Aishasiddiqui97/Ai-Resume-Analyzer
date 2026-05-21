"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "@/components/Navbar";
import UploadCard from "@/components/UploadCard";
import AnalysisLoader from "@/components/AnalysisLoader";
import ResultsDashboard from "@/components/ResultsDashboard";
import { AnalysisResult, HistoryItem } from "@/lib/types";

type Stage = "upload" | "loading" | "results";

async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  // Use the worker from node_modules (properly resolved by bundler)
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n";
  }

  return text;
}

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loaderStep, setLoaderStep] = useState(0);
  const [showTextPreview, setShowTextPreview] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setError("");
  }, []);

  const advanceLoader = useCallback(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoaderStep(step);
      if (step >= 4) clearInterval(interval);
    }, 900);
    return interval;
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setError("");
    setStage("loading");
    setLoaderStep(0);

    const interval = advanceLoader();

    try {
      const text = await extractTextFromPDF(selectedFile);
      setExtractedText(text);

      const { data } = await axios.post("/api/analyze", { resumeText: text });
      clearInterval(interval);
      setLoaderStep(4);

      // Save to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        date: new Date().toLocaleDateString(),
        score: data.analysis.overallScore,
        analysis: data.analysis,
      };
      const existing = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
      localStorage.setItem("resumeHistory", JSON.stringify([historyItem, ...existing].slice(0, 10)));

      setTimeout(() => {
        setAnalysis(data.analysis);
        setStage("results");
      }, 500);
    } catch (err: unknown) {
      clearInterval(interval);
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.error || "Analysis failed. Check your API key."
          : "Something went wrong.";
      setError(msg);
      setStage("upload");
    }
  };

  const handleReset = () => {
    setStage("upload");
    setSelectedFile(null);
    setExtractedText("");
    setAnalysis(null);
    setError("");
    setLoaderStep(0);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-300/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative w-full max-w-4xl px-6 py-16">
        <AnimatePresence mode="wait">
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-extrabold text-gray-800"
              >
                Smart Upload
              </motion.h1>
              <p className="text-gray-500 mt-3 text-lg">
                Drag & drop your PDF resume. Instant text extraction with live preview.
              </p>

              <UploadCard onFileSelect={handleFileSelect} isLoading={false} />

              {extractedText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-4 depth-shadow"
                >
                  <button
                    onClick={() => setShowTextPreview(!showTextPreview)}
                    className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    {showTextPreview ? "Hide" : "Show"} extracted text preview
                  </button>
                  {showTextPreview && (
                    <textarea
                      value={extractedText}
                      onChange={(e) => setExtractedText(e.target.value)}
                      className="w-full mt-3 h-40 text-xs text-gray-600 bg-white/50 rounded-xl p-3 border border-gray-200 resize-none focus:outline-none focus:border-green-400"
                    />
                  )}
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <motion.button
                whileHover={selectedFile ? { scale: 1.02 } : {}}
                whileTap={selectedFile ? { scale: 0.98 } : {}}
                onClick={handleAnalyze}
                disabled={!selectedFile}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                  selectedFile
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white glow-green hover:glow-green cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedFile ? "🚀 Start Free Analysis" : "Select a PDF to continue"}
              </motion.button>

              <p className="text-center text-xs text-gray-400">
                Requires GEMINI_API_KEY in .env.local · Your resume is never stored on our servers
              </p>
            </motion.div>
          )}

          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-3xl p-8 depth-shadow"
              style={{ overflow: "hidden", position: "relative", willChange: "opacity" }}
            >
              <AnalysisLoader currentStep={loaderStep} />
            </motion.div>
          )}

          {stage === "results" && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsDashboard
                analysis={analysis}
                fileName={selectedFile?.name || "resume.pdf"}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

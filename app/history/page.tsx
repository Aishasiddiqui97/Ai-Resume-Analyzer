"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScoreMeter from "@/components/ScoreMeter";
import { HistoryItem } from "@/lib/types";
import { FiTrash2, FiEye, FiFileText } from "react-icons/fi";
import ResultsDashboard from "@/components/ResultsDashboard";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("resumeHistory") || "[]");
    setHistory(data);
  }, []);

  const deleteItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("resumeHistory", JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem("resumeHistory");
    setSelected(null);
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300/15 rounded-full blur-3xl animate-blob" />
      </div>

      <div className="relative pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">
                Analysis <span className="gradient-text">History</span>
              </h1>
              <p className="text-gray-500 mt-1">Your previous resume analyses</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <FiTrash2 /> Clear all
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-16 text-center depth-shadow"
            >
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No analyses yet</h3>
              <p className="text-gray-500 mb-6">Upload your first resume to get started</p>
              <Link href="/analyze">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold glow-green-sm"
                >
                  Analyze Resume
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {history.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl p-5 depth-shadow flex items-center gap-5 hover:border-green-300/60 border border-transparent transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FiFileText className="text-green-500 text-xl" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.fileName}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>

                  <ScoreMeter score={item.score} label="Score" size="sm" />

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelected(selected?.id === item.id ? null : item)}
                      className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <FiEye />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteItem(item.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                    >
                      <FiTrash2 />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Expanded result */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <ResultsDashboard
                  analysis={selected.analysis}
                  fileName={selected.fileName}
                  onReset={() => setSelected(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

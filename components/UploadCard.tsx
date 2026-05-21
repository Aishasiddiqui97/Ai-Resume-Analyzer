"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from "react-icons/fi";

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function UploadCard({ onFileSelect, isLoading }: UploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-10 text-center
          ${isDragActive || dragActive
            ? "border-green-500 bg-green-50/60 glow-green"
            : "border-green-300/60 bg-white/30 hover:border-green-400 hover:bg-white/50"
          }
          glass depth-shadow`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center glow-green-sm">
                <FiCheckCircle className="text-green-500 text-3xl" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">{selectedFile.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB · PDF
                </p>
              </div>
              {!isLoading && (
                <button
                  onClick={removeFile}
                  className="flex items-center gap-2 text-red-400 hover:text-red-600 text-sm transition-colors"
                >
                  <FiX /> Remove file
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-teal-400/20 flex items-center justify-center border border-green-300/40 flex-shrink-0"
                style={{ aspectRatio: "1", minWidth: "5rem", minHeight: "5rem", willChange: "transform" }}
              >
                <FiUploadCloud className="text-green-500 text-4xl flex-shrink-0" style={{ pointerEvents: "none" }} />
              </motion.div>
              <div>
                <p className="text-xl font-semibold text-gray-700">
                  Drop your resume here
                </p>
                <p className="text-gray-500 mt-1">or click to browse · PDF only</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/40 px-4 py-2 rounded-full">
                <FiFile className="text-green-400" />
                Supports PDF up to 10MB
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

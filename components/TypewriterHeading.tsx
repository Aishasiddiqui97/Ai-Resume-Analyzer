"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterHeadingProps {
  duration?: number; // Time per character in milliseconds
  delay?: number;
  cursorDuration?: number;
}

/**
 * Premium typewriter heading component with smooth character-by-character reveal
 * and blinking cursor animation. Prevents layout shifts with fixed rendering.
 * Optimized for "Analyze Your Resume with AI" text with gradient styling.
 */
export default function TypewriterHeading({
  duration = 40, // Time per character in ms
  delay = 0.2,
  cursorDuration = 0.8,
}: TypewriterHeadingProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  // Full text to animate
  const fullText = "Analyze Your Resume with AI";

  useEffect(() => {
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex >= fullText.length) {
        clearInterval(interval);
        setIsComplete(true);
        return;
      }

      setDisplayedText(fullText.substring(0, charIndex + 1));
      charIndex++;
    }, duration);

    return () => clearInterval(interval);
  }, [fullText, duration]);

  // Simple rendering with line breaks and gradient
  const renderText = () => {
    // Split by " " to process words
    const words = displayedText.split(" ");
    const result: React.ReactNode[] = [];
    
    // Line 1: "Analyze Your"
    if (words.length >= 1) {
      result.push(
        <span key="line1">
          {words.slice(0, 2).join(" ")}
        </span>
      );
    }
    
    // Line 2: "Resume"
    if (words.length >= 3) {
      result.push(
        <br key="br1" />
      );
      result.push(
        <span key="line2">
          {words[2]}
        </span>
      );
    }
    
    // Line 3: "with AI" (with gradient)
    if (words.length >= 4) {
      result.push(
        <br key="br2" />
      );
      result.push(
        <span key="line3" className="gradient-text">
          {words.slice(3).join(" ")}
        </span>
      );
    }
    
    return result.length > 0 ? result : displayedText;
  };

  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      style={{
        fontSize: "clamp(1.5rem, 3.5vw, 2.3rem)",
        fontWeight: 900,
        color: "#1F2937",
        lineHeight: 1.1,
        margin: 0,
        textAlign: "center",
      }}
      className="text-center"
    >
      {renderText()}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: cursorDuration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            display: "inline-block",
            width: "2px",
            height: "1.1em",
            backgroundColor: "#22C55E",
            verticalAlign: "text-bottom",
            marginLeft: "0.25em",
          }}
        />
      )}
    </motion.h1>
  );
}

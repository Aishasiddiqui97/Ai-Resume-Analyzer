"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TypewriterHeading from "@/components/TypewriterHeading";
import {
  FiUploadCloud,
  FiCpu,
  FiBarChart2,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import type { Variants, Transition } from "framer-motion";

const ThreeDHeroSection = dynamic(() => import("@/components/ThreeDHeroSection"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] flex items-center justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-40" />
        <div className="absolute inset-2 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
      </div>
    </div>
  ),
});

const features = [
  {
    icon: FiUploadCloud,
    title: "Smart Upload",
    desc: "Drag & drop your PDF resume. Instant text extraction with live preview.",
    gradient: "from-green-400/20 to-emerald-400/20",
    border: "border-green-200/50",
  },
  {
    icon: FiCpu,
    title: "Gemini AI Analysis",
    desc: "Deep analysis of skills, experience, formatting, and ATS compatibility.",
    gradient: "from-teal-400/20 to-cyan-400/20",
    border: "border-teal-200/50",
  },
  {
    icon: FiBarChart2,
    title: "Visual Dashboard",
    desc: "Interactive radar & bar charts showing your resume score and skill gaps.",
    gradient: "from-emerald-400/20 to-green-400/20",
    border: "border-emerald-200/50",
  },
  {
    icon: FiCheckCircle,
    title: "Actionable Tips",
    desc: "Prioritized suggestions to improve your resume and land more interviews.",
    gradient: "from-green-400/20 to-teal-400/20",
    border: "border-green-200/50",
  },
];

const stats = [
  { value: "98%", label: "Accuracy Rate", icon: FiShield },
  { value: "10K+", label: "Resumes Analyzed", icon: FiBarChart2 },
  { value: "3x", label: "More Interviews", icon: FiTrendingUp },
  { value: "<5s", label: "Analysis Time", icon: FiCpu },
];

const steps = [
  { num: "01", title: "Upload PDF", desc: "Drop your resume file" },
  { num: "02", title: "AI Analyzes", desc: "Gemini reads every line" },
  { num: "03", title: "Get Results", desc: "Score, tips & insights" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" } as Transition,
  }),
};

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-green-300/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-300/15 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-[80px] animate-blob animation-delay-4000" />
      </div>

      {/* ── HERO ── */}
      <section className="relative pb-10 px-4 sm:px-6 z-10" style={{ paddingTop: "7rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2.5rem",
            alignItems: "center",
            justifyContent: "center",
          }}
            className="grid-cols-1 lg:grid-cols-2 items-center"
          >

            {/* ── LEFT COPY ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative", zIndex: 10, alignItems: "center" }}>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                className="flex justify-center"
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.45rem 1rem",
                  background: "rgba(34,197,94,0.1)",
                  color: "#16A34A",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  border: "1px solid rgba(34,197,94,0.25)",
                }}
                >
                  <FiStar style={{ color: "#EAB308" }} />
                  AI-Powered Resume Intelligence
                </div>
              </motion.div>

              {/* Heading — Typewriter Animation */}
              <TypewriterHeading delay={0.1} duration={40} cursorDuration={0.8} />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: "1.1rem", color: "#6B7280", lineHeight: 1.7, margin: 0, maxWidth: "30rem", textAlign: "center" }}
                className="text-center"
              >
                Get instant AI-powered feedback. Score your ATS compatibility,
                identify skill gaps, and land your dream job faster.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}
              >
                <Link href="/analyze">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(34,197,94,0.55)" }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      padding: "0.9rem 1.8rem",
                      background: "linear-gradient(135deg, #22C55E, #0F766E)",
                      color: "#fff",
                      borderRadius: "1rem",
                      fontWeight: 700,
                      fontSize: "1rem",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
                    }}
                  >
                    <FiUploadCloud />
                    Analyze My Resume
                    <FiArrowRight />
                  </motion.button>
                </Link>
                <Link href="/history">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.9rem 1.8rem",
                      background: "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(12px)",
                      color: "#374151",
                      borderRadius: "1rem",
                      fontWeight: 600,
                      fontSize: "1rem",
                      border: "1px solid rgba(0,0,0,0.1)",
                      cursor: "pointer",
                    }}
                  >
                    View History
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats row — properly spaced below buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                  maxWidth: "28rem",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
              >
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, scale: 1.04 }}
                    style={{
                      background: "rgba(255,255,255,0.55)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.7)",
                      borderRadius: "0.875rem",
                      padding: "0.75rem 0.5rem",
                      textAlign: "center",
                      cursor: "default",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    <s.icon style={{ color: "#22C55E", fontSize: "1rem", margin: "0 auto 0.3rem" }} />
                    <div className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 800, lineHeight: 1 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "0.25rem", lineHeight: 1.3 }}>
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: 3D Canvas ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
              style={{ position: "relative", zIndex: 0 }}
            >
              <ThreeDHeroSection />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-6 z-10 relative">
        <div style={{ maxWidth: "56rem", margin: "0 auto" }}>

          {/* Heading — centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3rem", marginTop: "3rem" }}
          >
            <h2 className="text-3xl font-extrabold text-gray-800">
              How it <span className="gradient-text">works</span>
            </h2>
            <p style={{ color: "#6B7280", marginTop: "0.5rem", fontSize: "1rem" }}>
              Three simple steps to a better resume
            </p>
          </motion.div>

          {/* Steps — centered grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            position: "relative",
          }}
            className="grid-cols-1 md:grid-cols-3"
          >
            {/* Connector line between cards */}
            <div style={{
              display: "none",
              position: "absolute",
              top: "2.2rem",
              left: "calc(16.66% + 1.5rem)",
              right: "calc(16.66% + 1.5rem)",
              height: "2px",
              background: "linear-gradient(90deg, #22C55E40, #0F766E60, #22C55E40)",
              zIndex: 0,
            }}
              className="md:block"
            />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="glass depth-shadow"
                style={{
                  borderRadius: "1.25rem",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                {/* Step number badge */}
                <div style={{
                  width: 56, height: 56,
                  borderRadius: "1rem",
                  background: "linear-gradient(135deg, #22C55E, #0F766E)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 22px rgba(34,197,94,0.4)",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>
                    {step.num}
                  </span>
                </div>

                <h3 style={{ fontWeight: 700, color: "#1F2937", fontSize: "1.1rem", margin: 0 }}>
                  {step.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-6 z-10 relative">
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

          {/* Heading — centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3rem", marginTop: "3rem" }}
          >
            <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.25rem)", fontWeight: 800, color: "#1F2937", lineHeight: 1.2 }}>
              Everything you need to{" "}
              <span className="gradient-text">stand out</span>
            </h2>
            <p style={{ color: "#6B7280", marginTop: "0.75rem", fontSize: "1.05rem" }}>
              Professional-grade resume analysis in seconds
            </p>
          </motion.div>

          {/* Cards grid — centered with auto margins */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
            justifyContent: "center",
          }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="glass depth-shadow"
                style={{
                  borderRadius: "1.25rem",
                  padding: "1.75rem 1.5rem",
                  cursor: "default",
                  border: "1px solid rgba(34,197,94,0.15)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "0.75rem",
                }}
              >
                {/* Icon badge */}
                <div style={{
                  width: 52, height: 52,
                  borderRadius: "0.875rem",
                  background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(15,118,110,0.15))",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  transition: "transform 0.3s ease",
                }}>
                  <f.icon style={{ color: "#16A34A", fontSize: "1.25rem" }} />
                </div>

                <h3 style={{ fontWeight: 700, color: "#1F2937", fontSize: "1.05rem", margin: 0 }}>
                  {f.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER (Premium AI SaaS Style) ── */}
      <section className="w-full py-32 px-4 z-10 relative flex items-center justify-center min-h-[600px] bg-gradient-to-b from-transparent via-white/30 to-white/50">
        <div style={{ maxWidth: "56rem", width: "100%", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden depth-shadow"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(2.5rem, 8vw, 4rem)",
              gap: "1.5rem",
              background: "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(15,118,110,0.12) 50%, rgba(34,197,94,0.08) 100%)",
              border: "2px solid rgba(34,197,94,0.3)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Animated corner glows */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-green-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            {/* Rocket Icon */}
            <motion.div
              animate={{ rotate: [0, 8, -8, 0], y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ fontSize: "clamp(4rem, 12vw, 6rem)", marginBottom: "0.5rem", zIndex: 10 }}
              className="flex-shrink-0"
            >
              🚀
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center relative z-10"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                fontWeight: 900,
                color: "#1F2937",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Ready to Level Up<br className="hidden sm:block" /> Your Resume?
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-center relative z-10"
              style={{
                fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
                color: "#6B7280",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: "32rem",
              }}
            >
              Join thousands of job seekers who improved their resume with AI-powered insights and actionable recommendations.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative z-10 mt-2"
            >
              <Link href="/analyze">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: "0 0 60px rgba(34,197,94,0.6)" }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.7rem",
                    padding: "clamp(0.9rem, 2vw, 1.1rem) clamp(1.5rem, 4vw, 2.2rem)",
                    background: "linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #0F766E 100%)",
                    color: "#fff",
                    borderRadius: "1.25rem",
                    fontWeight: 800,
                    fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    letterSpacing: "-0.3px",
                  }}
                  className="whitespace-nowrap"
                >
                  Start Free Analysis
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>

            {/* Social proof text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: "0.85rem",
                color: "#9CA3AF",
                marginTop: "0.5rem",
                textAlign: "center",
                zIndex: 10,
              }}
              className="relative"
            >
              ✓ No credit card required · 100% Free · Instant results
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-gray-400 text-sm border-t border-gray-200/60 relative z-10">
        <p>© 2025 ResumeAI · Built with Next.js, Framer Motion & Gemini AI</p>
      </footer>
    </main>
  );
}

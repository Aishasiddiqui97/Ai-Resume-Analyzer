"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiZap, FiMenu, FiX } from "react-icons/fi";

const links = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* Sticky navbar with Tailwind CSS — stays on top while scrolling */
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          borderRadius: "1rem",
          padding: "0.6rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset"
            : "0 2px 12px rgba(0,0,0,0.06)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #22C55E, #0F766E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 14px rgba(34,197,94,0.45)",
              flexShrink: 0,
            }}
          >
            <FiZap style={{ color: "#fff", fontSize: 15 }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1F2937", letterSpacing: "-0.02em" }}>
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          className="hidden md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{ textDecoration: "none" }}>
              <motion.span
                whileHover={{ scale: 1.04 }}
                style={{
                  display: "inline-block",
                  padding: "0.45rem 1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: pathname === l.href ? "rgba(34,197,94,0.12)" : "transparent",
                  color: pathname === l.href ? "#16A34A" : "#4B5563",
                }}
              >
                {l.label}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Get Started — always visible on desktop */}
          <Link href="/analyze" className="hidden sm:block" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 0 22px rgba(34,197,94,0.55)" }}
              whileTap={{ scale: 0.94 }}
              style={{
                padding: "0.55rem 1.25rem",
                background: "linear-gradient(135deg, #22C55E, #0F766E)",
                color: "#fff",
                border: "none",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(34,197,94,0.35)",
                whiteSpace: "nowrap",
              }}
            >
              Get Started
            </motion.button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{
              padding: "0.45rem",
              borderRadius: "0.6rem",
              background: "#F3F4F6",
              border: "none",
              cursor: "pointer",
              color: "#4B5563",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            style={{
              maxWidth: "72rem",
              margin: "0.5rem auto 0",
              borderRadius: "1rem",
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            {links.map((l, i) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "1rem 1.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderBottom: i < links.length - 1 ? "1px solid #F3F4F6" : "none",
                  color: pathname === l.href ? "#16A34A" : "#374151",
                  background: pathname === l.href ? "rgba(34,197,94,0.06)" : "transparent",
                }}>
                  {l.label}
                </div>
              </Link>
            ))}
            <Link href="/analyze" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "1rem 1.5rem",
                background: "linear-gradient(135deg, #22C55E, #0F766E)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                textAlign: "center",
              }}>
                Get Started →
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

"use client";

import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Trail } from "@react-three/drei";
import * as THREE from "three";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

/* ── Suppress THREE.Clock deprecation warning ── */
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      args[0]?.includes?.("THREE.Clock") ||
      args.some((arg: any) => typeof arg === "string" && arg.includes("THREE.Clock"))
    ) {
      return;
    }
    originalWarn(...args);
  };
}

/* ── Mouse parallax ── */
function useMouse() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });
  const sy = useSpring(my, { stiffness: 55, damping: 20 });
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [mx, my]);
  return { sx, sy };
}

/* ── Camera follows mouse ── */
function CameraRig({ mx, my }: { mx: { get: () => number }; my: { get: () => number } }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mx.get() * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-my.get() * 0.35 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Main wireframe sphere ── */
function WireframeSphere() {
  const outerRef  = useRef<THREE.Mesh>(null);
  const innerRef  = useRef<THREE.Mesh>(null);
  const coreRef   = useRef<THREE.Mesh>(null);
  const glowRef   = useRef<THREE.Mesh>(null);
  const groupRef  = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.12;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.13;
      outerRef.current.rotation.x = Math.sin(t * 0.22) * 0.09;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.22;
      innerRef.current.rotation.z =  t * 0.11;
    }
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.08;
      coreRef.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.1) * 0.05;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.05 + Math.sin(t * 1.4) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer atmosphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshBasicMaterial color="#22C55E" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      {/* Outer icosahedron wireframe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.52, 5]} />
        <meshBasicMaterial color="#22C55E" wireframe transparent opacity={0.28} />
      </mesh>

      {/* Solid shell behind wireframe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.50, 5]} />
        <meshPhongMaterial
          color="#071a0e"
          emissive="#22C55E"
          emissiveIntensity={0.09}
          transparent opacity={0.60}
          shininess={60}
        />
      </mesh>

      {/* Inner rotating wireframe */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.98, 3]} />
        <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.38} />
      </mesh>

      {/* Core glowing orb */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshPhongMaterial
          color="#22C55E"
          emissive="#22C55E"
          emissiveIntensity={3}
          transparent opacity={1}
          shininess={400}
        />
      </mesh>

      {/* Core soft halo */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#22C55E" transparent opacity={0.10} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/* ── Scan torus rings ── */
function ScanRing({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed  = 0.5 + index * 0.2;
  const offset = (index / 3) * Math.PI * 2;
  const radius = 1.60 + index * 0.20;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + offset;
    ref.current.rotation.x = t;
    ref.current.rotation.z = t * 0.38;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.16 + Math.sin(clock.elapsedTime * 2.5 + offset) * 0.10;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.007, 8, 120]} />
      <meshBasicMaterial color="#22C55E" transparent opacity={0.18} />
    </mesh>
  );
}

/* ── Orbital particles with trails ── */
function OrbitalParticle({ index, total }: { index: number; total: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const a0     = (index / total) * Math.PI * 2;
  const oR     = 2.05 + (index % 3) * 0.32;
  const speed  = 0.26 + (index % 5) * 0.07;
  const tiltX  = (index % 4) * 0.42;
  const tiltZ  = (index % 3) * 0.32;
  const colors = ["#22C55E","#4ade80","#86efac","#0F766E","#34d399"];
  const color  = colors[index % colors.length];
  const size   = 0.016 + (index % 4) * 0.011;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + a0;
    ref.current.position.set(
      Math.cos(t) * oR,
      Math.sin(t * 0.7 + tiltX) * oR * Math.sin(tiltZ + 0.5),
      Math.sin(t) * oR,
    );
    ref.current.scale.setScalar(0.7 + Math.sin(clock.elapsedTime * 2 + index) * 0.3);
  });

  return (
    <Trail width={0.55} length={5} color={color} attenuation={(t) => t * t} decay={1}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

/* ── Floating data nodes ── */
function DataNode({ position, delay }: { position: [number,number,number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.14;
    ref.current.rotation.y = t * 0.5;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.35 + Math.sin(t * 1.5) * 0.28;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.055, 0]} />
      <meshBasicMaterial color="#4ade80" transparent opacity={0.5} />
    </mesh>
  );
}

/* ── Grid floor ── */
function GridPlane() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.055 + Math.sin(clock.elapsedTime * 0.5) * 0.02;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]}>
      <planeGeometry args={[14, 14, 20, 20]} />
      <meshBasicMaterial color="#22C55E" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

/* ── Full scene ── */
function Scene({ mx, my }: { mx: { get: () => number }; my: { get: () => number } }) {
  const nodes = useMemo<[number,number,number][]>(() => [
    [-3.0, 1.1,-1.0],[3.2, 0.7,-1.4],[-2.6,-1.3, 0.4],
    [ 2.8,-0.9, 0.9],[-1.4, 2.2,-1.8],[2.0, 1.8,-0.4],
    [-3.3, 0.2, 1.4],[3.0,-1.8,-0.7],[0.4, 2.6, 0.9],
    [-0.7,-2.4,-1.1],
  ], []);

  return (
    <>
      <CameraRig mx={mx} my={my} />

      {/* Lighting */}
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 0, 4]}   intensity={7}   color="#22C55E" distance={14} decay={2} />
      <pointLight position={[4, 3, 2]}   intensity={3.5} color="#4ade80" distance={10} decay={2} />
      <pointLight position={[-4,-2,-3]}  intensity={2.5} color="#0F766E" distance={10} decay={2} />
      <pointLight position={[0, 4,-2]}   intensity={1.8} color="#ffffff" distance={8}  decay={2} />

      {/* Sparkles */}
      <Sparkles count={160} scale={7}   size={2.0} speed={0.3} opacity={0.55} color="#22C55E" />
      <Sparkles count={70}  scale={4.5} size={1.3} speed={0.5} opacity={0.40} color="#86efac" />
      <Sparkles count={35}  scale={3}   size={0.8} speed={0.8} opacity={0.55} color="#ffffff" />

      <WireframeSphere />
      {[0,1,2].map(i => <ScanRing key={i} index={i} />)}
      {Array.from({length:16},(_,i) => <OrbitalParticle key={i} index={i} total={16} />)}
      {nodes.map((p,i) => <DataNode key={i} position={p} delay={i*0.7} />)}
      <GridPlane />
    </>
  );
}

/* ── HUD overlay ── */
function HUDOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll(".hi"),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: "power2.out", delay: 1.0 }
    );
  }, []);

  const metrics = [
    { label: "ATS SCORE",     value: "94%", color: "#22C55E", pct: 94 },
    { label: "SKILLS MATCH",  value: "87%", color: "#4ade80", pct: 87 },
    { label: "AI CONFIDENCE", value: "99%", color: "#0F766E", pct: 99 },
  ];

  return (
    <div ref={ref} style={{ position:"absolute", inset:0, pointerEvents:"none", userSelect:"none", overflow:"hidden" }}>

      {/* Corner brackets */}
      {[
        { top:14, left:14,  borderTop:"2px solid rgba(34,197,94,0.55)", borderLeft:"2px solid rgba(34,197,94,0.55)" },
        { top:14, right:14, borderTop:"2px solid rgba(34,197,94,0.55)", borderRight:"2px solid rgba(34,197,94,0.55)" },
        { bottom:14, left:14,  borderBottom:"2px solid rgba(34,197,94,0.55)", borderLeft:"2px solid rgba(34,197,94,0.55)" },
        { bottom:14, right:14, borderBottom:"2px solid rgba(34,197,94,0.55)", borderRight:"2px solid rgba(34,197,94,0.55)" },
      ].map((s,i) => (
        <div key={i} className="hi" style={{ position:"absolute", width:28, height:28, opacity:0, ...s }} />
      ))}

      {/* Scan line */}
      <motion.div
        style={{
          position:"absolute", left:0, right:0, height:1,
          background:"linear-gradient(90deg,transparent,rgba(34,197,94,0.5),#22C55E,rgba(34,197,94,0.5),transparent)",
        }}
        animate={{ top:["8%","92%","8%"] }}
        transition={{ duration:5, repeat:Infinity, ease:"linear" }}
      />

      {/* Left metrics */}
      <div className="hi" style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", opacity:0, display:"flex", flexDirection:"column", gap:8 }}>
        {metrics.map((m,i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", gap:2 }}>
            <span style={{ fontSize:8, fontFamily:"monospace", letterSpacing:"0.15em", color: m.color+"99", textTransform:"uppercase" }}>
              {m.label}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:60, height:3, borderRadius:4, background:"rgba(255,255,255,0.1)", overflow:"hidden" }}>
                <motion.div
                  style={{ height:"100%", borderRadius:4, background: m.color }}
                  initial={{ width:0 }}
                  animate={{ width:`${m.pct}%` }}
                  transition={{ duration:1.4, delay:1.2+i*0.2, ease:"easeOut" }}
                />
              </div>
              <span style={{ fontSize:9, fontFamily:"monospace", fontWeight:700, color: m.color }}>{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right status */}
      <div className="hi" style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", opacity:0, display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
        {["NEURAL NET","SCANNING","ACTIVE"].map((txt,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:8, fontFamily:"monospace", letterSpacing:"0.15em", color:"rgba(74,222,128,0.7)" }}>{txt}</span>
            <motion.div
              style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 6px #22C55E" }}
              animate={{ opacity:[1,0.2,1], scale:[1,1.4,1] }}
              transition={{ duration:1.2, repeat:Infinity, delay:i*0.4 }}
            />
          </div>
        ))}
      </div>

      {/* Bottom badge */}
      <div className="hi" style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)", opacity:0 }}>
        <div style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"5px 14px", borderRadius:999,
          border:"1px solid rgba(34,197,94,0.3)",
          background:"rgba(0,0,0,0.35)",
          backdropFilter:"blur(8px)",
        }}>
          <motion.div
            style={{ width:5, height:5, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 6px #22C55E" }}
            animate={{ opacity:[1,0.3,1], scale:[1,1.5,1] }}
            transition={{ duration:1.5, repeat:Infinity }}
          />
          <span style={{ fontSize:8, fontFamily:"monospace", letterSpacing:"0.2em", color:"rgba(74,222,128,0.85)", textTransform:"uppercase" }}>
            AI Resume Analyzer
          </span>
        </div>
      </div>

      {/* Crosshair */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.18 }}>
        <div style={{ position:"relative", width:28, height:28 }}>
          <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"#22C55E" }} />
          <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"#22C55E" }} />
          <div style={{ position:"absolute", inset:6, borderRadius:"50%", border:"1px solid #22C55E" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Export ── */
export default function ThreeDHeroSection() {
  const { sx, sy } = useMouse();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay so Next.js hydration completes before mounting WebGL
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(400px, 48vw, 540px)",
        borderRadius: "1.25rem",
        overflow: "hidden",
        isolation: "isolate",
        /* Dark background so sphere is always visible */
        background: "radial-gradient(ellipse at 50% 45%, #0d2218 0%, #060e09 55%, #030806 100%)",
        boxShadow: "0 0 70px rgba(34,197,94,0.18), 0 0 140px rgba(34,197,94,0.07), 0 24px 48px rgba(0,0,0,0.25)",
      }}
    >
      {/* Animated green pulse behind sphere */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(34,197,94,0.13) 0%, transparent 70%)",
        }}
      />

      {/* WebGL Canvas — z-index 1 */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            <Canvas
              camera={{ position: [0, 0, 5.6], fov: 46 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <Suspense fallback={null}>
                <Scene mx={{ get: () => sx.get() }} my={{ get: () => sy.get() }} />
              </Suspense>
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD — z-index 2 */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
        <HUDOverlay />
      </div>

      {/* Border glow — z-index 3 */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        borderRadius: "1.25rem",
        boxShadow: "inset 0 0 0 1px rgba(34,197,94,0.25)",
      }} />

      {/* Vignette — z-index 4 */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        borderRadius: "1.25rem",
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.58) 100%)",
      }} />
    </motion.div>
  );
}

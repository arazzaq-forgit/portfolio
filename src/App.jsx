import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Mail,
  ArrowUpRight,
  Download,
  Command,
  X,
  Search,
  ExternalLink,
  Cpu,
  Layers,
  Code2,
  MapPin,
  CheckCircle2,
  Send,
  Sparkles,
  Database,
  Boxes,
  GitBranch,
  Award,
  Palette,
  Filter,
  Home,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

/* Inline brand icons — not all lucide-react versions ship Github/Linkedin */
function GithubIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.17.69-3.84-1.35-3.84-1.35-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.03 11.03 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z" />
    </svg>
  );
}
function LinkedinIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

/* ============================================================
   TOKENS
   bg        #05060A
   surface   rgba(255,255,255,0.05)  glass
   border    rgba(255,255,255,0.10)
   violet    #7C5CFC
   cyan      #22D3EE
   magenta   #F472B6
   text      #F3F4F8
   muted     #8A8FA3
   Display: Space Grotesk / Body: Inter / Mono: JetBrains Mono
============================================================ */

const FONTS =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

function useFonts() {
  useEffect(() => {
    if (!document.getElementById("pf-fonts")) {
      const l = document.createElement("link");
      l.id = "pf-fonts";
      l.rel = "stylesheet";
      l.href = FONTS;
      document.head.appendChild(l);
    }
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
}

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   BACKGROUND FX — neural network canvas + cursor-reactive glow
============================================================ */
function BackgroundFX() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf, nodes;
    const motionOff = reducedMotion();

    const resize = () => {
      canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0, Math.min(window.devicePixelRatio, 2), 0, 0);
      const count = Math.min(46, Math.floor((window.innerWidth * window.innerHeight) / 34000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.6,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      const w = window.innerWidth,
        h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      nodes.forEach((n) => {
        if (!motionOff) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        const dx = n.x - mouse.current.x;
        const dy = n.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          n.x += dx * 0.0025;
          n.y += dy * 0.0025;
        }
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(124,92,252,${0.12 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        const dm = Math.hypot(n.x - mouse.current.x, n.y - mouse.current.y);
        const glow = dm < 160 ? 1 - dm / 160 : 0;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = glow > 0 ? `rgba(34,211,238,${0.5 + glow * 0.5})` : "rgba(138,143,163,0.35)";
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.8 }}
    />
  );
}

function AuroraBlobs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.028'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

/* ============================================================
   CUSTOM CURSOR
============================================================ */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf;
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16;
      ring.current.y += (pos.current.y - ring.current.y) * 0.16;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    loop();

    const growSel = 'a, button, .magnetic, [data-cursor="grow"]';
    const onOver = (e) => {
      if (e.target.closest && e.target.closest(growSel)) ringRef.current?.classList.add("cursor-grow");
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(growSel)) ringRef.current?.classList.remove("cursor-grow");
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ============================================================
   MAGNETIC WRAPPER
============================================================ */
function Magnetic({ as: Tag = "button", strength = 16, className = "", style = {}, children, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = e.clientX - r.left - r.width / 2;
    const ry = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${rx / strength}px, ${ry / strength}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <Tag
      ref={ref}
      className={`magnetic ${className}`}
      style={{ transition: "transform 0.2s cubic-bezier(.2,.8,.2,1)", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ============================================================
   TILT CARD
============================================================ */
function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg) translateZ(6px)`;
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
  };
  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ transition: "transform 0.35s cubic-bezier(.2,.8,.2,1)", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

/* ============================================================
   REVEAL ON SCROLL
============================================================ */
function useReveal() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, v];
}
function Reveal({ children, delay = 0, y = 22 }) {
  const [ref, v] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(.16,.9,.25,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   TYPING ROLES
============================================================ */
function TypingRoles({ roles }) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = roles[idx % roles.length];
    const speed = deleting ? 32 : 62;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = full.slice(0, text.length + 1);
        setText(next);
        if (next === full) setTimeout(() => setDeleting(true), 1100);
      } else {
        const next = full.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIdx((i) => i + 1);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx, roles]);

  return (
    <span style={{ background: "linear-gradient(90deg,#22D3EE,#7C5CFC)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
      {text}
      <span className="type-caret">|</span>
    </span>
  );
}

/* ============================================================
   COUNT UP
============================================================ */
function CountUp({ to, suffix = "", duration = 1400 }) {
  const [ref, v] = useReveal();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!v) return;
    let start;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setN(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [v, to, duration]);
  return (
    <span ref={ref} className="mono" style={{ fontSize: 34, color: "#F3F4F8" }}>
      {n}
      {suffix}
    </span>
  );
}

/* ============================================================
   DATA
============================================================ */
const NAV = [
  { id: "ai", label: "AI Systems", icon: Cpu },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "work", label: "Work", icon: Code2 },
  { id: "certs", label: "Certificates", icon: Award },
  { id: "timeline", label: "Journey", icon: GitBranch },
  { id: "contact", label: "Contact", icon: Mail },
];

const AI_STACK = [
  "LLMs", "RAG", "Transformers", "Agents", "LangGraph", "LangChain",
  "Fine-Tuning", "Prompt Engineering", "Vector Databases", "Embeddings",
  "MCP", "MLOps", "PyTorch", "Evaluation",
];

const PIPELINE = [
  { label: "Input", icon: Sparkles },
  { label: "Embed", icon: Boxes },
  { label: "Retrieve", icon: Database },
  { label: "LLM", icon: Cpu },
  { label: "Output", icon: GitBranch },
];

const SKILLS_RADAR = [
  { skill: "ML / DL", value: 92 },
  { skill: "LLM Systems", value: 95 },
  { skill: "Backend", value: 84 },
  { skill: "Frontend", value: 78 },
  { skill: "Design", value: 72 },
  { skill: "MLOps", value: 80 },
];

const ORBIT_SKILLS = [
  { name: "PyTorch", radius: 120, duration: 26 },
  { name: "LangChain", radius: 120, duration: 26, offset: 120 },
  { name: "React", radius: 120, duration: 26, offset: 240 },
  { name: "FAISS", radius: 175, duration: 34 },
  { name: "FastAPI", radius: 175, duration: 34, offset: 90 },
  { name: "AWS", radius: 175, duration: 34, offset: 180 },
  { name: "vLLM", radius: 175, duration: 34, offset: 270 },
];

const PROJECTS = [
  {
    title: "RAG Pipeline",
    kind: "Enterprise AI Knowledge Assistant",
    year: "2025",
    desc: "An end-to-end RAG system that grounds LLM responses in a private document set — chunking and embedding source documents, retrieving relevant context from a vector store, and passing it to an LLM to generate accurate, source-backed answers instead of relying on the model's raw memory.",
    highlights: ["Document ingestion & chunking pipeline", "Vector search for context retrieval", "LLM-generated answers grounded in retrieved context"],
    stack: ["Python", "LangChain", "Vector DB", "LLM API"],
    link: "https://enterprise-ai-knowledge-assistant-v.vercel.app",
  },
  {
    title: "NLP Compiler",
    kind: "NL → App Config Compiler",
    year: "2025",
    desc: "Describe an app in plain English and this pipeline compiles it end to end — extracting intent, designing the architecture, generating UI/API/DB/Auth schemas, validating cross-layer consistency, repairing issues, and proving execution.",
    highlights: ["Natural language intent extraction", "Auto-generated UI, API, DB & Auth schemas", "Cross-layer validation with self-repair before execution"],
    stack: ["Python", "NLP", "Pipeline orchestration"],
    link: "https://voluble-gumption-ccc447.netlify.app",
  },
  {
    title: "Smart Resource Matcher",
    kind: "RAG-Powered Community Matching",
    year: "2025",
    desc: "\"Nearby\" — describe a need in plain words (food, a clinic, a shelter bed tonight) and get real, ranked community resources back with an explanation of why each one matches and whether it's open right now.",
    highlights: ["Plain-language need → ranked resource matches", "RAG-powered retrieval over a resource index", "Location-aware, explains the reasoning behind each match"],
    stack: ["RAG", "Python", "Vector Search"],
    link: "https://smart-resource-matcher.vercel.app",
  },
  {
    title: "Smart Stadium Copilot",
    kind: "GenAI Wayfinding & Accessibility",
    year: "2025",
    desc: "An explainable GenAI assistant built for FIFA World Cup 2026 fans — helping people navigate stadiums and find accessible routes, seating, and amenities with clear, understandable reasoning behind every suggestion.",
    highlights: ["Explainable GenAI wayfinding", "Accessibility-first navigation", "Built for large-scale, high-traffic event conditions"],
    stack: ["GenAI", "React", "Wayfinding logic"],
    link: "https://smart-stadium-copilot-ihio.vercel.app",
  },
];

const PROJECT_CATS = ["All", "RAG", "NLP", "GenAI"];
const PROJECT_CAT_MAP = {
  "RAG Pipeline": "RAG",
  "NLP Compiler": "NLP",
  "Smart Resource Matcher": "RAG",
  "Smart Stadium Copilot": "GenAI",
};
 

const CERTS = [];
const CERT_CATS = ["All"];

const ACCENTS = [
  { name: "Cyan", a: "#22D3EE", b: "#7C5CFC" },
  { name: "Rose", a: "#FB7185", b: "#F59E0B" },
  { name: "Emerald", a: "#34D399", b: "#22D3EE" },
  { name: "Violet", a: "#A78BFA", b: "#F472B6" },
];

const TIMELINE = [
  { year: "2026", role: "AI / ML Engineer", org: "Independent — open to roles", note: "Building fine-tuned LLM systems end to end." },
  { year: "2023 – 2025", role: "ML Engineer", org: "Applied research team", note: "Shipped retrieval and evaluation infrastructure to production." },
  { year: "2021 – 2023", role: "Full-stack Engineer", org: "Series B startup", note: "Built the product surfaces that made models usable." },
];

/* ============================================================
   COMMAND PALETTE
============================================================ */
function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState("");
  const items = NAV.filter((n) => n.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(5,6,10,0.6)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} className="glass" style={{ width: "min(520px, 90vw)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={16} color="#8A8FA3" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to a section…"
            style={{ background: "transparent", border: "none", outline: "none", color: "#F3F4F8", fontFamily: "Inter", fontSize: 14, flex: 1 }}
          />
          <X size={16} color="#8A8FA3" style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div style={{ padding: 8 }}>
          {items.length === 0 && (
            <div style={{ padding: 14, color: "#8A8FA3", fontSize: 13 }}>No matches.</div>
          )}
          {items.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={onClose}
              className="cmd-item"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, fontSize: 14, color: "#F3F4F8" }}
            >
              {n.label} <ArrowUpRight size={14} color="#8A8FA3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN
============================================================ */
export default function Portfolio() {
  useFonts();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState("idle"); // idle | sending | sent
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [accentPickerOpen, setAccentPickerOpen] = useState(false);
  const [projFilter, setProjFilter] = useState("All");

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent.a);
    document.documentElement.style.setProperty("--accent2", accent.b);
  }, [accent]);

  const filteredProjects = PROJECTS.filter(
    (p) => projFilter === "All" || PROJECT_CAT_MAP[p.title] === projFilter
  );

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setScrollPct(isFinite(pct) ? pct : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setFormState("sending");
    setTimeout(() => setFormState("sent"), 1300);
  };

  return (
    <div style={{ background: "#030405", color: "#F3F4F8", minHeight: "100vh", fontFamily: "Inter, sans-serif", position: "relative", overflowX: "hidden" }}>
      <GlobalStyle />
      <BackgroundFX />
      <AuroraBlobs />
      <CustomCursor />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <div style={{ position: "fixed", top: 0, left: 0, height: 2, width: `${scrollPct}%`, background: "linear-gradient(90deg, var(--accent, #22D3EE), var(--accent2, #7C5CFC))", zIndex: 60, transition: "width 0.1s linear" }} />

      {/* NAV */}
      <div className="glass" style={{ position: "sticky", top: 14, zIndex: 50, margin: "14px auto 0", maxWidth: 980, borderRadius: 999, padding: "10px 10px 10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="display" style={{ fontSize: 16, fontWeight: 600 }}>Mohammed Abdul Razzaq</span>
        <nav style={{ display: "flex", gap: 22 }} className="hide-mobile">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="nav-link">{n.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
          <Magnetic as="button" onClick={() => setAccentPickerOpen((p) => !p)} className="icon-btn small" aria-label="Accent color">
            <Palette size={14} />
          </Magnetic>
          {accentPickerOpen && (
            <div className="glass swatch-pop">
              {ACCENTS.map((a) => (
                <button
                  key={a.name}
                  onClick={() => { setAccent(a); setAccentPickerOpen(false); }}
                  className="swatch"
                  style={{ background: `linear-gradient(135deg, ${a.a}, ${a.b})`, outline: accent.name === a.name ? "2px solid #fff" : "none" }}
                  aria-label={a.name}
                />
              ))}
            </div>
          )}
          <Magnetic
            as="button"
            onClick={() => setPaletteOpen(true)}
            className="pill-btn"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Command size={13} /> <span className="mono" style={{ fontSize: 12 }}>K</span>
          </Magnetic>
        </div>
      </div>

      {/* HERO */}
      <header style={{ maxWidth: 1080, margin: "0 auto", padding: "min(14vh,140px) 32px 60px", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="pill" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 26 }}>
            <span className="pulse-dot" /> Available for AI / ML roles
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="display" style={{ fontSize: "clamp(42px, 8vw, 92px)", fontWeight: 600, lineHeight: 1.02, letterSpacing: "-0.02em", margin: "0 0 22px" }}>
            I build <TypingRoles roles={["AI systems.", "LLM pipelines.", "ML products.", "RAG architectures."]} />
            <br />that ship.
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p style={{ maxWidth: 560, color: "#8A8FA3", fontSize: 17.5 }}>
            AI/ML engineer focused on fine-tuning, retrieval and production model infrastructure —
            with the full-stack and design range to take a model from notebook to shipped product.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
            <Magnetic as="a" href="#work" className="btn-primary">
              View work <ArrowUpRight size={15} />
            </Magnetic>
            <Magnetic as="a" href="/resume.pdf" className="btn-ghost">
              <Download size={15} /> Resume
            </Magnetic>
            <Magnetic as="a" href="https://github.com/arazzaq-forgit" className="icon-btn" aria-label="GitHub"><GithubIcon size={16} /></Magnetic>
            <Magnetic as="a" href="https://linkedin.com/in/mohd-abdul-razzaq" className="icon-btn" aria-label="LinkedIn"><LinkedinIcon size={16} /></Magnetic>
            <Magnetic as="a" href="mailto:ajrqqf@gmail.com" className="icon-btn" aria-label="Email"><Mail size={16} /></Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div style={{ display: "flex", gap: 40, marginTop: 66, flexWrap: "wrap" }}>
            <div><CountUp to={14} suffix="+" /><div className="stat-label">models shipped</div></div>
            <div><CountUp to={5} /><div className="stat-label">years experience</div></div>
            <div><CountUp to={40} suffix="+" /><div className="stat-label">production PRs merged / mo</div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8A8FA3", fontSize: 13 }}>
              <MapPin size={14} /> Remote ·  Hyderabad, India
            </div>
          </div>
        </Reveal>
      </header>

      {/* AI SYSTEMS */}
      <section id="ai" style={{ maxWidth: 1080, margin: "0 auto", padding: "90px 32px", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="eyebrow">AI Systems</div>
          <h2 className="display" style={{ fontSize: 34, margin: "10px 0 14px" }}>How a request becomes an answer</h2>
          <p style={{ color: "#8A8FA3", maxWidth: 560, marginBottom: 46 }}>
            A simplified view of the retrieval-augmented pipelines I build and productionize.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="glass pipeline">
            {PIPELINE.map((p, i) => {
              const Icon = p.icon;
              return (
                <React.Fragment key={p.label}>
                  <div className="pipeline-node">
                    <div className="pipeline-icon"><Icon size={18} color="#22D3EE" /></div>
                    <span className="mono" style={{ fontSize: 12 }}>{p.label}</span>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="pipeline-track">
                      <div className="pipeline-dot" style={{ animationDelay: `${i * 0.4}s` }} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 40 }}>
            {AI_STACK.map((t) => (
              <span key={t} className="tag-chip">{t}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 32px 100px", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="eyebrow">Skills</div>
          <h2 className="display" style={{ fontSize: 34, margin: "10px 0 40px" }}>Depth, mapped two ways</h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="skills-grid">
          <Reveal delay={0.06}>
            <div className="glass" style={{ padding: 20, borderRadius: 16, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={SKILLS_RADAR} outerRadius="72%">
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#8A8FA3", fontSize: 11, fontFamily: "JetBrains Mono" }} />
                  <Radar dataKey="value" stroke="#22D3EE" fill="#7C5CFC" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="glass" style={{ padding: 20, borderRadius: 16, height: 320, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div className="orbit-core mono">CORE</div>
              {ORBIT_SKILLS.map((s) => (
                <div
                  key={s.name}
                  className="orbit-ring"
                  style={{
                    width: s.radius * 2,
                    height: s.radius * 2,
                    animationDuration: `${s.duration}s`,
                    transform: `rotate(${s.offset || 0}deg)`,
                  }}
                >
                  <span className="orbit-node mono">{s.name}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 32px 100px", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="eyebrow">Selected Work</div>
          <h2 className="display" style={{ fontSize: 34, margin: "10px 0 24px" }}>Shipped, not just trained</h2>
        </Reveal>

        <Reveal delay={0.04}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            <Filter size={13} color="#8A8FA3" />
            {PROJECT_CATS.map((c) => (
              <button
                key={c}
                onClick={() => setProjFilter(c)}
                className="filter-chip"
                style={{
                  borderColor: projFilter === c ? "var(--accent, #22D3EE)" : "rgba(255,255,255,0.12)",
                  color: projFilter === c ? "var(--accent, #22D3EE)" : "#A8ADC0",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px,1fr))", gap: 20 }}>
          {filteredProjects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <TiltCard className="glass project-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="mono" style={{ fontSize: 11.5, color: "#8A8FA3", marginBottom: 6 }}>{p.kind} · {p.year}</div>
                    <div className="display" style={{ fontSize: 22, fontWeight: 600 }}>{p.title}</div>
                  </div>
                  <ExternalLink size={16} color="#8A8FA3" />
                </div>
                <p style={{ color: "#A8ADC0", fontSize: 14, margin: "14px 0" }}>{p.desc}</p>
                <ul style={{ margin: "0 0 16px", paddingLeft: 18, display: "grid", gap: 6 }}>
                  {p.highlights.map((h) => (
                    <li key={h} style={{ color: "#C9CDE0", fontSize: 13 }}>{h}</li>
                  ))}
                </ul>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.stack.map((s) => <span key={s} className="tag-chip small">{s}</span>)}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p style={{ color: "#5B6072", fontSize: 12.5, marginTop: 18 }}>
            More projects added as they're finalized.
          </p>
        </Reveal>
      </section>

      {/* CERTIFICATES */}
      <section id="certs" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 32px 100px", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="eyebrow">Certificates</div>
          <h2 className="display" style={{ fontSize: 34, margin: "10px 0 24px" }}>Verified learning</h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="glass empty-state">
            <div className="pipeline-icon" style={{ width: 46, height: 46, margin: "0 auto 14px" }}>
              <Award size={20} color="var(--accent, #22D3EE)" />
            </div>
            <div className="display" style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Coming soon</div>
            <p style={{ color: "#8A8FA3", fontSize: 13.5, maxWidth: 360, margin: "0 auto" }}>
              Certifications will appear here once added — search, filtering, and a fullscreen preview are already built in.
            </p>
          </div>
        </Reveal>
      </section>


      {/* TIMELINE */}
      <section id="timeline" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 32px 110px", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="eyebrow">Journey</div>
          <h2 className="display" style={{ fontSize: 34, margin: "10px 0 40px" }}>Roadmap</h2>
        </Reveal>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: 5, top: 6, bottom: 6, width: 2, background: "linear-gradient(180deg,#22D3EE,#7C5CFC,transparent)" }} />
          {TIMELINE.map((t, i) => (
            <Reveal key={t.role} delay={i * 0.08}>
              <div style={{ position: "relative", paddingBottom: 34 }}>
                <div style={{ position: "absolute", left: -24, top: 4, width: 11, height: 11, borderRadius: "50%", background: "#0B0D14", border: "2px solid #22D3EE", boxShadow: "0 0 12px #22D3EE" }} />
                <div className="mono" style={{ fontSize: 12, color: "#22D3EE", marginBottom: 4 }}>{t.year}</div>
                <div className="display" style={{ fontSize: 19, fontWeight: 600 }}>{t.role}</div>
                <div style={{ color: "#8A8FA3", fontSize: 13.5, marginTop: 2 }}>{t.org}</div>
                <div style={{ color: "#A8ADC0", fontSize: 13.5, marginTop: 6, maxWidth: 480 }}>{t.note}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ maxWidth: 760, margin: "0 auto", padding: "20px 32px 140px", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div className="eyebrow">Contact</div>
          <h2 className="display" style={{ fontSize: "clamp(30px,5vw,44px)", margin: "10px 0 30px" }}>
            Building an AI product? Let's talk.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={submit} className="glass" style={{ padding: 26, borderRadius: 16, display: "grid", gap: 14 }}>
            {formState === "sent" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "30px 0", color: "#22D3EE" }}>
                <CheckCircle2 size={30} />
                <span className="display" style={{ fontSize: 18 }}>Message sent — I'll reply soon.</span>
              </div>
            ) : (
              <>
                <input className="field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <textarea className="field" placeholder="What are you building?" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                <Magnetic as="button" type="submit" className="btn-primary" style={{ justifySelf: "start" }}>
                  {formState === "sending" ? "Sending…" : <>Send message <Send size={14} /></>}
                </Magnetic>
              </>
            )}
          </form>
        </Reveal>

        <Reveal delay={0.14}>
          <div style={{ display: "flex", gap: 22, marginTop: 30, flexWrap: "wrap" }}>
            <a href="mailto:ajrqqf@gmail.com" className="nav-link" style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} /> hello@example.com</a>
            <a href="https://github.com/arazzaq-forgit" className="nav-link" style={{ display: "flex", alignItems: "center", gap: 6 }}><GithubIcon size={14} /> github.com/yourname</a>
            <a href="https://linkedin.com/in/mohd-abdul-razzaq" className="nav-link" style={{ display: "flex", alignItems: "center", gap: 6 }}><LinkedinIcon size={14} /> linkedin.com/in/yourname</a>
          </div>
        </Reveal>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "24px 32px 90px", maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        <span className="mono" style={{ fontSize: 11.5, color: "#4a4f63" }}>© 2026 · Mohammed Abdul Razzaq</span>
        <span className="mono" style={{ fontSize: 11.5, color: "#4a4f63" }}>⌘K to navigate</span>
      </footer>

      {/* FLOATING DOCK */}
      <div className="glass dock" role="navigation" aria-label="Quick navigation">
        <a href="#" className="dock-item" aria-label="Home"><Home size={16} /></a>
        {NAV.map((n) => {
          const Icon = n.icon;
          return (
            <a key={n.id} href={`#${n.id}`} className="dock-item" aria-label={n.label}>
              <Icon size={16} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   GLOBAL STYLE
============================================================ */
function GlobalStyle() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      a { text-decoration: none; color: inherit; }
      button { font-family: inherit; cursor: pointer; }
      input, textarea { font-family: inherit; }
      ::selection { background: #7C5CFC; color: #fff; }
      .display { font-family: 'Space Grotesk', sans-serif; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .eyebrow {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #22D3EE;
      }
      .glass {
        background: rgba(255,255,255,0.045);
        border: 1px solid rgba(255,255,255,0.10);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .pill {
        font-family: 'JetBrains Mono', monospace; font-size: 12.5px;
        border: 1px solid var(--accent, #22D3EE); background: color-mix(in srgb, var(--accent, #22D3EE) 10%, transparent);
        color: var(--accent, #22D3EE); padding: 7px 14px; border-radius: 999px;
      }
      .pulse-dot {
        width: 7px; height: 7px; border-radius: 50%; background: var(--accent, #22D3EE);
        box-shadow: 0 0 0 0 rgba(34,211,238,0.6);
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(34,211,238,0.5); }
        70% { box-shadow: 0 0 0 8px rgba(34,211,238,0); }
        100% { box-shadow: 0 0 0 0 rgba(34,211,238,0); }
      }
      .nav-link { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #A8ADC0; transition: color 0.2s; }
      .nav-link:hover { color: #F3F4F8; }
      .pill-btn {
        display: flex; align-items: center; gap: 6px;
        border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.04);
        color: #F3F4F8; padding: 8px 12px; border-radius: 999px; font-size: 12px;
      }
      .btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        background: linear-gradient(90deg, var(--accent, #22D3EE), var(--accent2, #7C5CFC));
        color: #05060A; font-weight: 600; font-size: 14px;
        padding: 12px 20px; border-radius: 10px; border: none;
      }
      .btn-ghost {
        display: inline-flex; align-items: center; gap: 8px;
        border: 1px solid rgba(255,255,255,0.16); color: #F3F4F8;
        font-size: 14px; padding: 12px 20px; border-radius: 10px; background: rgba(255,255,255,0.03);
      }
      .icon-btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 42px; height: 42px; border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.03); color: #F3F4F8;
      }
      .stat-label { font-size: 12px; color: #8A8FA3; margin-top: 4px; max-width: 130px; }
      .tag-chip {
        font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #C9CDE0;
        border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03);
        padding: 7px 12px; border-radius: 8px;
      }
      .tag-chip.small { font-size: 11px; padding: 4px 9px; }
      .cmd-item:hover { background: rgba(255,255,255,0.06); }
      .field {
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);
        border-radius: 8px; padding: 12px 14px; color: #F3F4F8; font-size: 14px; outline: none;
        transition: border-color 0.2s;
      }
      .field:focus { border-color: #22D3EE; }

      .blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.22; }
      .blob-a { width: 480px; height: 480px; background: var(--accent2, #7C5CFC); top: -120px; left: -100px; animation: float1 24s ease-in-out infinite; }
      .blob-b { width: 420px; height: 420px; background: var(--accent, #22D3EE); bottom: -140px; right: -80px; animation: float2 28s ease-in-out infinite; }
      .blob-c { width: 340px; height: 340px; background: #2A2F3F; top: 40%; left: 55%; opacity: 0.35; animation: float3 32s ease-in-out infinite; }
      @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(60px,80px) scale(1.1);} }
      @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(-70px,-50px) scale(1.15);} }
      @keyframes float3 { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(-40px,60px) scale(0.9);} }

      .cursor-dot, .cursor-ring { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 90; border-radius: 50%; }
      .cursor-dot { width: 6px; height: 6px; background: #22D3EE; margin: -3px 0 0 -3px; }
      .cursor-ring { width: 34px; height: 34px; border: 1px solid rgba(124,92,252,0.6); margin: -17px 0 0 -17px; transition: width 0.2s, height 0.2s, margin 0.2s, background 0.2s; }
      .cursor-ring.cursor-grow { width: 56px; height: 56px; margin: -28px 0 0 -28px; background: rgba(124,92,252,0.12); }
      @media (pointer: coarse) { .cursor-dot, .cursor-ring { display: none; } }

      .type-caret { animation: blink 1s step-start infinite; }
      @keyframes blink { 50% { opacity: 0; } }

      .pipeline { display: flex; align-items: center; padding: 30px 24px; border-radius: 16px; overflow-x: auto; gap: 4px; }
      .pipeline-node { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 74px; }
      .pipeline-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--accent, #22D3EE) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent, #22D3EE) 35%, transparent); }
      .pipeline-track { flex: 1; min-width: 40px; height: 2px; background: rgba(255,255,255,0.1); position: relative; margin: 0 4px 22px; }
      .pipeline-dot { position: absolute; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent2, #7C5CFC); box-shadow: 0 0 10px var(--accent2, #7C5CFC); animation: travel 2.4s linear infinite; }
      @keyframes travel { 0% { left: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 100%; opacity: 0; } }

      .orbit-core {
        position: absolute; width: 64px; height: 64px; border-radius: 50%;
        background: radial-gradient(circle, color-mix(in srgb, var(--accent2, #7C5CFC) 40%, transparent), transparent);
        border: 1px solid color-mix(in srgb, var(--accent2, #7C5CFC) 50%, transparent);
        display: flex; align-items: center; justify-content: center; font-size: 11px; color: #C9CDE0; z-index: 2;
      }
      .orbit-ring {
        position: absolute; border: 1px dashed rgba(255,255,255,0.1); border-radius: 50%;
        animation: spin linear infinite;
      }
      .orbit-node {
        position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
        background: rgba(5,6,10,0.9); border: 1px solid rgba(255,255,255,0.16);
        padding: 4px 9px; border-radius: 999px; font-size: 10.5px; color: #E6E9F5;
        animation: counter-spin linear infinite; animation-duration: inherit;
      }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes counter-spin { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(-360deg); } }

      .tilt-card { padding: 22px; border-radius: 16px; position: relative; }
      .tilt-card::before {
        content: ""; position: absolute; inset: 0; border-radius: 16px; opacity: 0; pointer-events: none;
        background: radial-gradient(240px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--accent, #22D3EE) 16%, transparent), transparent 60%);
        transition: opacity 0.3s;
      }
      .tilt-card:hover::before { opacity: 1; }

      .icon-btn.small { width: 34px; height: 34px; border-radius: 999px; }
      .swatch-pop {
        position: absolute; top: 46px; right: 90px; display: flex; gap: 8px;
        padding: 8px; border-radius: 12px; z-index: 55;
      }
      .swatch { width: 22px; height: 22px; border-radius: 50%; border: none; cursor: pointer; }
      .filter-chip {
        font-family: 'JetBrains Mono', monospace; font-size: 12px;
        background: transparent; border: 1px solid rgba(255,255,255,0.12);
        padding: 6px 13px; border-radius: 999px; transition: border-color 0.2s, color 0.2s;
      }
      .cert-card { display: flex; }
      .empty-state { text-align: center; padding: 48px 24px; border-radius: 16px; }
      .dock {
        position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%);
        display: flex; gap: 4px; padding: 8px; border-radius: 999px; z-index: 55;
      }
      .dock-item {
        width: 38px; height: 38px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
        color: #A8ADC0; transition: background 0.2s, color 0.2s, transform 0.2s;
      }
      .dock-item:hover { background: rgba(255,255,255,0.08); color: #F3F4F8; transform: translateY(-3px); }

      @media (max-width: 760px) {
        .hide-mobile { display: none; }
        .skills-grid { grid-template-columns: 1fr !important; }
        .swatch-pop { right: 10px; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, .blob, .orbit-ring, .orbit-node, .pipeline-dot, .pulse-dot, .type-caret { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}

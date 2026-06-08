"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Lightbulb, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Logo, { LogoMark } from "@/components/Logo";
import { useTheme, THEMES } from "@/context/ThemeContext";

const COLOR_TOKENS = [
  { name: "--background", label: "Background" },
  { name: "--surface", label: "Surface" },
  { name: "--panel", label: "Panel" },
  { name: "--foreground", label: "Foreground" },
  { name: "--muted", label: "Muted" },
  { name: "--primary", label: "Primary" },
  { name: "--secondary", label: "Secondary" },
  { name: "--border", label: "Border" },
];

const SEVERITY_TOKENS = [
  { name: "--sev-critical", label: "Critical" },
  { name: "--sev-high", label: "High" },
  { name: "--sev-medium", label: "Medium" },
  { name: "--sev-low", label: "Low" },
];

const TAGLINES = [
  "Audit before exploit day.",
  "Protected by design.",
  "Every Rust file. Every exploit path.",
  "Ship Solana with confidence.",
];

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: "56px" }}
    >
      <div
        className="section-label section-label--ruled"
        style={{ marginBottom: "24px", display: "flex", gap: "12px" }}
      >
        <span className="font-mono" style={{ color: "var(--primary)" }}>{num}</span>
        {title}
      </div>
      {children}
    </motion.section>
  );
}

export default function BrandKitPage() {
  const { theme, setTheme } = useTheme();
  const [hexes, setHexes] = useState<Record<string, string>>({});

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const map: Record<string, string> = {};
    [...COLOR_TOKENS, ...SEVERITY_TOKENS].forEach((t) => {
      map[t.name] = cs.getPropertyValue(t.name).trim();
    });
    setHexes(map);
  }, [theme]);

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ maxWidth: "1080px", margin: "0 auto", padding: "48px 24px 100px" }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "56px" }}
        >
          <div className="badge" style={{ background: "var(--primary-soft)", borderColor: "color-mix(in srgb, var(--primary) 30%, transparent)", color: "var(--primary)", marginBottom: "20px" }}>
            <Lightbulb size={11} />
            Brand Kit
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.05, marginBottom: "16px" }}>
            The SolShield identity system
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", maxWidth: "640px", lineHeight: 1.65 }}>
            A security brand drawn on engineering graph paper. The mark, palette,
            type, and components below adapt live to the active theme — switch it
            from the navbar to preview every world.
          </p>
        </motion.div>

        {/* 01 · Strategy */}
        <Section num="01" title="Brand Strategy">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            {[
              { k: "Category", v: "Security × developer tool" },
              { k: "Audience", v: "Solana / Anchor builders, auditors" },
              { k: "Personality", v: "Precise, vigilant, builder-native" },
              { k: "Core metaphor", v: "A protected core inside an engineering grid" },
              { k: "Logo idea", v: "Shield on graph paper, three scan-bars guarding a center node" },
              { k: "Promise", v: "Catch the exploit before mainnet does" },
            ].map((item) => (
              <div key={item.k} className="card" style={{ padding: "18px" }}>
                <div className="section-label" style={{ marginBottom: "8px" }}>{item.k}</div>
                <div style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: 1.5 }}>{item.v}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 02 · Logo */}
        <Section num="02" title="Logo System">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
            {/* Primary mark */}
            <div className="card" style={{ padding: "36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <LogoMark size={72} />
              <span className="section-label">Primary Mark</span>
            </div>
            {/* On panel */}
            <div className="panel" style={{ padding: "36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <Logo size={36} fontSize={22} />
              <span className="section-label">Wordmark</span>
            </div>
            {/* On primary */}
            <div style={{ padding: "36px", borderRadius: "8px", background: "var(--primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <span style={{ color: "var(--primary-fg)", display: "inline-flex", alignItems: "center", gap: "9px", fontWeight: 800, fontSize: "20px" }} className="font-heading">
                <ShieldCheck size={28} />
                SolShield
              </span>
              <span className="section-label" style={{ color: "var(--primary-fg)", opacity: 0.85 }}>On Primary</span>
            </div>
          </div>

          <div className="card" style={{ marginTop: "14px", padding: "22px", display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
            <span className="section-label">Construction</span>
            <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, flex: 1, minWidth: "260px" }}>
              The shield is built on a 32×32 graph-paper grid. Internal hatch
              lines echo the notebook texture; three angled scan-bars sweep the
              shield (a nod to Solana) and converge on a filled center node — the
              protected core. The stroke uses <code className="font-mono" style={{ color: "var(--primary)" }}>currentColor</code> so the
              mark inherits the active theme primary.
            </p>
            <span style={{ display: "inline-flex", gap: "14px", alignItems: "center" }}>
              <LogoMark size={20} />
              <LogoMark size={32} />
              <LogoMark size={48} />
            </span>
          </div>
        </Section>

        {/* 03 · Color */}
        <Section num="03" title="Color System">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {COLOR_TOKENS.map((t) => (
              <div key={t.name} className="card" style={{ overflow: "hidden", padding: 0 }}>
                <div style={{ height: "76px", background: `var(${t.name})`, borderBottom: "1px solid var(--border)" }} />
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>{t.label}</div>
                  <code className="font-mono" style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {hexes[t.name] || t.name}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <div className="section-label" style={{ marginBottom: "12px" }}>Severity scale</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            {SEVERITY_TOKENS.map((t) => (
              <div key={t.name} className="card" style={{ overflow: "hidden", padding: 0 }}>
                <div style={{ height: "56px", background: `var(${t.name})` }} />
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>{t.label}</div>
                  <code className="font-mono" style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {hexes[t.name] || t.name}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <div className="section-label" style={{ marginBottom: "12px" }}>Themes — click to preview</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="card"
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  padding: "16px",
                  borderColor: t.id === theme ? "var(--primary)" : "var(--border)",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "15px" }}>{t.icon}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>{t.name}</span>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  {t.swatches.map((c, i) => (
                    <span key={i} style={{ flex: 1, height: 26, borderRadius: "4px", background: c, border: "1px solid var(--border)" }} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* 04 · Typography */}
        <Section num="04" title="Typography">
          <div className="card" style={{ padding: "28px" }}>
            <div className="section-label" style={{ marginBottom: "8px" }}>Headings · DM Sans 800</div>
            <div className="font-heading" style={{ fontSize: "44px", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "20px" }}>
              Secure by construction
            </div>
            <div className="section-label" style={{ marginBottom: "8px" }}>Body · system UI</div>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.65, marginBottom: "20px", maxWidth: "640px" }}>
              SolShield pairs an expressive DM Sans display face with the native
              system UI stack for body copy — fast, legible, and familiar across
              every platform.
            </p>
            <div className="section-label" style={{ marginBottom: "8px" }}>Mono · system monospace</div>
            <code className="font-mono" style={{ fontSize: "14px", color: "var(--primary)" }}>
              SOL-001 · signer_validation() · time O(n)
            </code>
          </div>
        </Section>

        {/* 05 · Components */}
        <Section num="05" title="Component Library">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            <div className="card" style={{ padding: "22px" }}>
              <div className="section-label" style={{ marginBottom: "14px" }}>Buttons</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button className="btn-primary"><Zap size={14} /> Primary</button>
                <button className="btn-ghost">Ghost</button>
              </div>
            </div>
            <div className="card" style={{ padding: "22px" }}>
              <div className="section-label" style={{ marginBottom: "14px" }}>Severity Badges</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span className="badge badge-critical">Critical</span>
                <span className="badge badge-high">High</span>
                <span className="badge badge-medium">Medium</span>
                <span className="badge badge-low">Low</span>
              </div>
            </div>
            <div className="card" style={{ padding: "22px" }}>
              <div className="section-label" style={{ marginBottom: "14px" }}>Input</div>
              <input className="input-field" placeholder="https://github.com/owner/repo" />
            </div>
            <div className="stat-block">
              <div className="stat-value">7</div>
              <div className="stat-label">Vulnerability Rules</div>
            </div>
          </div>
        </Section>

        {/* 06 · Voice */}
        <Section num="06" title="Voice & Taglines">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
            {TAGLINES.map((t) => (
              <div key={t} className="panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                <ArrowUpRight size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <span className="font-heading" style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.02em" }}>{t}</span>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
          <Logo size={24} fontSize={15} />
          <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "10px" }}>
            SolShield AI · brand system v1 · built on AlgoVizuals UI
          </p>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  ArrowUpRight,
  Code2,
  GitBranch,
  MessageSquare,
  Eye,
  Upload,
  Sparkles,
  History,
  Clock,
  Star,
  ShieldCheck,
} from "lucide-react";
import Logo, { LogoMark } from "@/components/Logo";
import ThemePicker from "@/components/ThemePicker";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------- data ---------- */

const VULN_RULES = [
  { id: "SOL-001", name: "Missing Signer Validation", catches: "Instructions that mutate state without verifying the caller signed the transaction", severity: "high" },
  { id: "SOL-002", name: "Unsafe unwrap() Usage", catches: "Panics on None/Err that can brick an instruction and enable griefing", severity: "medium" },
  { id: "SOL-003", name: "Account Ownership Missing", catches: "Accounts deserialized without checking the owning program", severity: "high" },
  { id: "SOL-004", name: "Insecure CPI Invocation", catches: "Cross-program invokes against unverified target program IDs", severity: "high" },
  { id: "SOL-005", name: "PDA Validation Issues", catches: "Seeds/bump mismatches that let attackers substitute forged PDAs", severity: "high" },
  { id: "SOL-006", name: "Arithmetic Overflow Risk", catches: "Unchecked +, -, * on token amounts and balances", severity: "medium" },
  { id: "SOL-007", name: "Missing Authority Check", catches: "Admin-only paths reachable without comparing against the stored authority", severity: "high" },
];

const TRACE_ROWS = [
  { id: "SOL-001", label: "signer_validation", status: "fail" },
  { id: "SOL-004", label: "insecure_cpi", status: "fail" },
  { id: "SOL-005", label: "pda_validation", status: "warn" },
  { id: "SOL-002", label: "unsafe_unwrap", status: "pass" },
  { id: "SOL-006", label: "arithmetic_overflow", status: "pass" },
];

const STATS = [
  { value: "7", label: "Detection Rules", icon: <ShieldCheck size={20} />, box: "icon-box--primary" },
  { value: "<2s", label: "Avg Scan Time", icon: <Zap size={20} />, box: "icon-box--secondary" },
  { value: "100%", label: "Free · No Login", icon: <Star size={20} />, box: "icon-box--accent" },
  { value: "24/7", label: "AI Assistant", icon: <MessageSquare size={20} />, box: "icon-box--primary" },
];

const STEPS = [
  {
    n: "01",
    box: "icon-box--primary",
    icon: <Upload size={22} />,
    title: "Upload or paste a URL",
    desc: "Drop an Anchor project ZIP or paste any public GitHub repo URL. No account needed for quick audits.",
    time: "~5 sec",
  },
  {
    n: "02",
    box: "icon-box--secondary",
    icon: <Code2 size={22} />,
    title: "7 rules scan in parallel",
    desc: "Every .rs file is parsed and checked for signer, ownership, CPI, PDA, overflow, authority, and unwrap() issues.",
    time: "~2 sec",
  },
  {
    n: "03",
    box: "icon-box--accent",
    icon: <Sparkles size={22} />,
    title: "AI explains every finding",
    desc: "Click any finding for a Gemini-written exploit scenario, root cause, and the secure Rust fix.",
    time: "on demand",
  },
];

const FEATURES = [
  {
    box: "icon-box--primary",
    icon: <Code2 size={22} />,
    title: "Static Analysis Engine",
    desc: "7 security rules check every function signature, CPI call, PDA seed derivation, and arithmetic operation across your whole Anchor program.",
  },
  {
    box: "icon-box--secondary",
    icon: <Sparkles size={22} />,
    title: "Gemini AI Explanations",
    desc: "Every finding gets an on-demand exploit scenario, root cause analysis, and secure Rust fix — powered by Gemini 2.5 Flash.",
  },
  {
    box: "icon-box--accent",
    icon: <Eye size={22} />,
    title: "Monaco Code Viewer",
    desc: "Interactive editor highlights vulnerable lines with inline severity markers and jump-to-line navigation.",
  },
  {
    box: "icon-box--secondary",
    icon: <GitBranch size={22} />,
    title: "GitHub Repo Scanner",
    desc: "Paste a URL — SolShield clones the repo, finds every .rs file, runs the full suite, and returns a report.",
  },
  {
    box: "icon-box--accent",
    icon: <MessageSquare size={22} />,
    title: "AI Security Chat",
    desc: "A streaming Solana-security assistant for follow-up questions, secure patterns, and code reviews.",
  },
  {
    box: "icon-box--primary",
    icon: <History size={22} />,
    title: "Scan History",
    desc: "Sign in with Google and every scan is stored — revisit findings and track fixes over time.",
  },
];

/* tint helpers for the inverted (dark-on-light themes) sections */
const INK = "var(--foreground)";
const PAPER = "var(--background)";
const inkTint = (pct: number) =>
  `color-mix(in srgb, ${PAPER} ${pct}%, transparent)`;

export default function LandingPage() {
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".hero-pill", { y: 24, opacity: 0, duration: 0.5 })
        .from(".hero-title", { y: 48, opacity: 0, duration: 0.9 }, "-=0.3")
        .from(".hero-sub", { y: 32, opacity: 0, duration: 0.7 }, "-=0.55")
        .from(".hero-proof", { y: 20, opacity: 0, duration: 0.5 }, "-=0.45")
        .from(".hero-ctas", { y: 20, opacity: 0, duration: 0.5 }, "-=0.35")
        .from(".hero-trace", { y: 60, opacity: 0, duration: 0.8 }, "-=0.3")
        .from(".trace-row", { x: -16, opacity: 0, stagger: 0.07, duration: 0.35 }, "-=0.35");

      const reveal = (sel: string, trigger: string) =>
        gsap.from(sel, {
          y: 42,
          opacity: 0,
          duration: 0.6,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger, start: "top 82%" },
        });

      reveal(".stat-item", ".stats-grid");
      reveal(".step-card", ".steps-grid");
      reveal(".feature-card", ".features-grid");
      reveal(".rules-table-wrap", ".rules-table-wrap");
      reveal(".cta-content", ".cta-content");
    },
    { scope: mainRef }
  );

  return (
    <main
      ref={mainRef}
      style={{
        overflowX: "hidden",
        width: "100%",
        position: "relative",
        zIndex: 1,
        color: "var(--foreground)",
      }}
    >
      {/* ─────────── NAV ─────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          padding: "12px clamp(20px, 4vw, 48px)",
          background: "var(--surface)",
          borderBottom: "3px solid var(--border)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo size={28} fontSize={16} />
        </Link>
        <div
          className="landing-nav-links"
          style={{
            display: "flex",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--muted)",
            alignItems: "center",
          }}
        >
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how" },
            { label: "Rules", href: "#rules" },
            { label: "Dashboard", href: "/dashboard" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="nav-link"
              style={{
                color: "inherit",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "999px",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemePicker />
          <Link
            href="/dashboard"
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: "13px" }}
          >
            <Zap size={14} />
            Start Audit
          </Link>
        </div>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "clamp(64px, 9vw, 120px) 24px 56px",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: "880px", width: "100%" }}>
          <div className="hero-pill pill-label" style={{ marginBottom: "28px" }}>
            <Zap size={14} style={{ color: "var(--secondary-text)" }} />
            AI-Powered Solana Security Auditing
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(2.7rem, 6.4vw, 5.2rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
              marginBottom: "24px",
            }}
          >
            Ship Solana contracts.
            <br />
            <span
              style={{
                color: "var(--secondary-text)",
                borderBottom: "6px solid var(--secondary)",
                lineHeight: 1.2,
              }}
            >
              Audited in seconds.
            </span>
          </h1>

          <p
            className="hero-sub"
            style={{
              fontSize: "clamp(15px, 1.8vw, 18px)",
              color: "var(--muted)",
              fontWeight: 500,
              maxWidth: "580px",
              margin: "0 auto 28px",
              lineHeight: 1.65,
            }}
          >
            SolShield AI scans Anchor and Rust programs for{" "}
            <span style={{ color: "var(--secondary-text)", fontWeight: 800 }}>
              7 critical vulnerability classes
            </span>{" "}
            and explains every finding — exploit path, root cause, and secure
            fix — in plain English.
          </p>

          {/* social proof pills */}
          <div
            className="hero-proof"
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            <span className="pill-label" style={{ padding: "6px 14px", fontSize: "12.5px" }}>
              <span style={{ display: "flex" }}>
                {["var(--primary)", "var(--secondary)", "var(--accent)"].map((c, i) => (
                  <span
                    key={i}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: c,
                      border: "2px solid var(--surface)",
                      marginLeft: i === 0 ? 0 : -7,
                    }}
                  />
                ))}
              </span>
              Built for Anchor devs
            </span>
            <span className="pill-label" style={{ padding: "6px 14px", fontSize: "12.5px" }}>
              <Star size={13} style={{ color: "var(--accent)", fill: "var(--accent)" }} />
              Free — no login required
            </span>
          </div>

          <div
            className="hero-ctas"
            style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/dashboard"
              className="btn-primary"
              style={{ padding: "15px 34px", fontSize: "16px", borderRadius: "16px" }}
            >
              <ShieldCheck size={18} />
              Start Free Audit
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/chat"
              className="btn-ghost"
              style={{ padding: "15px 34px", fontSize: "16px", borderRadius: "16px" }}
            >
              <MessageSquare size={17} />
              Ask AI Assistant
            </Link>
          </div>
        </div>

        {/* Trace window mockup */}
        <div
          className="hero-trace"
          style={{
            marginTop: "60px",
            width: "100%",
            maxWidth: "720px",
            overflow: "hidden",
            textAlign: "left",
            background: "var(--surface)",
            border: "3px solid var(--border)",
            borderRadius: "20px",
            boxShadow: "8px 8px 0px 0px var(--shadow-color)",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 18px",
              borderBottom: "3px solid var(--border)",
              background: "var(--panel)",
            }}
          >
            <span style={{ display: "flex", gap: "6px" }}>
              {["var(--primary)", "var(--secondary)", "var(--accent)"].map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: c,
                    border: "2px solid var(--border)",
                  }}
                />
              ))}
            </span>
            <code className="font-mono" style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)" }}>
              trace://solshield/scan · lending_program.rs
            </code>
          </div>

          <div style={{ padding: "18px 20px" }}>
            <div className="section-label" style={{ marginBottom: "14px" }}>
              Static analysis · 7 rules
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {TRACE_ROWS.map((row) => {
                const meta =
                  row.status === "fail"
                    ? { cls: "badge-critical", text: "VULNERABLE" }
                    : row.status === "warn"
                    ? { cls: "badge-medium", text: "REVIEW" }
                    : { cls: "badge-low", text: "PASS" };
                return (
                  <div
                    key={row.id}
                    className="trace-row panel"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                    }}
                  >
                    <code className="font-mono" style={{ fontSize: "12px", fontWeight: 800, color: "var(--primary-text)", width: "64px" }}>
                      {row.id}
                    </code>
                    <code className="font-mono" style={{ fontSize: "12px", color: "var(--foreground)", flex: 1 }}>
                      {row.label}()
                    </code>
                    <span className={`badge ${meta.cls}`} style={{ fontSize: "10px" }}>
                      {meta.text}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* progress */}
            <div
              style={{
                marginTop: "18px",
                height: "10px",
                background: "var(--panel)",
                border: "2px solid var(--border)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div style={{ width: "100%", height: "100%", background: "var(--primary)" }} />
            </div>
            <div
              className="font-mono"
              style={{ marginTop: "10px", fontSize: "11px", fontWeight: 700, color: "var(--muted)", display: "flex", justifyContent: "space-between" }}
            >
              <span>scan complete</span>
              <span>time 1.84s · 3 findings</span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div
          className="stats-grid"
          style={{
            marginTop: "56px",
            width: "100%",
            maxWidth: "880px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="stat-item card"
              style={{
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "8px",
              }}
            >
              <div className={`icon-box ${stat.box}`} style={{ width: 44, height: 44 }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: "30px", fontWeight: 900, letterSpacing: "-0.04em" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── MARQUEE (inverted ticker) ─────────── */}
      <div
        style={{
          padding: "14px 0",
          borderTop: "3px solid var(--border)",
          borderBottom: "3px solid var(--border)",
          overflow: "hidden",
          background: INK,
          color: PAPER,
        }}
      >
        <div className="marquee-track">
          {[...VULN_RULES, ...VULN_RULES].map((rule, i) => (
            <span
              key={i}
              className="font-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <span style={{ color: ["var(--primary)", "var(--secondary)", "var(--accent)"][i % 3] }}>
                ✦
              </span>
              {rule.id} · {rule.name}
            </span>
          ))}
        </div>
      </div>

      {/* ─────────── HOW IT WORKS (dark / inverted) ─────────── */}
      <section
        id="how"
        style={{
          background: INK,
          color: PAPER,
          padding: "clamp(64px, 9vw, 120px) clamp(20px, 4vw, 52px)",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div
              className="pill-label"
              style={{
                background: inkTint(10),
                borderColor: inkTint(22),
                color: PAPER,
                boxShadow: "none",
                marginBottom: "20px",
              }}
            >
              <span style={{ color: "var(--secondary)" }}>✦</span>
              Stupidly Simple
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4.4vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                marginBottom: "14px",
              }}
            >
              ZIP in. Audit out.
            </h2>
            <p style={{ color: inkTint(65), fontSize: "16px", fontWeight: 500, maxWidth: "520px", margin: "0 auto" }}>
              Three steps from raw Rust to an explained, fix-ready security
              report.
            </p>
          </div>

          <div
            className="steps-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="step-card"
                style={{
                  background: inkTint(6),
                  border: `3px solid ${inkTint(14)}`,
                  borderRadius: "20px",
                  padding: "26px 26px 24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "56px",
                    fontWeight: 900,
                    lineHeight: 1,
                    color: inkTint(12),
                    alignSelf: "flex-end",
                    marginBottom: "6px",
                  }}
                >
                  {step.n}
                </span>
                <div
                  className={`icon-box ${step.box}`}
                  style={{ boxShadow: `4px 4px 0px 0px ${inkTint(10)}`, marginBottom: "18px" }}
                >
                  {step.icon}
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "8px" }}>
                  {step.title}
                </h3>
                <p style={{ color: inkTint(65), fontSize: "14px", lineHeight: 1.65, flex: 1 }}>
                  {step.desc}
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    alignSelf: "flex-start",
                    marginTop: "18px",
                    padding: "5px 13px",
                    borderRadius: "999px",
                    border: "2px solid var(--border)",
                    background: "var(--primary)",
                    color: "var(--primary-fg)",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  <Clock size={12} /> {step.time}
                </span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <Link
              href="/dashboard"
              className="btn-primary"
              style={{
                padding: "14px 32px",
                fontSize: "15px",
                borderRadius: "16px",
                boxShadow: `5px 5px 0px 0px ${inkTint(12)}`,
              }}
            >
              <Zap size={16} />
              Start Building Securely
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section
        id="features"
        style={{ padding: "clamp(64px, 9vw, 120px) clamp(20px, 4vw, 52px)" }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div className="pill-label" style={{ marginBottom: "20px" }}>
              <Star size={14} style={{ color: "var(--secondary)", fill: "var(--secondary)" }} />
              Why SolShield
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4.4vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                marginBottom: "14px",
              }}
            >
              Everything in one workspace
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "16px", fontWeight: 500, maxWidth: "520px", margin: "0 auto" }}>
              From static analysis to AI-generated remediation — all in under
              two seconds.
            </p>
          </div>

          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card card" style={{ padding: "26px" }}>
                <div className={`icon-box ${f.box}`} style={{ marginBottom: "18px" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "8px" }}>
                  {f.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── RULES TABLE ─────────── */}
      <section
        id="rules"
        style={{
          padding: "clamp(64px, 9vw, 120px) clamp(20px, 4vw, 52px)",
          background: `linear-gradient(135deg, var(--paper-wash), var(--paper-wash-2))`,
          borderTop: "3px solid var(--border)",
          borderBottom: "3px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div className="pill-label" style={{ marginBottom: "20px" }}>
              <ShieldCheck size={14} style={{ color: "var(--primary-text)" }} />
              The Detection Suite
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4.4vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                marginBottom: "14px",
              }}
            >
              7 rules. Zero excuses.
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "16px", fontWeight: 500, maxWidth: "560px", margin: "0 auto" }}>
              The vulnerability classes behind the biggest Solana exploits —
              checked on every scan.
            </p>
          </div>

          <div
            className="rules-table-wrap"
            style={{
              background: "var(--surface)",
              border: "3px solid var(--border)",
              borderRadius: "20px",
              boxShadow: "8px 8px 0px 0px var(--shadow-color)",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
                <thead>
                  <tr style={{ background: "var(--panel)", borderBottom: "3px solid var(--border)" }}>
                    {["Rule", "Vulnerability", "What it catches", "Severity"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "14px 18px",
                          fontSize: "11px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--muted)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VULN_RULES.map((rule, i) => (
                    <tr
                      key={rule.id}
                      style={{
                        borderBottom:
                          i === VULN_RULES.length - 1
                            ? "none"
                            : "2px solid color-mix(in srgb, var(--border) 18%, transparent)",
                      }}
                    >
                      <td style={{ padding: "14px 18px" }}>
                        <code className="font-mono" style={{ fontSize: "12.5px", fontWeight: 800, color: "var(--primary-text)" }}>
                          {rule.id}
                        </code>
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: 800, whiteSpace: "nowrap" }}>
                        {rule.name}
                      </td>
                      <td style={{ padding: "14px 18px", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                        {rule.catches}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span className={`badge badge-${rule.severity}`} style={{ fontSize: "10.5px" }}>
                          {rule.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section style={{ padding: "clamp(72px, 11vw, 140px) clamp(20px, 4vw, 52px)", textAlign: "center" }}>
        <div className="cta-content" style={{ maxWidth: "740px", margin: "0 auto" }}>
          <span
            className="icon-box"
            style={{
              width: 72,
              height: 72,
              borderRadius: "18px",
              background: "var(--surface)",
              boxShadow: "5px 5px 0px 0px var(--shadow-color)",
              display: "inline-flex",
            }}
          >
            <LogoMark size={44} />
          </span>
          <h2
            style={{
              fontSize: "clamp(2.3rem, 5.4vw, 4.4rem)",
              fontWeight: 900,
              letterSpacing: "-0.045em",
              lineHeight: 1.05,
              margin: "26px 0 18px",
            }}
          >
            Deploy with{" "}
            <span style={{ color: "var(--secondary-text)", borderBottom: "5px solid var(--secondary)" }}>
              full confidence
            </span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "clamp(15px, 1.7vw, 18px)",
              fontWeight: 500,
              marginBottom: "36px",
              lineHeight: 1.7,
              maxWidth: "540px",
              marginInline: "auto",
            }}
          >
            Upload your Anchor project ZIP or paste a GitHub URL. Get a complete
            AI security report in seconds —{" "}
            <span style={{ color: "var(--secondary-text)", fontWeight: 800 }}>no login required</span>.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              className="btn-primary"
              style={{ padding: "16px 40px", fontSize: "16px", borderRadius: "16px" }}
            >
              <Zap size={18} />
              Start Scanning Free
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/chat"
              className="btn-ghost"
              style={{ padding: "16px 40px", fontSize: "16px", borderRadius: "16px" }}
            >
              <MessageSquare size={18} />
              Open AI Chat
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER (inverted) ─────────── */}
      <footer
        style={{
          background: INK,
          color: PAPER,
          borderTop: "3px solid var(--border)",
          padding: "36px clamp(20px, 4vw, 52px)",
        }}
      >
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "18px",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
            <LogoMark size={24} />
            <span style={{ fontSize: "15px", fontWeight: 900, letterSpacing: "-0.03em" }}>
              SolShield <span style={{ color: "var(--primary)" }}>AI</span>
            </span>
          </span>
          <p style={{ fontSize: "12.5px", fontWeight: 600, color: inkTint(60) }}>
            AI-Powered Solana Smart Contract Security Auditing
          </p>
          <div style={{ display: "flex", gap: "22px", fontSize: "12.5px", fontWeight: 700, color: inkTint(60) }}>
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "AI Chat", href: "/chat" },
              { label: "History", href: "/history" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "3px" }}
              >
                {label}
                <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {
  Zap,
  ArrowUpRight,
  Code2,
  GitBranch,
  MessageSquare,
  Eye,
  Lock,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Logo, { LogoMark } from "@/components/Logo";
import ThemePicker from "@/components/ThemePicker";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VULN_RULES = [
  "SOL-001 · Missing Signer Validation",
  "SOL-002 · Unsafe unwrap() Usage",
  "SOL-003 · Account Ownership Missing",
  "SOL-004 · Insecure CPI Invocation",
  "SOL-005 · PDA Validation Issues",
  "SOL-006 · Arithmetic Overflow Risk",
  "SOL-007 · Missing Authority Check",
];

const TRACE_ROWS = [
  { id: "SOL-001", label: "signer_validation", status: "fail" },
  { id: "SOL-004", label: "insecure_cpi", status: "fail" },
  { id: "SOL-005", label: "pda_validation", status: "warn" },
  { id: "SOL-002", label: "unsafe_unwrap", status: "pass" },
  { id: "SOL-006", label: "arithmetic_overflow", status: "pass" },
];

const SCRUB_SENTENCE =
  "Every Rust file parsed. Every exploit scenario modeled. Every fix explained in plain language before a single user's funds are lost on-chain.";

export default function LandingPage() {
  const mainRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".hero-eyebrow", { y: 24, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 48, opacity: 0, duration: 1 }, "-=0.4")
        .from(".hero-sub", { y: 32, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero-ctas", { y: 22, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".hero-trace", { y: 60, opacity: 0, duration: 0.9 }, "-=0.35")
        .from(".trace-row", { x: -16, opacity: 0, stagger: 0.08, duration: 0.4 }, "-=0.4");

      gsap.from(".bento-item", {
        y: 56,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: bentoRef.current, start: "top 80%" },
      });

      gsap.fromTo(
        ".scrub-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.035,
          ease: "none",
          scrollTrigger: {
            trigger: scrubRef.current,
            start: "top 65%",
            end: "bottom 40%",
            scrub: 1.6,
          },
        }
      );

      gsap.from(".scrub-feature", {
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".scrub-feature-list", start: "top 82%" },
      });

      gsap.from(".stat-block", {
        y: 36,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 84%" },
      });

      gsap.from(".cta-content", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cta-content", start: "top 82%" },
      });
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
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "24px",
          padding: "8px 10px 8px 18px",
          borderRadius: "12px",
          background: "var(--surface-glass)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
          whiteSpace: "nowrap",
          maxWidth: "calc(100vw - 24px)",
        }}
      >
        <Logo size={24} fontSize={14} />
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "var(--muted)",
          }}
          className="landing-nav-links"
        >
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how" },
            { label: "Brand Kit", href: "/brandkit" },
            { label: "Dashboard", href: "/dashboard" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="nav-link"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {label}
            </Link>
          ))}
        </div>
        <ThemePicker />
        <Link href="/dashboard" className="btn-primary" style={{ padding: "7px 16px", fontSize: "12.5px" }}>
          Start Audit
        </Link>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "130px 24px 64px",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: "920px", width: "100%" }}>
          <div
            className="hero-eyebrow badge"
            style={{
              background: "var(--primary-soft)",
              borderColor: "color-mix(in srgb, var(--primary) 30%, transparent)",
              color: "var(--primary)",
              marginBottom: "28px",
              fontSize: "11.5px",
            }}
          >
            <Zap size={11} />
            AI-Powered Solana Security Auditing
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 5.4rem)",
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.045em",
              marginBottom: "24px",
            }}
          >
            Audit Solana contracts
            <br />
            <span style={{ color: "var(--primary)" }}>before exploit day</span>
          </h1>

          <p
            className="hero-sub"
            style={{
              fontSize: "clamp(15px, 1.7vw, 18px)",
              color: "var(--muted)",
              maxWidth: "560px",
              margin: "0 auto 36px",
              lineHeight: 1.65,
            }}
          >
            SolShield AI scans Anchor and Rust smart contracts for 7 critical
            vulnerability classes and explains every finding — exploit path,
            root cause, and secure fix — in plain English.
          </p>

          <div
            className="hero-ctas"
            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/dashboard" className="btn-primary" style={{ padding: "13px 30px", fontSize: "15px" }}>
              <ShieldCheck size={17} />
              Start Free Audit
            </Link>
            <Link href="/chat" className="btn-ghost" style={{ padding: "13px 30px", fontSize: "15px" }}>
              <MessageSquare size={17} />
              Ask AI Assistant
            </Link>
          </div>
        </div>

        {/* Trace window mockup */}
        <div
          className="hero-trace card"
          style={{
            marginTop: "56px",
            width: "100%",
            maxWidth: "720px",
            overflow: "hidden",
            textAlign: "left",
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              background: "var(--panel)",
            }}
          >
            <span style={{ display: "flex", gap: "6px" }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--secondary)" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--primary)" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--sev-critical)" }} />
            </span>
            <code className="font-mono" style={{ fontSize: "12px", color: "var(--muted)" }}>
              trace://solshield/scan · lending_program.rs
            </code>
          </div>

          <div style={{ padding: "18px" }}>
            <div className="section-label" style={{ marginBottom: "14px" }}>
              Static analysis · 7 rules
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                    <code className="font-mono" style={{ fontSize: "12px", color: "var(--primary)", width: "62px" }}>
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
            <div style={{ marginTop: "16px", height: "2px", background: "var(--border)", borderRadius: "2px" }}>
              <div style={{ width: "100%", height: "100%", background: "var(--secondary)", borderRadius: "2px" }} />
            </div>
            <div
              className="font-mono"
              style={{ marginTop: "10px", fontSize: "11px", color: "var(--muted)", display: "flex", justifyContent: "space-between" }}
            >
              <span>scan complete</span>
              <span>time 1.84s · 3 findings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── MARQUEE ─────────── */}
      <div
        style={{
          padding: "16px 0",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          overflow: "hidden",
          background: "var(--surface)",
        }}
      >
        <div className="marquee-track">
          {[...VULN_RULES, ...VULN_RULES].map((rule, i) => (
            <span
              key={i}
              className="font-mono"
              style={{
                fontSize: "11.5px",
                fontWeight: 600,
                color: i % 2 === 0 ? "var(--primary)" : "var(--muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {rule}
            </span>
          ))}
        </div>
      </div>

      {/* ─────────── BENTO ─────────── */}
      <section id="features" style={{ padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 52px)" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="section-label" style={{ marginBottom: "12px" }}>
              The Platform
            </div>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: "12px" }}>
              Everything in one workspace
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "460px", margin: "0 auto" }}>
              From static analysis to AI-generated remediation — all in under two seconds.
            </p>
          </div>

          <div
            ref={bentoRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gridAutoFlow: "dense",
              gap: "14px",
            }}
          >
            {/* Card A */}
            <div className="bento-item card lift" style={{ gridColumn: "span 4", gridRow: "span 2", padding: "34px 36px", minHeight: "360px" }}>
              <div className="badge" style={{ background: "var(--primary-soft)", borderColor: "color-mix(in srgb, var(--primary) 30%, transparent)", color: "var(--primary)", marginBottom: "24px" }}>
                <Code2 size={11} />
                Static Analysis Engine
              </div>
              <h3 style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "16px" }}>
                Regex AST analysis across every Rust file
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.65, maxWidth: "440px" }}>
                7 security rules check every function signature, CPI call, PDA
                seed derivation, and arithmetic operation across your entire
                Anchor program in parallel.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "26px" }}>
                {["Signer", "Ownership", "CPI", "PDA", "Overflow", "Authority", "unwrap()"].map((tag) => (
                  <span key={tag} className="badge">{tag}</span>
                ))}
              </div>
            </div>

            {/* Card B */}
            <div className="bento-item card lift" style={{ gridColumn: "span 2", gridRow: "span 1", padding: "28px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className="panel" style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--secondary)" }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px", marginTop: "20px" }}>
                  Gemini AI Explanations
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6 }}>
                  Every finding gets an on-demand exploit scenario, root cause
                  analysis, and secure Rust fix — powered by Gemini 2.5 Flash.
                </p>
              </div>
            </div>

            {/* Card C */}
            <div className="bento-item card lift" style={{ gridColumn: "span 2", gridRow: "span 1", padding: "28px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className="panel" style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                <Eye size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px", marginTop: "20px" }}>
                  Monaco Code Viewer
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6 }}>
                  Interactive editor highlights vulnerable lines with inline
                  severity markers and jump-to-line navigation.
                </p>
              </div>
            </div>

            {/* Card D */}
            <div className="bento-item card lift" style={{ gridColumn: "span 6", gridRow: "span 1", padding: "32px 36px", display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <div className="badge" style={{ background: "color-mix(in srgb, var(--sev-low) 12%, transparent)", borderColor: "color-mix(in srgb, var(--sev-low) 30%, transparent)", color: "var(--sev-low)", marginBottom: "14px" }}>
                  <GitBranch size={11} />
                  GitHub Repository Scanner
                </div>
                <h3 style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", fontWeight: 800, letterSpacing: "-0.035em", marginBottom: "10px", lineHeight: 1.15 }}>
                  Paste a GitHub URL. Get a full security report.
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.65, maxWidth: "520px" }}>
                  SolShield clones the repo, finds every{" "}
                  <code className="font-mono" style={{ fontSize: "12px", color: "var(--primary)", background: "var(--primary-soft)", padding: "1px 6px", borderRadius: "4px" }}>
                    .rs
                  </code>{" "}
                  file, runs the full detection suite, and returns findings — no
                  authentication required.
                </p>
              </div>
              <div className="panel" style={{ flex: "0 0 auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: "10px", minWidth: "200px" }}>
                {["clone repository", "discover .rs files", "run 7 rules", "compile report"].map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={14} style={{ color: "var(--sev-low)" }} />
                    <code className="font-mono" style={{ fontSize: "12px", color: i === 3 ? "var(--foreground)" : "var(--muted)" }}>
                      {step}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── SCRUB REVEAL ─────────── */}
      <section
        id="how"
        ref={scrubRef}
        style={{
          padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 52px)",
          maxWidth: "1240px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 7vw, 90px)",
          alignItems: "start",
        }}
        className="scrub-grid"
      >
        <div style={{ position: "sticky", top: "32vh", alignSelf: "start" }}>
          <div className="section-label" style={{ marginBottom: "14px" }}>
            The Process
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 3.2vw, 3rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.1, marginBottom: "20px" }}>
            Why developers trust SolShield
          </h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "14.5px", maxWidth: "340px" }}>
            Built for hackathon velocity and mainnet-grade security assurance.
          </p>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "28px", fontSize: "13px", fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>
            Start auditing <ArrowUpRight size={14} />
          </Link>
        </div>

        <div>
          <p style={{ fontSize: "clamp(1.3rem, 2.1vw, 1.8rem)", fontWeight: 700, lineHeight: 1.5, letterSpacing: "-0.025em" }}>
            {SCRUB_SENTENCE.split(" ").map((word, i) => (
              <span key={i} className="scrub-word" style={{ opacity: 0.12 }}>
                {word}{" "}
              </span>
            ))}
          </p>

          <div className="scrub-feature-list" style={{ marginTop: "44px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: <Lock size={15} />, title: "Upload ZIP or paste a GitHub URL", desc: "No account required for quick audits. Authenticated users get scan history." },
              { icon: <Code2 size={15} />, title: "Parallel regex-based analysis", desc: "All 7 rules run simultaneously across every .rs file — scan completes in under 2 seconds." },
              { icon: <Zap size={15} />, title: "On-demand AI enrichment", desc: "Click any finding to fetch a Gemini explanation, exploit scenario, and fix." },
            ].map((item, i) => (
              <div key={i} className="scrub-feature card" style={{ display: "flex", gap: "15px", alignItems: "flex-start", padding: "18px 20px" }}>
                <div className="panel" style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "-0.02em", marginBottom: "5px" }}>
                    {item.title}
                  </h4>
                  <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── STATS ─────────── */}
      <section
        ref={statsRef}
        style={{
          padding: "clamp(52px, 8vw, 96px) clamp(20px, 4vw, 52px)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { value: "7", label: "Vulnerability Rules", note: "SOL-001 → SOL-007" },
            { value: "< 2s", label: "Average Scan Speed", note: "full Anchor projects" },
            { value: "AI", label: "Powered Analysis", note: "Gemini 2.5 Flash" },
          ].map((stat) => (
            <div key={stat.label} className="stat-block">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="font-mono" style={{ fontSize: "11px", color: "var(--muted)", marginTop: "8px" }}>
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section style={{ padding: "clamp(80px, 13vw, 150px) clamp(20px, 4vw, 52px)", textAlign: "center" }}>
        <div className="cta-content" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <span style={{ display: "inline-flex" }}>
            <LogoMark size={48} />
          </span>
          <h2 style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.6rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.05, margin: "24px 0" }}>
            Deploy with{" "}
            <span style={{ color: "var(--primary)" }}>full confidence</span>
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "clamp(15px, 1.6vw, 18px)", marginBottom: "40px", lineHeight: 1.7, maxWidth: "540px", marginInline: "auto" }}>
            Upload your Anchor project ZIP or paste a GitHub URL. Get a complete
            AI security report in seconds. No login required.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: "15px 40px", fontSize: "16px" }}>
              <Zap size={18} />
              Start Scanning Free
            </Link>
            <Link href="/chat" className="btn-ghost" style={{ padding: "15px 40px", fontSize: "16px" }}>
              <MessageSquare size={18} />
              Open AI Chat
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "28px clamp(20px, 4vw, 52px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        <Logo size={22} fontSize={14} />
        <p style={{ fontSize: "12px", color: "var(--muted)" }}>
          AI-Powered Solana Smart Contract Security Auditing
        </p>
        <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "var(--muted)" }}>
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "AI Chat", href: "/chat" },
            { label: "Brand Kit", href: "/brandkit" },
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="nav-link" style={{ color: "inherit", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </main>
  );
}

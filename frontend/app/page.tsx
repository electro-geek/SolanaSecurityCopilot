"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {
  Shield,
  Zap,
  ArrowUpRight,
  Code2,
  GitBranch,
  MessageSquare,
  Terminal,
  Eye,
  Lock,
} from "lucide-react";

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

const SCRUB_SENTENCE =
  "Every Rust file parsed. Every exploit scenario modeled. Every fix explained in plain language before a single user's funds are lost on-chain.";

export default function LandingPage() {
  const mainRef     = useRef<HTMLElement>(null);
  const bentoRef    = useRef<HTMLDivElement>(null);
  const scrubRef    = useRef<HTMLElement>(null);
  const statsRef    = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /* ── Hero entrance ── */
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".hero-eyebrow", { y: 24, opacity: 0, duration: 0.7 })
        .from(".hero-title",   { y: 56, opacity: 0, duration: 1.1 }, "-=0.45")
        .from(".hero-sub",     { y: 36, opacity: 0, duration: 0.85 }, "-=0.65")
        .from(".hero-ctas",    { y: 24, opacity: 0, duration: 0.7 }, "-=0.5");

      /* ── Bento cards ── */
      gsap.from(".bento-item", {
        y: 64,
        opacity: 0,
        duration: 0.8,
        stagger: 0.11,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bentoRef.current,
          start: "top 78%",
        },
      });

      /* ── Scrubbing text reveal ── */
      gsap.fromTo(
        ".scrub-word",
        { opacity: 0.06 },
        {
          opacity: 1,
          stagger: 0.035,
          ease: "none",
          scrollTrigger: {
            trigger: scrubRef.current,
            start: "top 65%",
            end: "bottom 35%",
            scrub: 1.8,
          },
        }
      );

      /* ── Feature rows fade-up ── */
      gsap.from(".scrub-feature", {
        y: 32,
        opacity: 0,
        duration: 0.65,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".scrub-feature-list",
          start: "top 80%",
        },
      });

      /* ── Image scale on scroll ── */
      gsap.fromTo(
        ".scale-image",
        { scale: 0.86, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".scale-image",
            start: "top 82%",
          },
        }
      );

      /* ── Stats count-up ── */
      gsap.from(".stat-block", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 82%",
        },
      });

      /* ── CTA fade up ── */
      gsap.from(".cta-content", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-content",
          start: "top 80%",
        },
      });
    },
    { scope: mainRef }
  );

  return (
    <main
      ref={mainRef}
      className="landing-root"
      style={{
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100%",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* ─────────────────── NAV ─────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "28px",
          padding: "10px 20px",
          borderRadius: "100px",
          background: "rgba(8, 12, 22, 0.78)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(99, 179, 255, 0.11)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset",
          whiteSpace: "nowrap",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Shield size={14} color="white" />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "14px",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #63b3ff, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SolShield
          </span>
        </div>

        {/* Links */}
        <div
          style={{
            display: "flex",
            gap: "22px",
            fontSize: "12.5px",
            fontWeight: 500,
            color: "rgba(138, 163, 200, 0.8)",
          }}
        >
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how" },
            { label: "Dashboard", href: "/dashboard" },
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="nav-link" style={{ color: "inherit", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          style={{
            padding: "7px 18px",
            borderRadius: "100px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
            fontSize: "12px",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.01em",
            boxShadow: "0 0 24px rgba(59,130,246,0.3)",
          }}
        >
          Start Audit
        </Link>
      </nav>

      {/* ─────────────────── HERO ─────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 32px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Full-bleed background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://picsum.photos/seed/solana-blockchain-network/1920/1080)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "grayscale(100%) brightness(0.12) contrast(1.3)",
            zIndex: 0,
          }}
        />
        {/* Radial glow overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 55% at 50% 45%, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.04) 45%, transparent 75%)",
            zIndex: 1,
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "220px",
            background: "linear-gradient(to bottom, transparent, var(--bg-primary))",
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 3, maxWidth: "1240px", width: "100%" }}>
          {/* Eyebrow */}
          <div
            className="hero-eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "5px 14px",
              borderRadius: "100px",
              background: "rgba(59,130,246,0.09)",
              border: "1px solid rgba(59,130,246,0.22)",
              fontSize: "11.5px",
              fontWeight: 700,
              color: "#4f9eff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "36px",
            }}
          >
            <Zap size={11} />
            AI-Powered Solana Security Auditing
          </div>

          {/* H1 — max 3 lines, inline image in heading */}
          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(3rem, 6.5vw, 6.2rem)",
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: "-0.055em",
              marginBottom: "28px",
              maxWidth: "100%",
            }}
          >
            <span style={{ color: "#e8f4fd" }}>Audit Solana </span>
            {/* Inline pill image */}
            <span
              style={{
                display: "inline-block",
                width: "clamp(56px, 6vw, 88px)",
                height: "clamp(32px, 3.5vw, 52px)",
                borderRadius: "100px",
                backgroundImage:
                  "url(https://picsum.photos/seed/circuit-dark/200/100)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "grayscale(60%) brightness(0.75) contrast(1.2)",
                verticalAlign: "middle",
                margin: "0 6px -4px",
                border: "1px solid rgba(99,179,255,0.18)",
              }}
            />
            <span style={{ color: "#e8f4fd" }}>Contracts</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #4f9eff 0%, #9d7cff 52%, #2dd4bf 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Before Exploit Day
            </span>
          </h1>

          {/* Sub */}
          <p
            className="hero-sub"
            style={{
              fontSize: "clamp(15px, 1.7vw, 19px)",
              color: "#6b8cad",
              maxWidth: "520px",
              margin: "0 auto 44px",
              lineHeight: 1.7,
              letterSpacing: "-0.01em",
            }}
          >
            SolShield AI scans Anchor and Rust smart contracts for 7 critical
            vulnerability classes and explains every finding — exploit path,
            root cause, and secure fix — in plain English.
          </p>

          {/* CTAs */}
          <div
            className="hero-ctas"
            style={{
              display: "flex",
              gap: "13px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 34px",
                borderRadius: "100px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                letterSpacing: "-0.015em",
                boxShadow:
                  "0 0 48px rgba(59,130,246,0.28), 0 2px 0 rgba(255,255,255,0.12) inset",
              }}
            >
              <Shield size={16} />
              Start Free Audit
            </Link>
            <Link
              href="/chat"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 34px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.035)",
                color: "#e8f4fd",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
                border: "1px solid rgba(99,179,255,0.15)",
                letterSpacing: "-0.015em",
              }}
            >
              <MessageSquare size={16} />
              Ask AI Assistant
            </Link>
          </div>

          {/* Scroll hint */}
          <div
            style={{
              marginTop: "72px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 1,
                height: 64,
                background:
                  "linear-gradient(to bottom, rgba(99,179,255,0.35), transparent)",
                borderRadius: "1px",
              }}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────── MARQUEE ─────────────────── */}
      <div
        style={{
          padding: "18px 0",
          borderTop: "1px solid rgba(99,179,255,0.055)",
          borderBottom: "1px solid rgba(99,179,255,0.055)",
          overflow: "hidden",
          background: "rgba(0,0,0,0.18)",
        }}
      >
        <div className="marquee-track">
          {[...VULN_RULES, ...VULN_RULES].map((rule, i) => (
            <span
              key={i}
              style={{
                fontSize: "11.5px",
                fontWeight: 700,
                color: i % 3 === 0 ? "#4f9eff" : i % 3 === 1 ? "#9d7cff" : "#2dd4bf",
                letterSpacing: "0.07em",
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

      {/* ─────────────────── BENTO GRID ─────────────────── */}
      <section
        id="features"
        style={{ padding: "clamp(72px, 10vw, 136px) clamp(20px, 4vw, 52px)" }}
      >
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 3.8vw, 3.4rem)",
                fontWeight: 900,
                letterSpacing: "-0.045em",
                lineHeight: 1.08,
                marginBottom: "14px",
              }}
            >
              Everything in One Platform
            </h2>
            <p
              style={{ color: "#6b8cad", fontSize: "15.5px", maxWidth: "440px", margin: "0 auto" }}
            >
              From static analysis to AI-generated remediation — all in under two seconds.
            </p>
          </div>

          {/*
            Bento math:  6 cols × 3 rows = 18 cells
            Card A: col-span-4, row-span-2 → 8 cells
            Card B: col-span-2, row-span-1 → 2 cells  (col 5-6, row 1)
            Card C: col-span-2, row-span-1 → 2 cells  (col 5-6, row 2)
            Card D: col-span-6, row-span-1 → 6 cells  (row 3)
            Total: 18 ✓ — grid-auto-flow: dense applied.
          */}
          <div
            ref={bentoRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gridAutoFlow: "dense",
              gap: "15px",
            }}
          >
            {/* Card A — Static Analysis (tall left) */}
            <div
              className="bento-item"
              style={{
                gridColumn: "span 4",
                gridRow: "span 2",
                borderRadius: "22px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(99,179,255,0.09)",
                padding: "38px 40px",
                position: "relative",
                overflow: "hidden",
                minHeight: "380px",
              }}
            >
              {/* Background image */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "url(https://picsum.photos/seed/dark-code-screen/800/600)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(100%) brightness(0.07) contrast(1.6)",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 13px",
                    borderRadius: "100px",
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.22)",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: "#4f9eff",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    marginBottom: "28px",
                  }}
                >
                  <Code2 size={10} />
                  Static Analysis Engine
                </div>
                <h3
                  style={{
                    fontSize: "clamp(1.5rem, 2.8vw, 2.6rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.045em",
                    lineHeight: 1.08,
                    marginBottom: "18px",
                  }}
                >
                  Regex AST analysis
                  <br />
                  across every Rust file
                </h3>
                <p
                  style={{
                    color: "#6b8cad",
                    fontSize: "14.5px",
                    lineHeight: 1.68,
                    maxWidth: "420px",
                  }}
                >
                  7 security rules check every function signature, CPI call,
                  PDA seed derivation, and arithmetic operation across your
                  entire Anchor program in parallel.
                </p>

                {/* Rule badges */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "28px",
                  }}
                >
                  {["Signer", "Ownership", "CPI", "PDA", "Overflow", "Authority", "unwrap()"].map(
                    (tag, i) => (
                      <span
                        key={tag}
                        style={{
                          padding: "4px 11px",
                          borderRadius: "100px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(99,179,255,0.1)",
                          color: "#8aa3c8",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Card B — AI Explanations */}
            <div
              className="bento-item"
              style={{
                gridColumn: "span 2",
                gridRow: "span 1",
                borderRadius: "22px",
                background:
                  "linear-gradient(140deg, rgba(139,92,246,0.09) 0%, rgba(59,130,246,0.05) 100%)",
                border: "1px solid rgba(139,92,246,0.17)",
                padding: "28px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "rgba(139,92,246,0.13)",
                  border: "1px solid rgba(139,92,246,0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9d7cff",
                }}
              >
                <Zap size={20} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    marginBottom: "8px",
                  }}
                >
                  Gemini AI Explanations
                </h3>
                <p style={{ color: "#6b8cad", fontSize: "13px", lineHeight: 1.62 }}>
                  Every finding gets an on-demand exploit scenario, root cause
                  analysis, and secure Rust fix — powered by Gemini 2.5 Flash.
                </p>
              </div>
            </div>

            {/* Card C — Monaco Viewer */}
            <div
              className="bento-item"
              style={{
                gridColumn: "span 2",
                gridRow: "span 1",
                borderRadius: "22px",
                background:
                  "linear-gradient(140deg, rgba(45,212,191,0.07) 0%, rgba(6,182,212,0.04) 100%)",
                border: "1px solid rgba(45,212,191,0.14)",
                padding: "28px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "rgba(45,212,191,0.1)",
                  border: "1px solid rgba(45,212,191,0.24)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2dd4bf",
                }}
              >
                <Eye size={20} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    marginBottom: "8px",
                  }}
                >
                  Monaco Code Viewer
                </h3>
                <p style={{ color: "#6b8cad", fontSize: "13px", lineHeight: 1.62 }}>
                  Interactive editor highlights vulnerable lines with inline
                  severity markers and jump-to-line navigation.
                </p>
              </div>
            </div>

            {/* Card D — GitHub Scanner (full width, image scale) */}
            <div
              className="bento-item scale-image"
              style={{
                gridColumn: "span 6",
                gridRow: "span 1",
                borderRadius: "22px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(16,185,129,0.1)",
                padding: "34px 40px",
                display: "flex",
                alignItems: "center",
                gap: "48px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 13px",
                    borderRadius: "100px",
                    background: "rgba(16,185,129,0.09)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: "#34d399",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  <GitBranch size={10} />
                  GitHub Repository Scanner
                </div>
                <h3
                  style={{
                    fontSize: "clamp(1.2rem, 2vw, 1.75rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    marginBottom: "12px",
                    lineHeight: 1.15,
                  }}
                >
                  Paste a GitHub URL.
                  <br />
                  Get a full security report.
                </h3>
                <p
                  style={{
                    color: "#6b8cad",
                    fontSize: "14px",
                    lineHeight: 1.68,
                    maxWidth: "500px",
                  }}
                >
                  SolShield clones the repo, finds every{" "}
                  <code
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "12px",
                      color: "#4f9eff",
                      background: "rgba(59,130,246,0.08)",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    .rs
                  </code>{" "}
                  file, runs the full detection suite, and returns findings —
                  no authentication required.
                </p>
              </div>
              <div
                style={{
                  width: "clamp(180px, 22%, 300px)",
                  height: "130px",
                  borderRadius: "14px",
                  backgroundImage:
                    "url(https://picsum.photos/seed/server-rack-dark/600/300)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter:
                    "grayscale(80%) brightness(0.55) contrast(1.25) saturate(0.4)",
                  flexShrink: 0,
                  border: "1px solid rgba(99,179,255,0.09)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SCRUBBING TEXT REVEAL ─────────────────── */}
      <section
        id="how"
        ref={scrubRef}
        style={{
          padding: "clamp(72px, 10vw, 136px) clamp(20px, 4vw, 52px)",
          maxWidth: "1300px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 7vw, 96px)",
          alignItems: "start",
        }}
      >
        {/* Left — sticky title */}
        <div style={{ position: "sticky", top: "38vh", alignSelf: "start" }}>
          <p
            style={{
              fontSize: "10.5px",
              fontWeight: 700,
              color: "#4f9eff",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            The Process
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 3.4vw, 3.1rem)",
              fontWeight: 900,
              letterSpacing: "-0.048em",
              lineHeight: 1.09,
              marginBottom: "22px",
            }}
          >
            Why developers
            <br />
            trust SolShield
          </h2>
          <p style={{ color: "#6b8cad", lineHeight: 1.7, fontSize: "14.5px", maxWidth: "340px" }}>
            Built for hackathon velocity and mainnet-grade security assurance.
          </p>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "32px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#4f9eff",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Start auditing <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Right — scrub paragraph + feature rows */}
        <div>
          {/* Scrubbing paragraph */}
          <p
            style={{
              fontSize: "clamp(1.35rem, 2.2vw, 1.9rem)",
              fontWeight: 700,
              lineHeight: 1.52,
              letterSpacing: "-0.03em",
            }}
          >
            {SCRUB_SENTENCE.split(" ").map((word, i) => (
              <span key={i} className="scrub-word" style={{ opacity: 0.06 }}>
                {word}{" "}
              </span>
            ))}
          </p>

          {/* Feature rows */}
          <div
            className="scrub-feature-list"
            style={{
              marginTop: "48px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {[
              {
                icon: <Lock size={15} />,
                title: "Upload ZIP or paste a GitHub URL",
                desc: "No account required for quick audits. Authenticated users get scan history.",
              },
              {
                icon: <Code2 size={15} />,
                title: "Parallel regex-based analysis",
                desc: "All 7 rules run simultaneously across every .rs file — scan completes in under 2 seconds.",
              },
              {
                icon: <Zap size={15} />,
                title: "On-demand AI enrichment",
                desc: "Click any finding to fetch a Gemini explanation, exploit scenario, and fix — no wait during the initial scan.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="scrub-feature bento-item"
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-start",
                  padding: "20px 22px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.022)",
                  border: "1px solid rgba(99,179,255,0.07)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: "rgba(59,130,246,0.09)",
                    border: "1px solid rgba(59,130,246,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f9eff",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      letterSpacing: "-0.02em",
                      marginBottom: "5px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ color: "#6b8cad", fontSize: "13px", lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── STATS ─────────────────── */}
      <section
        ref={statsRef}
        style={{
          padding: "clamp(52px, 8vw, 100px) clamp(20px, 4vw, 52px)",
          borderTop: "1px solid rgba(99,179,255,0.055)",
          borderBottom: "1px solid rgba(99,179,255,0.055)",
          background: "rgba(0,0,0,0.14)",
        }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px",
            textAlign: "center",
          }}
        >
          {[
            { value: "7+",    label: "Vulnerability Rules",     sub: "SOL-001 through SOL-007" },
            { value: "< 2s",  label: "Average Scan Speed",      sub: "Across full Anchor projects" },
            { value: "100%",  label: "AI-Powered Analysis",     sub: "Gemini 2.5 Flash on every finding" },
          ].map((stat) => (
            <div key={stat.label} className="stat-block">
              <div
                style={{
                  fontSize: "clamp(2.4rem, 4.8vw, 5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                  marginBottom: "10px",
                  background: "linear-gradient(135deg, #4f9eff, #9d7cff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "-0.01em",
                  marginBottom: "5px",
                }}
              >
                {stat.label}
              </p>
              <p style={{ color: "#4a6280", fontSize: "12px" }}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── CTA ─────────────────── */}
      <section
        style={{
          padding: "clamp(88px, 14vw, 168px) clamp(20px, 4vw, 52px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.04) 40%, transparent 75%)",
          }}
        />
        <div
          className="cta-content"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "820px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2.6rem, 5.8vw, 5.8rem)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 1.02,
              marginBottom: "24px",
            }}
          >
            <span style={{ color: "#e8f4fd" }}>Deploy With</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #4f9eff 0%, #9d7cff 50%, #2dd4bf 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Full Confidence
            </span>
          </h2>
          <p
            style={{
              color: "#6b8cad",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              marginBottom: "46px",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto 46px",
            }}
          >
            Upload your Anchor project ZIP or paste a GitHub URL. Get a
            complete AI security report in seconds. No login required.
          </p>
          <div
            style={{
              display: "flex",
              gap: "13px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                padding: "16px 44px",
                borderRadius: "100px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white",
                fontWeight: 700,
                fontSize: "16px",
                textDecoration: "none",
                letterSpacing: "-0.015em",
                boxShadow:
                  "0 0 64px rgba(59,130,246,0.22), 0 2px 0 rgba(255,255,255,0.1) inset",
              }}
            >
              <Zap size={18} />
              Start Scanning Free
            </Link>
            <Link
              href="/chat"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                padding: "16px 44px",
                borderRadius: "100px",
                background: "transparent",
                color: "#e8f4fd",
                fontWeight: 600,
                fontSize: "16px",
                textDecoration: "none",
                border: "1px solid rgba(99,179,255,0.18)",
                letterSpacing: "-0.015em",
              }}
            >
              <Terminal size={18} />
              Open AI Chat
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(99,179,255,0.055)",
          padding: "28px clamp(20px, 4vw, 52px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={15} color="#3b82f6" />
          <span
            style={{
              fontWeight: 800,
              fontSize: "13.5px",
              color: "#8aa3c8",
              letterSpacing: "-0.02em",
            }}
          >
            SolShield AI
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "#3a4f66" }}>
          AI-Powered Solana Smart Contract Security Auditing
        </p>
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "12px",
            color: "#4a6280",
          }}
        >
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "AI Chat", href: "/chat" },
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
      </footer>
    </main>
  );
}

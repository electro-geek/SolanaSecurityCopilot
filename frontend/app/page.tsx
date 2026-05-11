"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Zap,
  Code2,
  GitBranch,
  MessageSquare,
  FileDown,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  Terminal,
} from "lucide-react";

const features = [
  {
    icon: <Shield size={24} />,
    title: "Static Security Scanner",
    desc: "AST-based analysis detects signer validation gaps, unsafe CPIs, PDA misuse, and 7+ vulnerability classes.",
    color: "#3b82f6",
  },
  {
    icon: <Sparkles size={24} />,
    title: "AI Vulnerability Explainer",
    desc: "Gemini AI acts as your personal auditor — explaining risks, exploit paths, and providing secure code fixes.",
    color: "#8b5cf6",
  },
  {
    icon: <Code2 size={24} />,
    title: "Monaco Code Viewer",
    desc: "Interactive code editor with syntax highlighting, vulnerable line markers, and inline severity indicators.",
    color: "#06b6d4",
  },
  {
    icon: <GitBranch size={24} />,
    title: "GitHub Repository Scanner",
    desc: "Paste a public GitHub URL and SolShield instantly clones, scans, and reports vulnerabilities.",
    color: "#10b981",
  },
  {
    icon: <MessageSquare size={24} />,
    title: "AI Security Chat",
    desc: 'Ask "Why is this dangerous?" or "How do I fix PDA validation?" — streaming AI answers your questions.',
    color: "#f59e0b",
  },
  {
    icon: <FileDown size={24} />,
    title: "Report Export",
    desc: "Download detailed JSON audit reports with all findings, severity scores, and remediation steps.",
    color: "#ec4899",
  },
];

const vulnerabilities = [
  { id: "SOL-001", name: "Missing Signer Validation", severity: "HIGH" },
  { id: "SOL-002", name: "Unsafe unwrap() Usage", severity: "MEDIUM" },
  { id: "SOL-003", name: "Account Ownership Missing", severity: "HIGH" },
  { id: "SOL-004", name: "Insecure CPI Invocation", severity: "HIGH" },
  { id: "SOL-005", name: "PDA Validation Issues", severity: "HIGH" },
  { id: "SOL-006", name: "Arithmetic Overflow Risk", severity: "MEDIUM" },
  { id: "SOL-007", name: "Missing Authority Check", severity: "HIGH" },
];

const steps = [
  {
    step: "01",
    title: "Upload or Link",
    desc: "Upload a ZIP of your Anchor project or paste a GitHub repository URL.",
    icon: <Code2 size={20} />,
  },
  {
    step: "02",
    title: "Automated Scan",
    desc: "SolShield parses your Rust files, runs 7 vulnerability rules, and detects issues instantly.",
    icon: <Eye size={20} />,
  },
  {
    step: "03",
    title: "AI Explanations",
    desc: "Every finding is enriched with AI-generated explanations, exploit scenarios, and code fixes.",
    icon: <Sparkles size={20} />,
  },
  {
    step: "04",
    title: "Fix & Deploy Safely",
    desc: "Apply the suggested fixes, re-scan to confirm, and deploy with confidence.",
    icon: <Lock size={20} />,
  },
];

const severityColors: Record<string, string> = {
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
  CRITICAL: "#ef4444",
};

export default function LandingPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* NAV */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(8, 12, 20, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(99, 179, 255, 0.08)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={20} color="white" />
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #63b3ff, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SolShield AI
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: "8px 18px", fontSize: "13px" }}>
            Dashboard
          </Link>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
            Start Scanning <ArrowRight size={14} />
          </Link>
        </div>
      </motion.nav>

      {/* HERO */}
      <section
        style={{
          padding: "100px 32px 80px",
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "20px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              marginBottom: "32px",
              fontSize: "13px",
              color: "#63b3ff",
              fontWeight: 600,
            }}
          >
            <Zap size={14} />
            AI-Powered Security Auditing for Solana
          </div>

          <h1
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: "24px",
              letterSpacing: "-0.04em",
            }}
          >
            <span style={{ color: "#e8f4fd" }}>Secure Your</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #63b3ff 0%, #a78bfa 50%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Solana Contracts
            </span>
            <br />
            <span style={{ color: "#e8f4fd" }}>Before Exploit Day</span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#8aa3c8",
              maxWidth: "600px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            SolShield AI automatically scans your Anchor projects for critical vulnerabilities,
            explains every finding with AI, and provides secure code fixes — in seconds.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: "15px", padding: "14px 32px" }}>
              <Shield size={18} />
              Start Free Audit
            </Link>
            <Link href="/chat" className="btn-secondary" style={{ fontSize: "15px", padding: "14px 32px" }}>
              <MessageSquare size={18} />
              Ask AI Assistant
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            marginTop: "64px",
            flexWrap: "wrap",
          }}
        >
          {[
            { val: "7+", label: "Vulnerability Rules" },
            { val: "<2s", label: "Scan Speed" },
            { val: "AI", label: "Explanations" },
            { val: "Free", label: "No Auth Required" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #63b3ff, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.val}
              </div>
              <div style={{ fontSize: "13px", color: "#4a6280", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <h2
            style={{ fontSize: "38px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.03em" }}
          >
            Everything You Need for{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #63b3ff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Smart Contract Security
            </span>
          </h2>
          <p style={{ fontSize: "16px", color: "#8aa3c8", maxWidth: "500px", margin: "0 auto" }}>
            A complete developer-first security platform for the Solana ecosystem.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card"
              style={{ padding: "28px" }}
              whileHover={{ y: -4 }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: `${feat.color}1a`,
                  border: `1px solid ${feat.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feat.color,
                  marginBottom: "16px",
                }}
              >
                {feat.icon}
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>{feat.title}</h3>
              <p style={{ fontSize: "14px", color: "#8aa3c8", lineHeight: 1.6 }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: "80px 32px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <h2 style={{ fontSize: "38px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.03em" }}>
            Audit in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #34d399, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              4 Simple Steps
            </span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card"
              style={{ padding: "28px", position: "relative", overflow: "hidden" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  fontSize: "80px",
                  fontWeight: 900,
                  color: "rgba(99,179,255,0.04)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {step.step}
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "rgba(59, 130, 246, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#63b3ff",
                  marginBottom: "16px",
                }}
              >
                {step.icon}
              </div>
              <div style={{ fontSize: "12px", color: "#3b82f6", fontWeight: 700, marginBottom: "8px" }}>
                STEP {step.step}
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>{step.title}</h3>
              <p style={{ fontSize: "13px", color: "#8aa3c8", lineHeight: 1.6 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VULNERABILITY TABLE */}
      <section
        style={{
          padding: "80px 32px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <h2 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "12px" }}>
            Vulnerabilities We{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ef4444, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Detect
            </span>
          </h2>
          <p style={{ color: "#8aa3c8", fontSize: "15px" }}>
            7 rule-based detectors targeting the most critical Solana attack surfaces.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card"
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              padding: "14px 24px",
              borderBottom: "1px solid rgba(99,179,255,0.08)",
              display: "grid",
              gridTemplateColumns: "80px 1fr 100px",
              gap: "16px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#4a6280",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>Rule ID</span>
            <span>Vulnerability</span>
            <span>Severity</span>
          </div>
          {vulnerabilities.map((vuln, i) => (
            <motion.div
              key={vuln.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{
                padding: "16px 24px",
                display: "grid",
                gridTemplateColumns: "80px 1fr 100px",
                gap: "16px",
                alignItems: "center",
                borderBottom: i < vulnerabilities.length - 1 ? "1px solid rgba(99,179,255,0.05)" : "none",
                transition: "background 0.2s",
              }}
              whileHover={{ backgroundColor: "rgba(99, 179, 255, 0.04)" }}
            >
              <code style={{ fontSize: "12px", color: "#3b82f6", fontFamily: "JetBrains Mono, monospace" }}>
                {vuln.id}
              </code>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertTriangle size={14} color={severityColors[vuln.severity]} />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>{vuln.name}</span>
              </div>
              <span
                className={`badge badge-${vuln.severity.toLowerCase()}`}
                style={{ justifySelf: "start" }}
              >
                {vuln.severity}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 32px 120px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "60px 40px",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
            border: "1px solid rgba(99, 179, 255, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <Shield
            size={48}
            color="#63b3ff"
            style={{ marginBottom: "20px", filter: "drop-shadow(0 0 20px rgba(99,179,255,0.4))" }}
          />
          <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.03em" }}>
            Ready to Audit Your Contract?
          </h2>
          <p style={{ color: "#8aa3c8", marginBottom: "36px", lineHeight: 1.7, fontSize: "16px" }}>
            Upload your Anchor project ZIP or paste a GitHub URL — get a full AI security report in seconds. No login required.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: "15px", padding: "14px 36px" }}>
              <Zap size={18} />
              Start Scanning Now
            </Link>
            <Link href="/chat" className="btn-secondary" style={{ fontSize: "15px", padding: "14px 36px" }}>
              <Terminal size={18} />
              Open AI Chat
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(99,179,255,0.08)",
          padding: "32px",
          textAlign: "center",
          color: "#4a6280",
          fontSize: "13px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
          <Shield size={16} color="#3b82f6" />
          <span style={{ fontWeight: 700, color: "#8aa3c8" }}>SolShield AI</span>
        </div>
        <p>AI-Powered Solana Smart Contract Security Auditing Platform</p>
      </footer>
    </div>
  );
}

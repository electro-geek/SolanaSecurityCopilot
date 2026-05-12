"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Bug,
  Code2,
} from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Finding, analyzeFinding } from "@/lib/api";

interface Props {
  finding: Finding | null;
  onEnrich?: (enrichedFinding: Finding) => void;
}

const severityConfig = {
  CRITICAL: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", icon: <ShieldAlert size={16} /> },
  HIGH: { color: "#f97316", bg: "rgba(249,115,22,0.08)", icon: <AlertTriangle size={16} /> },
  MEDIUM: { color: "#eab308", bg: "rgba(234,179,8,0.08)", icon: <AlertTriangle size={16} /> },
  LOW: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", icon: <Info size={16} /> },
};

export default function FindingDetail({ finding, onEnrich }: Props) {
  const [showExploit, setShowExploit] = useState(false);
  const [showRemediation, setShowRemediation] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when finding changes
  useEffect(() => {
    setIsAnalyzing(false);
    setError(null);
  }, [finding?.rule_id, finding?.line]);

  if (!finding) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          color: "#4a6280",
        }}
      >
        <AlertTriangle size={40} color="#4a6280" />
        <p style={{ fontSize: "14px" }}>Select a finding to view details</p>
      </div>
    );
  }

  const handleRunAI = async () => {
    if (!finding) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const enriched = await analyzeFinding(finding);
      if (onEnrich) onEnrich(enriched);
    } catch (err: any) {
      console.error("AI Analysis failed:", err);
      setError(err.response?.data?.detail || "AI Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const cfg = severityConfig[finding.severity] || severityConfig.LOW;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={finding.rule_id + finding.line}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ padding: "24px", height: "100%", overflowY: "auto" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 700,
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.color}30`,
              }}
            >
              {cfg.icon}
              {finding.severity}
            </span>
            <code style={{ fontSize: "12px", color: "#4a6280", fontFamily: "JetBrains Mono, monospace" }}>
              {finding.rule_id}
            </code>
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{finding.title}</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#4a6280",
            }}
          >
            <Code2 size={13} />
            <code style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {finding.file}:{finding.line}
            </code>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            padding: "16px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(99,179,255,0.08)",
            marginBottom: "16px",
            fontSize: "13px",
            color: "#8aa3c8",
            lineHeight: 1.6,
          }}
        >
          {finding.description}
        </div>

        {/* AI Analysis Button or Content */}
        {(!finding.ai_explanation || finding.ai_explanation.includes("Ensure your GEMINI_API_KEY") || finding.ai_explanation.includes("AI analysis is currently unavailable")) ? (
          <div
            style={{
              padding: "32px 16px",
              borderRadius: "10px",
              background: "rgba(59, 130, 246, 0.04)",
              border: "1px dashed rgba(59, 130, 246, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#63b3ff", marginBottom: "4px" }}>
                Deep Security Analysis
              </h3>
              <p style={{ fontSize: "12px", color: "#4a6280" }}>
                Use SolShield AI to generate an exploit scenario and remediation steps.
              </p>
            </div>
            
            <button
              onClick={handleRunAI}
              disabled={isAnalyzing}
              className={isAnalyzing ? "" : "btn-primary"}
              style={{
                padding: "10px 24px",
                fontSize: "13px",
                borderRadius: "8px",
                cursor: isAnalyzing ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: isAnalyzing ? "rgba(255,255,255,0.05)" : undefined,
                border: isAnalyzing ? "1px solid rgba(255,255,255,0.1)" : undefined,
                color: isAnalyzing ? "#4a6280" : undefined,
              }}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner-small" />
                  Analyzing with Gemini...
                </>
              ) : (
                <>
                  <Lightbulb size={16} />
                  Run AI Analysis
                </>
              )}
            </button>
            {error && (
              <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "8px" }}>{error}</p>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              background: "rgba(59, 130, 246, 0.06)",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#63b3ff",
              }}
            >
              <Lightbulb size={14} />
              AI ANALYSIS
            </div>
            <div className="markdown-content" style={{ fontSize: "13px" }}>
              <ReactMarkdown>{finding.ai_explanation}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Exploit Scenario */}
        {finding.exploit_scenario && (
          <div
            style={{
              borderRadius: "10px",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              marginBottom: "12px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setShowExploit(!showExploit)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.06)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bug size={14} />
                EXPLOIT SCENARIO
              </div>
              {showExploit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {showExploit && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="markdown-content"
                    style={{ padding: "16px", fontSize: "13px" }}
                  >
                    <ReactMarkdown>{finding.exploit_scenario}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Remediation */}
        {finding.remediation && (
          <div
            style={{
              borderRadius: "10px",
              border: "1px solid rgba(34, 197, 94, 0.15)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setShowRemediation(!showRemediation)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(34, 197, 94, 0.06)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#22c55e",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Code2 size={14} />
                REMEDIATION
              </div>
              {showRemediation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {showRemediation && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="markdown-content"
                    style={{ padding: "16px", fontSize: "13px" }}
                  >
                    <ReactMarkdown>{finding.remediation}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

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

const severityMeta = {
  CRITICAL: { cls: "badge-critical", icon: <ShieldAlert size={14} /> },
  HIGH: { cls: "badge-high", icon: <AlertTriangle size={14} /> },
  MEDIUM: { cls: "badge-medium", icon: <AlertTriangle size={14} /> },
  LOW: { cls: "badge-low", icon: <Info size={14} /> },
};

export default function FindingDetail({ finding, onEnrich }: Props) {
  const [showExploit, setShowExploit] = useState(false);
  const [showRemediation, setShowRemediation] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          color: "var(--muted)",
        }}
      >
        <AlertTriangle size={40} style={{ color: "var(--muted)" }} />
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

  const meta = severityMeta[finding.severity] || severityMeta.LOW;

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <span className={`badge ${meta.cls}`}>
              {meta.icon}
              {finding.severity}
            </span>
            <code
              className="font-mono"
              style={{ fontSize: "12px", color: "var(--muted)" }}
            >
              {finding.rule_id}
            </code>
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>
            {finding.title}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "var(--muted)",
            }}
          >
            <Code2 size={13} />
            <code className="font-mono">
              {finding.file}:{finding.line}
            </code>
          </div>
        </div>

        {/* Description */}
        <div
          className="panel"
          style={{
            padding: "16px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "var(--muted)",
            lineHeight: 1.6,
          }}
        >
          {finding.description}
        </div>

        {/* AI Analysis Button or Content */}
        {!finding.ai_explanation ||
        finding.ai_explanation.includes("Ensure your GEMINI_API_KEY") ||
        finding.ai_explanation.includes("AI analysis is currently unavailable") ? (
          <div
            style={{
              padding: "32px 16px",
              borderRadius: "8px",
              background: "var(--primary-soft)",
              border: "2px dashed var(--primary)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "var(--primary-text)",
                  marginBottom: "4px",
                }}
              >
                Deep Security Analysis
              </h3>
              <p style={{ fontSize: "12px", color: "var(--muted)" }}>
                Use SolShield AI to generate an exploit scenario and remediation
                steps.
              </p>
            </div>

            <button
              onClick={handleRunAI}
              disabled={isAnalyzing}
              className={isAnalyzing ? "btn-ghost" : "btn-primary"}
              style={{ padding: "10px 24px", fontSize: "13px" }}
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
              <p style={{ fontSize: "11px", color: "var(--sev-critical)", marginTop: "8px" }}>
                {error}
              </p>
            )}
          </div>
        ) : (
          <div
            className="panel"
            style={{
              padding: "16px",
              marginBottom: "12px",
              borderColor: "var(--primary)",
            }}
          >
            <div
              className="section-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                color: "var(--primary-text)",
              }}
            >
              <Lightbulb size={14} />
              AI Analysis
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
              borderRadius: "8px",
              border: "2px solid color-mix(in srgb, var(--sev-critical) 30%, transparent)",
              marginBottom: "12px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setShowExploit(!showExploit)}
              className="section-label"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "color-mix(in srgb, var(--sev-critical) 8%, transparent)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "var(--sev-critical)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bug size={14} />
                Exploit Scenario
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
              borderRadius: "8px",
              border: "2px solid color-mix(in srgb, var(--sev-low) 30%, transparent)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setShowRemediation(!showRemediation)}
              className="section-label"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "color-mix(in srgb, var(--sev-low) 8%, transparent)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "var(--sev-low)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Code2 size={14} />
                Remediation
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

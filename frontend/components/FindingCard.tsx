"use client";

import { AlertTriangle, ShieldAlert, ShieldCheck, Info } from "lucide-react";
import { Finding } from "@/lib/api";

interface Props {
  finding: Finding;
  isSelected: boolean;
  onClick: () => void;
}

const severityConfig = {
  CRITICAL: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", icon: <ShieldAlert size={14} /> },
  HIGH: { color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)", icon: <AlertTriangle size={14} /> },
  MEDIUM: { color: "#eab308", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", icon: <AlertTriangle size={14} /> },
  LOW: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", icon: <Info size={14} /> },
};

export default function FindingCard({ finding, isSelected, onClick }: Props) {
  const cfg = severityConfig[finding.severity] || severityConfig.LOW;

  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 16px",
        borderRadius: "10px",
        cursor: "pointer",
        background: isSelected ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.02)",
        border: isSelected
          ? "1px solid rgba(59, 130, 246, 0.35)"
          : "1px solid rgba(99, 179, 255, 0.07)",
        transition: "all 0.2s",
        marginBottom: "8px",
      }}
    >
      {/* Severity + Rule ID */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "2px 8px",
            borderRadius: "20px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
          }}
        >
          {cfg.icon}
          {finding.severity}
        </span>
        <code
          style={{
            fontSize: "10px",
            color: "#4a6280",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {finding.rule_id}
        </code>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: isSelected ? "#e8f4fd" : "#8aa3c8",
          marginBottom: "6px",
          lineHeight: 1.3,
        }}
      >
        {finding.title}
      </div>

      {/* File + line */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <code
          style={{
            fontSize: "11px",
            color: "#4a6280",
            fontFamily: "JetBrains Mono, monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "160px",
          }}
        >
          {finding.file}
        </code>
        <span style={{ fontSize: "11px", color: "#4a6280" }}>:{finding.line}</span>
      </div>
    </div>
  );
}

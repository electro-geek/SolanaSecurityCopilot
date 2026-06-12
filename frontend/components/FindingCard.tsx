"use client";

import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import { Finding } from "@/lib/api";

interface Props {
  finding: Finding;
  isSelected: boolean;
  onClick: () => void;
}

const severityMeta = {
  CRITICAL: { cls: "badge-critical", icon: <ShieldAlert size={12} /> },
  HIGH: { cls: "badge-high", icon: <AlertTriangle size={12} /> },
  MEDIUM: { cls: "badge-medium", icon: <AlertTriangle size={12} /> },
  LOW: { cls: "badge-low", icon: <Info size={12} /> },
};

export default function FindingCard({ finding, isSelected, onClick }: Props) {
  const meta = severityMeta[finding.severity] || severityMeta.LOW;

  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 16px",
        borderRadius: "12px",
        cursor: "pointer",
        background: isSelected ? "var(--primary-soft)" : "var(--surface)",
        border: "2px solid var(--border)",
        boxShadow: isSelected ? "4px 4px 0px 0px var(--shadow-color)" : "none",
        transform: isSelected ? "translate(-2px, -2px)" : "none",
        transition: "all 0.15s ease",
        marginBottom: "10px",
      }}
    >
      {/* Severity + Rule ID */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <span className={`badge ${meta.cls}`} style={{ fontSize: "10px" }}>
          {meta.icon}
          {finding.severity}
        </span>
        <code
          className="font-mono"
          style={{ fontSize: "10px", color: "var(--muted)" }}
        >
          {finding.rule_id}
        </code>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--foreground)",
          marginBottom: "6px",
          lineHeight: 1.3,
        }}
      >
        {finding.title}
      </div>

      {/* File + line */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <code
          className="font-mono"
          style={{
            fontSize: "11px",
            color: "var(--muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "160px",
          }}
        >
          {finding.file}
        </code>
        <span className="font-mono" style={{ fontSize: "11px", color: "var(--muted)" }}>
          :{finding.line}
        </span>
      </div>
    </div>
  );
}

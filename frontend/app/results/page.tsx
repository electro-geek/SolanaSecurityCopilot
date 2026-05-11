"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Download,
  Clock,
  FileText,
  Filter,
  ChevronLeft,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FindingCard from "@/components/FindingCard";
import FindingDetail from "@/components/FindingDetail";
import CodeEditor from "@/components/CodeEditor";
import { ScanResult, Finding } from "@/lib/api";

const SEVERITY_ORDER: Record<string, number> = {
  CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3,
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"detail" | "code">("detail");

  useEffect(() => {
    const raw = sessionStorage.getItem("scanResult");
    if (!raw) { router.push("/dashboard"); return; }
    const parsed: ScanResult = JSON.parse(raw);
    // Sort findings by severity
    parsed.findings.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4));
    setResult(parsed);
    if (parsed.findings.length > 0) setSelectedFinding(parsed.findings[0]);
  }, []);

  const filteredFindings = result?.findings.filter(
    (f) => filter === "ALL" || f.severity === filter
  ) || [];

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solshield-report-${result.scan_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  const { summary } = result;

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,179,255,0.1)",
                borderRadius: "8px",
                color: "#8aa3c8",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <ChevronLeft size={14} /> Back
            </button>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 800 }}>Scan Results</h1>
              <p style={{ fontSize: "12px", color: "#4a6280", marginTop: "2px" }}>
                {result.source_name} • Scan #{result.scan_id} •{" "}
                {(result.scan_duration_ms / 1000).toFixed(2)}s
              </p>
            </div>
          </div>
          <button id="download-report" className="btn-secondary" onClick={downloadReport} style={{ padding: "9px 18px", fontSize: "13px" }}>
            <Download size={14} />
            Export JSON Report
          </button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              label: "Total Findings",
              value: summary.total,
              icon: <Layers size={18} />,
              color: "#63b3ff",
              bg: "rgba(99,179,255,0.08)",
            },
            {
              label: "Critical",
              value: summary.critical,
              icon: <ShieldAlert size={18} />,
              color: "#ef4444",
              bg: "rgba(239,68,68,0.08)",
            },
            {
              label: "High",
              value: summary.high,
              icon: <AlertTriangle size={18} />,
              color: "#f97316",
              bg: "rgba(249,115,22,0.08)",
            },
            {
              label: "Medium",
              value: summary.medium,
              icon: <AlertTriangle size={18} />,
              color: "#eab308",
              bg: "rgba(234,179,8,0.08)",
            },
            {
              label: "Files Scanned",
              value: result.rust_files_found,
              icon: <FileText size={18} />,
              color: "#8b5cf6",
              bg: "rgba(139,92,246,0.08)",
            },
          ].map((card) => (
            <motion.div
              key={card.label}
              whileHover={{ y: -2 }}
              className="glass-card"
              style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: card.color, lineHeight: 1.1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: "11px", color: "#4a6280" }}>{card.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main layout: Findings Sidebar + Detail + Code */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px", height: "calc(100vh - 280px)", minHeight: "500px" }}>
          {/* Findings sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card"
            style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* Sidebar Header + Filter */}
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid rgba(99,179,255,0.08)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Filter size={14} color="#63b3ff" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#8aa3c8" }}>
                  FINDINGS ({filteredFindings.length})
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {["ALL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilter(sev)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      background: filter === sev ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                      color: filter === sev ? "#63b3ff" : "#4a6280",
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Findings list */}
            <div style={{ overflowY: "auto", flex: 1, padding: "12px" }}>
              {filteredFindings.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 16px",
                    color: "#4a6280",
                    fontSize: "13px",
                  }}
                >
                  <CheckCircle size={32} color="#22c55e" style={{ marginBottom: "12px" }} />
                  <p>No findings for this filter</p>
                </div>
              ) : (
                filteredFindings.map((finding, i) => (
                  <motion.div
                    key={`${finding.rule_id}-${finding.line}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <FindingCard
                      finding={finding}
                      isSelected={selectedFinding === finding}
                      onClick={() => setSelectedFinding(finding)}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Right panel: detail + code */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid rgba(99,179,255,0.08)",
                padding: "0 16px",
                flexShrink: 0,
              }}
            >
              {[
                { id: "detail", label: "AI Analysis" },
                { id: "code", label: "Code View" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "detail" | "code")}
                  style={{
                    padding: "12px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: activeTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
                    color: activeTab === tab.id ? "#63b3ff" : "#4a6280",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              {activeTab === "detail" ? (
                <div style={{ height: "100%", overflowY: "auto" }}>
                  <FindingDetail finding={selectedFinding} />
                </div>
              ) : (
                <div style={{ padding: "16px", height: "100%" }}>
                  <CodeEditor
                    content={selectedFinding?.code_snippet || "// No code snippet available for this finding.\n// Select a finding from the sidebar."}
                    language="rust"
                    selectedFinding={selectedFinding}
                    height="100%"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

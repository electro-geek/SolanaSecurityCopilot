"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Download,
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
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"detail" | "code">("detail");

  useEffect(() => {
    const raw = sessionStorage.getItem("scanResult");
    if (!raw) {
      router.push("/dashboard");
      return;
    }
    const parsed: ScanResult = JSON.parse(raw);
    parsed.findings.sort(
      (a, b) => (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4)
    );
    setResult(parsed);
    if (parsed.findings.length > 0) setSelectedFinding(parsed.findings[0]);
  }, []);

  const filteredFindings =
    result?.findings.filter((f) => filter === "ALL" || f.severity === filter) || [];

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solshield-report-${result.scan_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEnrichFinding = (enrichedFinding: Finding) => {
    if (!result) return;
    const updatedFindings = result.findings.map((f) =>
      f.rule_id === enrichedFinding.rule_id && f.line === enrichedFinding.line
        ? enrichedFinding
        : f
    );
    const updatedResult = { ...result, findings: updatedFindings };
    setResult(updatedResult);
    setSelectedFinding(enrichedFinding);
    sessionStorage.setItem("scanResult", JSON.stringify(updatedResult));
  };

  if (!result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  const { summary } = result;

  const cards = [
    { label: "Total Findings", value: summary.total, icon: <Layers size={18} />, color: "var(--primary)" },
    { label: "Critical", value: summary.critical, icon: <ShieldAlert size={18} />, color: "var(--sev-critical)" },
    { label: "High", value: summary.high, icon: <AlertTriangle size={18} />, color: "var(--sev-high)" },
    { label: "Medium", value: summary.medium, icon: <AlertTriangle size={18} />, color: "var(--sev-medium)" },
    { label: "Files Scanned", value: result.rust_files_found, icon: <FileText size={18} />, color: "var(--secondary)" },
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
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
            <button onClick={() => router.push("/dashboard")} className="btn-ghost" style={{ padding: "8px 14px", fontSize: "13px" }}>
              <ChevronLeft size={14} /> Back
            </button>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 800 }}>Scan Results</h1>
              <p className="font-mono" style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                {result.source_name} · scan #{result.scan_id} ·{" "}
                {(result.scan_duration_ms / 1000).toFixed(2)}s
              </p>
            </div>
          </div>
          <button id="download-report" className="btn-ghost" onClick={downloadReport} style={{ padding: "9px 18px", fontSize: "13px" }}>
            <Download size={14} />
            Export JSON Report
          </button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.label}
              className="card"
              style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "8px",
                  background: `color-mix(in srgb, ${card.color} 12%, transparent)`,
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
                <div
                  className="font-heading"
                  style={{ fontSize: "24px", fontWeight: 800, color: card.color, lineHeight: 1.1 }}
                >
                  {card.value}
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {card.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "16px",
            height: "calc(100vh - 290px)",
            minHeight: "500px",
          }}
        >
          {/* Findings sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 }}
            className="card"
            style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Filter size={14} style={{ color: "var(--primary)" }} />
                <span className="section-label">Findings ({filteredFindings.length})</span>
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilter(sev)}
                    style={{
                      padding: "3px 9px",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: 700,
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      background: filter === sev ? "var(--primary-soft)" : "transparent",
                      color: filter === sev ? "var(--primary)" : "var(--muted)",
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowY: "auto", flex: 1, padding: "12px" }}>
              {filteredFindings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--muted)", fontSize: "13px" }}>
                  <CheckCircle size={32} style={{ color: "var(--sev-low)", marginBottom: "12px" }} />
                  <p>No findings for this filter</p>
                </div>
              ) : (
                filteredFindings.map((finding, i) => (
                  <motion.div
                    key={`${finding.rule_id}-${finding.line}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
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

          {/* Right panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16 }}
            className="card"
            style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 16px", flexShrink: 0 }}>
              {[
                { id: "detail", label: "AI Analysis" },
                { id: "code", label: "Code View" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "detail" | "code")}
                  style={{
                    padding: "13px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                    color: activeTab === tab.id ? "var(--primary)" : "var(--muted)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
              {activeTab === "detail" ? (
                <div style={{ height: "100%", overflowY: "auto" }}>
                  <FindingDetail finding={selectedFinding} onEnrich={handleEnrichFinding} />
                </div>
              ) : (
                <div style={{ padding: "16px", height: "100%" }}>
                  <CodeEditor
                    content={
                      selectedFinding?.code_snippet ||
                      "// No code snippet available for this finding.\n// Select a finding from the sidebar."
                    }
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

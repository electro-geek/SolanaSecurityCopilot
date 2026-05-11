"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  GitFork,
  Upload,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import DropZone from "@/components/DropZone";
import { scanZip, scanGitHub, ScanResult } from "@/lib/api";
import { useRouter } from "next/navigation";

const SAMPLE_REPOS = [
  "https://github.com/coral-xyz/sealevel-attacks",
  "https://github.com/project-serum/serum-dex",
];

export default function DashboardPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"upload" | "github">("upload");
  const [githubUrl, setGithubUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = async () => {
    setError(null);
    setIsScanning(true);
    setScanProgress(10);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress((p) => Math.min(p + 8, 85));
    }, 400);

    try {
      let result: ScanResult;
      if (mode === "upload") {
        if (!file) { setError("Please select a ZIP file first."); return; }
        result = await scanZip(file);
      } else {
        if (!githubUrl.trim()) { setError("Please enter a GitHub repository URL."); return; }
        result = await scanGitHub(githubUrl.trim());
      }

      clearInterval(progressInterval);
      setScanProgress(100);

      // Store result in sessionStorage and navigate
      sessionStorage.setItem("scanResult", JSON.stringify(result));
      setTimeout(() => router.push("/results"), 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      const msg = err?.response?.data?.detail || err.message || "Scan failed.";
      setError(msg);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "40px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.03em" }}>
                Security Dashboard
              </h1>
              <p style={{ fontSize: "13px", color: "#8aa3c8" }}>
                Upload a project or scan a GitHub repository
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "flex",
            gap: "8px",
            padding: "6px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(99,179,255,0.08)",
            borderRadius: "14px",
            marginBottom: "28px",
            width: "fit-content",
          }}
        >
          {[
            { id: "upload", label: "Upload ZIP", icon: <Upload size={16} /> },
            { id: "github", label: "GitHub URL", icon: <GitFork size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as "upload" | "github")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                transition: "all 0.2s",
                background: mode === tab.id
                  ? "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.2))"
                  : "transparent",
                color: mode === tab.id ? "#e8f4fd" : "#4a6280",
                boxShadow: mode === tab.id ? "0 2px 12px rgba(59,130,246,0.2)" : "none",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Upload / GitHub Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card"
          style={{ padding: "28px", marginBottom: "24px" }}
        >
          <AnimatePresence mode="wait">
            {mode === "upload" ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>
                  Upload Anchor Project ZIP
                </h2>
                <DropZone onFile={setFile} disabled={isScanning} />
                <p style={{ fontSize: "12px", color: "#4a6280", marginTop: "12px" }}>
                  Supports: Anchor projects, raw Rust programs, multi-file projects
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="github"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>
                  Scan GitHub Repository
                </h2>
                <div style={{ display: "flex", gap: "12px" }}>
                  <input
                    id="github-url-input"
                    type="text"
                    className="input-field"
                    placeholder="https://github.com/owner/solana-program"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScan()}
                    disabled={isScanning}
                  />
                </div>
                <div style={{ marginTop: "12px" }}>
                  <p style={{ fontSize: "12px", color: "#4a6280", marginBottom: "8px" }}>
                    Try these sample repositories:
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {SAMPLE_REPOS.map((repo) => (
                      <button
                        key={repo}
                        onClick={() => setGithubUrl(repo)}
                        style={{
                          padding: "4px 10px",
                          background: "rgba(59,130,246,0.08)",
                          border: "1px solid rgba(59,130,246,0.2)",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#63b3ff",
                          cursor: "pointer",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {repo.split("/").slice(-2).join("/")}
                        <ExternalLink size={10} style={{ marginLeft: "4px", display: "inline" }} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                padding: "14px 18px",
                borderRadius: "10px",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                fontSize: "13px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <AlertTriangle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isScanning ? (
            <div>
              <div
                style={{
                  padding: "14px 28px",
                  borderRadius: "12px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div className="spinner" />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#63b3ff" }}>
                  Scanning for vulnerabilities...
                </span>
              </div>
              {/* Progress bar */}
              <div
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  background: "rgba(99,179,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{ height: "100%", borderRadius: "2px", background: "linear-gradient(90deg, #3b82f6, #8b5cf6)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p style={{ fontSize: "12px", color: "#4a6280", marginTop: "8px" }}>
                {scanProgress < 50 ? "Parsing Rust files..." : scanProgress < 80 ? "Running vulnerability rules..." : "Generating AI explanations..."}
              </p>
            </div>
          ) : (
            <button
              id="scan-button"
              className="btn-primary"
              onClick={handleScan}
              style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "15px" }}
            >
              <Zap size={18} />
              Run Security Scan
            </button>
          )}
        </motion.div>

        {/* Feature hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginTop: "32px",
          }}
        >
          {[
            { icon: <Shield size={16} />, label: "7 Vulnerability Rules" },
            { icon: <Zap size={16} />, label: "AI-Powered Explanations" },
            { icon: <FileText size={16} />, label: "Exportable Reports" },
          ].map((hint) => (
            <div
              key={hint.label}
              style={{
                padding: "14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(99,179,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "12px",
                color: "#4a6280",
              }}
            >
              <span style={{ color: "#3b82f6" }}>{hint.icon}</span>
              {hint.label}
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

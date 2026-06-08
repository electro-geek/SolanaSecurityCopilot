"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitFork,
  Upload,
  Zap,
  AlertTriangle,
  FileText,
  Shield,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import DropZone from "@/components/DropZone";
import { LogoMark } from "@/components/Logo";
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

    const progressInterval = setInterval(() => {
      setScanProgress((p) => Math.min(p + 8, 85));
    }, 400);

    try {
      let result: ScanResult;
      if (mode === "upload") {
        if (!file) {
          setError("Please select a ZIP file first.");
          clearInterval(progressInterval);
          setIsScanning(false);
          return;
        }
        result = await scanZip(file);
      } else {
        if (!githubUrl.trim()) {
          setError("Please enter a GitHub repository URL.");
          clearInterval(progressInterval);
          setIsScanning(false);
          return;
        }
        result = await scanGitHub(githubUrl.trim());
      }

      clearInterval(progressInterval);
      setScanProgress(100);
      sessionStorage.setItem("scanResult", JSON.stringify(result));
      setTimeout(() => router.push("/results"), 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      const msg = err?.response?.data?.detail || err.message || "Scan failed.";
      setError(msg);
      setIsScanning(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "40px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              className="panel"
              style={{
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogoMark size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.03em" }}>
                Security Dashboard
              </h1>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                Upload an Anchor project or scan a GitHub repository
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="panel"
          style={{
            display: "flex",
            gap: "6px",
            padding: "6px",
            marginBottom: "24px",
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
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "all 0.2s",
                background: mode === tab.id ? "var(--primary)" : "transparent",
                color: mode === tab.id ? "var(--primary-fg)" : "var(--muted)",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Upload / GitHub Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="card"
          style={{ padding: "28px", marginBottom: "20px" }}
        >
          <AnimatePresence mode="wait">
            {mode === "upload" ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="section-label section-label--ruled" style={{ marginBottom: "16px" }}>
                  Upload Anchor Project ZIP
                </div>
                <DropZone onFile={setFile} disabled={isScanning} />
                <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px" }}>
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
                <div className="section-label section-label--ruled" style={{ marginBottom: "16px" }}>
                  Scan GitHub Repository
                </div>
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
                <div style={{ marginTop: "14px" }}>
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>
                    Try these sample repositories:
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {SAMPLE_REPOS.map((repo) => (
                      <button
                        key={repo}
                        onClick={() => setGithubUrl(repo)}
                        className="font-mono"
                        style={{
                          padding: "5px 10px",
                          background: "var(--primary-soft)",
                          border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "var(--primary)",
                          cursor: "pointer",
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
                borderRadius: "8px",
                background: "color-mix(in srgb, var(--sev-critical) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--sev-critical) 30%, transparent)",
                color: "var(--sev-critical)",
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
          transition={{ delay: 0.16 }}
        >
          {isScanning ? (
            <div>
              <div
                className="panel"
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "14px",
                  borderColor: "var(--primary)",
                }}
              >
                <div className="spinner" />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>
                  Scanning for vulnerabilities...
                </span>
              </div>
              <div
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  background: "var(--panel)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{ height: "100%", borderRadius: "2px", background: "var(--primary)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="font-mono" style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
                {scanProgress < 50
                  ? "Parsing Rust files..."
                  : scanProgress < 80
                  ? "Running vulnerability rules..."
                  : "Compiling report..."}
              </p>
            </div>
          ) : (
            <button
              id="scan-button"
              className="btn-primary"
              onClick={handleScan}
              style={{ width: "100%", padding: "15px", fontSize: "15px" }}
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
          transition={{ delay: 0.3 }}
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
              className="panel"
              style={{
                padding: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "12px",
                color: "var(--muted)",
              }}
            >
              <span style={{ color: "var(--primary)" }}>{hint.icon}</span>
              {hint.label}
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

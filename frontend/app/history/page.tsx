"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Search,
  FileText,
  GitFork,
  ChevronRight,
  Calendar,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface HistoryItem {
  id: number;
  scan_id: string;
  source_name: string;
  source_type: string;
  findings_summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  created_at: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }
    if (user) fetchHistory();
  }, [user, authLoading]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history/");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const viewResult = (item: HistoryItem) => {
    setLoading(true);
    api
      .get(`/history/${item.scan_id}`)
      .then((res) => {
        sessionStorage.setItem("scanResult", JSON.stringify(res.data));
        router.push("/results");
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredHistory = history.filter(
    (item) =>
      item.source_name.toLowerCase().includes(search.toLowerCase()) ||
      item.scan_id.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || (loading && history.length === 0)) {
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

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ padding: "48px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <header style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div
              className="panel"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-text)",
              }}
            >
              <History size={22} />
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Audit History</h1>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>
            View and manage your previous Solana security scans.
          </p>
        </header>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search by repository name or scan ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: "46px", padding: "13px 14px 13px 46px" }}
          />
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredHistory.length === 0 ? (
            <div className="card" style={{ padding: "60px 20px", textAlign: "center" }}>
              <ShieldCheck
                size={48}
                strokeWidth={1}
                style={{ margin: "0 auto 16px", color: "var(--muted)", opacity: 0.6 }}
              />
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                No scans found
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>
                {search
                  ? "Try a different search term"
                  : "You haven't performed any security scans yet."}
              </p>
              {!search && (
                <button onClick={() => router.push("/dashboard")} className="btn-primary">
                  Start First Scan
                </button>
              )}
            </div>
          ) : (
            filteredHistory.map((item, idx) => (
              <motion.div
                key={item.scan_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="card"
                onClick={() => viewResult(item)}
                style={{
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  alignItems: "center",
                  gap: "24px",
                  cursor: "pointer",
                }}
              >
                <div
                  className="panel"
                  style={{
                    width: 42,
                    height: 42,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted)",
                  }}
                >
                  {item.source_type === "github" ? <GitFork size={20} /> : <FileText size={20} />}
                </div>

                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
                    {item.source_name}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span>ID: {item.scan_id}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  {item.findings_summary.high > 0 && (
                    <span className="badge badge-high">
                      <AlertTriangle size={10} />
                      {item.findings_summary.high} High
                    </span>
                  )}
                  {item.findings_summary.medium > 0 && (
                    <span className="badge badge-medium">{item.findings_summary.medium} Med</span>
                  )}
                  {item.findings_summary.total === 0 && (
                    <span className="badge badge-low">Secure</span>
                  )}
                </div>

                <div style={{ color: "var(--muted)" }}>
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

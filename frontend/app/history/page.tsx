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
  ExternalLink
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

    if (user) {
      fetchHistory();
    }
  }, [user, authLoading]);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/history/`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const viewResult = (item: HistoryItem) => {
    // For now, we store the full results in the DB. 
    // We can either fetch them again or redirect to results page if we modify results page to fetch by ID.
    // For this hackathon version, we'll fetch detail and store in sessionStorage to reuse existing results page.
    setLoading(true);
    api.get(`/history/${item.scan_id}`).then(res => {
      sessionStorage.setItem("scanResult", JSON.stringify(res.data));
      router.push("/results");
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const filteredHistory = history.filter(item => 
    item.source_name.toLowerCase().includes(search.toLowerCase()) ||
    item.scan_id.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || (loading && history.length === 0)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ padding: "40px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <header style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: "10px", background: "rgba(99,179,255,0.1)", 
              display: "flex", alignItems: "center", justifyContent: "center", color: "#63b3ff" 
            }}>
              <History size={20} />
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Audit History</h1>
          </div>
          <p style={{ color: "#4a6280", fontSize: "14px" }}>View and manage your previous Solana security scans.</p>
        </header>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <Search 
            size={18} 
            color="#4a6280" 
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} 
          />
          <input 
            type="text"
            placeholder="Search by repository name or scan ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 14px 14px 48px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(99,179,255,0.1)",
              borderRadius: "12px",
              color: "#e8f4fd",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(99,179,255,0.3)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(99,179,255,0.1)"}
          />
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredHistory.length === 0 ? (
            <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ color: "#4a6280", marginBottom: "16px" }}>
                <ShieldCheck size={48} strokeWidth={1} style={{ margin: "0 auto", opacity: 0.5 }} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>No scans found</h3>
              <p style={{ color: "#4a6280", fontSize: "14px", marginBottom: "24px" }}>
                {search ? "Try a different search term" : "You haven't performed any security scans yet."}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card"
                onClick={() => viewResult(item)}
                style={{ 
                  padding: "16px 20px", 
                  display: "grid", 
                  gridTemplateColumns: "auto 1fr auto auto",
                  alignItems: "center",
                  gap: "24px",
                  cursor: "pointer",
                  transition: "transform 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {/* Icon */}
                <div style={{ 
                  width: 40, height: 40, borderRadius: "8px", background: "rgba(255,255,255,0.03)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#8aa3c8"
                }}>
                  {item.source_type === "github" ? <GitFork size={20} /> : <FileText size={20} />}
                </div>

                {/* Name & ID */}
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#e8f4fd", marginBottom: "4px" }}>
                    {item.source_name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#4a6280", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      ID: {item.scan_id}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Summary Badges */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {item.findings_summary.high > 0 && (
                    <div style={{ 
                      padding: "4px 8px", borderRadius: "6px", background: "rgba(239,68,68,0.1)", 
                      color: "#ef4444", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px"
                    }}>
                      <AlertTriangle size={10} />
                      {item.findings_summary.high} High
                    </div>
                  )}
                  {item.findings_summary.medium > 0 && (
                    <div style={{ 
                      padding: "4px 8px", borderRadius: "6px", background: "rgba(234,179,8,0.1)", 
                      color: "#eab308", fontSize: "11px", fontWeight: 700
                    }}>
                      {item.findings_summary.medium} Med
                    </div>
                  )}
                  {item.findings_summary.total === 0 && (
                    <div style={{ 
                      padding: "4px 8px", borderRadius: "6px", background: "rgba(34,197,94,0.1)", 
                      color: "#22c55e", fontSize: "11px", fontWeight: 700
                    }}>
                      Secure
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div style={{ color: "#4a6280" }}>
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

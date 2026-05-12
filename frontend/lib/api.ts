import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 min for scans
});

// Attach auth token to every request if available
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("solshield_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Finding {
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  file: string;
  line: number;
  description: string;
  rule_id: string;
  code_snippet?: string;
  ai_explanation?: string;
  remediation?: string;
  exploit_scenario?: string;
  secure_pattern?: string;
}

export interface ScanSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ScanResult {
  scan_id: string;
  source: "upload" | "github";
  source_name: string;
  findings: Finding[];
  total_files_scanned: number;
  rust_files_found: number;
  scan_duration_ms: number;
  error?: string;
  summary: ScanSummary;
}

export async function scanZip(file: File): Promise<ScanResult> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<ScanResult>("/scan", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function scanGitHub(url: string): Promise<ScanResult> {
  const { data } = await api.post<ScanResult>("/scan-github", { url });
  return data;
}

export async function chatWithAI(
  question: string,
  context?: string
): Promise<string> {
  const { data } = await api.post<{ response: string }>("/ai-chat", {
    question,
    context,
    stream: false,
  });
  return data.response;
}

export async function* streamChat(
  question: string,
  context?: string
): AsyncGenerator<string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem("solshield_token") : null;
  const response = await fetch(`${API_BASE}/ai-chat`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ question, context, stream: true }),
  });

  if (!response.body) throw new Error("No response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}

export async function analyzeFinding(finding: Finding): Promise<Finding> {
  const { data } = await api.post<Finding>("/analyze-finding", { finding });
  return data;
}

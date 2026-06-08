"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Finding } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  content: string;
  language?: string;
  selectedFinding?: Finding | null;
  height?: string;
}

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function isLight(hex: string): boolean {
  const m = hex.replace("#", "");
  if (m.length < 6) return false;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

function hex(v: string): string | undefined {
  return v.startsWith("#") ? v : undefined;
}

export default function CodeEditor({
  content,
  language = "rust",
  selectedFinding,
  height = "500px",
}: Props) {
  // theme value forces React to re-key the editor so the Monaco theme rebuilds
  const { theme } = useTheme();
  const decoRef = useRef<string[]>([]);

  const applyTheme = (monaco: any) => {
    const bg = cssVar("--surface", "#191f1c");
    const fg = cssVar("--foreground", "#f2ead8");
    const muted = cssVar("--muted", "#b7ad98");
    const primary = cssVar("--primary", "#32b8a6");
    const secondary = cssVar("--secondary", "#d99d43");
    const panel = cssVar("--panel", "#202923");

    const base = isLight(bg) ? "vs" : "vs-dark";
    const colors: Record<string, string> = {};
    const set = (k: string, v?: string) => {
      if (v) colors[k] = v;
    };
    set("editor.background", hex(bg));
    set("editor.foreground", hex(fg));
    set("editorLineNumber.foreground", hex(muted));
    set("editorLineNumber.activeForeground", hex(primary));
    set("editor.lineHighlightBackground", hex(panel));
    set("editorGutter.background", hex(bg));

    monaco.editor.defineTheme("solshield", {
      base,
      inherit: true,
      rules: [
        { token: "comment", foreground: muted.replace("#", ""), fontStyle: "italic" },
        { token: "keyword", foreground: primary.replace("#", "") },
        { token: "string", foreground: secondary.replace("#", "") },
        { token: "number", foreground: secondary.replace("#", "") },
        { token: "type", foreground: primary.replace("#", "") },
      ],
      colors,
    });
    monaco.editor.setTheme("solshield");
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    applyTheme(monaco);

    const severityVar: Record<string, string> = {
      CRITICAL: "--sev-critical",
      HIGH: "--sev-high",
      MEDIUM: "--sev-medium",
      LOW: "--sev-low",
    };

    if (selectedFinding && selectedFinding.line > 0) {
      const color = cssVar(severityVar[selectedFinding.severity] || "--sev-high", "#e89a4a");
      editor.revealLineInCenter(selectedFinding.line);
      decoRef.current = editor.deltaDecorations(decoRef.current, [
        {
          range: new monaco.Range(selectedFinding.line, 1, selectedFinding.line, 9999),
          options: {
            isWholeLine: true,
            className: "vulnerable-line",
            linesDecorationsClassName: "vulnerable-line-decoration",
            overviewRuler: {
              color,
              position: monaco.editor.OverviewRulerLane.Left,
            },
            minimap: { color, position: 1 },
            hoverMessage: {
              value: `**${selectedFinding.severity}**: ${selectedFinding.title}`,
            },
          },
        },
      ]);
    }
  };

  return (
    <div
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}
    >
      <style>{`
        .vulnerable-line { background: color-mix(in srgb, var(--sev-high) 14%, transparent) !important; }
        .vulnerable-line-decoration { width: 3px !important; background: var(--sev-high); margin-left: 3px; border-radius: 2px; }
      `}</style>
      <MonacoEditor
        key={theme}
        height={height}
        language={language}
        value={content}
        theme="solshield"
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          minimap: { enabled: true, scale: 1 },
          fontSize: 13,
          lineNumbers: "on",
          glyphMargin: true,
          folding: true,
          wordWrap: "off",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          renderLineHighlight: "all",
          cursorStyle: "line",
          fontFamily: "ui-monospace, 'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
        }}
      />
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Finding } from "@/lib/api";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  content: string;
  language?: string;
  selectedFinding?: Finding | null;
  height?: string;
}

export default function CodeEditor({ content, language = "rust", selectedFinding, height = "500px" }: Props) {
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Add severity-colored line decorations for the selected finding
    if (selectedFinding) {
      const severityColors: Record<string, string> = {
        CRITICAL: "#ef4444",
        HIGH: "#f97316",
        MEDIUM: "#eab308",
        LOW: "#22c55e",
      };
      const color = severityColors[selectedFinding.severity] || "#f97316";
      
      // Create a custom decoration style
      monaco.editor.defineTheme("solshield-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "4a6280", fontStyle: "italic" },
          { token: "keyword", foreground: "a78bfa" },
          { token: "string", foreground: "34d399" },
          { token: "number", foreground: "fb923c" },
          { token: "type", foreground: "60a5fa" },
        ],
        colors: {
          "editor.background": "#080c14",
          "editor.foreground": "#e8f4fd",
          "editorLineNumber.foreground": "#2d4a6e",
          "editorLineNumber.activeForeground": "#63b3ff",
          "editor.selectionBackground": "#1e3a5f",
          "editor.lineHighlightBackground": "#0f1a2e",
          "editorGutter.background": "#0a1018",
          "scrollbarSlider.background": "#1a3050",
        },
      });
      monaco.editor.setTheme("solshield-dark");

      // Highlight the vulnerable line
      const line = selectedFinding.line;
      if (line > 0) {
        editor.revealLineInCenter(line);
        editor.deltaDecorations(
          [],
          [
            {
              range: new monaco.Range(line, 1, line, 9999),
              options: {
                isWholeLine: true,
                className: "vulnerable-line",
                glyphMarginClassName: "vulnerable-glyph",
                overviewRuler: {
                  color: color,
                  position: monaco.editor.OverviewRulerLane.Left,
                },
                minimap: { color, position: 1 },
                linesDecorationsClassName: "vulnerable-line-decoration",
                inlineClassName: "vulnerable-inline",
                hoverMessage: {
                  value: `**${selectedFinding.severity}**: ${selectedFinding.title}`,
                },
              },
            },
          ]
        );
      }
    } else {
      // Apply theme without finding
      monaco.editor.defineTheme("solshield-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "4a6280", fontStyle: "italic" },
          { token: "keyword", foreground: "a78bfa" },
          { token: "string", foreground: "34d399" },
          { token: "number", foreground: "fb923c" },
          { token: "type", foreground: "60a5fa" },
        ],
        colors: {
          "editor.background": "#080c14",
          "editor.foreground": "#e8f4fd",
          "editorLineNumber.foreground": "#2d4a6e",
          "editorLineNumber.activeForeground": "#63b3ff",
          "editor.selectionBackground": "#1e3a5f",
          "editor.lineHighlightBackground": "#0f1a2e",
          "editorGutter.background": "#0a1018",
          "scrollbarSlider.background": "#1a3050",
        },
      });
      monaco.editor.setTheme("solshield-dark");
    }
  };

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(99, 179, 255, 0.1)",
      }}
    >
      <style>{`
        .vulnerable-line { background: rgba(249, 115, 22, 0.12) !important; }
        .vulnerable-line-decoration { width: 3px !important; background: #f97316; margin-left: 3px; border-radius: 2px; }
        .monaco-editor .view-overlays .current-line { background: rgba(15, 26, 46, 0.8); }
      `}</style>
      <MonacoEditor
        height={height}
        language={language}
        value={content}
        theme="solshield-dark"
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
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
        }}
      />
    </div>
  );
}

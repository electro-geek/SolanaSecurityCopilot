"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileArchive, X, CheckCircle } from "lucide-react";

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFile, disabled }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        setSelectedFile(accepted[0]);
        onFile(accepted[0]);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/zip": [".zip"] },
    maxFiles: 1,
    disabled,
  });

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  return (
    <div
      {...getRootProps()}
      style={{
        padding: "40px 24px",
        borderRadius: "8px",
        border: `1.5px dashed ${isDragActive ? "var(--primary)" : "var(--border)"}`,
        background: isDragActive ? "var(--primary-soft)" : "var(--panel)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
        textAlign: "center",
        position: "relative",
      }}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "8px",
                background: "color-mix(in srgb, var(--sev-low) 14%, transparent)",
                border: "1px solid color-mix(in srgb, var(--sev-low) 30%, transparent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileArchive size={28} style={{ color: "var(--sev-low)" }} />
            </div>
            <div>
              <div
                style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}
              >
                {selectedFile.name}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--sev-low)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <CheckCircle size={14} />
              Ready to scan
            </div>
            <button
              onClick={clear}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              <X size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <motion.div
              animate={{ y: isDragActive ? -8 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: "8px",
                background: "var(--primary-soft)",
                border: "1px solid var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload size={24} style={{ color: "var(--primary)" }} />
            </motion.div>
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "4px",
                }}
              >
                {isDragActive ? "Drop it here!" : "Drag & drop your ZIP file"}
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                or click to browse — .zip files only, max 50MB
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

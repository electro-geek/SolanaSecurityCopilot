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
        borderRadius: "16px",
        border: `2px dashed ${isDragActive ? "#3b82f6" : "rgba(99, 179, 255, 0.2)"}`,
        background: isDragActive
          ? "rgba(59, 130, 246, 0.08)"
          : "rgba(255, 255, 255, 0.02)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        textAlign: "center",
        position: "relative",
      }}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "14px",
                background: "rgba(34, 197, 94, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileArchive size={28} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#e8f4fd" }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: "12px", color: "#8aa3c8", marginTop: "4px" }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px", color: "#22c55e", fontSize: "13px" }}
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
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#8aa3c8",
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
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}
          >
            <motion.div
              animate={{ y: isDragActive ? -8 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: "14px",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload size={24} color="#63b3ff" />
            </motion.div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#e8f4fd", marginBottom: "4px" }}>
                {isDragActive ? "Drop it here!" : "Drag & drop your ZIP file"}
              </div>
              <div style={{ fontSize: "13px", color: "#4a6280" }}>
                or click to browse — .zip files only, max 50MB
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

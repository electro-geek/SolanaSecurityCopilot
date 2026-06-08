"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useTheme, THEMES } from "@/context/ThemeContext";

export default function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch theme"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "6px 10px",
          borderRadius: "20px",
          background: "var(--panel)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: "13px", lineHeight: 1 }}>{active.icon}</span>
        <span style={{ display: "none" }} className="theme-name-label">
          {active.name}
        </span>
        <ChevronDown size={13} style={{ color: "var(--muted)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: "264px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "6px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
              zIndex: 200,
            }}
          >
            <div
              className="section-label"
              style={{ padding: "8px 10px 6px" }}
            >
              Theme
            </div>
            {THEMES.map((t) => {
              const isActive = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 10px",
                    borderRadius: "8px",
                    background: isActive ? "var(--primary-soft)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "var(--panel)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>{t.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--foreground)",
                      }}
                    >
                      {t.name}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "11px",
                        color: "var(--muted)",
                      }}
                    >
                      {t.description}
                    </span>
                  </span>
                  <span style={{ display: "flex", gap: "3px" }}>
                    {t.swatches.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          width: 11,
                          height: 11,
                          borderRadius: "3px",
                          background: c,
                          border: "1px solid var(--border)",
                        }}
                      />
                    ))}
                  </span>
                  {isActive && (
                    <Check size={14} style={{ color: "var(--primary)" }} />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

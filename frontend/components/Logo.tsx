"use client";

/* ============================================================
   SolShield AI — brand mark
   Concept (brandkit): security × developer-tool. A shield drawn
   on engineering graph paper — a "protected core" guarded by three
   angled scan-bars (a nod to Solana). Stroke uses currentColor so
   the mark inherits the active AlgoVizuals theme primary.
   ============================================================ */

interface MarkProps {
  size?: number;
  className?: string;
  title?: string;
}

export function LogoMark({ size = 28, className, title = "SolShield" }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
      style={{ display: "block", color: "var(--primary)" }}
    >
      {/* shield body */}
      <path
        d="M16 2.5 L27 6.5 V15.5 C27 22.4 22.3 27.3 16 29.5 C9.7 27.3 5 22.4 5 15.5 V6.5 Z"
        fill="var(--primary-soft)"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* internal graph-paper hatch */}
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.32">
        <line x1="5" y1="11" x2="27" y2="11" />
        <line x1="5" y1="16" x2="27" y2="16" />
        <line x1="5" y1="21" x2="27" y2="21" />
        <line x1="11" y1="5" x2="11" y2="26" />
        <line x1="16" y1="3.5" x2="16" y2="28" />
        <line x1="21" y1="5" x2="21" y2="26" />
      </g>
      {/* three angled scan-bars (Solana nod) */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="11" y1="12.5" x2="20" y2="11" />
        <line x1="11" y1="16" x2="20" y2="16" />
        <line x1="11" y1="19.5" x2="20" y2="21" />
      </g>
      {/* protected core node */}
      <circle cx="16" cy="16" r="2.4" fill="currentColor" stroke="var(--surface)" strokeWidth="1" />
    </svg>
  );
}

interface WordmarkProps {
  size?: number;
  fontSize?: number;
  showAI?: boolean;
  className?: string;
}

export default function Logo({
  size = 28,
  fontSize = 16,
  showAI = true,
  className,
}: WordmarkProps) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}
    >
      <LogoMark size={size} />
      <span
        className="font-heading"
        style={{
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "var(--foreground)",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        SolShield
        {showAI && (
          <span style={{ color: "var(--primary)", marginLeft: "5px" }}>AI</span>
        )}
      </span>
    </span>
  );
}

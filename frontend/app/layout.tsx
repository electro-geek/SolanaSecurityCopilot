import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "SolShield AI — Solana Smart Contract Security Auditor",
  description:
    "AI-powered Solana smart contract security auditing platform. Detect vulnerabilities, get AI explanations, and fix issues before deployment.",
  keywords: "Solana, smart contract, security, audit, vulnerability scanner, Anchor, Rust",
  openGraph: {
    title: "SolShield AI",
    description: "AI-Powered Solana Smart Contract Security Auditor",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full">
        <AuthProvider>
          <div className="bg-grid" aria-hidden="true" />
          <div className="glow-orb glow-orb-1" aria-hidden="true" />
          <div className="glow-orb glow-orb-2" aria-hidden="true" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

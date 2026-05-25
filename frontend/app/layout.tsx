import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solshield.mritunjay.live"),
  title: "SolShield AI — Solana Smart Contract Security Auditor",
  description:
    "AI-powered Solana smart contract security auditing platform. Detect vulnerabilities, get AI explanations, and fix issues before deployment.",
  keywords: "Solana, smart contract, security, audit, vulnerability scanner, Anchor, Rust",
  openGraph: {
    title: "SolShield AI — Solana Security Auditor",
    description: "AI-Powered Solana Smart Contract Security Auditor. Secure your contracts with SolShield.",
    url: "https://solshield.mritunjay.live",
    siteName: "SolShield AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SolShield AI — AI-Powered Solana Security Auditor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolShield AI — Solana Security Auditor",
    description: "AI-Powered Solana Smart Contract Security Auditor. Secure your contracts with SolShield.",
    images: ["/og-image.png"],
    creator: "@mritunjay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className={`${outfit.variable} min-h-full`}>
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

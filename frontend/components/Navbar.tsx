"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  LayoutDashboard,
  MessageSquare,
  Home,
  Zap,
  History,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: <Home size={18} /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/chat", label: "AI Chat", icon: <MessageSquare size={18} /> },
  { href: "/history", label: "History", icon: <History size={18} />, private: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(8, 12, 20, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99, 179, 255, 0.08)",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={18} color="white" />
        </div>
        <span
          style={{
            fontSize: "16px",
            fontWeight: 800,
            background: "linear-gradient(135deg, #63b3ff, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SolShield AI
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ display: "flex", gap: "4px" }}>
        {navItems.map((item) => {
          if (item.private && !user) return null;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s",
                background: isActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
                color: isActive ? "#63b3ff" : "#8aa3c8",
                border: isActive ? "1px solid rgba(59, 130, 246, 0.25)" : "1px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Auth & Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {loading ? (
          <div className="spinner" style={{ width: 20, height: 20 }} />
        ) : user ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" style={{ width: "100%", height: "100%" }} />
              ) : (
                <UserIcon size={16} color="#8aa3c8" />
              )}
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    width: "180px",
                    background: "rgba(15, 20, 30, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(99, 179, 255, 0.15)",
                    borderRadius: "10px",
                    padding: "8px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                  }}
                >
                  <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "4px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#e8f4fd" }}>{user.displayName}</div>
                    <div style={{ fontSize: "10px", color: "#4a6280", wordBreak: "break-all" }}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px",
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "12px",
                      cursor: "pointer",
                      borderRadius: "6px",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(99, 179, 255, 0.2)",
              borderRadius: "8px",
              color: "#63b3ff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99, 179, 255, 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          >
            <LogIn size={14} /> Sign In
          </button>
        )}
        <Link href="/dashboard" className="btn-primary" style={{ padding: "7px 16px", fontSize: "13px" }}>
          <Zap size={14} />
          New Scan
        </Link>
      </div>
    </motion.header>
  );
}

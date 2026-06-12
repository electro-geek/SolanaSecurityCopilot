"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
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
import Logo from "@/components/Logo";
import ThemePicker from "@/components/ThemePicker";

const navItems = [
  { href: "/", label: "Home", icon: <Home size={15} /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
  { href: "/chat", label: "AI Chat", icon: <MessageSquare size={15} /> },
  { href: "/history", label: "History", icon: <History size={15} />, private: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--surface)",
        borderBottom: "3px solid var(--border)",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <Logo size={26} fontSize={15} />
      </Link>

      {/* Nav links */}
      <nav style={{ display: "flex", gap: "2px", flex: 1, justifyContent: "center" }}>
        {navItems.map((item) => {
          if (item.private && !user) return null;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s",
                background: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "var(--primary-fg)" : "var(--muted)",
                border: isActive
                  ? "2px solid var(--border)"
                  : "2px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right cluster */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <ThemePicker />

        {loading ? (
          <div className="spinner-small" />
        ) : user ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                background: "var(--panel)",
                border: "2px solid var(--border)",
                borderRadius: "50%",
                width: 34,
                height: 34,
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <UserIcon size={16} style={{ color: "var(--muted)" }} />
              )}
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  style={{
                    position: "absolute",
                    top: "42px",
                    right: 0,
                    width: "210px",
                    background: "var(--surface)",
                    border: "3px solid var(--border)",
                    borderRadius: "14px",
                    padding: "8px",
                    boxShadow: "5px 5px 0px 0px var(--shadow-color)",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      borderBottom: "2px solid var(--border)",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "var(--foreground)",
                      }}
                    >
                      {user.displayName}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--muted)",
                        wordBreak: "break-all",
                      }}
                    >
                      {user.email}
                    </div>
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
                      color: "var(--sev-critical)",
                      fontSize: "12px",
                      cursor: "pointer",
                      borderRadius: "6px",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "color-mix(in srgb, var(--sev-critical) 12%, transparent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
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
            className="btn-ghost"
            style={{ padding: "7px 14px", fontSize: "13px" }}
          >
            <LogIn size={14} /> Sign In
          </button>
        )}

        <Link
          href="/dashboard"
          className="btn-primary"
          style={{ padding: "7px 16px", fontSize: "13px" }}
        >
          <Zap size={14} />
          New Scan
        </Link>
      </div>
    </motion.header>
  );
}

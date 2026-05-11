"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Send,
  Sparkles,
  User,
  Code2,
  Trash2,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import { streamChat } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What is missing signer validation in Solana?",
  "How do I properly validate PDAs in Anchor?",
  "Explain insecure CPI and how to prevent it",
  "What are common Solana DeFi attack vectors?",
  "How do I prevent arithmetic overflow in Rust?",
  "What is the difference between is_signer and is_writable?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "# Hello! I'm SolShield AI 🛡️\n\nI'm your Solana smart contract security assistant. I can help you understand:\n\n- **Vulnerability explanations** — Why is missing signer validation dangerous?\n- **Secure coding patterns** — How do I properly validate PDAs?\n- **Audit guidance** — What should I check before deploying?\n- **Attack vectors** — How do real exploits happen on Solana?\n\nAsk me anything about Solana security!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (question?: string) => {
    const text = question || input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      for await (const chunk of streamChat(text, context || undefined)) {
        assistantMsg.content += chunk;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsg.id ? { ...assistantMsg } : m))
        );
      }
    } catch (err: any) {
      assistantMsg.content = `Error: ${err.message || "Failed to get AI response. Make sure the backend is running and GEMINI_API_KEY is set."}`;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsg.id ? { ...assistantMsg } : m))
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared. Ask me anything about Solana smart contract security!",
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
      <Navbar />

      <main style={{ flex: 1, display: "flex", maxWidth: "1100px", margin: "0 auto", width: "100%", padding: "24px", gap: "20px" }}>
        {/* Sidebar */}
        <div style={{ width: "260px", flexShrink: 0 }}>
          {/* About */}
          <div className="glass-card" style={{ padding: "20px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>SolShield AI</div>
                <div style={{ fontSize: "11px", color: "#22c55e", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  Online
                </div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#8aa3c8", lineHeight: 1.6 }}>
              Expert AI assistant specialized in Solana smart contract security, Anchor framework, and Rust security patterns.
            </p>
          </div>

          {/* Suggested Questions */}
          <div className="glass-card" style={{ padding: "16px", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#4a6280", letterSpacing: "0.08em", marginBottom: "10px" }}>
              SUGGESTED QUESTIONS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isStreaming}
                  style={{
                    padding: "8px 10px",
                    background: "rgba(59,130,246,0.06)",
                    border: "1px solid rgba(59,130,246,0.12)",
                    borderRadius: "8px",
                    color: "#8aa3c8",
                    fontSize: "12px",
                    cursor: isStreaming ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.4,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = "rgba(59,130,246,0.12)";
                    (e.target as HTMLElement).style.color = "#63b3ff";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = "rgba(59,130,246,0.06)";
                    (e.target as HTMLElement).style.color = "#8aa3c8";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Code Context */}
          <div className="glass-card" style={{ padding: "16px" }}>
            <button
              onClick={() => setShowContext(!showContext)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                color: "#8aa3c8",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.08em",
                marginBottom: showContext ? "10px" : 0,
              }}
            >
              <Code2 size={13} color="#63b3ff" />
              ADD CODE CONTEXT
            </button>
            {showContext && (
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Paste Rust code here for context..."
                style={{
                  width: "100%",
                  height: "120px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(99,179,255,0.1)",
                  borderRadius: "8px",
                  color: "#e8f4fd",
                  fontSize: "11px",
                  fontFamily: "JetBrains Mono, monospace",
                  padding: "8px",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            )}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="glass-card">
          {/* Chat Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(99,179,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={16} color="#a78bfa" />
              <span style={{ fontSize: "14px", fontWeight: 700 }}>Security Chat</span>
            </div>
            <button
              onClick={clearChat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(99,179,255,0.08)",
                borderRadius: "8px",
                color: "#4a6280",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex",
                  gap: "12px",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "10px",
                    background: msg.role === "user"
                      ? "rgba(59, 130, 246, 0.2)"
                      : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    border: "1px solid rgba(99,179,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {msg.role === "user" ? (
                    <User size={16} color="#63b3ff" />
                  ) : (
                    <Shield size={16} color="white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "14px 18px",
                    borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))"
                      : "rgba(255,255,255,0.03)",
                    border: "1px solid",
                    borderColor: msg.role === "user"
                      ? "rgba(59,130,246,0.2)"
                      : "rgba(99,179,255,0.08)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <div className="markdown-content" style={{ fontSize: "13px" }}>
                      <ReactMarkdown>{msg.content || "▋"}</ReactMarkdown>
                    </div>
                  ) : (
                    <p style={{ fontSize: "14px", color: "#e8f4fd", lineHeight: 1.5, margin: 0 }}>
                      {msg.content}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid rgba(99,179,255,0.08)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-end",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(99,179,255,0.12)",
                borderRadius: "14px",
                transition: "border-color 0.2s",
              }}
              onFocus={() => {}}
            >
              <textarea
                ref={inputRef}
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Solana security... (Enter to send, Shift+Enter for new line)"
                disabled={isStreaming}
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#e8f4fd",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  resize: "none",
                  outline: "none",
                  lineHeight: 1.5,
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              />
              <button
                id="chat-send-button"
                onClick={() => sendMessage()}
                disabled={isStreaming || !input.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: isStreaming || !input.trim()
                    ? "rgba(59,130,246,0.1)"
                    : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  border: "none",
                  cursor: isStreaming || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                {isStreaming ? (
                  <Loader2 size={16} color="#63b3ff" style={{ animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <Send size={16} color={input.trim() ? "white" : "#4a6280"} />
                )}
              </button>
            </div>
            <p style={{ fontSize: "11px", color: "#4a6280", marginTop: "8px", textAlign: "center" }}>
              Powered by Gemini AI • Specialized in Solana & Anchor security
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

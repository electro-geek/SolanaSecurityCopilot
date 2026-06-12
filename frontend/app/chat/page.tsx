"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, User, Code2, Trash2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { LogoMark } from "@/components/Logo";
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
      assistantMsg.content = `Error: ${
        err.message ||
        "Failed to get AI response. Make sure the backend is running and GEMINI_API_KEY is set."
      }`;
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          display: "flex",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
          padding: "24px",
          gap: "20px",
        }}
      >
        {/* Sidebar */}
        <div style={{ width: "270px", flexShrink: 0 }}>
          <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div
                className="panel"
                style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <LogoMark size={22} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>SolShield AI</div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--sev-low)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--sev-low)",
                      display: "inline-block",
                    }}
                  />
                  Online
                </div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.6 }}>
              Expert AI assistant specialized in Solana smart contract security,
              Anchor framework, and Rust security patterns.
            </p>
          </div>

          <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
            <div className="section-label" style={{ marginBottom: "10px" }}>
              Suggested Questions
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isStreaming}
                  style={{
                    padding: "9px 11px",
                    background: "var(--panel)",
                    border: "2px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--muted)",
                    fontSize: "12px",
                    cursor: isStreaming ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    lineHeight: 1.4,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                    (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "16px" }}>
            <button
              onClick={() => setShowContext(!showContext)}
              className="section-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: showContext ? "10px" : 0,
              }}
            >
              <Code2 size={13} style={{ color: "var(--primary-text)" }} />
              Add Code Context
            </button>
            {showContext && (
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Paste Rust code here for context..."
                className="font-mono"
                style={{
                  width: "100%",
                  height: "120px",
                  background: "var(--panel)",
                  border: "2px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                  fontSize: "11px",
                  padding: "8px",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "2px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={16} style={{ color: "var(--secondary)" }} />
              <span style={{ fontSize: "14px", fontWeight: 700 }}>Security Chat</span>
            </div>
            <button onClick={clearChat} className="btn-ghost" style={{ padding: "6px 12px", fontSize: "12px" }}>
              <Trash2 size={12} />
              Clear
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
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
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: msg.role === "user" ? "var(--primary-soft)" : "var(--panel)",
                    border: "2px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {msg.role === "user" ? (
                    <User size={16} style={{ color: "var(--primary-text)" }} />
                  ) : (
                    <LogoMark size={18} />
                  )}
                </div>

                <div
                  style={{
                    maxWidth: "76%",
                    padding: "14px 18px",
                    borderRadius: msg.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
                    background: msg.role === "user" ? "var(--primary-soft)" : "var(--panel)",
                    border: "2px solid var(--border)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <div className="markdown-content" style={{ fontSize: "13px" }}>
                      <ReactMarkdown>{msg.content || "▋"}</ReactMarkdown>
                    </div>
                  ) : (
                    <p style={{ fontSize: "14px", color: "var(--foreground)", lineHeight: 1.5, margin: 0 }}>
                      {msg.content}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: "16px 20px", borderTop: "2px solid var(--border)", flexShrink: 0 }}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-end",
                padding: "10px 14px",
                background: "var(--panel)",
                border: "2px solid var(--border)",
                borderRadius: "8px",
              }}
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
                  color: "var(--foreground)",
                  fontSize: "14px",
                  fontFamily: "inherit",
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
                  borderRadius: "8px",
                  background: isStreaming || !input.trim() ? "var(--panel)" : "var(--primary)",
                  border: "2px solid var(--border)",
                  cursor: isStreaming || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                {isStreaming ? (
                  <Loader2 size={16} style={{ color: "var(--primary-text)", animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <Send size={16} color={input.trim() ? "var(--primary-fg)" : "var(--muted)"} />
                )}
              </button>
            </div>
            <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "8px", textAlign: "center" }}>
              Powered by Gemini AI · Specialized in Solana &amp; Anchor security
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

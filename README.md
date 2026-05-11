# AI Smart Contract Security Copilot — Complete Project Specification

Use this entire document as the master prompt/context for Antigravity.

---

# Project Name

## SolShield AI

AI-Powered Solana Smart Contract Security Copilot

---

# Project Overview

SolShield AI is an AI-powered smart contract security auditing platform focused on the Solana ecosystem.

The platform allows developers to upload Solana smart contract repositories or Anchor projects and automatically scans them for security vulnerabilities using static analysis and AI-based reasoning.

The system detects common Solana smart contract vulnerabilities, explains the security risk in plain English, suggests fixes, and provides code-level insights through an interactive dashboard.

The goal is to create a developer-first security assistant that simplifies smart contract auditing and reduces vulnerabilities before deployment.

---

# Core Problem

Solana smart contract development is complex and security-critical.

Many developers:

* do not fully understand Solana security patterns
* miss account validation checks
* misuse Program Derived Addresses (PDAs)
* perform unsafe Cross Program Invocations (CPIs)
* fail to validate signers properly

Traditional auditing:

* is expensive
* requires expert auditors
* takes time
* is inaccessible for hackathon builders and indie developers

SolShield AI solves this problem by combining:

* static analysis
* AST parsing
* AI vulnerability explanations
* automated remediation suggestions

into one easy-to-use platform.

---

# Main Features

## 1. Upload & Scan Solana Projects

Users can:

* upload ZIP files
* paste GitHub repository URLs
* upload Anchor projects

The backend automatically:

* extracts files
* identifies Rust smart contracts
* scans source code
* generates findings

---

# 2. Static Security Scanner

The scanner performs AST-based analysis on Rust smart contract code.

The system detects vulnerabilities such as:

* missing signer validation
* unchecked account ownership
* unsafe unwrap()
* insecure CPI usage
* PDA misuse
* arithmetic overflow risks
* missing authority checks

Each vulnerability includes:

* title
* severity
* affected file
* vulnerable line number
* explanation

---

# 3. AI Vulnerability Explainer

After the static scanner identifies issues, AI generates:

* human-readable explanations
* exploit scenarios
* attack vectors
* remediation suggestions
* secure code recommendations

The AI behaves like a smart contract security auditor.

---

# 4. Monaco Code Viewer

Frontend includes:

* Monaco editor
* syntax highlighting
* vulnerable line markers
* severity indicators
* inline security explanations

This creates an interactive developer experience.

---

# 5. AI Security Chat Assistant

Users can ask questions like:

* "Why is this vulnerability dangerous?"
* "How do I fix signer validation?"
* "Explain PDA security"

The AI assistant responds with Solana-specific security guidance.

---

# 6. GitHub Repository Scanner

Users can paste:

* public GitHub repository URLs

Backend automatically:

* clones repository
* scans project
* generates findings

---

# 7. Security Reports

Generate:

* JSON reports
* downloadable audit summaries

Each report includes:

* findings
* severity
* remediation suggestions
* timestamps

---

# Technical Architecture

```text
Frontend (Next.js)
    |
    | REST API
    |
Backend (FastAPI)
    |
    ├── Scanner Engine
    ├── AST Parser
    ├── AI Explainer
    ├── GitHub Cloner
    |
Database (PostgreSQL)
```

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* TailwindCSS
* shadcn/ui
* Monaco Editor
* Framer Motion
* Axios

---

## Backend

* FastAPI
* Python
* Tree-sitter
* GitPython
* OpenAI/Gemini APIs

---

## Scanner Engine

* Tree-sitter Rust parser
* Custom vulnerability detection rules
* AST traversal

---

# Frontend Requirements

# General UI Style

Create a:

* modern cybersecurity dashboard
* dark theme
* professional developer tooling interface

Design inspiration:

* Linear
* Cursor
* GitHub Security
* Vercel
* Datadog

Use:

* smooth animations
* responsive layouts
* glowing security indicators
* minimal but premium UI

---

# Required Pages

## 1. Landing Page

Sections:

* Hero section
* Features
* Security workflow
* Demo screenshots
* CTA buttons

Hero headline:
"AI-Powered Solana Smart Contract Security Auditor"

---

## 2. Dashboard Page

Features:

* upload project
* recent scans
* scan status
* findings summary

---

## 3. Scan Results Page

Must include:

* findings sidebar
* Monaco code editor
* vulnerability markers
* severity badges
* AI explanations

---

## 4. AI Security Chat Page

Chat interface similar to:

* ChatGPT
* Cursor AI

Features:

* streaming responses
* markdown rendering
* code snippets

---

# Backend Requirements

# Backend Structure

```text
backend/
│
├── main.py
├── routes/
├── scanner/
├── services/
├── utils/
├── models/
└── uploads/
```

---

# API Requirements

## POST /scan

Accepts:

* ZIP file upload

Flow:

1. save upload
2. extract project
3. scan Rust files
4. run vulnerability rules
5. AI explanation generation
6. return findings JSON

---

## POST /scan-github

Accepts:

* GitHub repository URL

Flow:

1. clone repository
2. scan project
3. generate findings
4. return results

---

## POST /ai-chat

Accepts:

* user question
* code context

Returns:

* AI-generated security explanation

---

# Scanner Engine Requirements

# Directory Structure

```text
scanner/
│
├── parser.py
├── analyzer.py
├── findings.py
└── rules/
```

---

# Parsing Logic

Use:

* Tree-sitter Rust parser

Parser should:

* parse Rust source code
* generate AST
* traverse syntax nodes
* identify security patterns

---

# Vulnerability Rules

Implement the following initial rules:

---

## Rule 1 — Missing Signer Validation

Detect cases where:

* sensitive operations occur
* but account.is_signer is not checked

Severity:
HIGH

---

## Rule 2 — Unsafe unwrap()

Detect:

* unwrap()
* expect()

Severity:
MEDIUM

Reason:
Can cause panic and denial of service.

---

## Rule 3 — Missing Account Ownership Validation

Detect:

* account usage without owner verification

Severity:
HIGH

---

## Rule 4 — Insecure Cross Program Invocation

Detect:

* invoke()
* invoke_signed()

without proper validation.

Severity:
HIGH

---

## Rule 5 — PDA Validation Issues

Detect:

* missing seeds validation
* incorrect PDA derivation patterns

Severity:
HIGH

---

# Findings JSON Format

```json
{
  "title": "Missing Signer Validation",
  "severity": "HIGH",
  "file": "lib.rs",
  "line": 42,
  "description": "Sensitive operation performed without signer validation."
}
```

---

# AI Logic

The AI assistant should behave like:

* a professional Solana smart contract auditor
* security researcher
* blockchain engineer

---

# AI Prompting Logic

When vulnerabilities are found, AI should explain:

1. what the issue is
2. why it is dangerous
3. possible exploit scenario
4. severity level
5. how to fix it
6. secure coding practices

Tone:

* professional
* technical
* educational

---

# Monaco Editor Requirements

The Monaco editor should:

* display uploaded Rust files
* highlight vulnerable lines
* support syntax highlighting
* show inline error decorations
* display severity colors

---

# UI Components Required

Use shadcn/ui components.

Required:

* cards
* dialogs
* badges
* sidebar
* tabs
* scroll areas
* tooltips
* accordions

---

# Animations

Use Framer Motion for:

* page transitions
* dashboard loading
* vulnerability cards
* AI streaming effects

Animations should feel:

* modern
* smooth
* premium

---

# Authentication

For hackathon MVP:
DO NOT implement:

* OAuth
* complex auth systems
* billing

Simple anonymous usage is enough.

---

# File Upload Requirements

Frontend must support:

* drag-and-drop upload
* ZIP validation
* upload progress indicators

---

# Error Handling

Handle:

* invalid ZIPs
* missing Rust files
* failed GitHub clones
* parser crashes
* AI API failures

Show clean user-friendly errors.

---

# Expected User Flow

## Flow 1 — Upload Scan

1. User uploads Anchor project ZIP
2. Backend extracts files
3. Scanner analyzes Rust contracts
4. Vulnerabilities detected
5. AI explanations generated
6. Frontend displays findings

---

## Flow 2 — GitHub Scan

1. User pastes GitHub repo URL
2. Backend clones repo
3. Scanner runs
4. Results displayed in dashboard

---

# Important Constraints

DO NOT:

* overcomplicate architecture
* add unnecessary blockchain transactions
* implement DAO features
* build tokenomics
* add payment systems

Focus only on:

* smart contract security
* developer tooling
* AI-assisted auditing

---

# Priority Order

## MUST HAVE

* upload scanning
* vulnerability detection
* AI explanations
* Monaco editor
* clean dashboard UI

---

## NICE TO HAVE

* GitHub scanning
* AI chat
* PDF reports

---

# Development Roadmap

# STEP 5 — Implement Rust Parser

Tasks:

* integrate Tree-sitter
* parse Rust files
* generate AST
* extract functions and calls

---

# STEP 6 — Implement Vulnerability Rules

Tasks:

* create rule engine
* add signer validation rule
* add unsafe unwrap rule
* add ownership validation rule
* generate findings JSON

---

# STEP 7 — Build Scan API

Tasks:

* create /scan endpoint
* support ZIP uploads
* extract files
* trigger scanner
* return results

---

# STEP 8 — Build GitHub Scanner

Tasks:

* create /scan-github endpoint
* clone repository
* scan automatically

---

# STEP 9 — Integrate AI Explanations

Tasks:

* connect Gemini/OpenAI
* generate vulnerability explanations
* generate remediation suggestions

---

# STEP 10 — Build Frontend Dashboard

Tasks:

* upload page
* findings cards
* scan history
* sidebar navigation

---

# STEP 11 — Add Monaco Code Editor

Tasks:

* render Rust files
* highlight vulnerable lines
* show inline markers

---

# STEP 12 — Build AI Chat Assistant

Tasks:

* create chat UI
* integrate streaming responses
* add code-aware prompts

---

# STEP 13 — Add Report Export

Tasks:

* export findings JSON
* downloadable reports

---

# STEP 14 — UI Polish

Tasks:

* add animations
* improve responsiveness
* optimize loading states
* improve developer UX

---

# Final Goal

Build a polished AI-powered Solana smart contract auditing platform that:

* feels production-ready
* demonstrates deep technical capability
* solves a real Web3 security problem
* impresses hackathon judges through:

  * technical depth
  * polished UI
  * strong live demo
  * real vulnerability detection

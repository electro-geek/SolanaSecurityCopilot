"""
services/ai_service.py — Gemini AI integration for vulnerability explanations and chat
"""

import os
import json
from typing import List, Optional, AsyncGenerator
import google.generativeai as genai
from dotenv import load_dotenv

# Absolute path to .env
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path, override=True)

SYSTEM_PROMPT = """You are SolShield AI — a world-class Solana smart contract security auditor and researcher.

Your expertise includes:
- Solana program security patterns and anti-patterns
- Anchor framework security best practices
- Common Solana vulnerabilities: signer validation, account ownership, PDA misuse, insecure CPIs
- Rust security patterns and memory safety
- DeFi protocol security and economic attacks
- Blockchain security research

When analyzing vulnerabilities, provide:
1. Clear technical explanation of the vulnerability
2. Why it is dangerous in a real Solana program context  
3. A realistic exploit scenario showing how an attacker would abuse it
4. Severity assessment with reasoning
5. Concrete remediation steps with secure code examples in Rust/Anchor

Tone: Professional, educational, technically precise. Use Solana/Anchor specific terminology.
Format responses with clear sections using markdown. Always include code examples when relevant."""


class AIService:
    def __init__(self):
        self.model = None
        self.enabled = False
        self._initialize()

    def _initialize(self):
        """Try to initialize the Gemini model."""
        # Force reload env
        load_dotenv(dotenv_path=env_path, override=True)
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        
        if api_key and not api_key.startswith("your_"):
            try:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel(
                    model_name="gemini-pro-latest",
                    system_instruction=SYSTEM_PROMPT,
                )
                self.enabled = True
                print(f"✅ [SolShield AI] Gemini Enabled (Key: {api_key[:8]}...)")
            except Exception as e:
                print(f"❌ [SolShield AI] Initialization Error: {e}")
                self.enabled = False
        else:
            print(f"⚠️ [SolShield AI] Gemini Disabled - No API key found at {env_path}")
            self.enabled = False

    def explain_vulnerability(self, finding: dict) -> dict:
        if not self.enabled:
            self._initialize()
        
        if not self.enabled:
            return self._fallback_explanation(finding)

        prompt = f"""Analyze this Solana smart contract vulnerability finding:

**Rule**: {finding.get('rule_id', 'N/A')}
**Title**: {finding.get('title', 'N/A')}
**Severity**: {finding.get('severity', 'N/A')}
**File**: {finding.get('file', 'N/A')}
**Line**: {finding.get('line', 'N/A')}
**Description**: {finding.get('description', 'N/A')}

Code Snippet:
```rust
{finding.get('code_snippet', 'No snippet available')}
```

Provide a detailed security analysis following this JSON structure:
{{
  "ai_explanation": "Detailed explanation of the vulnerability (2-3 paragraphs)",
  "exploit_scenario": "Step-by-step realistic attack scenario",
  "remediation": "Specific code-level fix with Rust/Anchor code example",
  "secure_pattern": "The secure coding pattern to use"
}}

Respond ONLY with valid JSON."""

        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if "```" in text:
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            text = text.strip()
            parsed = json.loads(text)
            return {
                **finding,
                "ai_explanation": parsed.get("ai_explanation", ""),
                "exploit_scenario": parsed.get("exploit_scenario", ""),
                "remediation": parsed.get("remediation", ""),
                "secure_pattern": parsed.get("secure_pattern", ""),
            }
        except Exception as e:
            error_msg = str(e)
            print(f"❌ [SolShield AI] AI Error: {error_msg}")
            return self._fallback_explanation(finding, error_msg)

    def chat(self, question: str, context: Optional[str] = None) -> str:
        if not self.enabled: self._initialize()
        if not self.enabled: return self._fallback_chat(question)
        try:
            context_part = f"\n\nCode Context:\n```rust\n{context}\n```" if context else ""
            response = self.model.generate_content(f"Question: {question}{context_part}")
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"

    async def stream_chat(self, question: str, context: Optional[str] = None) -> AsyncGenerator[str, None]:
        if not self.enabled: self._initialize()
        if not self.enabled:
            yield self._fallback_chat(question)
            return
        try:
            context_part = f"\n\nCode Context:\n```rust\n{context}\n```" if context else ""
            response = self.model.generate_content(f"Question: {question}{context_part}", stream=True)
            for chunk in response:
                if chunk.text: yield chunk.text
        except Exception as e:
            yield f"Error: {str(e)}"

    def _fallback_explanation(self, finding: dict, error_msg: str = "") -> dict:
        title = finding.get("title", "Unknown")
        severity = finding.get("severity", "MEDIUM")
        
        reason = f" Error: {error_msg}" if error_msg else ""
        
        return {
            **finding,
            "ai_explanation": (
                f"**{title}** — This is a {severity} severity vulnerability. "
                f"Ensure your GEMINI_API_KEY is correctly set and valid.{reason}"
            ),
            "exploit_scenario": "AI analysis is currently unavailable.",
            "remediation": "AI remediation is currently unavailable.",
        }

    def _fallback_chat(self, question: str) -> str:
        return f"AI chat is not available. Please set GEMINI_API_KEY in your .env file.\n\nQuestion: {question}"


# Singleton
ai_service = AIService()

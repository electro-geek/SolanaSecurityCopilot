"""
services/ai_service.py — Gemini AI integration for vulnerability explanations and chat
"""

import os
import re
import json
from typing import List, Optional, AsyncGenerator
import google.generativeai as genai
from dotenv import load_dotenv

# Absolute path to .env
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path, override=True)

# Safety settings — disable filters for security research/auditing
SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]


def _extract_json(text: str) -> dict:
    """
    Reliably extract a JSON object from a string that may contain
    extra markdown formatting or prose.
    """
    # Strip markdown code fences
    if "```json" in text:
        text = text.split("```json", 1)[1].split("```", 1)[0]
    elif "```" in text:
        text = text.split("```", 1)[1].split("```", 1)[0]

    text = text.strip()

    # Find the first { ... } block (handles trailing text)
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group(0))

    return json.loads(text)


class AIService:
    def __init__(self):
        self.model = None
        self.enabled = False
        self._initialize()

    def _initialize(self):
        """Try to initialize the Gemini model."""
        load_dotenv(dotenv_path=env_path, override=True)
        api_key = os.getenv("GEMINI_API_KEY", "").strip()

        if api_key and not api_key.startswith("your_"):
            try:
                genai.configure(api_key=api_key)
                # gemini-2.5-flash confirmed working with this API key
                self.model = genai.GenerativeModel(
                    model_name="gemini-2.5-flash",
                    safety_settings=SAFETY_SETTINGS,
                )
                self.enabled = True
                print(f"✅ [SolShield AI] Gemini Enabled — gemini-2.5-flash")
            except Exception as e:
                print(f"❌ [SolShield AI] Initialization Error: {e}")
                self.enabled = False
        else:
            print(f"⚠️ [SolShield AI] Gemini Disabled — no API key at {env_path}")
            self.enabled = False

    def explain_vulnerability(self, finding: dict) -> dict:
        """On-demand AI analysis for a single vulnerability finding."""
        if not self.enabled:
            self._initialize()
        if not self.enabled:
            return self._fallback_explanation(finding)

        # Use plain text section markers — completely avoids JSON parsing issues
        prompt = (
            "You are a Solana smart contract security expert.\n"
            "Analyze this vulnerability. You MUST include ALL FOUR sections below.\n"
            "Keep each section concise (3-5 sentences max). Do NOT skip any section.\n\n"
            f"RULE: {finding.get('rule_id', 'N/A')}\n"
            f"TITLE: {finding.get('title', 'N/A')}\n"
            f"SEVERITY: {finding.get('severity', 'N/A')}\n"
            f"DESCRIPTION: {finding.get('description', 'N/A')}\n"
            f"CODE:\n{finding.get('code_snippet', 'N/A')}\n\n"
            "Respond using EXACTLY this format with all four markers:\n\n"
            "###EXPLANATION###\n"
            "Explain the vulnerability technically.\n\n"
            "###EXPLOIT###\n"
            "Describe a realistic exploit scenario.\n\n"
            "###REMEDIATION###\n"
            "Show the fix with a brief Rust/Anchor code example.\n\n"
            "###PATTERN###\n"
            "State the secure coding pattern to follow."
        )

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.0,
                    max_output_tokens=8192,
                ),
            )

            raw = getattr(response, "text", "") or ""
            if not raw.strip():
                return self._fallback_explanation(finding, "Empty response from AI")

            print(f"[SolShield AI] Response length: {len(raw)} chars")

            # Parse sections by splitting on markers
            def extract_section(text: str, start_marker: str, end_marker: str) -> str:
                if start_marker not in text:
                    return ""
                part = text.split(start_marker, 1)[1]
                if end_marker and end_marker in part:
                    part = part.split(end_marker, 1)[0]
                return part.strip()

            ai_explanation   = extract_section(raw, "###EXPLANATION###", "###EXPLOIT###")
            exploit_scenario = extract_section(raw, "###EXPLOIT###",     "###REMEDIATION###")
            remediation      = extract_section(raw, "###REMEDIATION###", "###PATTERN###")
            secure_pattern   = extract_section(raw, "###PATTERN###",     "")

            print(f"[SolShield AI] Sections found: explanation={bool(ai_explanation)}, "
                  f"exploit={bool(exploit_scenario)}, remediation={bool(remediation)}, "
                  f"pattern={bool(secure_pattern)}")

            return {
                **finding,
                "ai_explanation":   ai_explanation   or "Analysis unavailable",
                "exploit_scenario": exploit_scenario or "Scenario unavailable",
                "remediation":      remediation      or "Remediation unavailable",
                "secure_pattern":   secure_pattern   or "Pattern unavailable",
            }
        except Exception as e:
            print(f"❌ [SolShield AI] AI Error: {e}")
            return self._fallback_explanation(finding, str(e))

    def chat(self, question: str, context: Optional[str] = None) -> str:
        if not self.enabled:
            self._initialize()
        if not self.enabled:
            return self._fallback_chat(question)
        try:
            context_part = f"\n\nCode Context:\n```rust\n{context}\n```" if context else ""
            response = self.model.generate_content(f"Question: {question}{context_part}")
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"

    async def stream_chat(self, question: str, context: Optional[str] = None) -> AsyncGenerator[str, None]:
        if not self.enabled:
            self._initialize()
        if not self.enabled:
            yield self._fallback_chat(question)
            return
        try:
            context_part = f"\n\nCode Context:\n```rust\n{context}\n```" if context else ""
            response = self.model.generate_content(
                f"Question: {question}{context_part}", stream=True
            )
            for chunk in response:
                if chunk.text:
                    yield chunk.text
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
        return (
            "AI chat is not available. Please set GEMINI_API_KEY in your .env file.\n\n"
            f"Question: {question}"
        )


# Singleton
ai_service = AIService()

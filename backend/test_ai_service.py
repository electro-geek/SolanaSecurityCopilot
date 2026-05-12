"""
Quick test to verify explain_vulnerability works end-to-end
with the new plain-text section markers approach.
"""
from services.ai_service import ai_service

test_finding = {
    "rule_id": "SOL-004",
    "title": "Insecure Cross Program Invocation (CPI)",
    "severity": "HIGH",
    "file": "programs/vulnerable_vault/src/staking.rs",
    "line": 77,
    "description": "invoke() or invoke_signed() is called without validating the target program ID.",
    "code_snippet": "invoke_signed(&instruction, &account_infos, &[&signer_seeds])?;"
}

print(f"AI Service enabled: {ai_service.enabled}")
print(f"Model: {ai_service.model}")
print()
print("Calling explain_vulnerability()...")
result = ai_service.explain_vulnerability(test_finding)
print()
print("=== RESULT ===")
print(f"ai_explanation present: {bool(result.get('ai_explanation'))}")
print(f"exploit_scenario present: {bool(result.get('exploit_scenario'))}")
print(f"remediation present: {bool(result.get('remediation'))}")
print(f"secure_pattern present: {bool(result.get('secure_pattern'))}")
print()

# Check if it's a fallback or real result
if "Ensure your GEMINI_API_KEY" in result.get("ai_explanation", ""):
    print("❌ FAILED — got fallback response (AI call failed)")
    print(f"ai_explanation: {result['ai_explanation'][:300]}")
else:
    print("✅ SUCCESS — got real AI response!")
    print(f"ai_explanation (first 300 chars): {result['ai_explanation'][:300]}")
    print(f"exploit_scenario (first 200 chars): {result['exploit_scenario'][:200]}")

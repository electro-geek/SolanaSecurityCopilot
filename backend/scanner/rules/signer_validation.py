"""
Rule 1 — Missing Signer Validation
Detects when sensitive operations happen without is_signer checks.
"""

import re
from typing import List
from scanner.findings import Finding
from .base_rule import BaseRule


class SignerValidationRule(BaseRule):
    rule_id = "SOL-001"
    title = "Missing Signer Validation"
    severity = "HIGH"
    description = (
        "Sensitive operations are performed without verifying account.is_signer. "
        "An attacker can pass any account as a signer without the runtime enforcing it."
    )

    # Patterns that indicate a sensitive operation
    SENSITIVE_OPS = re.compile(
        r"transfer\s*\(|lamports\s*\*?=|invoke\s*\(|invoke_signed\s*\(|"
        r"close_account|burn\s*\(|mint_to\s*\(",
        re.MULTILINE
    )
    SIGNER_CHECK = re.compile(r"is_signer", re.MULTILINE)

    def check(self, parsed: dict) -> List[Finding]:
        findings = []
        content = "\n".join(parsed["lines"])
        file_path = parsed["file"]

        # Only flag if there are sensitive ops but no signer checks in the file
        if self.SENSITIVE_OPS.search(content) and not self.SIGNER_CHECK.search(content):
            # Find the first sensitive op line
            for match in self.SENSITIVE_OPS.finditer(content):
                line_num = content[: match.start()].count("\n") + 1
                snippet = self._get_snippet(parsed["lines"], line_num)
                findings.append(Finding(
                    title=self.title,
                    severity=self.severity,
                    file=file_path,
                    line=line_num,
                    description=self.description,
                    rule_id=self.rule_id,
                    code_snippet=snippet,
                ))
                # Report first occurrence only to reduce noise
                break

        return findings

    def _get_snippet(self, lines, line_num, ctx=3):
        start = max(0, line_num - ctx - 1)
        end = min(len(lines), line_num + ctx)
        parts = []
        for i, ln in enumerate(lines[start:end], start=start + 1):
            prefix = ">>>" if i == line_num else "   "
            parts.append(f"{i:4d} | {prefix} {ln}")
        return "\n".join(parts)

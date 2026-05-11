"""
Rule 3 — Missing Account Ownership Validation
Detects account usage without verifying the account owner.
"""

import re
from typing import List
from scanner.findings import Finding
from .base_rule import BaseRule


class AccountOwnershipRule(BaseRule):
    rule_id = "SOL-003"
    title = "Missing Account Ownership Validation"
    severity = "HIGH"
    description = (
        "Accounts are used without verifying their owner program. "
        "An attacker can substitute a malicious account owned by a different program, "
        "leading to arbitrary data injection or fund theft."
    )

    ACCOUNT_USAGE = re.compile(
        r"Account\s*<|AccountInfo\s*<|\.data\.borrow|\.lamports\(\)",
        re.MULTILINE
    )
    OWNER_CHECK = re.compile(
        r"\.owner\b|check_owner|owner\s*==|assert_owner|token::ID",
        re.MULTILINE
    )

    def check(self, parsed: dict) -> List[Finding]:
        findings = []
        content = "\n".join(parsed["lines"])
        file_path = parsed["file"]

        if self.ACCOUNT_USAGE.search(content) and not self.OWNER_CHECK.search(content):
            for match in self.ACCOUNT_USAGE.finditer(content):
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
                break  # Report first occurrence

        return findings

    def _get_snippet(self, lines, line_num, ctx=3):
        start = max(0, line_num - ctx - 1)
        end = min(len(lines), line_num + ctx)
        parts = []
        for i, ln in enumerate(lines[start:end], start=start + 1):
            prefix = ">>>" if i == line_num else "   "
            parts.append(f"{i:4d} | {prefix} {ln}")
        return "\n".join(parts)

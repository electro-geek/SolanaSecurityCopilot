"""
Rule 7 — Missing Authority Checks
Detects admin/privileged operations without authority verification.
"""

import re
from typing import List
from scanner.findings import Finding
from .base_rule import BaseRule


class MissingAuthorityRule(BaseRule):
    rule_id = "SOL-007"
    title = "Missing Authority / Admin Check"
    severity = "HIGH"
    description = (
        "Privileged operations (admin functions, upgrades, freeze/thaw) are performed "
        "without verifying the caller is the designated authority. "
        "Any user could execute restricted operations."
    )

    PRIVILEGED_OPS = re.compile(
        r"freeze_account|thaw_account|set_authority|upgrade|"
        r"admin_|initialize_mint|close_account|revoke\s*\(",
        re.MULTILINE | re.IGNORECASE
    )
    AUTHORITY_CHECK = re.compile(
        r"authority\s*==|\.authority\b|check_authority|"
        r"assert_keys_eq.*authority|require_keys_eq",
        re.MULTILINE
    )

    def check(self, parsed: dict) -> List[Finding]:
        findings = []
        content = "\n".join(parsed["lines"])
        file_path = parsed["file"]

        for match in self.PRIVILEGED_OPS.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            ctx_start = max(0, match.start() - 400)
            ctx_end = min(len(content), match.end() + 400)
            context = content[ctx_start:ctx_end]

            if not self.AUTHORITY_CHECK.search(context):
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

        return findings

    def _get_snippet(self, lines, line_num, ctx=3):
        start = max(0, line_num - ctx - 1)
        end = min(len(lines), line_num + ctx)
        parts = []
        for i, ln in enumerate(lines[start:end], start=start + 1):
            prefix = ">>>" if i == line_num else "   "
            parts.append(f"{i:4d} | {prefix} {ln}")
        return "\n".join(parts)

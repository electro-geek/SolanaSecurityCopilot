"""
Rule 6 — Arithmetic Overflow Risk
Detects arithmetic operations that don't use checked variants.
"""

import re
from typing import List
from scanner.findings import Finding
from .base_rule import BaseRule


class ArithmeticOverflowRule(BaseRule):
    rule_id = "SOL-006"
    title = "Arithmetic Overflow / Underflow Risk"
    severity = "MEDIUM"
    description = (
        "Arithmetic operations (+, -, *, /) are performed without using "
        "checked_add(), checked_sub(), checked_mul(), or checked_div(). "
        "This can cause integer overflow/underflow, leading to unexpected token amounts or logic errors."
    )

    # Detect raw arithmetic on what appears to be numeric variables
    RAW_ARITHMETIC = re.compile(
        r"(?:amount|balance|lamports|tokens?|supply|total|count|qty|quantity)"
        r"\s*[+\-\*]\s*(?:\w+)",
        re.MULTILINE | re.IGNORECASE
    )
    CHECKED_OPS = re.compile(
        r"\.checked_add\(|\.checked_sub\(|\.checked_mul\(|\.checked_div\("
        r"|\.saturating_add\(|\.saturating_sub\(",
        re.MULTILINE
    )

    def check(self, parsed: dict) -> List[Finding]:
        findings = []
        content = "\n".join(parsed["lines"])
        file_path = parsed["file"]

        for match in self.RAW_ARITHMETIC.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            # Check surrounding 200 chars for safe arithmetic
            ctx_start = max(0, match.start() - 100)
            ctx_end = min(len(content), match.end() + 100)
            context = content[ctx_start:ctx_end]

            if not self.CHECKED_OPS.search(context):
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

"""
Rule 2 — Unsafe unwrap() / expect()
Detects panicking calls that can cause denial-of-service.
"""

import re
from typing import List
from scanner.findings import Finding
from .base_rule import BaseRule


class UnsafeUnwrapRule(BaseRule):
    rule_id = "SOL-002"
    title = "Unsafe unwrap() / expect() Usage"
    severity = "MEDIUM"
    description = (
        "Usage of .unwrap() or .expect() can cause a program panic and denial-of-service "
        "when the value is None or Err. Use proper error propagation with ? or match instead."
    )

    UNWRAP_PATTERN = re.compile(
        r"\.unwrap\(\)|\.expect\([^\)]*\)",
        re.MULTILINE
    )

    def check(self, parsed: dict) -> List[Finding]:
        findings = []
        content = "\n".join(parsed["lines"])
        file_path = parsed["file"]

        for match in self.UNWRAP_PATTERN.finditer(content):
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

        return findings

    def _get_snippet(self, lines, line_num, ctx=3):
        start = max(0, line_num - ctx - 1)
        end = min(len(lines), line_num + ctx)
        parts = []
        for i, ln in enumerate(lines[start:end], start=start + 1):
            prefix = ">>>" if i == line_num else "   "
            parts.append(f"{i:4d} | {prefix} {ln}")
        return "\n".join(parts)

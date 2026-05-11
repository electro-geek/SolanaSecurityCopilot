"""
Rule 5 — PDA Validation Issues
Detects missing seeds validation or incorrect PDA derivation patterns.
"""

import re
from typing import List
from scanner.findings import Finding
from .base_rule import BaseRule


class PDAValidationRule(BaseRule):
    rule_id = "SOL-005"
    title = "PDA Validation Issues"
    severity = "HIGH"
    description = (
        "Program Derived Address (PDA) is used without proper seeds validation or bump verification. "
        "This can allow attackers to substitute arbitrary PDAs and manipulate program state."
    )

    PDA_DERIVATION = re.compile(
        r"find_program_address\s*\(|create_program_address\s*\(",
        re.MULTILINE
    )
    SEEDS_VALIDATION = re.compile(
        r"seeds\s*=\s*\[|bump\s*=\s*|canonical_bump|assert_keys_eq",
        re.MULTILINE
    )

    def check(self, parsed: dict) -> List[Finding]:
        findings = []
        content = "\n".join(parsed["lines"])
        file_path = parsed["file"]

        for match in self.PDA_DERIVATION.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            # Look for seeds validation in surrounding context
            ctx_start = max(0, match.start() - 300)
            ctx_end = min(len(content), match.end() + 300)
            context = content[ctx_start:ctx_end]

            if not self.SEEDS_VALIDATION.search(context):
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

"""
Rule 4 — Insecure Cross Program Invocation (CPI)
Detects invoke() or invoke_signed() without proper validation.
"""

import re
from typing import List
from scanner.findings import Finding
from .base_rule import BaseRule


class InsecureCPIRule(BaseRule):
    rule_id = "SOL-004"
    title = "Insecure Cross Program Invocation (CPI)"
    severity = "HIGH"
    description = (
        "invoke() or invoke_signed() is called without validating the target program ID. "
        "An attacker can redirect the CPI to a malicious program, "
        "bypassing expected security controls."
    )

    INVOKE_PATTERN = re.compile(
        r"\binvoke\s*\(|\binvoke_signed\s*\(",
        re.MULTILINE
    )
    PROGRAM_ID_CHECK = re.compile(
        r"program_id\s*==|assert_keys_eq|check_program_account|token::ID|"
        r"system_program::ID|spl_token::id\(\)",
        re.MULTILINE
    )

    def check(self, parsed: dict) -> List[Finding]:
        findings = []
        content = "\n".join(parsed["lines"])
        file_path = parsed["file"]

        for match in self.INVOKE_PATTERN.finditer(content):
            line_num = content[: match.start()].count("\n") + 1

            # Check if there's a program ID validation near the call (±10 lines)
            start_char = max(0, match.start() - 500)
            end_char = min(len(content), match.end() + 500)
            context_window = content[start_char:end_char]

            if not self.PROGRAM_ID_CHECK.search(context_window):
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

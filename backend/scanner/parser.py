"""
parser.py — Rust source code parser using regex-based AST analysis
Uses regex patterns to extract security-relevant code constructs from Rust files.
(Tree-sitter bindings for Rust require native compilation; regex-based parsing
 is used here for portability and hackathon speed.)
"""

import re
from typing import List, Dict, Any, Optional
from pathlib import Path


class RustParser:
    """Parse Rust source files and extract security-relevant constructs."""

    # Patterns for code analysis
    PATTERNS = {
        "function_def": re.compile(
            r"(?:pub\s+)?(?:async\s+)?fn\s+(\w+)\s*\(([^)]*)\)",
            re.MULTILINE
        ),
        "is_signer_check": re.compile(
            r"is_signer",
            re.MULTILINE
        ),
        "owner_check": re.compile(
            r"\.owner\b|check_owner|verify_owner|owner_key",
            re.MULTILINE
        ),
        "unwrap_call": re.compile(
            r"\.unwrap\(\)|\.expect\([^)]*\)",
            re.MULTILINE
        ),
        "invoke_call": re.compile(
            r"\binvoke\s*\(|\binvoke_signed\s*\(",
            re.MULTILINE
        ),
        "pda_find": re.compile(
            r"find_program_address\s*\(|create_program_address\s*\(",
            re.MULTILINE
        ),
        "arithmetic": re.compile(
            r"\.checked_add\(|\.checked_sub\(|\.checked_mul\(|\.checked_div\(",
            re.MULTILINE
        ),
        "unchecked_arithmetic": re.compile(
            r"(?<!\.)(?:[\w\s]+)\s*[+\-\*]\s*(?:[\w\s]+)(?!\s*\.checked)",
            re.MULTILINE
        ),
        "authority_check": re.compile(
            r"\.authority\b|authority_key|check_authority|assert_keys_eq",
            re.MULTILINE
        ),
        "transfer_lamports": re.compile(
            r"transfer\s*\(|lamports\s*\(",
            re.MULTILINE
        ),
        "deserialize": re.compile(
            r"try_from_slice\s*\(|deserialize\s*\(",
            re.MULTILINE
        ),
        "seeds_check": re.compile(
            r"seeds\s*=\s*\[|bump\s*=",
            re.MULTILINE
        ),
    }

    def parse_file(self, file_path: str, content: str) -> Dict[str, Any]:
        """
        Parse a Rust file and return structured information about code constructs.
        """
        lines = content.split("\n")
        result = {
            "file": file_path,
            "lines": lines,
            "line_count": len(lines),
            "constructs": [],
        }

        # Extract function definitions
        for match in self.PATTERNS["function_def"].finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            result["constructs"].append({
                "type": "function",
                "name": match.group(1),
                "params": match.group(2),
                "line": line_num,
            })

        # Build line-level feature map
        features_by_line: Dict[int, List[str]] = {}
        for feat_name, pattern in self.PATTERNS.items():
            if feat_name == "function_def":
                continue
            for match in pattern.finditer(content):
                line_num = content[: match.start()].count("\n") + 1
                if line_num not in features_by_line:
                    features_by_line[line_num] = []
                features_by_line[line_num].append(feat_name)

        result["features_by_line"] = features_by_line

        # Per-file flags
        result["has_signer_check"] = bool(self.PATTERNS["is_signer_check"].search(content))
        result["has_owner_check"] = bool(self.PATTERNS["owner_check"].search(content))
        result["has_invoke"] = bool(self.PATTERNS["invoke_call"].search(content))
        result["has_pda"] = bool(self.PATTERNS["pda_find"].search(content))
        result["has_seeds"] = bool(self.PATTERNS["seeds_check"].search(content))

        return result

    def get_code_snippet(self, lines: List[str], line_num: int, context: int = 3) -> str:
        """Get a code snippet around a given line number with context."""
        start = max(0, line_num - context - 1)
        end = min(len(lines), line_num + context)
        snippet_lines = []
        for i, line in enumerate(lines[start:end], start=start + 1):
            prefix = ">>> " if i == line_num else "    "
            snippet_lines.append(f"{i:4d} | {prefix}{line}")
        return "\n".join(snippet_lines)

    def find_rust_files(self, directory: str) -> List[str]:
        """Recursively find all .rs files in a directory."""
        rust_files = []
        base = Path(directory)
        for path in base.rglob("*.rs"):
            # Skip target directory (compiled artifacts)
            if "target" not in path.parts:
                rust_files.append(str(path))
        return rust_files

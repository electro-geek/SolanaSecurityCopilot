"""
analyzer.py — Main vulnerability analysis engine
Orchestrates parsing + rule checking across all Rust files.
"""

import time
import uuid
import os
from typing import List
from pathlib import Path

from scanner.parser import RustParser
from scanner.findings import Finding, ScanResult
from scanner.rules import ALL_RULES


class VulnerabilityAnalyzer:
    """Runs all vulnerability rules against parsed Rust files."""

    def __init__(self):
        self.parser = RustParser()
        self.rules = ALL_RULES

    def analyze_directory(self, directory: str, source: str = "upload", source_name: str = "") -> ScanResult:
        """
        Analyze all Rust files in a directory.
        Returns a ScanResult with all findings.
        """
        scan_id = str(uuid.uuid4())[:8]
        start_time = time.time()

        rust_files = self.parser.find_rust_files(directory)
        all_findings: List[Finding] = []
        total_files = 0

        for file_path in rust_files:
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # Make file path relative to the scanned directory
                rel_path = os.path.relpath(file_path, directory)
                parsed = self.parser.parse_file(rel_path, content)
                total_files += 1

                # Run all rules
                for rule in self.rules:
                    try:
                        findings = rule.check(parsed)
                        all_findings.extend(findings)
                    except Exception as e:
                        # Rule errors should not crash the scan
                        pass

            except Exception as e:
                pass

        elapsed_ms = int((time.time() - start_time) * 1000)

        return ScanResult(
            scan_id=scan_id,
            source=source,
            source_name=source_name or directory,
            findings=all_findings,
            total_files_scanned=total_files,
            rust_files_found=len(rust_files),
            scan_duration_ms=elapsed_ms,
        )

    def analyze_file(self, file_path: str, content: str) -> List[Finding]:
        """Analyze a single Rust file's content."""
        parsed = self.parser.parse_file(file_path, content)
        findings = []
        for rule in self.rules:
            try:
                findings.extend(rule.check(parsed))
            except Exception:
                pass
        return findings

"""
findings.py — Data models for vulnerability findings
"""

from dataclasses import dataclass, field, asdict
from typing import Optional, List
from enum import Enum


class Severity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


@dataclass
class Finding:
    title: str
    severity: str
    file: str
    line: int
    description: str
    rule_id: str
    code_snippet: Optional[str] = None
    ai_explanation: Optional[str] = None
    remediation: Optional[str] = None
    exploit_scenario: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ScanResult:
    scan_id: str
    source: str  # "upload" or "github"
    source_name: str
    findings: List[Finding] = field(default_factory=list)
    total_files_scanned: int = 0
    rust_files_found: int = 0
    scan_duration_ms: int = 0
    error: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "scan_id": self.scan_id,
            "source": self.source,
            "source_name": self.source_name,
            "findings": [f.to_dict() for f in self.findings],
            "total_files_scanned": self.total_files_scanned,
            "rust_files_found": self.rust_files_found,
            "scan_duration_ms": self.scan_duration_ms,
            "error": self.error,
            "summary": {
                "total": len(self.findings),
                "critical": sum(1 for f in self.findings if f.severity == "CRITICAL"),
                "high": sum(1 for f in self.findings if f.severity == "HIGH"),
                "medium": sum(1 for f in self.findings if f.severity == "MEDIUM"),
                "low": sum(1 for f in self.findings if f.severity == "LOW"),
            }
        }

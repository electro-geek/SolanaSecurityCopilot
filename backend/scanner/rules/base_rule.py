"""
base_rule.py — Abstract base class for vulnerability rules
"""

from abc import ABC, abstractmethod
from typing import List
from scanner.findings import Finding


class BaseRule(ABC):
    """Abstract base class all vulnerability rules must implement."""

    rule_id: str = ""
    title: str = ""
    severity: str = "MEDIUM"
    description: str = ""

    @abstractmethod
    def check(self, parsed: dict) -> List[Finding]:
        """
        Run the rule against a parsed Rust file.
        Returns a list of findings (may be empty).
        """
        ...

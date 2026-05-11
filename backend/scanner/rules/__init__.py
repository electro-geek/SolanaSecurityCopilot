"""
rules/__init__.py — Vulnerability rule registry
"""

from .signer_validation import SignerValidationRule
from .unsafe_unwrap import UnsafeUnwrapRule
from .account_ownership import AccountOwnershipRule
from .insecure_cpi import InsecureCPIRule
from .pda_validation import PDAValidationRule
from .arithmetic_overflow import ArithmeticOverflowRule
from .missing_authority import MissingAuthorityRule

ALL_RULES = [
    SignerValidationRule(),
    UnsafeUnwrapRule(),
    AccountOwnershipRule(),
    InsecureCPIRule(),
    PDAValidationRule(),
    ArithmeticOverflowRule(),
    MissingAuthorityRule(),
]

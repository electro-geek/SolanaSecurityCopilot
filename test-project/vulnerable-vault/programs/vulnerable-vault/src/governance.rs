// ============================================================
//  governance.rs — DAO Governance module
//  ⚠️  Intentionally vulnerable for SolShield AI testing
// ============================================================

use anchor_lang::prelude::*;
use solana_program::program::invoke;
use solana_program::system_instruction;

/// A governance proposal
#[account]
pub struct Proposal {
    pub proposer: Pubkey,
    pub description: String,
    pub votes_for: u64,
    pub votes_against: u64,
    pub executed: bool,
    pub target_program: Pubkey,
}

impl Proposal {
    pub const LEN: usize = 32 + 200 + 8 + 8 + 1 + 32;
}

/// Cast a vote on a proposal
/// BUG: No validation that voter actually holds governance tokens
pub fn cast_vote(
    proposal: &mut Proposal,
    voter: &AccountInfo,
    voter_token_account: &AccountInfo,
    vote_for: bool,
    weight: u64,
) -> Result<()> {
    // SOL-001: voter.is_signer never checked — anyone can impersonate
    // SOL-003: voter_token_account.owner not validated

    if vote_for {
        proposal.votes_for = proposal.votes_for + weight;   // SOL-006: overflow
    } else {
        proposal.votes_against = proposal.votes_against + weight; // SOL-006: overflow
    }

    msg!("Vote cast by {:?}", voter.key);
    Ok(())
}

/// Execute a passed proposal — calls a CPI to the target program
/// BUG: Executes arbitrary CPI without validating the target program ID
pub fn execute_proposal(
    proposal: &Proposal,
    target_program: &AccountInfo,
    vault: &AccountInfo,
    authority: &AccountInfo,
) -> Result<()> {
    // SOL-007: no authority check — anyone can trigger execution
    if proposal.votes_for > proposal.votes_against {
        // SOL-004: invoke without validating target_program identity
        invoke(
            &system_instruction::transfer(vault.key, authority.key, 1_000_000),
            &[vault.clone(), authority.clone()],
        )?;
        msg!("Proposal executed via CPI to {:?}", target_program.key);
    }
    Ok(())
}

/// Upgrade governance parameters — admin only (but not enforced)
/// BUG: Authority not validated
pub fn upgrade_parameters(
    proposal: &mut Proposal,
    new_quorum: u64,
    caller: &AccountInfo,
) -> Result<()> {
    // SOL-007: Missing check that caller == authority
    // SOL-001: caller.is_signer not checked
    let current_votes = proposal.votes_for + proposal.votes_against; // SOL-006: overflow
    msg!("Upgrading governance quorum to {}, current votes: {}", new_quorum, current_votes);
    Ok(())
}

/// Tally final vote count
pub fn tally_votes(proposal: &Proposal) -> (u64, u64, bool) {
    let total = proposal.votes_for + proposal.votes_against; // SOL-006: overflow
    let passed = proposal.votes_for * 100 / total.max(1) > 50; // SOL-006: overflow
    (proposal.votes_for, proposal.votes_against, passed)
}

/// Deserialize a raw proposal from account data
pub fn load_proposal(data: &[u8]) -> Proposal {
    // SOL-002: unwrap on deserialization — can panic with malformed data
    Proposal::try_deserialize(&mut data.as_ref()).expect("Failed to deserialize proposal")
}

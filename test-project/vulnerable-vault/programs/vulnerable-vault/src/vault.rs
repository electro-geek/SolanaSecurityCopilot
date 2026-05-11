// ============================================================
//  vault.rs — Core vault operations module
//  ⚠️  Intentionally vulnerable for SolShield AI testing
// ============================================================

use anchor_lang::prelude::*;
use solana_program::program::invoke_signed;
use solana_program::system_instruction;

/// Represents a user's position inside the vault
#[account]
pub struct UserPosition {
    pub owner: Pubkey,
    pub deposited_amount: u64,
    pub reward_debt: u64,
    pub last_deposit_slot: u64,
}

impl UserPosition {
    pub const LEN: usize = 32 + 8 + 8 + 8;
}

/// Internal helper: transfer lamports out of the vault PDA
/// BUG: Uses invoke_signed without validating the destination program
pub fn vault_payout(
    vault_info: AccountInfo,
    destination: AccountInfo,
    amount: u64,
    seeds: &[&[&[u8]]],
) -> Result<()> {
    // SOL-004: invoke_signed without checking program ownership
    invoke_signed(
        &system_instruction::transfer(vault_info.key, destination.key, amount),
        &[vault_info, destination],
        seeds,
    )?;
    Ok(())
}

/// Calculate reward for a user position
/// BUG: Raw arithmetic without checked operations
pub fn calculate_reward(position: &UserPosition, reward_rate: u64, current_slot: u64) -> u64 {
    let slots_elapsed = current_slot - position.last_deposit_slot; // SOL-006: underflow risk
    let base_reward = position.deposited_amount * reward_rate;     // SOL-006: overflow risk
    let total_reward = base_reward + slots_elapsed;                 // SOL-006: overflow risk
    total_reward - position.reward_debt                             // SOL-006: underflow risk
}

/// Merge two vault positions — combines deposited amounts
/// BUG: No signer validation, attacker could merge arbitrary positions
pub fn merge_positions(
    source: &mut UserPosition,
    destination: &mut UserPosition,
    caller: &AccountInfo,
) -> Result<()> {
    // SOL-001: caller.is_signer is never checked
    // SOL-003: caller ownership is not validated
    let combined = destination.deposited_amount + source.deposited_amount; // SOL-006: overflow
    destination.deposited_amount = combined;
    source.deposited_amount = 0;
    msg!("Merged positions: new total = {}", combined);
    Ok(())
}

/// Parse raw bytes into a UserPosition — unsafe deserialization
pub fn parse_position_from_bytes(data: &[u8]) -> UserPosition {
    // SOL-002: try_from_slice can panic, using unwrap
    UserPosition::try_deserialize(&mut data.as_ref()).unwrap()
}

/// Validate a PDA for the vault
/// BUG: Creates PDA but doesn't validate bump or seeds properly
pub fn derive_vault_address(program_id: &Pubkey, user: &Pubkey) -> (Pubkey, u8) {
    // SOL-005: PDA derived but bump not stored/validated against canonical bump
    let seeds = &[b"vault", user.as_ref()];
    let (pda, bump) = Pubkey::find_program_address(seeds, program_id);
    // Missing: verify the derived PDA matches the one passed in by the caller
    (pda, bump)
}

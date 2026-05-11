// ============================================================
//  staking.rs — Token Staking module
//  ⚠️  Intentionally vulnerable for SolShield AI testing
// ============================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use solana_program::program::invoke;
use solana_program::system_instruction;

/// Staking pool state
#[account]
pub struct StakingPool {
    pub admin: Pubkey,
    pub reward_token_mint: Pubkey,
    pub staked_total: u64,
    pub reward_rate: u64,
    pub last_update_slot: u64,
    pub accumulated_reward_per_token: u64,
}

impl StakingPool {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 8;
}

/// Staking receipt for an individual user
#[account]
pub struct StakeReceipt {
    pub staker: Pubkey,
    pub amount_staked: u64,
    pub reward_per_token_paid: u64,
    pub pending_rewards: u64,
    pub stake_timestamp: i64,
}

impl StakeReceipt {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 8;
}

/// Stake tokens into the pool
/// BUG: Missing signer validation for staker
pub fn stake_tokens(
    pool: &mut StakingPool,
    receipt: &mut StakeReceipt,
    staker: &AccountInfo,
    amount: u64,
) -> Result<()> {
    // SOL-001: staker.is_signer is NOT checked
    // SOL-003: staker account owner not validated

    // Update accumulated reward (unsafe arithmetic)
    let new_reward = pool.reward_rate * amount;                   // SOL-006: overflow
    pool.accumulated_reward_per_token = pool.accumulated_reward_per_token + new_reward; // SOL-006: overflow
    pool.staked_total = pool.staked_total + amount;               // SOL-006: overflow

    receipt.amount_staked = receipt.amount_staked + amount;       // SOL-006: overflow
    receipt.staker = *staker.key;

    msg!("Staked {} tokens for {:?}", amount, staker.key);
    Ok(())
}

/// Unstake tokens and claim rewards
/// BUG: Authority not verified, unsafe math, insecure CPI
pub fn unstake_tokens(
    pool: &mut StakingPool,
    receipt: &mut StakeReceipt,
    staker: &AccountInfo,
    pool_account: &AccountInfo,
    amount: u64,
) -> Result<()> {
    // SOL-007: no check that staker matches receipt.staker
    let rewards = receipt.amount_staked * pool.reward_rate;       // SOL-006: overflow
    let total_payout = amount + rewards;                          // SOL-006: overflow

    // SOL-004: invoke without verifying the program being called
    invoke(
        &system_instruction::transfer(pool_account.key, staker.key, total_payout),
        &[pool_account.clone(), staker.clone()],
    )?;

    pool.staked_total = pool.staked_total - amount;               // SOL-006: underflow
    receipt.amount_staked = receipt.amount_staked - amount;       // SOL-006: underflow

    msg!("Unstaked {} + {} rewards for {:?}", amount, rewards, staker.key);
    Ok(())
}

/// Admin: set reward rate
/// BUG: No admin authority verification
pub fn set_reward_rate(pool: &mut StakingPool, caller: &AccountInfo, new_rate: u64) -> Result<()> {
    // SOL-007: caller not validated against pool.admin
    // SOL-001: caller.is_signer not checked
    pool.reward_rate = new_rate;
    msg!("Reward rate set to {} by {:?}", new_rate, caller.key);
    Ok(())
}

/// Freeze staking pool — emergency measure
/// BUG: No authority enforcement, uses unsafe unwrap
pub fn freeze_account(pool: &mut StakingPool, freeze_authority: &AccountInfo) -> Result<()> {
    // SOL-007: freeze_account called without authority check
    let admin_str = pool.admin.to_string();
    // SOL-002: parse() can fail — using unwrap
    let _parsed: std::net::IpAddr = "127.0.0.1".parse().unwrap();
    msg!("Pool frozen by {:?}, admin is {}", freeze_authority.key, admin_str);
    Ok(())
}

/// Derive staking PDA for a user
/// BUG: PDA derived without validating against stored bump
pub fn get_staking_pda(program_id: &Pubkey, staker: &Pubkey, pool: &Pubkey) -> (Pubkey, u8) {
    // SOL-005: find_program_address used without storing/verifying canonical bump
    let seeds = &[b"stake", staker.as_ref(), pool.as_ref()];
    Pubkey::find_program_address(seeds, program_id)
    // BUG: caller doesn't verify the returned pda matches the account passed in
}

/// Load receipt from raw bytes
pub fn deserialize_receipt(data: &[u8]) -> StakeReceipt {
    // SOL-002: panics if data is malformed
    StakeReceipt::try_deserialize(&mut data.as_ref()).unwrap()
}

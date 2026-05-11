// ============================================================
//  lib.rs — Main entry point for the VulnerableVault program
//
//  ⚠️  THIS IS AN INTENTIONALLY VULNERABLE PROGRAM FOR TESTING
//      SolShield AI security scanner. DO NOT DEPLOY.
// ============================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use solana_program::program::invoke;
use solana_program::system_instruction;

mod vault;
mod governance;
mod staking;

use vault::*;
use governance::*;
use staking::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod vulnerable_vault {
    use super::*;

    /// Initialize the vault with a deposit limit
    pub fn initialize(ctx: Context<Initialize>, deposit_limit: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.deposit_limit = deposit_limit;
        vault.total_deposits = 0;
        vault.bump = *ctx.bumps.get("vault").unwrap(); // SOL-002: unsafe unwrap
        Ok(())
    }

    /// Deposit tokens into the vault
    /// BUG: No signer check on depositor
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        // SOL-006: unchecked arithmetic — could overflow
        vault.total_deposits = vault.total_deposits + amount;

        // Transfer tokens from user to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.depositor.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        msg!("Deposited {} tokens", amount);
        Ok(())
    }

    /// Withdraw tokens from the vault
    /// BUG: Does not verify the caller is the authority
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &ctx.accounts.vault;

        // SOL-001: no is_signer check — anyone can call this
        // SOL-007: no authority check
        let balance = vault.total_deposits - amount; // SOL-006: unchecked subtraction

        invoke(
            &system_instruction::transfer(
                ctx.accounts.vault_token_account.to_account_info().key,
                ctx.accounts.recipient.key,
                amount,
            ),
            &[
                ctx.accounts.vault_token_account.to_account_info(),
                ctx.accounts.recipient.to_account_info(),
            ],
        )?; // SOL-004: invoke without program ID check

        msg!("Withdrew {} lamports, remaining: {}", amount, balance);
        Ok(())
    }

    /// Emergency close — closes vault and returns funds
    /// BUG: No authority validation, anyone can close the vault
    pub fn emergency_close(ctx: Context<EmergencyClose>) -> Result<()> {
        // SOL-007: missing authority check — admin_close without verifying authority
        let total = ctx.accounts.vault.total_deposits;
        msg!("Emergency close: {} tokens will be returned", total);

        // SOL-002: unwrap on optional value
        let config = ctx.accounts.vault.config.as_ref().unwrap();
        msg!("Config: {:?}", config);
        Ok(())
    }
}

// ---- Account Structures ----

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + VaultState::LEN,
        // SOL-005: PDA without seeds validation
    )]
    pub vault: Account<'info, VaultState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, VaultState>,
    /// CHECK: not validated — SOL-003 missing owner check
    pub depositor: AccountInfo<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, VaultState>,
    /// CHECK: no validation whatsoever — SOL-003
    pub withdrawer: AccountInfo<'info>,
    /// CHECK: unsafe — not validated
    pub vault_token_account: AccountInfo<'info>,
    /// CHECK: recipient not checked
    pub recipient: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct EmergencyClose<'info> {
    #[account(mut, close = receiver)]
    pub vault: Account<'info, VaultState>,
    /// CHECK: anyone can be the receiver
    pub receiver: AccountInfo<'info>,
}

// ---- State ----

#[account]
pub struct VaultState {
    pub authority: Pubkey,
    pub deposit_limit: u64,
    pub total_deposits: u64,
    pub bump: u8,
    pub config: Option<VaultConfig>,
}

impl VaultState {
    pub const LEN: usize = 32 + 8 + 8 + 1 + 1 + 64;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct VaultConfig {
    pub fee_bps: u16,
    pub min_deposit: u64,
}

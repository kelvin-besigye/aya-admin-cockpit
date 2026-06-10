/**
 * 👑 AYABUS SYSTEM DICTIONARY (v3.0 Sovereign)
 * ------------------------------------------------------------------
 * Module: Reconciliation & Debt Clearinghouse
 * File: reconciliation.constants.js
 * * DESCRIPTION:
 * The immutable state machine for the cancellation lifecycle. 
 * Using Object.freeze() ensures these states cannot be mutated at runtime,
 * guaranteeing absolute strictness across the database and UI layers.
 */

// ============================================================================
// 1. TICKET CANCELLATION LIFECYCLE
// The exact journey a ticket takes from cancellation to final settlement.
// ============================================================================
export const REFUND_STATUS = Object.freeze({
    // Stage 1: Customer clicks cancel in app
    REQUESTED: 'CANCELLATION_REQUESTED',
    
    // Stage 2 & 3: L1 Admin runs math, sends to Approvals Firewall
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    
    // Stage 4: L9 Admin approves, waiting for Treasury Execution
    APPROVED_UNSETTLED: 'APPROVED_UNSETTLED',
    
    // Stage 5: Treasury execution complete (Operator debt logged, Customer paid)
    SETTLED: 'REFUND_SETTLED',
    
    // Failsafe: If L9 Admin rejects the refund request
    REJECTED: 'REFUND_REJECTED'
});

// ============================================================================
// 2. DOUBLE-ENTRY LEDGER TYPES
// Classifications for the receipts injected into the Treasury Module.
// ============================================================================
export const LEDGER_TYPES = Object.freeze({
    // The negative offset (debt) taken from the operator's total revenue
    CLAWBACK: 'CANCELLATION_CLAWBACK',
    
    // The positive compensation given to the operator for the empty seat
    COMPENSATION: 'PENALTY_COMPENSATION'
});

// ============================================================================
// 3. UI STATE MAPPER (Powers the Frontend CSS)
// This translates the raw database statuses into the beautiful, color-coded 
// badges you will see in the UI, tying directly to your common CSS variables.
// ============================================================================
export const REFUND_UI_MAP = Object.freeze({
    [REFUND_STATUS.REQUESTED]: {
        label: 'AWAITING TRIAGE',
        color: 'var(--text-main)',
        bg: 'var(--bg-input)',
        border: 'var(--border-subtle)'
    },
    [REFUND_STATUS.PENDING_APPROVAL]: {
        label: 'L9 APPROVAL PENDING',
        color: 'var(--status-warning)',
        bg: 'rgba(245, 158, 11, 0.1)', // Matches your standard warning background
        border: 'rgba(245, 158, 11, 0.3)'
    },
    [REFUND_STATUS.APPROVED_UNSETTLED]: {
        label: 'QUEUED FOR VAULT',
        color: 'var(--brand-primary)',
        bg: 'var(--brand-surface)',
        border: 'var(--brand-subtle)'
    },
    [REFUND_STATUS.SETTLED]: {
        label: 'DEBT SETTLED',
        color: 'var(--status-success)',
        bg: 'rgba(16, 185, 129, 0.1)', // Matches your standard success background
        border: 'rgba(16, 185, 129, 0.3)'
    },
    [REFUND_STATUS.REJECTED]: {
        label: 'REJECTED BY ADMIN',
        color: 'var(--status-danger)',
        bg: 'rgba(239, 68, 68, 0.1)', // Matches your standard danger background
        border: 'rgba(239, 68, 68, 0.3)'
    }
});
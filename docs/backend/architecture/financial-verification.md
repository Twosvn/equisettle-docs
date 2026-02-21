---
id: financial-verification
title: Financial System Verification
sidebar_position: 4
---

# Financial System Verification Report

**Date**: 2026-02-21
**Status**: 90% Ledger Compliant

## Executive Summary

The EQS Platform implements a hybrid pure ledger architecture. A thorough code audit verifies that **9 out of 10 payment paths** are fully ledger-compliant. Only Sage payment sync remains as a gap.

## Verified Payment Paths

### 1. Invoice Creation - PASS

**File**: `src/core-features/invoices/models/invoices.js` (post-save hook)

- Creates `invoice_charge` FinancialTransaction automatically
- Idempotency check prevents duplicates
- FinancialTransaction post-save triggers materializedBalance update

### 2. GoCardless Webhook Payments - PASS

**Files**: `webhookController.js`, `webhookTransactionService.js`

- Creates `payment` FinancialTransaction
- Also handles: refunds, chargebacks, payment reversals
- Uses MongoDB sessions for ACID isolation
- Updates materializedBalance from ledger

### 3. Bank Reconciliation - PASS

**File**: `src/core-features/reconciliation/controllers/confirm.controller.js`

- Single match, bulk match, and undo all create FinancialTransactions
- Uses BalanceService for balance computation
- Cascades to case balance

### 4. Manual Payments - PASS

**File**: `src/core-features/paymentArrangement/controllers/utils/paymentUtils.js`

- Direct invoice and payment plan payments create FinancialTransactions
- Idempotency via processorReference
- Cascades to case balance

### 5. Payment Plan Payments - PASS

Same as Manual Payments (shared paymentUtils.js)

### 6. Credit Notes / Refunds / Chargebacks - PASS

- Credit notes: `credit_note` FinancialTransaction
- Refunds: `refund` FinancialTransaction
- Chargebacks: `chargeback` FinancialTransaction

### 7. Xero Payment Sync - PASS

**File**: `src/integration-layer/xero/services/xeroPaymentSyncService.js`

- Creates FinancialTransactions via paymentUtils
- Uses `BalanceService.calculateInvoiceBalance()` for authoritative balance
- Updates materializedBalance from ledger

### 8. FreeAgent Payment Sync - PASS

**File**: `src/integration-layer/freeAgent/services/freeAgentPaymentSyncService.js`

- Creates FinancialTransactions via paymentUtils
- Uses `BalanceService.calculateInvoiceBalance()` for authoritative balance
- Updates materializedBalance from ledger

### 9. Sage Payment Sync - FAIL

**File**: `src/integration-layer/sage/controllers/get.controller.js`

- Uses legacy `Payment` model instead of FinancialTransaction
- Computes balance from `Payment.aggregate()` instead of BalanceService
- Does NOT update materializedBalance
- Does NOT cascade case balance
- **Fix Required**: Same pattern as Xero/FreeAgent

### 10. Case Balance Calculation - PASS

**File**: `src/core-features/csv-mapping/utils/caseOutstandingAmount.js`

- Tier 1: Payment plan balance from BalanceService
- Tier 2: Invoice ledger balance from BalanceService
- Tier 3: Legacy fallback (deprecated path)

## Architecture Invariants

| Invariant | Status |
|-----------|--------|
| All charges create FinancialTransaction | PASS (except Sage) |
| FinancialTransaction is immutable after creation | PASS |
| Balance always computed from ledger aggregation | PASS |
| materializedBalance auto-triggers on every transaction | PASS |
| Case balance cascades from invoice balances | PASS |
| Unique processorReference prevents duplicates | PASS |
| Drift detection catches inconsistencies | PASS |

## Remaining Work

1. **Sage Payment Sync** - Add FinancialTransaction creation + BalanceService usage
2. **GoCardless Token Refresh** - `createGoCardlessPaymentLinkWithType()` should use `ensureValidGoCardlessToken()`

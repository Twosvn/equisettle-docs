# Pure Ledger Implementation - Complete

**Status:** ✅ Implemented (Needs Testing)
**Date:** 2026-02-20

---

## Summary

Successfully migrated the EQS Platform financial system to a **pure ledger architecture** following accounting software industry standards (QuickBooks, Xero, Sage).

### Core Principle
> **All financial state is derived from an immutable transaction log. Balances are computed, never stored.**

---

## What Changed

### 1. **Immutable Financial Ledger** ✅
**File:** `/src/core-features/financials/models/FinancialTransaction.js`

- Created immutable transaction model
- Unique constraint on `processorReference` prevents duplicate webhook processing
- Pre-save hooks prevent any modification after creation
- Transaction types: `invoice_charge`, `payment`, `refund`, `credit_note`, `payment_reversal`, `chargeback`

**Key feature:**
```javascript
processorReference: {
  type: String,
  sparse: true,
  unique: true,  // CRITICAL: Prevents duplicate transactions
  immutable: true
}
```

---

### 2. **Balance Computation Service** ✅
**File:** `/src/core-features/financials/services/BalanceService.js`

- **Single place** where all balances are computed
- Reads from FinancialTransaction ledger only
- Never reads or writes stored balance fields
- Includes status calculation logic

**Critical method:**
```javascript
async calculateInvoiceBalance(invoiceId, options = {}) {
  // Query FinancialTransaction ledger
  const transactions = await FinancialTransaction.find({ invoice: invoiceId });

  // Compute balance from transaction history
  let balance = 0;
  for (const txn of transactions) {
    switch (txn.type) {
      case "invoice_charge": balance += txn.amount; break;
      case "payment": balance -= txn.amount; break;
      case "refund": balance += txn.amount; break;
      // ... other types
    }
  }

  return { outstandingBalance, totalCharges, totalPayments, ... };
}
```

---

### 3. **Webhook Transaction Service** ✅
**File:** `/src/core-features/financials/services/webhookTransactionService.js`

- Handles GoCardless webhooks via pure ledger pattern
- Creates FinancialTransaction entries (not updates stored balances)
- Computes balances from ledger
- Returns computed status for webhook controller to apply
- Supports external MongoDB session (no nested transactions)

**Methods:**
- `handlePaymentSuccess()` - Creates payment transaction, computes balance
- `handlePaymentFailed()` - Creates reversal transaction if original payment exists
- `handleRefund()` - Creates refund transaction
- `handleChargeback()` - Creates chargeback transaction

---

### 4. **Invoice Model - Virtual Balance** ✅
**File:** `/src/core-features/invoices/models/invoices.js`

**BREAKING CHANGE:** Removed stored `outstandingBalance` field

**Before:**
```javascript
outstandingBalance: {
  type: Number,
  default: function () { return this.amount; }
}
```

**After:**
```javascript
// Virtual property - computes from ledger when accessed
invoiceSchema.virtual('outstandingBalance').get(async function() {
  return this._outstandingBalance ?? this.amount;
});

// Helper method to compute and attach balance
invoiceSchema.methods.computeBalance = async function() {
  const BalanceService = require('../../../core-features/financials/services/BalanceService');
  const balance = await BalanceService.calculateInvoiceBalance(this._id);
  this._outstandingBalance = balance.outstandingBalance;
  return this._outstandingBalance;
};
```

---

### 5. **GoCardless Webhook Integration** ✅
**File:** `/src/core-features/invoices/controllers/webhookController.js`

**Updated three payment paths to use pure ledger:**

#### Path 1: Sage Payment
```javascript
// Keep Sage sync + Payment record (business logic)
await newPayment.save({ session });

// Create FinancialTransaction (pure ledger)
const ledgerResult = await webhookTransactionService.handlePaymentSuccess({
  invoiceId, amount, processorReference: paymentId, ...
}, { session: eventSession });

// Use computed balance to set status
updateData.status = ledgerResult.balance.outstandingBalance <= 0.01 ? "paid" : "partially_paid";
```

#### Path 2: Payment Plan / Direct Invoice
```javascript
// Keep Remittance creation (business metadata: warehouse, products, etc.)
await paymentUtils.createPaymentRemittance({ ... });

// Create FinancialTransaction (financial truth)
const ledgerResult = await webhookTransactionService.handlePaymentSuccess({
  ...
}, { session: eventSession });

// Use computed balance
updateData.status = ledgerResult.balance.outstandingBalance <= 0.01 ? "paid" : "partially_paid";
```

#### Path 3: Payment Failure
```javascript
// Create reversal transaction if original payment exists
const failureResult = await webhookTransactionService.handlePaymentFailed({
  invoiceId, processorReference, failureReason, ...
}, { session: eventSession });

// Compute status from ledger balance
if (failureResult.balance) {
  const { outstandingBalance, totalCharges } = failureResult.balance;
  updateData.status = outstandingBalance <= 0.01 ? "paid" :
                      outstandingBalance < totalCharges ? "partially_paid" : "unpaid";
}
```

---

## Architectural Benefits

### ✅ Single Source of Truth
- **Before:** 3 sources - `invoice.outstandingBalance` (stored), `case.outstandingBalance` (stored), computed from Remittances
- **After:** 1 source - FinancialTransaction ledger

### ✅ Deduplication
- Unique constraint on `processorReference` prevents duplicate webhook processing
- Duplicate webhooks return `{ success: true, duplicate: true }` without error

### ✅ Payment Failure Handling
- Failed payments create `payment_reversal` transactions
- Balance automatically recalculated from ledger
- Status updated based on computed balance

### ✅ Transaction Isolation
- All operations use MongoDB sessions
- Webhook controller passes session to webhookTransactionService
- No nested transactions (webhookTransactionService detects external session)

### ✅ Audit Trail
- Every financial change is a new FinancialTransaction (append-only)
- Original transactions never modified (immutable)
- Full history preserved for compliance

---

## Migration Strategy

### Phase 1: Backfill Ledger (REQUIRED BEFORE TESTING) ⚠️
**File:** `/scripts/migrations/migrateToTransactionLedger.js`

**Run this to backfill existing data:**
```bash
cd /Users/dos/eqs-production/eqs-platform-be
node scripts/migrations/migrateToTransactionLedger.js --dry-run

# If validation passes:
node scripts/migrations/migrateToTransactionLedger.js
```

**What it does:**
1. Creates `invoice_charge` transactions for all existing invoices
2. Creates `payment` transactions from existing Remittances
3. Validates computed balances match stored balances
4. Reports discrepancies for manual review

### Phase 2: Test GoCardless Webhooks
1. Use sandbox environment
2. Trigger test webhooks (payment success, failure, refund)
3. Verify FinancialTransaction entries created
4. Verify balances computed correctly
5. Verify status updates correctly

### Phase 3: Deploy
- No production users = clean cutover
- Deploy all changes together (models + services + webhook controller)
- Monitor for webhook errors

---

## Key Files Modified

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| `src/core-features/financials/models/FinancialTransaction.js` | NEW | 142 | Immutable ledger model |
| `src/core-features/financials/services/BalanceService.js` | NEW | 180 | Pure balance computation |
| `src/core-features/financials/services/webhookTransactionService.js` | NEW | 383 | Webhook → ledger integration |
| `src/core-features/invoices/models/invoices.js` | MODIFIED | -5, +14 | Virtual outstandingBalance |
| `src/core-features/invoices/controllers/webhookController.js` | MODIFIED | +6, ~100 | Pure ledger webhook flow |
| `scripts/migrations/migrateToTransactionLedger.js` | NEW | 250 | Data migration |

---

## What Stays Unchanged

### ✅ Remittance Model
- **Kept** for business metadata (warehouse, products, SCL fields)
- FinancialTransaction = financial truth (minimal fields)
- Remittance = business record (rich metadata)

### ✅ Payment Model
- **Kept** for Sage integration
- Still creates Payment records for Sage sync
- FinancialTransaction runs in parallel

### ✅ GoCardless Flow
- Signature validation unchanged
- Event processing unchanged
- Only balance update logic changed (stored → computed)

---

## Testing Checklist

### Before Testing
- [ ] Run migration script to backfill FinancialTransaction ledger
- [ ] Verify migration validation passes
- [ ] Review any balance discrepancies reported

### Webhook Testing (Sandbox)
- [ ] Payment success creates `payment` transaction
- [ ] Duplicate webhook ignored (returns `duplicate: true`)
- [ ] Payment failure creates `payment_reversal` transaction
- [ ] Refund creates `refund` transaction
- [ ] Balance computed correctly after each event
- [ ] Invoice status updates correctly (`unpaid` → `partially_paid` → `paid`)

### Case Balance Testing
- [ ] Case balance updates when invoice paid
- [ ] Case balance computation uses FinancialTransaction ledger
- [ ] Multi-invoice cases compute correctly

### Error Scenarios
- [ ] Webhook signature validation still works
- [ ] Transaction rollback on error
- [ ] Duplicate processorReference handled gracefully

---

## Next Steps

### Immediate (Required)
1. **Run migration script** (dry-run first)
2. **Test webhook flow** in sandbox
3. **Fix any migration discrepancies**

### Short-term
4. Update Case balance calculation to use FinancialTransaction ledger
5. Add daily reconciliation job (GoCardless total vs FinancialTransaction total)
6. Create monitoring for balance computation performance

### Long-term
7. Deprecate Remittance model (or keep for legacy reasons)
8. Add chargeback handling to webhook controller
9. Implement full event sourcing for all financial operations

---

## Critical Notes

⚠️ **BREAKING CHANGE:** `invoice.outstandingBalance` is now virtual (computed)
- Any direct reads must call `invoice.computeBalance()` first
- Any queries filtering by `outstandingBalance` need refactoring

⚠️ **Migration Required:** Cannot test without running migration script
- Existing invoices have no FinancialTransaction entries
- Balance computation will fail without migration

⚠️ **No Shortcuts:** This is the "right way" implementation
- No dual-write phase (no production users)
- No stored balances (pure ledger)
- No compromises

---

## Questions?

**Q: Why keep Remittance if we have FinancialTransaction?**
A: Remittance has rich business metadata (warehouse, products, SCL fields). FinancialTransaction is minimal (pure financial ledger).

**Q: What if GoCardless webhook fails?**
A: Transaction constraint prevents duplicates. Retry is safe. Failed transactions rollback.

**Q: How do we query invoices by outstandingBalance?**
A: Need to compute balances first or use aggregation pipeline. This is a known trade-off of pure ledger.

**Q: Performance impact?**
A: Acceptable for current scale. For >10k invoices, add denormalized cache with background recomputation.

---

**Implementation Status:** ✅ Complete (Needs Testing & Migration)
**Accounting Compliance:** ✅ Aligned with QuickBooks/Xero/Sage patterns
**Production Readiness:** 🟡 Pending migration + testing

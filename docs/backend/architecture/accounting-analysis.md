---
id: accounting-analysis
title: AR Accounting Analysis
---

# AR & Accounting Standards Analysis

Analysis of the EQS platform's case, invoice, and payment plan setup against standard accounting and AR practices.

---

## Summary Scorecard

| Area | Status | Priority |
|------|--------|----------|
| Invoice Immutability | ✅ Compliant | — |
| Soft-Delete / Audit Trail | ✅ Compliant | — |
| Payment Lifecycle (Remittance) | ⚠️ Needs Attention | Medium |
| Credit Note Handling | ⚠️ Needs Attention | High |
| Balance Calculation | ⚠️ Needs Attention | High |
| Idempotency / Deduplication | ⚠️ Partial | Medium |
| Interest Accounting | ❌ Gap | Medium |
| Ageing / DSO Reporting | ❌ Missing | Medium |
| Revenue Recognition | ❌ Not Modelled | Low-Medium |
| Journal / Double-Entry | ❌ Not Modelled | Low |

---

## ✅ What Is Working Correctly

### 1. Invoice Immutability
`amount` is marked `immutable: true` in the schema — correct. Financial principal amounts must never be changed after creation per GAAP/IFRS.

### 2. Soft-Delete on All Financial Entities
`deletedAt`, `deletedBy`, `deletedReason` are present on `invoices`, `remittances`, and `paymentPlanArrangement`. This satisfies the audit trail requirement for financial records.

### 3. Invoice Superseding Pattern
Instead of hard-deleting invoices moved to a payment plan, the system creates `superseded` status invoices. This maintains a complete ledger trail.

### 4. Remittance as a Sub-Ledger
The `Remittance` model correctly tracks individual payment events (`payment`, `refund`, `credit_note`) against both invoices and cases — this mirrors an AR sub-ledger.

### 5. Status Lifecycle on Invoices
The `status` enum (`unpaid`, `paid`, `partially_paid`, `superseded`, `void`, `cancelled`) is broadly aligned with standard AR aging buckets.

---

## ⚠️ Issues and Risks

### 1. Credit Notes Are Not Proper AR Credits [HIGH]

**Current behaviour**: When debt is moved to a payment plan, a `credit_note` remittance is created for the original invoice to zero it out. However, credit notes are being counted the same as payments in the balance calculation.

**Standard practice**: A credit note reduces the *gross receivable* — it doesn't extinguish it like a cash payment does. The ledger should track:
- Gross AR (original invoice amount)
- Less: Credit Notes applied
- Less: Cash Received
- = Net Outstanding

**Risk**: If a credit note and actual payments are both counted as "totalPaid", you get double-coverage when a payment plan is active.

**Recommended fix**: In the balance calculation, scope `totalPaid` strictly to `transactionType === "payment"` for Tier 1 (plan). Credit notes should only reduce the `caseAmount` (gross AR), not inflate `totalPaid`.

---

### 2. Duplicate Remittance Records [HIGH]

**Current behaviour**: Multiple remittance documents exist for the same `processorReference` (GoCardless payment ID). Discovered 3–4 records per unique transaction in production data.

**Root cause**: The `syncGoCardlessPayments` cron and the webhook handler can both write a remittance for the same payment event. The idempotency check added to `paymentUtils.js` is correct but runs *after* the query — it needs to be a DB-level unique constraint.

**Recommended fix**:
```javascript
// Add to remittanceSchema
RemittanceSchema.index({ processorReference: 1 }, {
  unique: true,
  partialFilterExpression: { processorReference: { $exists: true, $ne: null } }
});
```
This prevents insertion of duplicates at the database level, making the in-memory deduplication a fallback rather than a dependency.

---

### 3. Balance Recalculation is Synchronous/Event-Driven [MEDIUM]

**Current behaviour**: `calculateCaseOutstandingBalance` is called after each payment event. If a webhook fires multiple times, or if a cron fires concurrently with a webhook, race conditions can cause stale balances.

**Standard practice**: AR systems use an append-only sub-ledger and derive the balance at query time, not by caching a pre-computed `outstandingBalance` field.

**Recommended fix**: The `outstandingBalance` field on `CsvMapping` is fine as a cache, but it should be treated as a *derived view*, not a source of truth. Every read path should prefer recalculation from the remittance sub-ledger, with the cached field as a performance hint only. Consider adding a `balanceLastCalculatedAt` timestamp.

---

### 4. Payment Plan Schedule — `paidAmount` Not Authoritative [MEDIUM]

**Current behaviour**: `schedule[].paidAmount` is set on the plan document, but the actual source of cash received is in the `Remittance` collection. These two can drift.

**Standard practice**: The schedule should be a *plan*, not a ledger. The `paidAmount` on a schedule item should always be derived from summing `Remittance` records linked to that schedule item, not stored independently.

**Recommended fix**: Add a virtual/computed field or derive `paidAmount` from `schedule[].remittanceRecords` at query time.

---

### 5. Invoice `category` Default is Wrong [MEDIUM]

**Current behaviour**: `category` defaults to `"payment"`:
```javascript
category: {
  enum: ["accounts_receivable", "expense", "payment", "other"],
  default: "payment",  // ← incorrect
}
```

**Standard practice**: An invoice is an **accounts receivable** document, not a payment. The default should be `"accounts_receivable"`. A `"payment"` category for an invoice is semantically incorrect.

**Recommended fix**: Change default to `"accounts_receivable"`.

---

## ❌ Missing Finance Standards

### 6. No Interest Accrual Entry [MEDIUM]
The payment plan stores `totalInterest` as a field on the arrangement, but there's no remittance entry of type `"interest"` when interest is earned/accrued. Under accrual accounting, interest must be recognised as income when earned, not when received.

**Recommended**: Add `interest_charge` as a `transactionType` in the remittance model, and post an interest entry per schedule installment as it becomes due.

---

### 7. No Ageing Buckets / DSO Calculation [MEDIUM]
Standard AR reporting requires ageing analysis:
- Current (0–30 days)
- 31–60 days
- 61–90 days  
- 90+ days

The data exists (invoice `dueDate` + `outstandingBalance`) but there's no aggregation pipeline or reporting endpoint for this. DSO (Days Sales Outstanding) is a core AR KPI.

---

### 8. No Bad Debt / Write-Off Mechanism [MEDIUM]
There's no `write_off` transaction type in the remittance model, and no status like `written_off` on invoices. Regulatory accounting requires the ability to formally write off uncollectable debt with an approved reason.

**Recommended**: Add `"written_off"` to invoice status enum and `"write_off"` to remittance `transactionType`.

---

### 9. No Revenue Recognition Model [LOW-MEDIUM]
There's no explicit separation between:
- **Deferred Revenue** (invoice raised but service not yet delivered)
- **Recognised Revenue** (service delivered, payment expected)
- **Cash Received** (payment cleared)

For platforms handling B2B debt collection, this matters for internal reporting even if not statutory.

---

### 10. No Double-Entry Journal [LOW]
The platform uses a single-entry model (remittances). This is acceptable for an AR-focused SaaS but means integration with accounting systems (QuickBooks, Xero, Sage — all of which the platform integrates with) requires a mapping layer to generate the double-entry journals those systems expect.

The existing accounting integrations (Xero, Sage, QB, FreeAgent) partly compensate for this, but any divergence between EQS data and the accounting system is undetectable without a reconciliation report.

---

## Recommended Priority Actions

| Priority | Action |
|----------|--------|
| 🔴 **High** | Add DB-level unique index on `remittance.processorReference` |
| 🔴 **High** | Fix credit note accounting — exclude from `totalPaid`, apply to gross AR reduction only |
| 🟡 **Medium** | Fix `invoice.category` default from `"payment"` to `"accounts_receivable"` |
| 🟡 **Medium** | Derive `schedule.paidAmount` from linked remittance records, not stored state |
| 🟡 **Medium** | Add `"write_off"` to invoice statuses and remittance transaction types |
| 🟡 **Medium** | Build ageing bucket report endpoint |
| 🟢 **Low** | Add `interest_charge` remittance type for accrual accounting |
| 🟢 **Low** | Add `balanceLastCalculatedAt` to case to detect stale caches |

---
sidebar_position: 1
title: Bank Reconciliation
description: Match bank transactions to invoices to confirm which payments have been received.
---

# Bank Reconciliation

Bank reconciliation helps you match transactions from your bank statements to invoices on ÉquiSettle. This confirms which invoices have been paid and keeps your records accurate.

## How it works

1. **Upload** your bank statement (CSV or PDF)
2. The matching engine **compares** each transaction against your open invoices
3. **Review** the suggested matches
4. **Confirm** correct matches to mark invoices as paid
5. **Investigate** unmatched transactions manually

## Uploading bank statements

### Supported formats
- **CSV** — standard bank statement export
- **PDF** — the platform extracts transaction data from PDF statements

### Upload process
1. Go to Bank Reconciliation
2. Upload your statement file
3. **Preview** the extracted transactions before processing — check that amounts, dates, and descriptions look correct
4. Confirm to start the matching process

Uploaded statements are stored with full transaction details for your records.

## Automatic matching

The matching engine analyses each bank transaction and compares it against your open invoices. Results fall into three categories:

### Auto-matched (high confidence)
The system is **confident** this bank transaction matches a specific invoice:
- Amount matches exactly (or within a small tolerance)
- Reference number matches
- Customer name matches

These are likely correct and can be bulk-confirmed.

### Needs review (medium confidence)
The system found a **likely match** but isn't certain:
- Amount is close but not exact
- Partial reference match
- Customer name is similar but not identical

These need a human to review and decide.

### Unmatched
**No match found** — the transaction doesn't correspond to any open invoice:
- Could be a payment from an unknown customer
- Could be a payment for an invoice not yet in the system
- Could be a non-invoice transaction (e.g., bank fees, transfers)

These need manual investigation.

## Reviewing matches

### Auto-matched transactions
- Review the list of high-confidence matches
- **Confirm** correct matches individually or **bulk confirm** them all at once
- **Reject** any that look wrong

### Medium-confidence matches
- Review each suggested match
- Confirm if the match is correct
- Reject if it's wrong — the transaction moves to "unmatched"

### Unmatched transactions
- Search your invoices to find a potential match
- **Manually match** a transaction to an invoice
- Or leave it unmatched if it's not related to an invoice

## Confirming and rejecting

| Action | What happens |
|--------|-------------|
| **Confirm** | The invoice is marked as paid and the payment is recorded |
| **Reject** | The suggested match is removed — the transaction becomes unmatched |
| **Undo** | Reverse a confirmed match if it was wrong — the invoice returns to unpaid |

## Customer assignment

For unmatched transactions that you've identified as payments:

1. **Search** for the customer by name or reference
2. **Assign** the customer to the transaction
3. **Link** the transaction to the correct invoice
4. **Confirm** the match

This is useful when a payment reference doesn't perfectly match but you know who it's from.

## ML-powered matching (PEM)

The **Payment Engine Model** uses machine learning to improve matching accuracy over time:

- It learns from your **confirmed matches** — the more you confirm, the smarter it gets
- Future matching suggestions become more accurate
- You can **retrain** the model if matching quality declines
- You can **reset** the model and start fresh if needed

The ML model is trained on your company's specific data, so it adapts to your customers' payment patterns and reference formats.

## Reconciliation dashboard

A summary view of your reconciliation activity:

| Metric | What it shows |
|--------|-------------|
| **Matched** | Number of transactions successfully matched to invoices |
| **Needs review** | Number of suggested matches awaiting human review |
| **Unmatched** | Number of transactions with no match found |
| **Session history** | List of all reconciliation sessions with dates and status |

## Good to know

- Bank reconciliation is **separate from GoCardless payments** — GoCardless payments are automatically recorded. Reconciliation is for payments received through other channels (bank transfers, cheques, etc.)
- Confirmed matches **automatically update** invoice status and outstanding balance
- Each reconciliation session is tracked — you can see who did what and when
- The ML model improves with use — early on, expect more manual matching; over time, auto-matching becomes more accurate
- You can run reconciliation as often as needed — daily, weekly, or whenever you receive bank statements

---
sidebar_position: 2
title: Managing Payment Plans
description: Track progress, handle defaults, update plans, and manage credit notes.
---

# Managing Payment Plans

Once a payment plan is active, here's how to track its progress and handle different scenarios.

## Payment plan statuses

| Status | What it means |
|--------|--------------|
| **Active** | Plan is running. Payments are being collected on schedule. |
| **Completed** | All installments have been paid in full. |
| **Defaulted** | The customer has missed one or more payments. |
| **Cancelled** | The plan has been terminated before all payments were made. |

## Installment statuses

Each installment within a plan has its own status:

| Status | What it means |
|--------|--------------|
| **Pending** | Not yet due — the due date hasn't arrived |
| **Paid** | Full installment amount received |
| **Partially paid** | Some payment received, but not the full installment amount |
| **Overdue** | Past the due date with no payment received |
| **Missed** | Customer failed to pay within the grace period |
| **Invoice linked** | An invoice has been generated for this installment |

## Tracking progress

The payment plan detail view shows:

- **Full schedule** — every installment with its date, expected amount, and current status
- **Remaining balance** per installment — how much is still owed on each
- **Total collected vs expected** — overall progress towards paying off the debt
- **Remittance records** — linked to each installment showing payment details (date, amount, reference)

This gives you a clear picture of whether the plan is on track or falling behind.

## When a customer defaults

If a customer misses a payment:

1. The plan status changes to **"defaulted"**
2. The missed installment is marked as "overdue" or "missed"
3. Your team and the customer are notified
4. If the case has a workflow, it may **escalate to the next stage** (e.g., legal or recovery)
5. You can decide to:
   - **Follow up** with the customer to get back on track
   - **Renegotiate** the plan with new terms
   - **Cancel** the plan and pursue alternative collection

## Updating a payment plan

If circumstances change (customer requests different terms, amount adjustment needed):

1. Modify the plan configuration (amount, number of payments, frequency)
2. The platform **supersedes old invoices** — existing payment plan invoices that haven't been paid are marked as superseded
3. **New invoices are generated** based on the updated plan
4. GoCardless mandates are updated if needed

This ensures there's no confusion between old and new installment schedules.

## Credit notes and refunds

### Credit notes
If a customer overpays or a dispute results in an adjustment:

- Issue a **credit note** against the overpayment
- The credit note is linked to the original invoice
- Outstanding balance is adjusted accordingly
- Tracked in your accounts payable records

### Refunds
If a customer is owed money back:

- Process a **refund** linked to the original payment
- The refund creates a new remittance record
- Refund reason and date are tracked
- Original payment reference is maintained for audit

## Pre-due reminders for payment plans

Payment plan installments receive special **pre-due reminders** to help customers stay on top of their payments:

| When | What happens |
|------|-------------|
| **7 days before due date** | First reminder — heads up that payment is coming |
| **3 days before due date** | Second reminder — payment is approaching |
| **1 day before due date** | Third reminder — payment is tomorrow |
| **Due date (day 0)** | Final reminder — payment is due today |

These reminders:
- Are sent **automatically** — no action needed from your team
- Use **smart channel switching** — email first, then SMS if emails aren't being opened
- Include the **payment link** so the customer can pay immediately
- Only go out for installments that are still unpaid

## Good to know

- Payment plans can be created for any case with outstanding invoices
- The original invoices are superseded (not deleted) — they remain in the system for audit
- Each installment is a separate invoice, so you have full visibility into individual payments
- If a customer's direct debit mandate is already active from a previous installment, subsequent payments are collected automatically
- Completed plans automatically update the case outstanding balance to reflect all payments received

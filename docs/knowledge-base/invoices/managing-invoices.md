---
sidebar_position: 2
title: Managing Invoices
description: Actions you can take on invoices — creating, updating, recording payments, voiding, and more.
---

# Managing Invoices

Here's everything you can do with invoices on ÉquiSettle.

## Creating invoices manually

To create a new invoice:

1. Set the **amount** and **due date** (required)
2. Add a **description** and choose a **category** (accounts receivable, expense, payment, or other)
3. Optionally add **line items** (individual charges with description, quantity, and price)
4. Choose whether to **auto-convert to a case** or keep it as a standalone invoice

The invoice is created with status "unpaid" and its outstanding balance equals the full amount.

## Updating an invoice

You can modify an invoice's details:

- Change the amount, description, category, or due date
- Add or update line items
- Changes to the amount are automatically reflected in the linked case's outstanding balance

:::warning
You cannot update invoices that are paid, void, or cancelled. These are finalised statuses.
:::

## Recording a payment

When you receive a payment for an invoice:

1. Select the invoice and confirm the payment
2. Enter the **payment amount** and **payment date**
3. The platform updates the invoice:
   - **Full payment** → status becomes "paid", outstanding balance drops to £0
   - **Partial payment** → status becomes "partially_paid", outstanding balance is reduced by the payment amount

### What happens automatically

- A **payment record** is created with the transaction details
- A **remittance entry** is generated for your records
- If the invoice is linked to a case, the **case outstanding balance** is recalculated
- If you have an accounting integration connected (Xero, Sage, etc.), the payment is **synced to your accounting software**
- Activity is logged on the case for audit purposes

## Voiding an invoice

Use void when an invoice was created in error or is no longer valid:

- The invoice status changes to "void"
- Outstanding balance is set to £0
- The invoice is closed
- It cannot be converted to a case
- Automatic reminders stop

:::info
Void is permanent in intent — use it when the invoice should never have existed or is completely invalid. For invoices being replaced by a new arrangement, "superseded" is more appropriate.
:::

## Superseding an invoice

An invoice is superseded when it's replaced by another invoice or a payment plan:

- Status changes to "superseded"
- Outstanding balance is set to £0
- The invoice is closed
- A status note records why it was superseded (e.g., "Superseded by updated payment plan")

This commonly happens when:
- A **payment plan** is created for a case — the original invoice is superseded by the plan's installment invoices
- An invoice amount needs to be **corrected** — the old one is superseded by a new one
- **Terms change** — original invoice replaced with updated terms

Superseded invoices remain in the system for audit purposes — they're not deleted.

## Converting a standalone invoice to a case

If a standalone invoice needs active collection:

1. Select the invoice and choose "Convert to Case"
2. The platform creates a new case linked to the invoice
3. The invoice type changes from "standalone" to "case-related"
4. A customer agreement is auto-created if one doesn't exist for this customer
5. The case's outstanding balance is set from the invoice

:::warning
You cannot convert an invoice that is already case-related, paid, void, or cancelled.
:::

## Linking invoices to cases

Add an existing standalone invoice to a case:

1. Open the case
2. Choose to add an invoice
3. Select from available standalone invoices
4. The invoice becomes "case-related" and the case outstanding balance increases

## Removing invoices from cases

Unlink an invoice from a case:

1. Open the case and find the invoice
2. Choose to remove it
3. The invoice returns to "standalone" status
4. The case outstanding balance decreases

The invoice isn't deleted — it still exists independently.

## Promise-to-Pay (PTP) tracking

When a customer promises to pay by a specific date:

- Mark the invoice with a **promise-to-pay date** and **expected amount**
- Track whether the customer follows through
- View **daily PTP digest reports** to see which promises are coming due or have been broken
- Helps prioritise follow-up — if a promise is broken, that customer may need escalation

---
sidebar_position: 3
title: Payment Links & Online Payments
description: Send customers a link to pay online via bank transfer or direct debit.
---

# Payment Links & Online Payments

ÉquiSettle integrates with **GoCardless** to let you send customers a secure link where they can pay online — either via instant bank transfer or by setting up a direct debit.

## Payment types

### Instant Bank Pay (IBP)

- Customer makes a **one-off bank transfer**
- Funds typically arrive within hours
- No recurring mandate — just a single payment
- Best for: one-time payments, final settlements, standalone invoices

### Direct Debit

- Customer **authorises a recurring payment mandate**
- Takes 3-5 days to activate after customer authorisation
- Once active, future payments are collected automatically
- Best for: payment plans where you need to collect installments regularly

### Combined

- Customer is presented with **both options** on the payment page
- They choose whether to pay via bank transfer or set up a direct debit
- Best for: giving customers flexibility

## Sending a payment link

1. Select the invoice you want to collect on
2. Choose the **payment type** (IBP, Direct Debit, or Combined)
3. Send the payment email
4. The customer receives an email with a **secure link** to the GoCardless payment page
5. The payment link is **saved on the invoice** so you can re-send it if needed

## Sending a manual payment email

You can send a payment email manually at any time:

- Select the invoice and choose to send a payment email
- Pick an email template:
  - **Gentle reminder** — friendly tone
  - **Follow-up** — firmer, mentions the overdue status
  - **Final notice** — urgent, warns of consequences
- The email includes the payment link for the customer to pay online

## Tracking payment status

After a payment link is sent, you can track its progress:

| Status | What it means |
|--------|--------------|
| **Pending** | Customer hasn't completed payment yet — they may not have opened the link |
| **Succeeded** | Payment received successfully |
| **Failed** | Payment attempt failed (e.g., insufficient funds, bank declined) |
| **Pending retry** | A failed direct debit payment is being automatically retried |

## What happens when payment succeeds

When a customer completes a payment through the link:

1. **Invoice status updates** — to "paid" (full amount) or "partially_paid" (partial amount)
2. **Outstanding balance recalculates** — on both the invoice and the linked case
3. **Accounting sync** — payment is recorded in your connected accounting software (Xero, Sage, etc.)
4. **Remittance record** — a payment record is created for your records
5. **Activity logged** — the payment appears in the case activity timeline

## What happens when payment fails

If a payment attempt fails:

- The **error is recorded** on the invoice with details of what went wrong
- The **retry count** is tracked
- For direct debits, GoCardless **Success+** automatically retries failed payments using intelligent timing
- You can view failed payments and decide whether to follow up manually

## Good to know

- Payment links are **reusable** — if a customer's link expires or they need it again, you can re-send it
- The GoCardless payment page is **secure and branded**
- **Direct debit mandates** stay active even after the first payment, making them ideal for payment plans
- You can see all payment activity (pending, succeeded, failed) on the invoice detail page

---
sidebar_position: 5
title: "Universal Payment Page"
description: "The /pay/:invoiceId public payment page and auto payment link generation"
---

# Universal Payment Page

The payment page is a public, auth-free interface that lets debtors pay an invoice using whichever payment methods the creditor company has configured. It is the single canonical URL sent to debtors in email reminders, WhatsApp messages, and workflow actions.

**Route**: `/pay/:invoiceId` (frontend)
**Return route**: `/pay/complete` (for Yapily Open Banking callback)

---

## Payment Methods

| Method | Provider | Prerequisite |
|--------|----------|--------------|
| Direct Debit | GoCardless | `company.integrations.gocardless.isActive` |
| Card | Stripe Connect | `company.integrations.stripeConnect.isActive` |
| Bank Transfer | Yapily Open Banking | `company.bankDetails.sortCode` + `accountNumber` set |

The page shows only the methods available for the invoice's company. If none are configured, the invoice is ineligible and a "no payment methods" error is returned.

---

## API

### Get invoice details

```
GET /api/v1/public/pay/:invoiceId
```

Returns:

```json
{
  "invoiceId": "...",
  "invoiceNumber": "INV-001",
  "amount": 500.00,
  "currency": "GBP",
  "dueDate": "2026-03-31",
  "companyName": "Acme Ltd",
  "availableMethods": ["gocardless", "stripe", "yapily"],
  "gocardless": { "flowUrl": "https://..." },   // if GC active & pre-created
  "payee": { "name": "...", "sortCode": "...", "accountNumber": "..." }  // if Yapily
}
```

### Create Stripe session

```
POST /api/v1/public/pay/:invoiceId/stripe
```

Creates a Checkout Session on demand. Returns `{ checkoutUrl }`. The browser redirects to the Stripe-hosted checkout.

### Get Yapily institutions

```
GET /api/v1/public/pay/:invoiceId/yapily/institutions
```

Returns UK PIS-capable banks for the picker.

### Create Yapily payment

```
POST /api/v1/public/pay/:invoiceId/yapily
Body: { "institutionId": "monzo" }
```

Returns `{ paymentId, authorisationUrl }`. Frontend saves `paymentId` to `sessionStorage` then redirects.

### Confirm Yapily payment (callback)

```
GET /api/v1/public/pay/yapily/confirm?paymentId=xxx
```

Called by `/pay/complete` when the debtor returns from bank auth. Checks Yapily status, records payment if complete. Idempotent.

---

## Auto Payment Link Generation

`src/core-features/invoices/cron/autoPaymentLink.js` runs daily and assigns `invoice.paymentLink` to all unpaid invoices that don't yet have one.

### Logic

```
For each unpaid invoice without paymentLink:
  1. If company has no active provider → skip
  2. If GoCardless active → pre-create billing request (flow URL ready for payment page)
  3. Set invoice.paymentLink = /pay/:invoiceId  (universal URL for all providers)
```

Stripe sessions and Yapily auth requests are **not** pre-created — they're generated on demand to avoid expiry.

### Why universal URL?

- Stripe Checkout Sessions expire after 24 hours — can't be pre-created
- Yapily requires the debtor to select their bank first — can't be pre-created
- GoCardless billing requests don't expire, so we pre-create them for smooth UX
- One URL works regardless of which provider ends up being used

---

## Email Reminder Links

When `invoice.paymentLink` is null (cron hasn't run yet), all email/reminder services fall back to constructing the URL directly:

```js
const appUrl = process.env.APP_URL || 'https://eqs-platform-fe.onrender.com';
paymentLink: invoice.paymentLink || `${appUrl}/pay/${invoice._id}`
```

Applied in: `emailController.js`, `workflowService.js`, `smartReminderService.js`, `ptpService.js`

---

## Payment Confirmation Flow (Stripe)

```
Debtor pays → Stripe webhook fires →
  POST /api/v1/webhooks/stripe/connect →
    checkout.session.completed →
      webhookTransactionService.handlePaymentSuccess({ processorType: 'stripe' }) →
        FinancialTransaction created → invoice status updated
```

## Payment Confirmation Flow (Yapily)

Since Yapily webhooks are in private beta, confirmation uses the callback pattern:

```
Debtor authorises at bank → redirected to /pay/complete →
  PaymentComplete.jsx reads sessionStorage →
    GET /api/v1/public/pay/yapily/confirm?paymentId=xxx →
      Yapily API status check →
        webhookTransactionService.handlePaymentSuccess({ processorType: 'yapily' }) →
          FinancialTransaction created → invoice status updated
```

---

## Frontend Files

| File | Purpose |
|------|---------|
| `src/pages/PaymentPage.jsx` | Main payment page — loads invoice, shows method picker |
| `src/pages/PaymentComplete.jsx` | Return page for Yapily — confirms payment, shows result |
| `src/App.jsx` | `/pay/complete` route must be registered **before** `/pay/:invoiceId` |

---

## CORS

Public pay routes allow any origin (debtors arrive from email links):

```js
// app.js
app.use("/api/v1/public/pay", cors({ origin: "*", credentials: false }));
```

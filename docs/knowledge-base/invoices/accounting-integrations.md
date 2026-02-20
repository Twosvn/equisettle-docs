---
sidebar_position: 4
title: Accounting Software Integrations
description: Sync invoices and payments with your existing accounting software.
---

# Accounting Software Integrations

ÉquiSettle connects with popular accounting platforms so your invoice and payment data stays in sync across systems.

## Supported platforms

| Platform | What syncs |
|----------|-----------|
| **Xero** | Two-way sync of invoices and contacts. Payments recorded automatically. |
| **Sage** | Payment recording and invoice sync. Payments confirmed on ÉquiSettle are pushed to Sage. |
| **QuickBooks** | Invoice and customer sync. Links QuickBooks companies to ÉquiSettle. |
| **Zoho** | Invoice and inventory sync. Line item details synced from Zoho. |
| **Clio** | Invoice sync for law firms. Links Clio invoice IDs to ÉquiSettle. |
| **FreeAgent** | Contact sync. Links FreeAgent contacts to your customer agreements. |

## What gets synced

### Invoices
- When you create or import an invoice on ÉquiSettle, it can be pushed to your accounting software
- Invoice details (amount, due date, description, line items) are synced
- Changes on either side can be reflected in the other

### Payments
- When a payment is confirmed on ÉquiSettle (via GoCardless or manual confirmation), it's recorded in your accounting software
- Payment amount, date, and reference are synced
- Keeps your books up to date without manual data entry

### Contacts and customers
- Customer details are synced between ÉquiSettle and your accounting platform
- Contact information, company details, and billing addresses stay consistent

## How to connect

1. Go to **Settings** in your ÉquiSettle dashboard
2. Navigate to **Integrations**
3. Select your accounting platform
4. **Authenticate** — you'll be redirected to your accounting provider to grant access
5. **Configure sync preferences** — choose what to sync and how often

Setup is typically done once by an Admin. After that, syncing happens automatically.

## Sync status tracking

For each invoice, you can see:

- **Whether it's been synced** to your accounting software
- **Last sync date** — when the most recent sync occurred
- **Sync errors** — if something went wrong (e.g., missing required fields, connection issues), the error is logged

If a sync fails, you can review the error and retry. Common issues include:
- Missing required fields on the invoice (e.g., no customer contact in the accounting platform)
- Expired authentication tokens (re-authenticate in Settings)
- Rate limits on the accounting platform's API

## Gmail integration

ÉquiSettle can also connect to Gmail to:

- **Extract invoices** from emails — the platform can identify invoices received via email and import them
- Track the email source: sender, date received, subject line
- Link extracted invoices to the right customer

This is useful for capturing invoices that arrive by email without manual data entry.

## Good to know

- Integrations are **company-wide** — once connected, they apply to all users
- Only **Admins** can set up or modify integrations
- You can connect **multiple platforms** simultaneously (e.g., Xero for accounting + GoCardless for payments)
- Webhook support means changes in your accounting software can trigger updates in ÉquiSettle automatically

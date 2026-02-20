---
sidebar_position: 2
title: Channels & Templates
description: Email, SMS, and WhatsApp channels — how smart channel switching works and custom templates.
---

# Channels & Templates

Reminders can be sent via **email**, **SMS**, or **WhatsApp**. The platform uses smart logic to pick the best channel based on how the customer is engaging.

## Email

Email is the **primary channel** — it's used by default for all reminders.

### What's included in a reminder email
- Customer name
- Invoice number and amount
- Due date
- Your company name
- **Payment link** — a clickable link for the customer to pay online
- Tone based on escalation level (gentle, follow-up, or final notice)

### Email tracking
The platform tracks what happens after each email is sent:

| Status | What it means |
|--------|--------------|
| **Sent** | Email has been dispatched |
| **Delivered** | Email reached the customer's inbox |
| **Opened** | Customer opened the email |
| **Clicked** | Customer clicked a link in the email (e.g., the payment link) |
| **Bounced** | Email couldn't be delivered (invalid address, full inbox, etc.) |

This tracking data feeds into the smart channel switching logic.

## SMS

SMS is used as a **secondary channel** when emails aren't getting through.

### Message content varies by urgency

| Situation | Example message |
|-----------|----------------|
| Due soon | "Invoice #1234 for £500 is due on 15 Feb" |
| Due today | "URGENT: Invoice #1234 is due TODAY" |
| Overdue | "FINAL NOTICE: Invoice #1234 is 14 days overdue" |

### SMS features
- Includes the **payment link** when available
- Customer can **reply STOP** to unsubscribe from SMS reminders
- Delivery status is tracked (sent, delivered, failed, undelivered)

## WhatsApp

WhatsApp is sent **alongside** email or SMS as an additional touchpoint.

- Uses **pre-approved WhatsApp Business templates** (required by WhatsApp's policies)
- Only sent if the customer has a **WhatsApp number on file**
- Message includes: customer name, company name, invoice number, amount, due date, and payment link
- Not a replacement for email/SMS — it's an extra channel to increase visibility

## Smart channel switching

The platform automatically decides which channel to use based on the customer's engagement history. Here's the logic:

```
1. No email history for this customer?
   → Start with EMAIL (give it a chance)

2. Previous email was opened or clicked?
   → Continue with EMAIL (it's working)

3. Email bounced?
   → Switch to SMS (email address may be invalid)

4. Email was delivered but never opened?
   → Try SMS (customer may not be checking email)

5. Recent SMS failed?
   → Fall back to EMAIL (SMS number may be wrong)

6. Default
   → EMAIL
```

### This is fully automatic
- You don't need to manually switch channels
- The system evaluates engagement history before each reminder
- It adapts over time — if a customer starts opening emails again, it switches back to email

## Custom email templates

You can create branded email templates for your company:

### Template types
- **Gentle reminder** — friendly tone for early reminders
- **Follow-up** — firmer tone for overdue invoices
- **Final notice** — urgent tone for long-overdue invoices

### Template variables
Use these variables in your templates — they're automatically replaced with real data:

| Variable | What it shows |
|----------|--------------|
| Customer name | The debtor's name |
| Invoice number | The invoice reference |
| Amount | The outstanding amount |
| Due date | When payment was/is due |
| Company name | Your company name |
| Payment link | The GoCardless payment URL |

### Managing templates
- Create templates in your company settings (Admin only)
- Edit existing templates at any time
- Delete templates you no longer need
- Each template is used for the appropriate escalation level in automatic reminders

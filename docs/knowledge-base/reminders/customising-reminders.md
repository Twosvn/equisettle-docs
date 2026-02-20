---
sidebar_position: 3
title: Customising Reminders
description: Control when and how reminders are sent — per customer, per invoice, or globally.
---

# Customising Reminders

While reminders work automatically out of the box, you have full control over when, how, and whether they're sent.

## Disabling reminders for a customer

You can turn off all automatic reminders for a specific customer. There are two places to do this:

### On the customer agreement
- Open the customer agreement
- Set **"Enable invoice reminders"** to off
- All invoices linked to this customer will stop receiving automatic reminders

### On the case
- Open the case
- Set the customer's reminder preference to off
- Reminders stop for all invoices on this case

:::info
Either setting being off is enough to stop reminders. Both must be on for reminders to be sent.
:::

This is useful when:
- A customer has asked not to be contacted
- You're in active negotiations and don't want automated messages interfering
- The customer is on a payment plan and you only want the pre-due reminders

## Overriding reminders per invoice

For more granular control, you can override the default reminder settings on individual invoices.

### Frequency options

| Frequency | How often reminders are sent |
|-----------|------------------------------|
| **Daily** | Every day |
| **Every 2 days** | Every other day |
| **Weekly** | Once a week |
| **Bi-weekly** | Every two weeks |
| **Custom** | Set your own interval (1-30 days) |
| **Disabled** | No automatic reminders for this invoice |

### Additional settings

| Setting | What it does |
|---------|-------------|
| **Send time** | What time of day to send (default: 09:00) |
| **Timezone** | Which timezone to use (default: Europe/London) |
| **Days of the week** | Choose specific days (e.g., Monday–Friday only) |
| **Avoid holidays** | Skip bank holidays and public holidays |

### Escalation rules

| Setting | What it does |
|---------|-------------|
| **Max reminders** | Maximum number of reminders before stopping (overrides the default 12) |
| **Escalate to roles** | After max reminders, notify manager or admin roles that manual follow-up is needed |

## Sending a reminder manually

You can send a reminder at any time, regardless of the automatic schedule:

1. Select the invoice
2. Choose **"Send payment email"**
3. Pick a template type:
   - **Gentle reminder**
   - **Follow-up**
   - **Final notice**
4. The email is sent immediately

Manual reminders don't affect the automatic schedule — the next automatic reminder will still go out at its scheduled milestone.

## Viewing reminder history

Every invoice keeps a full log of all reminders sent:

| Field | What it shows |
|-------|-------------|
| **Date and time** | When the reminder was sent |
| **Channel** | Email or SMS |
| **Template** | Which email template was used |
| **Status** | Sent, delivered, failed, opened, or clicked |

You can also see:
- **Total reminder count** — how many reminders have been sent for this invoice
- **Last reminder sent** — timestamp of the most recent reminder
- **Last SMS sent** — timestamp of the most recent SMS (tracked separately)

This history helps you understand what communication has gone out and whether the customer is engaging.

## Rate limits

To protect deliverability and prevent abuse:

| Limit | Value |
|-------|-------|
| Email send rate | **2 per second** (platform limit) |
| SMS send rate | **1 per second** per phone number |
| Batch size | Up to **50 invoices** processed per batch |
| Concurrent batches | Maximum **3** running at once |

These limits ensure reliable delivery without overwhelming email or SMS providers.

## Good to know

- Per-invoice overrides take priority over the default milestone schedule
- Disabling reminders at the customer level affects all invoices for that customer
- Manual reminders can be sent even if automatic reminders are disabled
- Reminder history is permanent — it's never deleted, even if the invoice is closed
- When a case is closed, all automatic reminders stop; when reopened, they resume

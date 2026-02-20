---
sidebar_position: 1
title: How Reminders Work
description: How ÉquiSettle's automatic payment reminders work — milestone schedule, escalation, and safety limits.
---

# How Reminders Work

ÉquiSettle automatically sends payment reminders to customers whose invoices are overdue. Reminders follow a **milestone-based schedule** — they're sent at specific intervals rather than every day, keeping follow-up consistent without overwhelming the customer.

## The milestone schedule

For **overdue invoices** (past their due date), reminders are sent on these milestones:

| Milestone | When it's sent |
|-----------|---------------|
| **Day 0** | The due date itself — a reminder that payment is due today |
| **Day 1** | The day after the due date — a gentle nudge |
| **Day 7** | One week overdue |
| **Day 14** | Two weeks overdue |
| **Day 21** | Three weeks overdue |
| **Day 28+** | Weekly thereafter (day 35, 42, 49, etc.) |

This schedule avoids over-messaging in the first few days while maintaining consistent weekly follow-up once the invoice is clearly overdue.

## Payment plan pre-due reminders

For **payment plan installments**, reminders are sent **before** the due date to help customers prepare:

| Milestone | When it's sent |
|-----------|---------------|
| **7 days before** | First heads-up — payment is coming next week |
| **3 days before** | Second reminder — payment in 3 days |
| **1 day before** | Third reminder — payment is tomorrow |
| **Due date (day 0)** | Payment is due today |

If the installment goes unpaid after the due date, the standard overdue milestone schedule kicks in (day 1, day 7, then weekly).

## When reminders are processed

- Reminders are processed **daily at 11am on weekdays** (Monday–Friday)
- The system looks **back up to 90 days** for overdue invoices
- The system looks **forward up to 7 days** for upcoming payment plan installments
- Reminders are not sent on weekends

## Reminder types (escalation)

As time passes, the tone of reminders escalates:

| Type | Tone | When it's used |
|------|------|---------------|
| **Gentle reminder** | Friendly, polite nudge | First few reminders (due date, day 1) |
| **Follow-up** | Firmer, mentions the overdue status clearly | After the initial period (day 7+) |
| **Final notice** | Urgent, warns of potential consequences | After extended non-payment |

The escalation happens automatically based on how long the invoice has been overdue.

## Which invoices get reminders

An invoice receives automatic reminders if **all** of the following are true:

- Status is **"unpaid"** (not paid, void, superseded, or cancelled)
- The invoice is **not closed**
- The customer has **reminders enabled** (checked at both the customer agreement and case level)
- The invoice hasn't hit the **maximum reminder count** (12)
- A reminder hasn't already been sent **today**
- It's a **weekday** (Monday–Friday)

## Safety limits

To prevent customers from being spammed:

| Limit | Value |
|-------|-------|
| Maximum reminders per invoice | **12** |
| Duplicate prevention | No more than **1 reminder per day** per invoice |
| Overdue window | Only invoices overdue within the **last 90 days** |
| Weekdays only | Reminders are **not sent on weekends** |

Once an invoice hits 12 reminders, automatic reminders stop. You can still send manual reminders if needed.

## Good to know

- Reminders are fully automatic — you don't need to trigger them
- The milestone schedule is designed to match best practices for debt collection communication
- Payment plan pre-due reminders ensure customers are prepared before each installment
- If a customer pays between milestones, reminders stop automatically (because the invoice status changes)
- You can always send a manual reminder at any time, regardless of the automatic schedule

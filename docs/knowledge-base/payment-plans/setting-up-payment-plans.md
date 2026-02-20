---
sidebar_position: 1
title: Setting Up Payment Plans
description: How to create installment plans for customers who can't pay in full.
---

# Setting Up Payment Plans

When a customer can't pay their full outstanding balance at once, you can set up a payment plan that splits the debt into smaller, scheduled installments.

## What is a payment plan?

A payment plan is an arrangement where:

- The total debt is divided into a series of **smaller payments**
- Each payment has its own **due date** based on the chosen frequency
- Each installment becomes its own **invoice** with the installment amount
- Payment collection can be **automated** via GoCardless direct debit

## Creating a payment plan

1. **Select the case** you want to create a plan for
2. **Configure the plan**:
   - **Start date** — when the first payment is due
   - **Number of payments** — how many installments (e.g., 6, 12, 24)
   - **Frequency** — how often payments are collected
   - **Interest** — optional interest rate applied to the total
3. **Review the schedule** — the platform calculates all installment amounts and due dates
4. **Confirm** — the plan is created and invoices are generated

## Frequency options

| Frequency | How it works |
|-----------|-------------|
| **Monthly** | Installments due on the same date each month (e.g., the 15th) |
| **Bi-weekly** | Every 14 days — faster collection cycle |
| **Weekly** | Every 7 days — the most aggressive collection option |

## Interest configuration

You can add interest to a payment plan:

- Set an **annual interest rate** (default is 4.99%)
- The platform calculates the **total interest** for the entire plan
- Interest is distributed evenly across all installments
- The **final payment** may differ slightly to account for rounding

**Example**: A £1,000 debt with £50 interest over 12 monthly payments = approximately £87.50 per month.

## What happens to the original invoice

When a payment plan is created, the platform handles the original invoice(s) automatically:

1. The original unpaid invoice(s) are marked as **"superseded"**
2. They're **closed** with an outstanding balance of £0
3. New **payment plan invoices** are generated — one for each installment
4. Only the payment plan invoices count towards the outstanding balance

This prevents **double-counting**. Without this step, both the original invoice and the payment plan invoices would show as outstanding, inflating your totals.

An audit trail records which invoices were superseded, when, and why.

## GoCardless mandate setup

Payment plans work best with **automated collection via GoCardless**:

### First installment
1. The customer receives a **payment link** via email
2. They click through to GoCardless and **authorise their bank**
3. A **direct debit mandate** is established
4. The first payment is collected

### Subsequent installments
- Collected **automatically** from the customer's bank — no action needed from the customer
- Uses the mandate established during the first payment
- GoCardless handles timing and retry logic

### If a payment fails
- GoCardless **Success+** automatically retries failed payments using intelligent timing
- You're notified of the failure
- Retry count and status are tracked on the invoice

## Minimum payment amount

The minimum installment amount is **£15**. When configuring a plan, ensure the total divided by the number of payments meets this threshold.

## Good to know

- Each installment invoice has its own due date and can be tracked independently
- Payment plan invoices appear separately in your invoice list with type "payment-plan"
- Pre-due reminders are sent automatically before each installment (7, 3, 1 days before and on the due date)
- The customer only needs to authorise the direct debit once — after that, payments are collected automatically

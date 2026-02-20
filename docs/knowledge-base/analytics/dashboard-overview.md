---
sidebar_position: 1
title: Dashboard Overview
description: Understanding your ÉquiSettle analytics dashboard — key metrics, status distribution, and aging buckets.
---

# Dashboard Overview

Your analytics dashboard gives you a real-time view of your collections performance. It shows what's been paid, what's outstanding, how quickly you're collecting, and where to focus your attention.

## Main dashboard metrics

These are the key numbers displayed at the top of your dashboard:

### Total Portfolio Value
The sum of all active case amounts. This represents the total value of debt you're managing on the platform.

### Outstanding Balance
The total amount still owed across all unpaid invoices. This decreases as payments come in.

### Amount Recovered
The total payments collected across all invoices. This shows how much money you've successfully brought in.

### Collection Rate
The percentage of invoices that have been paid. Calculated as:

> (Number of paid invoices / Total invoices) x 100

A higher collection rate means more invoices are being resolved.

### Expected Cash Flow
A forecast of incoming payments based on:
- Active payment plans (scheduled installments)
- Promise-to-pay commitments from customers
- Historical payment patterns

### DSO (Days Sales Outstanding)
The average number of days it takes to collect payment after an invoice is issued. Lower is better — it means you're collecting faster.

> Industry benchmark: 30-45 days is typical

## Status distribution

A visual breakdown showing how your invoices are distributed across statuses:

- **Paid** — fully collected
- **Unpaid** — nothing received yet
- **Partially paid** — some payment, balance remaining

:::info
Void, superseded, and cancelled invoices are **excluded** from this view. These are dead-end statuses that don't represent active receivables.
:::

## Aging buckets

Shows how long your overdue invoices have been outstanding. This helps you identify which debts need urgent attention:

| Bucket | What it means |
|--------|--------------|
| **Current** | Not yet due — the due date hasn't passed |
| **1-30 days overdue** | Recently overdue — still in early collection stage |
| **31-60 days overdue** | Moderately overdue — needs active follow-up |
| **61-90 days overdue** | Significantly overdue — consider escalation |
| **90+ days overdue** | Severely overdue — may need legal action or write-off |

The longer an invoice stays overdue, the harder it typically is to collect. Aging buckets help you prioritise accordingly.

## Dashboard customisation

You can personalise your dashboard:

| Customisation | What you can do |
|---------------|----------------|
| **Reorder stat cards** | Drag and drop to put your most important metrics first |
| **Reorder sections** | Rearrange dashboard sections to match your workflow |
| **Default time period** | Set which time period the dashboard shows by default |

## Filtering

Filter your dashboard data by:

### Time period
| Period | What it shows |
|--------|-------------|
| **All time** | Everything since you started using the platform |
| **This year** | January 1st of the current year to today |
| **Last 6 months** | The previous 6 months |
| **Last 30 days** | The previous 30 days |
| **Last year** | January 1st to December 31st of last year |

### Category
| Category | What it includes |
|----------|-----------------|
| **All** | Every invoice regardless of category |
| **Accounts receivable** | Money owed to you for goods or services delivered |
| **Expense** | Expense-related invoices |
| **Payment** | Payment-related records |
| **Other** | Anything that doesn't fit the above categories |

## Good to know

- Dashboard data is calculated in real-time — it reflects the current state of your invoices
- Only active, open invoices contribute to totals (void, superseded, cancelled, and closed invoices are excluded)
- Dashboard preferences are saved per user — each team member can customise their own view
- You can clear the analytics cache if you need to force a refresh

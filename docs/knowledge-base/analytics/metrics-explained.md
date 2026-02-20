---
sidebar_position: 3
title: Metrics Explained
description: What each metric means, how it's calculated, and how to use it.
---

# Metrics Explained

This page explains each analytics metric in detail — what it means, how it's calculated, and what to aim for.

## DSO (Days Sales Outstanding)

**What it measures**: The average number of days it takes to collect payment after an invoice is issued.

**Formula**:
> (Outstanding receivables / Total credit sales) x Number of days

**What to aim for**: Lower is better. Typical industry benchmarks are 30-45 days, but this varies by sector.

**How to use it**:
- Track DSO monthly to see if your collection speed is improving
- Compare against industry averages to benchmark your performance
- A rising DSO may indicate problems with your collection process or customer payment behaviour

ÉquiSettle tracks DSO monthly, so you can see trends over time.

## Collection Rate

**What it measures**: The percentage of invoices that have been fully paid.

**Formula**:
> (Number of paid invoices / Total invoices) x 100

**What to aim for**: Higher is better. A 90%+ collection rate is strong for most industries.

**How to use it**:
- Measures the effectiveness of your collection efforts
- A low collection rate may mean too many invoices are going uncollected
- Compare across categories to see which types of invoices are hardest to collect

## Payment Efficiency

**What it measures**: The percentage of total invoiced money that has actually been collected.

**Formula**:
> (Total paid amount / Total invoiced amount) x 100

**How it differs from collection rate**: Collection rate counts invoices (by number), payment efficiency counts money (by value). You might have a high collection rate but low payment efficiency if your largest invoices are unpaid.

## Overdue Rate

**What it measures**: What proportion of your unpaid invoices are past their due date.

**Formula**:
> (Number of overdue invoices / Number of unpaid invoices) x 100

**What to aim for**: Lower is better. A high overdue rate means most of your unpaid invoices have passed their due dates.

**How to use it**:
- A low overdue rate with many unpaid invoices may just mean the due dates haven't arrived yet
- A high overdue rate signals that customers are consistently paying late (or not at all)

## Year-over-year comparison

Compare this year's performance against last year:

- Same metrics, presented side by side
- See if you're collecting more, faster, or more efficiently than last year
- Useful for reporting to management or stakeholders

## Historical trends

Monthly aggregated metrics over time, including:

- **DSO trends** — is your collection speed improving month over month?
- **Collection effectiveness** — are you collecting a higher percentage over time?
- **Aging analysis** — is the proportion of severely overdue invoices growing or shrinking?

These trends help you see the bigger picture beyond any single month's numbers.

## Promise-to-Pay (PTP) tracking

When customers promise to pay by a specific date, PTP tracking helps you follow through:

- **PTP invoices** — see all invoices with a promise-to-pay commitment
- **Follow-through rate** — what percentage of promises are actually honoured
- **Daily PTP digest** — a daily report showing:
  - Promises coming due today
  - Promises that were due yesterday (did they pay?)
  - Upcoming promises in the next few days

PTP tracking is valuable for:
- Holding customers accountable to their commitments
- Prioritising follow-up when promises are broken
- Measuring whether verbal commitments translate to actual payments

## What's excluded from all analytics

To ensure accuracy, the following are **always excluded** from analytics calculations:

| Excluded | Why |
|----------|-----|
| **Void invoices** | Cancelled — never should have been counted |
| **Superseded invoices** | Replaced by payment plans or corrected invoices — counting them would double the totals |
| **Cancelled invoices** | No longer active |
| **Closed invoices** | Already finalised — their amounts have been settled or written off |

Only active, open invoices contribute to your analytics. This prevents phantom balances from inflating your numbers.

## Good to know

- All metrics update in real-time as payments are received and invoices are updated
- You can filter every metric by time period and category
- Historical data is preserved permanently — you can always look back at past performance
- Dashboard preferences (layout, default filters) are saved per user

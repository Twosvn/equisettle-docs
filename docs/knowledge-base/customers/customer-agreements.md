---
sidebar_position: 1
title: Customer Agreements
description: Managing customer relationships — agreements, reminder preferences, and credit monitoring.
---

# Customer Agreements

A **customer agreement** represents your relationship with a customer. It stores their details, preferences, and links all their cases together in one place.

## What is a customer agreement?

Think of it as a customer profile. It holds:

- **Customer details** — company or person name, contact information, billing address
- **All cases** linked to this customer — you can see their full history in one view
- **Preferences** — such as whether to send automatic reminders
- **Risk information** — credit scores, solvency data

## Creating a customer agreement

### Manual creation
When you first work with a new customer:

1. Go to Customer Agreements
2. Create a new agreement
3. Fill in the customer's details: name, contact info, billing address
4. Save — the agreement is ready to be linked to cases

### Automatic creation
A customer agreement is **auto-created** when:

- You convert a standalone invoice into a case and no agreement exists for that customer
- The system pulls customer details from the invoice data to create the agreement

## Managing agreements

| Action | What you can do |
|--------|----------------|
| **Update details** | Edit the customer's name, contact info, address, or any other stored information |
| **View linked cases** | See all cases associated with this customer — past and present |
| **Enable/disable reminders** | Control whether this customer receives automatic payment reminders |
| **Override risk score** | Manually adjust the customer's risk assessment if you have additional information |
| **Verify company details** | Confirm the customer's company registration and details |

## Reminder preferences

You can control automatic reminders at the customer level:

- **Enabled** (default) — the customer's invoices receive automatic reminders according to the milestone schedule
- **Disabled** — no automatic reminders are sent for any of this customer's invoices

This is useful when:
- A customer has requested not to be contacted
- You're in active negotiations and automated messages would be counterproductive
- The account is being handled manually

:::info
Reminder preferences can also be set at the case level. If reminders are disabled at **either** the customer or case level, no reminders are sent.
:::

## Credit monitoring

ÉquiSettle integrates with **Creditsafe** for credit monitoring:

### What you can view
- **Credit score** — the customer's overall creditworthiness
- **Solvency information** — financial stability indicators
- **Settlement data** — how quickly the customer typically pays their debts
- **Risk level assessment** — categorised risk (low, medium, high)

### Credit history
- Pull credit reports at any time for a customer
- Track how their credit score changes over time
- Use credit data to inform collection strategy (e.g., be more aggressive with high-risk customers)

### How to access
1. Open the customer agreement
2. Navigate to credit monitoring
3. View the latest report or pull a new one

## Monitoring dashboard

A real-time view of customer activity across all your customer agreements:

- See which customers have outstanding balances
- Track payment activity
- Identify customers who may need attention
- Overview of agreement statuses

## Good to know

- Each customer should have **one agreement** — all their cases are linked to it
- Agreements can be deleted if the customer relationship ends (all linked data is maintained for audit)
- Customer details from agreements are used in reminder emails and templates
- Credit monitoring requires a Creditsafe integration (set up by your Admin)

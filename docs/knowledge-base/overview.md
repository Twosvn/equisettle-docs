---
sidebar_position: 1
title: Welcome to ÉquiSettle
description: Your guide to using the ÉquiSettle platform for accounts receivable management and collections.
---

# Welcome to ÉquiSettle

ÉquiSettle is an accounts receivable management and collections platform. It helps you track outstanding invoices, manage debt cases, automate payment reminders, set up payment plans, and monitor your collections performance — all in one place.

## Who is this for?

This knowledge base is for everyone on your team who uses ÉquiSettle:

- **Admins** — full access to all features, settings, and user management
- **Managers** — oversee cases, approve workflows, and monitor team performance
- **Users** — day-to-day case management, sending reminders, and tracking payments

## The platform at a glance

```mermaid
flowchart LR
    A["Create Case"] --> B["Invoice Generated"]
    B --> C["Send Payment Link"]
    C --> D{"Customer Pays?"}
    D -- Yes --> E["Payment Recorded"]
    D -- No --> F["Automatic Reminders"]
    F --> G{"Still No Payment?"}
    G -- Pays --> E
    G -- No --> H["Escalation / Workflow"]
    H --> I{"Outcome"}
    I -- "Payment Plan" --> J["Installments Collected"]
    I -- "Dispute" --> K["Dispute Resolution"]
    I -- "Legal" --> L["Legal Action"]
    E --> M["Case Resolved"]
    J --> M
    K --> M
    L --> M
```

This diagram shows the core flow — from creating a case through to resolution. Most cases follow the left side (customer pays after a reminder), but the platform handles every scenario, including payment plans, disputes, and legal escalation.

## What you'll find here

| Section | What it covers |
|---------|---------------|
| [Platform Overview](./platform-overview) | How the platform works, key terminology, and user roles |
| [Cases](./cases/understanding-cases) | Creating and managing debt cases — the core of your collections work |
| [Invoices](./invoices/understanding-invoices) | Invoice types, statuses, payments, and accounting integrations |
| [Payment Plans](./payment-plans/setting-up-payment-plans) | Setting up installment plans for customers who can't pay in full |
| [Reminders & Communications](./reminders/how-reminders-work) | Automatic payment reminders via email, SMS, and WhatsApp |
| [Workflows](./workflows/understanding-workflows) | Automating your collection process with staged workflows |
| [Analytics & Reporting](./analytics/dashboard-overview) | Understanding your dashboard metrics and performance data |
| [Customers & Disputes](./customers/customer-agreements) | Managing customer relationships and handling disputes |
| [Teams & Portfolios](./teams/teams-and-portfolios) | Organising your team and grouping cases |
| [Bank Reconciliation](./reconciliation/bank-reconciliation) | Matching bank transactions to invoices |

## How everything connects

```mermaid
flowchart TD
    CA["Customer Agreement"] --> CASE["Case"]
    CASE --> INV["Invoice(s)"]
    INV --> PP["Payment Plan"]
    PP --> PP_INV["Installment Invoices"]
    INV --> REM["Reminders"]
    CASE --> WF["Workflow"]
    WF --> STAGES["Stages"]
    CASE --> PORT["Portfolio"]
    PORT --> TEAM["Team"]
    INV --> PAY["Payment via GoCardless"]
    PAY --> ACCT["Accounting Software"]
    INV --> RECON["Bank Reconciliation"]
    CASE --> DISP["Dispute"]

    style CA fill:#e1f5fe
    style CASE fill:#fff3e0
    style INV fill:#e8f5e9
    style PP fill:#fce4ec
    style WF fill:#f3e5f5
```

The **Customer Agreement** is at the top — it represents your relationship with a customer. Under it sit **Cases**, each with **Invoices**. From there, the platform branches into payment collection, reminders, workflows, analytics, and more. Everything is connected and automatically kept in sync.

## The basics in 30 seconds

1. **Create a case** — import via CSV or create manually for a customer who owes money
2. **An invoice is generated** — linked to the case with the amount and due date
3. **Send a payment link** — customer receives an email with a secure link to pay online via GoCardless
4. **Reminders go out automatically** — if the customer doesn't pay, the platform sends escalating reminders on a milestone schedule (day 0, 1, 7, 14, then weekly)
5. **Track everything** — your dashboard shows what's been paid, what's overdue, and where to focus
6. **Escalate when needed** — workflows automate the progression from gentle reminders through to legal action

If a customer can't pay in full, you can set up a **payment plan** to collect in installments (the original invoice is superseded and replaced by installment invoices). If there's a disagreement, you can raise a **dispute** that follows a formal resolution process. And **workflows** let you automate the entire process from first contact to resolution.

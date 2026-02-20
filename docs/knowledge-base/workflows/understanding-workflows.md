---
sidebar_position: 1
title: Understanding Workflows
description: What workflows are, how they automate your collection process, and how to get started.
---

# Understanding Workflows

Workflows automate your collection process by defining a series of **stages** that a case progresses through — from initial contact all the way to resolution.

## What is a workflow?

A workflow is an ordered series of steps that define how you handle a debt. Each step (called a "stage") has a specific action:

- Send an email to the customer
- Request documents from the customer
- Serve legal documents
- Generate documents from templates
- Hand off to an external partner

Cases move through stages either **automatically** (after a set time period) or **manually** (when you decide to progress). Everything is tracked for audit and compliance.

## Default workflows vs custom workflows

### Default workflows
- Come pre-configured with your ÉquiSettle account
- Include standard processes like "Payment Plan Management" and "Standard Collection"
- Cannot be deleted (but can be modified)
- Serve as templates you can learn from

### Custom workflows
- Created by your team to match your specific collection process
- Fully configurable — define your own stages, actions, and timing
- Can be edited or deleted at any time
- Only Admins can create and manage workflows

## Assigning a workflow to a case

To start a workflow on a case:

1. Open the case
2. Select the workflow you want to assign
3. The workflow activates immediately:
   - The first stage **auto-completes** (it's an acknowledgment that the workflow has started)
   - The case status moves to **"In Progress"**
   - A **next action date** is calculated based on the first active stage's validity period
   - An **estimated completion date** is calculated based on all remaining stages

## Auto-activation

You can configure workflows to start automatically:

### For single-invoice cases
- If "auto-activate workflow" is enabled in your company settings, the configured workflow starts as soon as the case is created

### For multi-invoice cases
- The workflow only auto-activates when an **overdue invoice is added** to the case (not at creation)
- This prevents workflows starting on cases that don't have any overdue invoices yet

### Configuration
- Go to company settings (Admin only)
- Enable "auto-activate workflow on cases"
- Select which workflow to auto-activate

## Workflow statuses

| Status | What it means |
|--------|--------------|
| **Active** | Currently running — stages are progressing |
| **Paused** | Temporarily halted — no stages will progress until resumed |
| **Completed** | All stages have been finished |
| **Failed** | The workflow encountered an error |

## Trigger statuses

Each stage in a workflow responds to a specific "trigger status" — the event or situation that stage is designed to handle:

| Category | Triggers |
|----------|---------|
| **Initial** | Initial Contact |
| **Payment** | Payment Overdue, Full Settlement, Partial Settlement, Payment Plan Settlement, Incomplete Settlement |
| **Reminders** | First Reminder, Second Reminder, Final Notice |
| **Disputes** | Dispute Approved, Dispute Resolved, Dispute Upheld, Dispute Rejected |
| **Escalation** | Debt Written Off, Legal Action Taken, Deemed Uncollectable |

These triggers help the platform determine the right email template and action for each stage.

## Good to know

- A case can only have **one active workflow** at a time
- Workflow history is maintained — you can see all previous workflows that ran on a case
- Workflows can be **transitioned** — move a case from one workflow to another (with approval if configured)
- All workflow actions are logged with who did what and when

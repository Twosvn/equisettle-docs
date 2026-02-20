---
sidebar_position: 2
title: Stages & Progression
description: How workflow stages work — stage types, automatic progression, skipping, and transitions.
---

# Stages & Progression

Workflow stages are the individual steps in your collection process. Each stage has an action type that determines what happens, and rules that control how the case moves forward.

## Stage types

### Send Email
Sends a templated email to the customer based on the trigger status (e.g., "Payment Overdue" triggers an overdue reminder email).

- Uses your company's email templates
- Can send grouped emails (one email listing all invoices) for multi-invoice cases
- Email content is personalised with customer and invoice details

### Document Request
Requests documents from the customer — for example, proof of income, identification, or financial statements.

- Define exactly which documents you need
- The customer receives a **secure link** to upload documents
- You can track which documents have been requested, uploaded, and verified
- Set reminder schedules for non-responsive customers

### Legal Document Serving
Serves legal documents to the customer through formal channels.

- **Serving methods**: Email, post, or personal delivery
- For post: record the tracking number and mail date
- For personal delivery: record proof of service
- Can require the customer to **acknowledge receipt**
- Proof of service documents can be uploaded (PDF)

### Document Generation
Automatically generates documents from pre-defined templates — for example, payment agreements, legal notices, or debt acknowledgment letters.

- Select a **document template**
- The system fills in case data automatically (customer name, amounts, dates, etc.)
- Generated documents are stored and available for download
- Can be immediately used for serving in the next stage

### External Handoff
Escalates the case to an external partner — such as a legal team, debt collection agency, or debt buyer.

- Creates a **handoff invoice** for the external partner
- Stops normal collection activities on the case
- Used when internal collection efforts have been exhausted

## How stages progress

### Automatic progression
If a stage has a **validity period** and **auto-progress** enabled:

1. The stage starts when it becomes active
2. A timer runs for the validity period (e.g., 7 days)
3. When the period expires, the case **automatically advances** to the next stage
4. No manual action needed

This keeps cases moving and prevents them from sitting idle.

### Manual progression
You can manually progress a case at any time:

- **Progress** — move to the next stage
- **Skip** — jump past a stage (if allowed)
- **Complete** — mark the current stage as finished

All progressions are logged with: who did it, when, and any notes provided.

## Validity periods

Each stage can have a time limit that determines how long it stays active before auto-progressing:

| Unit | Example |
|------|---------|
| **Minutes** | 30 minutes (for urgent stages) |
| **Hours** | 24 hours |
| **Days** | 7 days (most common) |
| **Weeks** | 2 weeks |

After the validity period expires:
- If auto-progress is **on**: the case moves to the next stage automatically
- If auto-progress is **off**: the stage stays active until someone manually progresses it

## Skipping a stage

Some stages allow skipping — jumping past them without completing the stage's action.

### When skipping is allowed
- The stage must be configured with "can be skipped" enabled
- Some skips **require approval** from a manager or admin
- You may need to **provide a reason** (if configured)

### Skip approval flow
1. You request to skip the stage
2. If approval is required, the request goes to a manager or admin
3. The approver reviews and either approves or rejects
4. If approved, the case moves to the next stage
5. If rejected, the case stays on the current stage

## Stage priority levels

Each stage has a priority that helps your team focus:

| Priority | When to use |
|----------|------------|
| **Low** | Routine stages that aren't time-sensitive |
| **Medium** | Standard collection stages |
| **High** | Stages that need prompt attention |
| **Critical** | Urgent stages — legal deadlines, compliance requirements |

Priority doesn't affect automatic progression — it's a visual indicator for your team.

## Transitioning between workflows

You can move a case from one workflow to another:

1. Select the case and choose to transition the workflow
2. Pick the new workflow
3. If **approval is required**, the transition request goes to a manager or admin
4. The approver can approve or reject with a reason
5. If approved, the new workflow starts

### What's maintained
- Full history: which workflows ran, when they were transitioned, why, and by whom
- The old workflow's stage history is preserved
- The new workflow starts from its first stage

This is useful when a case needs a different approach — for example, transitioning from a standard collection workflow to a legal action workflow.

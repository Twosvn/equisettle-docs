---
sidebar_position: 3
title: "Case Management (CSV Mapping)"
description: "Comprehensive guide to the core case management system and CSV mapping functionality"
---

# Case Management System (CSV Mapping)

The Case Management System, implemented through the CSV Mapping module, is the core of the ÉquiSettle platform. It manages debt collection cases, customer information, and automated workflows for comprehensive accounts receivable management.

## Overview

### Key Features
- **Multi-type Case Support**: Individual and company debt cases
- **Comprehensive Data Management**: Complete customer and case information
- **Workflow Integration**: Automated debt collection workflows
- **Follow-up System**: Scheduled and automated follow-up management
- **Payment Arrangements**: Flexible payment plan creation and tracking
- **Integration Support**: Seamless data sync with external systems
- **Audit Trail**: Complete case history and status tracking

### Core Entities
- **CSVMapping**: Primary case entity with complete debt information
- **WorkflowStatus**: Current and historical workflow states
- **FollowUp**: Individual follow-up items and scheduling
- **StatusHistory**: Complete audit trail of case changes
- **CaseActivity**: Activity logging and user interactions

## Data Models

### Primary Case Model (CSVMapping)

```javascript
const CSVMappingSchema = new mongoose.Schema({
  // Basic case information
  name: { type: String, required: true, trim: true },
  caseType: {
    type: String,
    enum: ["person", "company"],
    default: "person"
  },
  companyAccount: { type: ObjectId, ref: "Company", required: true },

  // Individual person details
  firstName: String,
  lastName: String,
  email: { type: String, lowercase: true, trim: true },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: "United Kingdom" }
  },
  dateOfBirth: Date,

  // Company-specific details
  companyDetails: {
    name: String,
    registrationNumber: String,
    clientReference: String,
    amount: String,
    dueDate: Date,
    vatTaxId: String,
    industry: {
      type: String,
      enum: ["finance", "healthcare", "retail", "manufacturing", "technology", "legal", "other"]
    },
    companySize: {
      type: String,
      enum: ["small", "medium", "large", "enterprise"]
    },

    // Multiple address support
    addresses: [{
      addressType: {
        type: String,
        enum: ["physical", "billing", "shipping", "registered", "mailing"]
      },
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "United Kingdom" },
      isPrimary: { type: Boolean, default: false }
    }],

    // Primary contact information
    primaryContact: {
      firstName: String,
      lastName: String,
      email: { type: String, lowercase: true },
      phone: String,
      position: String,
      department: String
    },

    // Role-based contacts for different departments
    roleBasedContacts: [{
      role: {
        type: String,
        enum: ["billing", "legal", "technical", "operations", "sales", "administrative", "accounts_payable", "cfo", "ceo", "other"]
      },
      firstName: String,
      lastName: String,
      email: { type: String, lowercase: true },
      phone: String,
      department: String,
      position: String,
      isPrimary: { type: Boolean, default: false }
    }]
  },

  // Financial information
  outstandingBalance: { type: Number, default: 0, min: 0 },
  originalAmount: { type: Number, default: 0, min: 0 },
  creditAmount: { type: Number, default: 0, min: 0 },
  paymentStatus: {
    type: String,
    enum: ["has_debt", "paid", "has_credit", "in_payment_plan", "disputed"],
    default: "has_debt"
  },
  currency: { type: String, default: "GBP" },

  // Case status and lifecycle
  status: {
    type: String,
    enum: ["pending", "active", "on_hold", "completed", "cancelled", "dispute", "legal"],
    default: "pending"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },

  // Workflow management
  activeWorkflow: {
    workflowId: { type: ObjectId, ref: "Workflow" },
    workflowName: String,
    currentStageId: ObjectId,
    currentStageName: String,
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    pausedAt: Date,
    status: {
      type: String,
      enum: ["active", "paused", "completed", "failed", "cancelled"],
      default: "active"
    }
  },

  workflowHistory: [{
    workflowId: { type: ObjectId, ref: "Workflow" },
    workflowName: String,
    startedAt: Date,
    completedAt: Date,
    finalStatus: String,
    reason: String
  }],

  // Follow-up system
  followups: [{
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    reminderDateTime: Date,
    completedAt: Date,
    status: {
      type: String,
      enum: ["pending", "completed", "snoozed", "read", "overdue"],
      default: "pending"
    },
    type: {
      type: String,
      enum: ["call", "email", "sms", "letter", "meeting", "payment_reminder", "legal_notice", "custom"],
      default: "custom"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    assignedTo: { type: ObjectId, ref: "CompanyAdmin" },
    createdBy: { type: ObjectId, ref: "CompanyAdmin" },

    // Snooze functionality
    snoozeDetails: {
      until: Date,
      reason: String,
      count: { type: Number, default: 0 },
      snoozeHistory: [{
        snoozedAt: Date,
        until: Date,
        reason: String,
        snoozedBy: { type: ObjectId, ref: "CompanyAdmin" }
      }]
    },

    // Contact information for follow-up
    contactInfo: {
      name: String,
      phone: String,
      email: String,
      preferredMethod: {
        type: String,
        enum: ["phone", "email", "sms"],
        default: "phone"
      },
      bestTimeToContact: String,
      timeZone: String
    },

    // Quick notes and outcomes
    quickNotes: [{
      note: String,
      timestamp: { type: Date, default: Date.now },
      user: { type: ObjectId, ref: "CompanyAdmin" },
      isOutcome: { type: Boolean, default: false }
    }],

    // Follow-up outcomes
    outcome: {
      result: {
        type: String,
        enum: ["contacted", "no_answer", "busy", "voicemail", "email_sent", "promise_to_pay", "payment_made", "dispute", "refused", "other"]
      },
      notes: String,
      nextAction: String,
      nextActionDate: Date,
      paymentPromise: {
        amount: Number,
        date: Date,
        method: String
      }
    }
  }],

  // Integration references
  integrationReferences: {
    quickbooks: [{
      customerId: String,
      invoiceIds: [String],
      lastSynced: Date
    }],
    zoho: [{
      contactId: String,
      dealId: String,
      lastSynced: Date
    }],
    clio: [{
      contactId: String,
      matterId: String,
      lastSynced: Date
    }],
    sage: [{
      customerId: String,
      invoiceIds: [String],
      lastSynced: Date
    }]
  },

  // Audit and tracking
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: ObjectId, refPath: "statusHistory.userSchema" },
    userSchema: {
      type: String,
      enum: ["CompanyAdmin", "Manager", "CompanyUser"]
    },
    reason: String,
    automaticChange: { type: Boolean, default: false },
    workflowTriggered: { type: Boolean, default: false }
  }],

  // Email audit trail
  emailsAudit: [{
    workflowId: { type: ObjectId, ref: "Workflow" },
    stageId: ObjectId,
    templateId: ObjectId,
    subject: String,
    body: String,
    recipient: String,
    sentAt: Date,
    deliveredAt: Date,
    openedAt: Date,
    clickedAt: Date,
    bouncedAt: Date,
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "opened", "clicked", "bounced", "failed"]
    },
    provider: String,
    messageId: String,
    errorMessage: String
  }],

  // Case lifecycle tracking
  lifeCycle: {
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: ObjectId, ref: "CompanyAdmin" },
    lastModifiedAt: { type: Date, default: Date.now },
    lastModifiedBy: { type: ObjectId, ref: "CompanyAdmin" },
    firstContactAt: Date,
    lastContactAt: Date,
    expectedResolutionDate: Date,
    actualResolutionDate: Date
  },

  // Case closure management
  isClosed: { type: Boolean, default: false },
  closureDetails: {
    closedAt: Date,
    closedBy: { type: ObjectId, refPath: "closureDetails.userSchema" },
    userSchema: {
      type: String,
      enum: ["CompanyAdmin", "Manager", "CompanyUser"]
    },
    reason: {
      type: String,
      enum: ["paid_in_full", "payment_plan_completed", "written_off", "disputed_resolved", "uncollectable", "legal_action", "customer_bankruptcy", "other"]
    },
    finalAmount: Number,
    recoveredAmount: Number,
    notes: String
  },

  // Reopening history
  reopeningHistory: [{
    date: { type: Date, default: Date.now },
    by: { type: ObjectId, refPath: "reopeningHistory.userSchema" },
    userSchema: {
      type: String,
      enum: ["CompanyAdmin", "Manager", "CompanyUser"]
    },
    reason: String,
    previousStatus: String
  }],

  // Additional metadata
  tags: [String],
  customFields: Map,
  notes: String,

  // Automated flags
  isHighRisk: { type: Boolean, default: false },
  requiresLegalAction: { type: Boolean, default: false },
  isVip: { type: Boolean, default: false },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

### Workflow Status Model

```javascript
const WorkflowStatusSchema = new mongoose.Schema({
  caseId: { type: ObjectId, ref: "CSVMappings", required: true },
  workflowId: { type: ObjectId, ref: "Workflow", required: true },
  workflowName: String,

  // Current stage information
  currentStageId: { type: ObjectId, required: true },
  currentStageName: String,
  stageEnteredAt: { type: Date, default: Date.now },

  // Progress tracking
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  pausedAt: Date,
  resumedAt: Date,

  // Stage progression history
  stageHistory: [{
    stageId: ObjectId,
    stageName: String,
    enteredAt: { type: Date, default: Date.now },
    exitedAt: Date,
    duration: Number, // milliseconds

    // Actions performed in this stage
    actionsPerformed: [{
      actionType: {
        type: String,
        enum: ["email_sent", "sms_sent", "call_made", "letter_sent", "payment_received", "workflow_progressed", "manual_action"]
      },
      performedAt: { type: Date, default: Date.now },
      performedBy: { type: ObjectId, ref: "CompanyAdmin" },
      automated: { type: Boolean, default: false },
      result: String,
      metadata: mongoose.Schema.Types.Mixed
    }],

    // Stage completion criteria
    completionCriteria: {
      timeElapsed: Number,
      actionsCompleted: [String],
      conditionsMet: [String]
    }
  }],

  // Workflow statistics
  statistics: {
    emailsSent: { type: Number, default: 0 },
    smsSent: { type: Number, default: 0 },
    callsMade: { type: Number, default: 0 },
    lettersSent: { type: Number, default: 0 },
    totalDuration: Number,
    averageStageTime: Number
  },

  // Current workflow status
  status: {
    type: String,
    enum: ["active", "paused", "completed", "failed", "cancelled"],
    default: "active"
  },

  // Workflow configuration at time of start
  workflowSnapshot: mongoose.Schema.Types.Mixed,

  // Next scheduled action
  nextScheduledAction: {
    actionType: String,
    scheduledFor: Date,
    actionData: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});
```

## Core Operations

### Case Creation

#### Create Individual Case
```javascript
const createIndividualCase = async (req, res) => {
  try {
    const { companyId } = req.user;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      outstandingBalance,
      dateOfBirth,
      workflowId
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !outstandingBalance) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and outstanding balance are required'
      });
    }

    // Check for duplicate cases
    const existingCase = await CSVMappings.findOne({
      companyAccount: companyId,
      email: email.toLowerCase(),
      isClosed: false
    });

    if (existingCase) {
      return res.status(409).json({
        success: false,
        message: 'Active case already exists for this customer'
      });
    }

    // Create new case
    const newCase = new CSVMappings({
      name: `${firstName} ${lastName}`,
      caseType: "person",
      companyAccount: companyId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      address,
      outstandingBalance: parseFloat(outstandingBalance),
      originalAmount: parseFloat(outstandingBalance),
      dateOfBirth,
      status: "pending",
      lifeCycle: {
        createdBy: req.user.id,
        createdAt: new Date()
      },
      statusHistory: [{
        status: "pending",
        changedBy: req.user.id,
        userSchema: req.user.schema,
        reason: "Case created"
      }]
    });

    await newCase.save();

    // Initialize workflow if specified
    if (workflowId) {
      await initializeWorkflow(newCase._id, workflowId, req.user.id);
    }

    // Log case creation activity
    await CaseActivity.create({
      caseId: newCase._id,
      companyId,
      userId: req.user.id,
      activityType: "case_created",
      description: `Case created for ${firstName} ${lastName}`,
      metadata: {
        caseType: "person",
        initialAmount: outstandingBalance
      }
    });

    res.status(201).json({
      success: true,
      message: 'Individual case created successfully',
      data: newCase
    });

  } catch (error) {
    console.error('Create individual case error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create case',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

#### Create Company Case
```javascript
const createCompanyCase = async (req, res) => {
  try {
    const { companyId } = req.user;
    const {
      companyDetails,
      outstandingBalance,
      workflowId,
      priority = "medium"
    } = req.body;

    // Validate company details
    if (!companyDetails.name || !outstandingBalance) {
      return res.status(400).json({
        success: false,
        message: 'Company name and outstanding balance are required'
      });
    }

    // Check for duplicate cases by company name or registration number
    const duplicateQuery = {
      companyAccount: companyId,
      caseType: "company",
      isClosed: false,
      $or: [
        { "companyDetails.name": companyDetails.name },
        ...(companyDetails.registrationNumber ?
          [{ "companyDetails.registrationNumber": companyDetails.registrationNumber }] :
          []
        )
      ]
    };

    const existingCase = await CSVMappings.findOne(duplicateQuery);

    if (existingCase) {
      return res.status(409).json({
        success: false,
        message: 'Active case already exists for this company',
        existingCase: {
          id: existingCase._id,
          name: existingCase.name,
          amount: existingCase.outstandingBalance
        }
      });
    }

    // Create new company case
    const newCase = new CSVMappings({
      name: companyDetails.name,
      caseType: "company",
      companyAccount: companyId,
      companyDetails: {
        ...companyDetails,
        // Ensure primary address is marked
        addresses: companyDetails.addresses?.map((addr, index) => ({
          ...addr,
          isPrimary: index === 0 || addr.isPrimary
        })) || []
      },
      outstandingBalance: parseFloat(outstandingBalance),
      originalAmount: parseFloat(outstandingBalance),
      priority,
      status: "pending",
      lifeCycle: {
        createdBy: req.user.id,
        createdAt: new Date()
      },
      statusHistory: [{
        status: "pending",
        changedBy: req.user.id,
        userSchema: req.user.schema,
        reason: "Case created"
      }]
    });

    await newCase.save();

    // Initialize workflow if specified
    if (workflowId) {
      await initializeWorkflow(newCase._id, workflowId, req.user.id);
    }

    // Log case creation activity
    await CaseActivity.create({
      caseId: newCase._id,
      companyId,
      userId: req.user.id,
      activityType: "case_created",
      description: `Company case created for ${companyDetails.name}`,
      metadata: {
        caseType: "company",
        initialAmount: outstandingBalance,
        registrationNumber: companyDetails.registrationNumber
      }
    });

    res.status(201).json({
      success: true,
      message: 'Company case created successfully',
      data: newCase
    });

  } catch (error) {
    console.error('Create company case error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create company case',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

### Case Updates

#### Update Case Status
```javascript
const updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status, reason, workflowAction } = req.body;
    const { companyId, id: userId, schema: userSchema } = req.user;

    // Validate status
    const validStatuses = ["pending", "active", "on_hold", "completed", "cancelled", "dispute", "legal"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Get current case
    const currentCase = await CSVMappings.findOne({
      _id: caseId,
      companyAccount: companyId
    });

    if (!currentCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    const oldStatus = currentCase.status;

    // Update case status
    const updatedCase = await CSVMappings.findByIdAndUpdate(
      caseId,
      {
        status,
        'lifeCycle.lastModifiedAt': new Date(),
        'lifeCycle.lastModifiedBy': userId,
        $push: {
          statusHistory: {
            status,
            changedBy: userId,
            userSchema,
            reason: reason || `Status changed from ${oldStatus} to ${status}`,
            automaticChange: false
          }
        }
      },
      { new: true }
    );

    // Handle workflow implications
    if (workflowAction && currentCase.activeWorkflow) {
      await handleWorkflowStatusChange(caseId, status, workflowAction, userId);
    }

    // Log status change activity
    await CaseActivity.create({
      caseId,
      companyId,
      userId,
      activityType: "status_changed",
      description: `Status changed from ${oldStatus} to ${status}`,
      metadata: {
        oldStatus,
        newStatus: status,
        reason,
        workflowAction
      }
    });

    // Trigger notifications
    await NotificationService.notifyStatusChange({
      caseId,
      companyId,
      oldStatus,
      newStatus: status,
      changedBy: userId,
      reason
    });

    res.json({
      success: true,
      message: 'Case status updated successfully',
      data: updatedCase
    });

  } catch (error) {
    console.error('Update case status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update case status'
    });
  }
};
```

### Follow-up Management

#### Create Follow-up
```javascript
const createFollowUp = async (req, res) => {
  try {
    const { caseId } = req.params;
    const {
      body,
      reminderDateTime,
      type = "custom",
      priority = "medium",
      assignedTo,
      contactInfo
    } = req.body;
    const { companyId, id: userId } = req.user;

    // Validate case exists
    const caseExists = await CSVMappings.findOne({
      _id: caseId,
      companyAccount: companyId
    });

    if (!caseExists) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    // Create follow-up
    const followUp = {
      body,
      reminderDateTime: reminderDateTime ? new Date(reminderDateTime) : undefined,
      type,
      priority,
      assignedTo: assignedTo || userId,
      createdBy: userId,
      contactInfo,
      status: "pending"
    };

    const updatedCase = await CSVMappings.findByIdAndUpdate(
      caseId,
      {
        $push: { followups: followUp },
        'lifeCycle.lastModifiedAt': new Date(),
        'lifeCycle.lastModifiedBy': userId
      },
      { new: true }
    );

    const newFollowUp = updatedCase.followups[updatedCase.followups.length - 1];

    // Schedule reminder if datetime provided
    if (reminderDateTime) {
      await scheduleFollowUpReminder(caseId, newFollowUp._id, reminderDateTime);
    }

    // Log follow-up creation
    await CaseActivity.create({
      caseId,
      companyId,
      userId,
      activityType: "followup_created",
      description: `Follow-up created: ${type}`,
      metadata: {
        followUpId: newFollowUp._id,
        type,
        priority,
        hasReminder: !!reminderDateTime
      }
    });

    res.status(201).json({
      success: true,
      message: 'Follow-up created successfully',
      data: newFollowUp
    });

  } catch (error) {
    console.error('Create follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create follow-up'
    });
  }
};
```

#### Complete Follow-up
```javascript
const completeFollowUp = async (req, res) => {
  try {
    const { caseId, followUpId } = req.params;
    const { outcome, notes, nextAction, nextActionDate } = req.body;
    const { companyId, id: userId } = req.user;

    // Update follow-up status
    const updatedCase = await CSVMappings.findOneAndUpdate(
      {
        _id: caseId,
        companyAccount: companyId,
        "followups._id": followUpId
      },
      {
        $set: {
          "followups.$.status": "completed",
          "followups.$.completedAt": new Date(),
          "followups.$.outcome": {
            result: outcome,
            notes,
            nextAction,
            nextActionDate: nextActionDate ? new Date(nextActionDate) : undefined
          }
        },
        'lifeCycle.lastModifiedAt': new Date(),
        'lifeCycle.lastModifiedBy': userId,
        'lifeCycle.lastContactAt': new Date()
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({
        success: false,
        message: 'Case or follow-up not found'
      });
    }

    // Create next follow-up if specified
    if (nextAction && nextActionDate) {
      const nextFollowUp = {
        body: nextAction,
        reminderDateTime: new Date(nextActionDate),
        type: "custom",
        priority: "medium",
        createdBy: userId,
        assignedTo: userId,
        status: "pending"
      };

      await CSVMappings.findByIdAndUpdate(caseId, {
        $push: { followups: nextFollowUp }
      });
    }

    // Log completion
    await CaseActivity.create({
      caseId,
      companyId,
      userId,
      activityType: "followup_completed",
      description: `Follow-up completed with outcome: ${outcome}`,
      metadata: {
        followUpId,
        outcome,
        hasNextAction: !!(nextAction && nextActionDate)
      }
    });

    res.json({
      success: true,
      message: 'Follow-up completed successfully',
      data: updatedCase.followups.id(followUpId)
    });

  } catch (error) {
    console.error('Complete follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete follow-up'
    });
  }
};
```

## Background Jobs and Automation

### Case Outstanding Status Cron
```javascript
// Cron job to update case outstanding statuses
const cron = require('node-cron');

const updateCaseOutstandingStatus = cron.schedule('0 */6 * * *', async () => {
  console.log('Running case outstanding status update...');

  try {
    const companies = await Company.find({ isActive: true });

    for (const company of companies) {
      await updateCompanyCaseStatuses(company._id);
    }

    console.log('Case outstanding status update completed');

  } catch (error) {
    console.error('Case outstanding status update error:', error);
  }
}, {
  scheduled: false
});

const updateCompanyCaseStatuses = async (companyId) => {
  try {
    // Find cases with overdue amounts
    const overdueCases = await CSVMappings.find({
      companyAccount: companyId,
      status: { $in: ["pending", "active"] },
      outstandingBalance: { $gt: 0 },
      $or: [
        { "companyDetails.dueDate": { $lt: new Date() } },
        { "followups.reminderDateTime": { $lt: new Date() } }
      ]
    });

    for (const case of overdueCases) {
      // Check if case needs status update
      const shouldUpdateStatus = await shouldUpdateCaseStatus(case);

      if (shouldUpdateStatus.update) {
        await CSVMappings.findByIdAndUpdate(case._id, {
          status: shouldUpdateStatus.newStatus,
          $push: {
            statusHistory: {
              status: shouldUpdateStatus.newStatus,
              reason: shouldUpdateStatus.reason,
              automaticChange: true,
              changedAt: new Date()
            }
          }
        });

        // Log automatic status change
        await CaseActivity.create({
          caseId: case._id,
          companyId,
          activityType: "status_auto_updated",
          description: shouldUpdateStatus.reason,
          metadata: {
            oldStatus: case.status,
            newStatus: shouldUpdateStatus.newStatus,
            automatic: true
          }
        });
      }
    }

  } catch (error) {
    console.error(`Error updating case statuses for company ${companyId}:`, error);
  }
};

// Initialize cron job
updateCaseOutstandingStatus.start();
```

### Follow-up Reminder System
```javascript
// Cron job for follow-up reminders
const followUpReminderJob = cron.schedule('*/15 * * * *', async () => {
  console.log('Checking for due follow-up reminders...');

  try {
    const now = new Date();

    // Find cases with due follow-up reminders
    const casesWithDueReminders = await CSVMappings.find({
      "followups.reminderDateTime": { $lte: now },
      "followups.status": "pending"
    }).populate('companyAccount');

    for (const case of casesWithDueReminders) {
      const dueFollowUps = case.followups.filter(
        f => f.status === 'pending' &&
             f.reminderDateTime &&
             f.reminderDateTime <= now
      );

      for (const followUp of dueFollowUps) {
        await sendFollowUpReminder(case, followUp);

        // Update reminder status
        await CSVMappings.findOneAndUpdate(
          { _id: case._id, "followups._id": followUp._id },
          { $set: { "followups.$.status": "overdue" } }
        );
      }
    }

  } catch (error) {
    console.error('Follow-up reminder job error:', error);
  }
});

const sendFollowUpReminder = async (caseData, followUp) => {
  try {
    // Send email notification to assigned user
    const assignedUser = await CompanyAdmin.findById(followUp.assignedTo);

    if (assignedUser && assignedUser.email) {
      await EmailService.sendTemplate({
        to: assignedUser.email,
        template: 'followup_reminder',
        variables: {
          caseName: caseData.name,
          followUpBody: followUp.body,
          dueDate: followUp.reminderDateTime,
          caseUrl: `${process.env.FRONTEND_URL}/cases/${caseData._id}`
        }
      });
    }

    // Create notification
    await Notification.create({
      recipient: followUp.assignedTo,
      recipientModel: 'CompanyAdmin',
      title: 'Follow-up Reminder',
      message: `Follow-up due for case: ${caseData.name}`,
      type: 'reminder',
      relatedEntity: caseData._id,
      relatedModel: 'CSVMappings',
      actionUrl: `/cases/${caseData._id}`
    });

  } catch (error) {
    console.error('Send follow-up reminder error:', error);
  }
};

// Start the job
followUpReminderJob.start();
```

## API Endpoints

### Case Management Endpoints
```
# Case CRUD Operations
GET    /api/v1/csv-mappings              # Get all cases with filters
POST   /api/v1/csv-mappings              # Create new case
GET    /api/v1/csv-mappings/:id          # Get specific case
PUT    /api/v1/csv-mappings/:id          # Update case
DELETE /api/v1/csv-mappings/:id          # Delete case

# Case Status Management
PUT    /api/v1/csv-mappings/:id/status   # Update case status
GET    /api/v1/csv-mappings/:id/history  # Get case history

# Follow-up Management
GET    /api/v1/csv-mappings/:id/followups         # Get case follow-ups
POST   /api/v1/csv-mappings/:id/followups         # Create follow-up
PUT    /api/v1/csv-mappings/:id/followups/:fid    # Update follow-up
DELETE /api/v1/csv-mappings/:id/followups/:fid    # Delete follow-up
POST   /api/v1/csv-mappings/:id/followups/:fid/complete  # Complete follow-up

# Bulk Operations
POST   /api/v1/csv-mappings/bulk-update  # Bulk update cases
POST   /api/v1/csv-mappings/bulk-assign  # Bulk assign cases
POST   /api/v1/csv-mappings/export       # Export cases

# Case Analytics
GET    /api/v1/csv-mappings/analytics    # Get case analytics
GET    /api/v1/csv-mappings/metrics      # Get case metrics
```

## Performance Optimization

### Database Indexing
```javascript
// Strategic indexes for case management
CSVMapping.index({ companyAccount: 1, name: 1 });
CSVMapping.index({ companyAccount: 1, status: 1 });
CSVMapping.index({ companyAccount: 1, "followups.status": 1 });
CSVMapping.index({ companyAccount: 1, "followups.reminderDateTime": 1 });
CSVMapping.index({ companyAccount: 1, outstandingBalance: -1 });
CSVMapping.index({ companyAccount: 1, priority: 1, status: 1 });

// Text search index
CSVMapping.index({
  name: "text",
  "companyDetails.name": "text",
  email: "text",
  "companyDetails.primaryContact.email": "text"
});

// Compound indexes for common queries
CSVMapping.index({
  companyAccount: 1,
  status: 1,
  "lifeCycle.createdAt": -1
});
```

### Query Optimization
```javascript
// Optimized case listing with pagination
const getCasesList = async (companyId, filters, options) => {
  const { page = 1, limit = 20, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  // Build filter query
  const query = {
    companyAccount: companyId,
    ...buildCaseFilters(filters)
  };

  // Use aggregation for complex queries
  const pipeline = [
    { $match: query },
    {
      $lookup: {
        from: 'companyadmins',
        localField: 'lifeCycle.createdBy',
        foreignField: '_id',
        as: 'creator'
      }
    },
    {
      $addFields: {
        overdueFollowups: {
          $size: {
            $filter: {
              input: '$followups',
              cond: {
                $and: [
                  { $eq: ['$$this.status', 'pending'] },
                  { $lt: ['$$this.reminderDateTime', new Date()] }
                ]
              }
            }
          }
        }
      }
    },
    { $sort: { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ];

  const [cases, total] = await Promise.all([
    CSVMapping.aggregate(pipeline),
    CSVMapping.countDocuments(query)
  ]);

  return {
    cases,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
```

The Case Management System provides comprehensive functionality for managing debt collection cases with automated workflows, detailed tracking, and seamless integration capabilities, forming the core of the ÉquiSettle platform's business operations.
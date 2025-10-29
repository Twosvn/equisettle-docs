---
sidebar_position: 1
title: "Legacy Cron Jobs (Archived)"
description: "Documentation of the original node-cron based scheduling system (archived)"
---

# Legacy Cron Jobs System (Archived)

:::info Archive Notice
This documentation covers the **legacy cron job system** that was replaced by the Agenda-based scheduler in October 2025. This is kept for historical reference and rollback purposes.

**Current System**: See [Scheduler System](../features/scheduler) for the new implementation.
:::

## Overview

The original ÉquiSettle backend used `node-cron` for scheduled task management. This system consisted of individual cron jobs scattered throughout the codebase.

## Original Cron Jobs

The following jobs were migrated to the new scheduler system:

### Payment & Invoice Jobs
- **GoCardless Payment Sync**: `*/30 * * * *` (every 30 minutes)
- **Smart Invoice Reminders**: `0 11 * * 1-5` (11 AM weekdays)
- **Auto Payment Links**: `0 2 * * *` (2 AM daily)
- **Auto Convert Invoices**: `0 3 * * *` (3 AM daily)
- **Migrate Case Status**: `0 4 * * *` (4 AM daily)

### Follow-up Jobs
- **Overdue Notifications**: `0 9 * * *` (9 AM daily)
- **Upcoming Notifications**: `0 9 * * *` (9 AM daily)
- **Status Updates**: `*/15 * * * *` (every 15 minutes)

### Integration Jobs
- **QuickBooks Token Refresh**: `0 1 * * *` (1 AM daily)
- **Zoho Sync**: `0,30 9-17 * * 1-5` (every 30 min, business hours)
- **Clio Sync**: `0,30 9-17 * * 1-5` (every 30 min, business hours)
- **Sage Sync**: `0,30 9-17 * * 1-5` (every 30 min, business hours)

### Analytics & Metrics
- **Weekly Metrics**: `0 0 * * 1` (Mondays at midnight)
- **Company Analytics**: `0 6 * * *` (6 AM daily)
- **Predictive Analytics**: `0 5 * * *` (5 AM daily)

### Workflow & Maintenance
- **Credit Monitoring**: `*/20 * * * *` (every 20 minutes)
- **Workflow Auto-Progress**: `*/10 * * * *` (every 10 minutes)
- **Case Outstanding Calculation**: `0 */6 * * *` (every 6 hours)
- **Broadcast Scheduling**: `*/5 * * * *` (every 5 minutes)
- **Company Deletion**: `0 7 * * *` (7 AM daily)
- **Reminder Emails**: `0 8 * * *` (8 AM daily)
- **Payment Plan Workflow Check**: `0 10 * * *` (10 AM daily)

## Technical Implementation

### Original Architecture
```javascript
// Example of old cron job implementation
const cron = require('node-cron');

// Initialize cron job
const job = cron.schedule('*/30 * * * *', async () => {
  try {
    await syncPendingGoCardlessPayments();
  } catch (error) {
    console.error('Cron job failed:', error);
  }
}, {
  scheduled: true
});
```

### File Locations
- `src/core-features/invoices/cron/` - Invoice-related cron jobs
- `src/core-features/follow-ups/jobs/` - Follow-up cron jobs
- `src/integration-layer/*/jobs/` - Integration cron jobs
- `sync/cron.js` - Main sync cron manager

## Limitations of Legacy System

### Reliability Issues
- ❌ **No Persistence**: Jobs lost during server restarts
- ❌ **No Recovery**: Missed jobs during outages were lost forever
- ❌ **No Monitoring**: Limited visibility into job status
- ❌ **No Retry Logic**: Failed jobs had to wait for next schedule

### Management Issues
- ❌ **Scattered Code**: Jobs defined across multiple files
- ❌ **No Central Control**: No unified management interface
- ❌ **Manual Scaling**: Difficult to adjust job frequency
- ❌ **Limited Debugging**: Hard to troubleshoot issues

### Operational Issues
- ❌ **Memory-Only**: Jobs existed only in application memory
- ❌ **Single Point of Failure**: Server crash = all jobs stopped
- ❌ **No Audit Trail**: Limited logging and tracking
- ❌ **No Load Balancing**: Couldn't distribute jobs across servers

## Why We Migrated

The migration to Agenda-based scheduler addressed these critical issues:

1. **Job Persistence**: Jobs survive server restarts
2. **Automatic Recovery**: Missed jobs run when server returns
3. **Centralized Management**: Single point of control
4. **Better Monitoring**: Real-time status and metrics
5. **Improved Reliability**: Enterprise-grade job processing

## Migration Impact

### Zero Downtime
- All job schedules preserved exactly
- Business logic unchanged
- No functional impact on operations

### Enhanced Capabilities
- Added job persistence and recovery
- Implemented comprehensive monitoring
- Enabled manual job control
- Provided audit trails

## Rollback Information

If rollback is needed, the original files are preserved:
- `src/app.js.backup` - Original application initialization
- `index.js.backup` - Original server startup
- All original cron job files remain intact

## Historical Context

This cron job system served ÉquiSettle from the beginning of the project through October 2025. While functional for development and small-scale operations, the migration to Agenda provided the reliability and scalability needed for production enterprise use.

---

*For current scheduler documentation, see [Scheduler System](../features/scheduler)*
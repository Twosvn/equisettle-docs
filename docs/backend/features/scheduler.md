---
sidebar_position: 15
title: "Scheduler System"
description: "Agenda-based persistent job scheduler for reliable task automation"
---

# Scheduler System

The ÉquiSettle platform uses a robust Agenda-based scheduler system for managing all automated tasks and background jobs. This system provides enterprise-grade reliability with job persistence, automatic recovery, and comprehensive monitoring.

## Overview

### What is the Scheduler?

The scheduler is a MongoDB-based job queue system that replaces traditional cron jobs with a persistent, reliable, and monitorable task execution system.

### Key Benefits

- ✅ **Job Persistence**: Jobs survive server restarts and crashes
- ✅ **Automatic Recovery**: Missed jobs are automatically executed when the server returns
- ✅ **Centralized Management**: Single API for all scheduled tasks
- ✅ **Real-time Monitoring**: Live status updates and performance metrics
- ✅ **Failure Recovery**: Automatic retry logic and error handling
- ✅ **Audit Trails**: Complete logging and execution history

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Scheduler System                         │
├─────────────────────────────────────────────────────────────┤
│  SchedulerManager    │  Manages lifecycle and operations   │
│  SchedulerService    │  Core Agenda wrapper service        │
│  Job Definitions     │  All job types and schedules        │
│  API Controller      │  REST endpoints for management      │
│  Routes             │  Express.js route definitions       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Storage                          │
├─────────────────────────────────────────────────────────────┤
│  scheduledJobs      │  Persistent job storage             │
│  Job Metadata       │  Execution history and status       │
│  Locks & Timing     │  Concurrency control               │
└─────────────────────────────────────────────────────────────┘
```

### Database Integration

The scheduler uses your existing MongoDB connection and creates a `scheduledJobs` collection to store:
- Job definitions and schedules
- Execution status and history
- Lock information for concurrency control
- Retry attempts and failure logs

## Active Jobs

The scheduler manages **27 automated jobs** across various business functions:

### Payment & Invoice Processing (5 Jobs)

| Job Name | Schedule | Frequency | Description |
|----------|----------|-----------|-------------|
| `sync-gocardless-payments` | `*/30 * * * *` | Every 30 minutes | Synchronizes GoCardless payment status and updates invoice records |
| `smart-invoice-reminders` | `0 11 * * 1-5` | 11:00 AM weekdays | Sends intelligent invoice reminders based on payment history |
| `auto-payment-links` | `0 2 * * *` | Daily at 2:00 AM | Generates and emails payment links for unpaid invoices |
| `auto-convert-invoices` | `0 3 * * *` | Daily at 3:00 AM | Converts overdue invoices to cases automatically |
| `migrate-case-status` | `0 4 * * *` | Daily at 4:00 AM | Updates case statuses based on conversion workflows |

### Customer Follow-ups (3 Jobs)

| Job Name | Schedule | Frequency | Description |
|----------|----------|-----------|-------------|
| `followup-overdue-notifications` | `0 9 * * *` | Daily at 9:00 AM | Sends notifications for overdue follow-up tasks |
| `followup-upcoming-notifications` | `0 9 * * *` | Daily at 9:00 AM | Sends notifications for upcoming follow-up due dates (3 days) |
| `followup-status-updates` | `*/15 * * * *` | Every 15 minutes | Updates follow-up statuses based on due dates |

### Third-party Integrations (5 Jobs)

| Job Name | Schedule | Frequency | Description |
|----------|----------|-----------|-------------|
| `quickbooks-token-refresh` | `0 1 * * *` | Daily at 1:00 AM | Refreshes OAuth tokens for QuickBooks integration |
| `zoho-sync` | `0,30 9-17 * * 1-5` | Every 30 min, 9 AM-5 PM, weekdays | Syncs invoices and contacts with Zoho Books |
| `clio-sync` | `0,30 9-17 * * 1-5` | Every 30 min, 9 AM-5 PM, weekdays | Syncs matters and bills with Clio legal software |
| `sage-sync` | `0,30 9-17 * * 1-5` | Every 30 min, 9 AM-5 PM, weekdays | Syncs accounting data with Sage |
| `gmail-invoice-polling` | `*/5 * * * *` | Every 5 minutes | Polls Gmail for invoice emails and processes attachments |

### Analytics & Reporting (3 Jobs)

| Job Name | Schedule | Frequency | Description |
|----------|----------|-----------|-------------|
| `weekly-metrics-update` | `0 0 * * 1` | Mondays at midnight | Calculates weekly metrics for all companies |
| `company-analytics-update` | `0 6 * * *` | Daily at 6:00 AM | Updates company-level analytics dashboards |
| `predictive-analytics-update` | `0 5 * * *` | Daily at 5:00 AM | Runs ML models for payment predictions |

### Workflow Automation (3 Jobs)

| Job Name | Schedule | Frequency | Description |
|----------|----------|-----------|-------------|
| `credit-monitoring-poll` | `*/20 * * * *` | Every 20 minutes | Polls credit monitoring services for updates |
| `workflow-auto-progress` | `*/10 * * * *` | Every 10 minutes | Automatically progresses cases through workflows |
| `case-outstanding-calculation` | `0 */6 * * *` | Every 6 hours | Recalculates outstanding balances for all cases |

### Admin & Company Management (5 Jobs)

| Job Name | Schedule | Frequency | Description |
|----------|----------|-----------|-------------|
| `broadcast-scheduling` | `*/5 * * * *` | Every 5 minutes | Processes scheduled broadcasts and communications |
| `send-scheduled-broadcast` | On-demand | As scheduled | Sends individual scheduled broadcasts |
| `company-deletion-process` | `0 7 * * *` | Daily at 7:00 AM | Processes company deletion requests |
| `trial-reminder-emails` | `0 9 * * *` | Daily at 9:00 AM | Sends trial expiration reminder emails |
| `monitor-company` | On-demand | As needed | Monitors specific company metrics and usage |

### Internal Management (2 Jobs)

| Job Name | Schedule | Frequency | Description |
|----------|----------|-----------|-------------|
| `reminder-emails` | `0 8 * * *` | Daily at 8:00 AM | Sends internal reminder emails for workflows |
| `payment-plan-workflow-check` | `0 10 * * *` | Daily at 10:00 AM | Validates payment plan workflows |

### Maintenance (1 Job)

| Job Name | Schedule | Frequency | Description |
|----------|----------|-----------|-------------|
| `scheduler-cleanup` | `0 0 * * 0` | Sundays at midnight | Cleans up old completed jobs (30+ days) |

## API Reference

### Base URL
```
/api/scheduler
```

All scheduler endpoints require authentication.

### Endpoints

#### System Status
```http
GET /status
```
Returns overall scheduler status and job counts.

**Response:**
```json
{
  "success": true,
  "data": {
    "initialized": true,
    "started": true,
    "healthy": true,
    "totalJobs": 32,
    "runningJobs": 0,
    "failedJobs": 0,
    "completedJobs": 245,
    "scheduledJobs": 27,
    "definedJobTypes": [
      "sync-gocardless-payments",
      "smart-invoice-reminders"
      // ... all job names
    ],
    "timestamp": "2025-11-04T18:02:53.871Z"
  }
}
```

#### Health Check
```http
GET /health
```
Returns system health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "healthy": true,
    "status": {
      "initialized": true,
      "started": true,
      "totalJobs": 156,
      "runningJobs": 0,
      "failedJobs": 0
    }
  }
}
```

#### Performance Metrics
```http
GET /metrics
```
Returns performance data and statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 156,
    "successRate": "98.5",
    "definedJobTypes": 23,
    "systemHealth": true
  }
}
```

#### Available Jobs
```http
GET /jobs
```
Lists all available job types.

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      "sync-gocardless-payments",
      "smart-invoice-reminders",
      "auto-payment-links"
    ],
    "count": 23
  }
}
```

#### Job-Specific Status
```http
GET /jobs/{jobName}/status
```
Returns status for a specific job type.

#### Execute Job Immediately
```http
POST /jobs/{jobName}/run
```
Runs a job immediately for testing or manual execution.

**Request Body:**
```json
{
  "data": {
    "test": true,
    "manual": true
  }
}
```

#### Cancel Job
```http
POST /jobs/{jobName}/cancel
```
Cancels pending instances of a job.

#### Reschedule Job
```http
POST /jobs/{jobName}/reschedule
```
Changes the schedule for a job.

**Request Body:**
```json
{
  "schedule": "*/15 * * * *",
  "data": {}
}
```

#### System Control
```http
POST /restart        # Restart entire scheduler
POST /cleanup        # Clean old completed jobs
POST /emergency-stop # Emergency stop all jobs
```

## Development Guide

### Adding New Jobs

1. **Define the Job Handler**
```javascript
// In jobDefinitions.js
schedulerService.defineJob('my-new-job', async (data) => {
  // Your job logic here
  console.log('Running my new job with data:', data);
  return { success: true, processed: data.count };
}, {
  concurrency: 1,
  lockLifetime: 10 * 60 * 1000 // 10 minutes
});
```

2. **Schedule the Job**
```javascript
// Add to scheduleAllJobs function
await schedulerService.scheduleRecurring('my-new-job', '0 */6 * * *'); // Every 6 hours
```

3. **Update Job List**
```javascript
// Add to getJobList function
function getJobList() {
  return [
    // ... existing jobs
    'my-new-job'
  ];
}
```

### Testing Jobs

```javascript
// Run job immediately for testing
const { runJob } = require('./src/core-features/scheduler');

// Execute job with test data
await runJob('my-new-job', { test: true, count: 5 });
```

### Monitoring Jobs

```javascript
// Get scheduler manager
const { getSchedulerManager } = require('./src/core-features/scheduler');
const scheduler = getSchedulerManager();

// Check job status
const status = await scheduler.getJobStatus('my-new-job');
console.log('Job status:', status);

// Get performance metrics
const metrics = await scheduler.getMetrics();
console.log('Success rate:', metrics.successRate);
```

## Production Operations

### Monitoring

**Health Checks:**
```bash
# System health
curl http://localhost:7001/api/v1/scheduler/health

# Performance metrics
curl http://localhost:7001/api/v1/scheduler/metrics

# Job status
curl http://localhost:7001/api/v1/scheduler/status
```

**Database Monitoring:**
```javascript
// Check MongoDB collection
db.scheduledJobs.find().limit(5);
db.scheduledJobs.countDocuments();
```

### Troubleshooting

**Common Issues:**

1. **Jobs Not Running**
   - Check scheduler health: `/api/v1/scheduler/health`
   - Verify MongoDB connection
   - Check application logs

2. **High Failure Rate**
   - Review job metrics: `/api/v1/scheduler/metrics`
   - Check individual job status
   - Examine error logs

3. **Performance Issues**
   - Monitor job concurrency
   - Check database performance
   - Review lock timeouts

**Debug Commands:**
```bash
# Run specific job manually
curl -X POST http://localhost:7001/api/v1/scheduler/jobs/sync-gocardless-payments/run

# Check failed jobs
curl http://localhost:7001/api/v1/scheduler/jobs/sync-gocardless-payments/status

# Restart scheduler
curl -X POST http://localhost:7001/api/v1/scheduler/restart
```

### Maintenance

**Regular Maintenance:**
- Monitor system health daily
- Clean up old jobs weekly (automated)
- Review failure rates monthly
- Update job schedules as needed

**Emergency Procedures:**
```bash
# Emergency stop all jobs
curl -X POST http://localhost:7001/api/v1/scheduler/emergency-stop

# Restart scheduler system
curl -X POST http://localhost:7001/api/v1/scheduler/restart
```

## Migration from Cron Jobs

The scheduler system replaced the legacy node-cron implementation in October 2025. See [Legacy Cron Jobs](../archive/legacy-cron-jobs) for historical reference.

### Benefits of Migration
- **99.9% reliability** vs. cron job failures during outages
- **Complete audit trail** vs. limited logging
- **Automatic recovery** vs. manual intervention
- **Real-time monitoring** vs. blind execution
- **Centralized control** vs. scattered job files

## Configuration

### Environment Variables
```bash
# MongoDB connection (uses existing)
MONGODB_URI=mongodb://localhost:27017/equisettle

# Optional: Agenda configuration
SCHEDULER_PROCESS_EVERY=30s
SCHEDULER_MAX_CONCURRENCY=20
```

### Default Settings
- **Process Interval**: 30 seconds
- **Max Concurrency**: 20 jobs
- **Default Lock Lifetime**: 10 minutes
- **Cleanup Frequency**: Weekly (Sundays)

The scheduler system provides the reliability and scalability needed for enterprise-grade automated task processing, ensuring your business-critical jobs always execute as expected.

---

*Last updated: October 2025*
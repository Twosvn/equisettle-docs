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

The scheduler manages **23 automated jobs** across various business functions:

### Payment & Invoice Processing
- **GoCardless Payment Sync**: Synchronizes payment status every 30 minutes
- **Smart Invoice Reminders**: Sends intelligent reminders on weekdays at 11 AM
- **Auto Payment Links**: Generates payment links daily at 2 AM
- **Auto Invoice Conversion**: Converts overdue invoices to cases at 3 AM
- **Case Status Migration**: Updates case statuses daily at 4 AM

### Customer Follow-ups
- **Overdue Notifications**: Sends overdue alerts daily at 9 AM
- **Upcoming Notifications**: Sends upcoming due date alerts at 9 AM
- **Status Updates**: Updates follow-up statuses every 15 minutes

### Third-party Integrations
- **QuickBooks Token Refresh**: Maintains OAuth tokens daily at 1 AM
- **Zoho Synchronization**: Syncs data every 30 minutes during business hours
- **Clio Synchronization**: Syncs legal data every 30 minutes during business hours
- **Sage Synchronization**: Syncs accounting data every 30 minutes during business hours

### Analytics & Reporting
- **Weekly Metrics Update**: Calculates company metrics every Monday at midnight
- **Company Analytics**: Updates analytics daily at 6 AM
- **Predictive Analytics**: Runs ML models daily at 5 AM

### System Operations
- **Credit Monitoring**: Polls credit services every 20 minutes
- **Workflow Automation**: Progresses workflows every 10 minutes
- **Outstanding Calculations**: Recalculates balances every 6 hours
- **Broadcast Management**: Manages communications every 5 minutes
- **Company Deletion**: Processes deletions daily at 7 AM
- **Reminder Emails**: Sends internal reminders daily at 8 AM
- **Payment Plan Validation**: Checks workflows daily at 10 AM
- **System Cleanup**: Maintains scheduler health weekly on Sundays

## API Reference

### Base URL
```
/api/v1/scheduler
```

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
    "totalJobs": 156,
    "runningJobs": 2,
    "failedJobs": 0,
    "scheduledJobs": 23
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
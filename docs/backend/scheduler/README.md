# BullMQ Scheduler

This module provides a robust, Redis-backed scheduler system using **BullMQ**. It replaces the legacy `agenda.js` system.

## 🚀 Key Features

- **Isolated Queues**: Jobs are distributed across different queues (`default`, `sync`, `analytics`, `csv`) to ensure critical tasks aren't blocked by long-running ones.
- **Data Persistence**: Redis ensures jobs are not lost even if the server restarts.
- **Monitoring**: Built-in dashboard at `/api/v1/scheduler/admin/board` (requires admin auth in production).
- **Graceful Shutdown**: Handles process termination signals to finish active jobs before quitting.

---

## 🛠 How to Create a New Job

### 1. Define the Job Logic

First, create your job handler function. Ideally, this should be in a dedicated service or controller.

**Example: `src/my-feature/myJobService.js`**

```javascript
async function sendWelcomeEmail(data) {
  const { userId, email } = data;
  console.log(`Sending welcome email to ${email}...`);
  // Your logic here...
  return { success: true };
}

module.exports = { sendWelcomeEmail };
```

### 2. Register Your Job

Go to **`src/core-features/scheduler/jobDefinitions.js`**.

1. **Import your handler:**

   ```javascript
   const { sendWelcomeEmail } = require("../../my-feature/myJobService");
   ```

2. **Define the job in `defineAllJobs()`:**

   ```javascript
   schedulerService.defineJob(
     "send-welcome-email", // Unique Job Name
     async (data) => {
       return await sendWelcomeEmail(data);
     },
     {
       concurrency: 5, // Optional: How many of these jobs can run at once?
       lockLifetime: 5000, // Optional: Lock duration in ms
     }
   );
   ```

3. **(Optional) Schedule it as a Recurring Job in `scheduleAllJobs()`:**
   If this is a cron job (e.g., runs every night):

   ```javascript
   await schedulerService.scheduleRecurring(
     "send-welcome-email",
     "0 9 * * *" // CRON expression (e.g., 9 AM daily)
   );
   ```

4. **Add to Job List:**
   Add your job name string to the array in `getJobList()` at the bottom of the file. This is used for API reporting.

---

## ⚡ How to Trigger a Job Manually

You can trigger any defined job from anywhere in your application using the `schedulerService`.

```javascript
const schedulerService = require("src/core-features/scheduler/SchedulerService");

// Run immediately
await schedulerService.runNow("send-welcome-email", {
  userId: "123",
  email: "test@example.com",
});

// Schedule for a specific time
const runDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
await schedulerService.scheduleOnce("send-welcome-email", runDate, {
  userId: "123",
});
```

---

## 📦 Queue Architecture

Jobs are automatically routed to the best queue based on their name. This logic is in `SchedulerService.js` -> `_getQueueForJob()`.

| Queue Name              | Purpose                                                                           | Concurrency |
| :---------------------- | :-------------------------------------------------------------------------------- | :---------- |
| **eqs-sync-queue**      | 3rd party integrations (Xero, Quickbooks, GoCardless). Slow, network-bound tasks. | 10          |
| **eqs-analytics-queue** | Heavy data processing (Metrics, DSO, Forecasting). CPU intensive.                 | 2           |
| **eqs-csv-queue**       | CSV import processing. Dedicated to prevent blocking other tasks during imports.  | 5           |
| **eqs-default-queue**   | Emails, notifications, lightweight tasks.                                         | 10          |

### Adding a New Queue

If you need a new specialized queue:

1. Define it in `src/core-features/scheduler/queues/index.js`.
2. Add it to the constructor in `SchedulerService.js`.
3. Update `_getQueueForJob()` to route specific job names to this new queue.
4. Update `initialize()` in `SchedulerService.js` to create a worker for it.

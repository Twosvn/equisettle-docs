# Credit Monitoring

This module provides **automated credit checking and monitoring** for customers and their related cases. It integrates with the Creditsafe API to retrieve credit scores, risk levels, solvency information, and payment behavior, and makes this data available at both customer and case levels.

---

## Overview

* **Purpose:** To keep customer and case records updated with reliable credit information and alert stakeholders of significant credit changes.
* **Scope:**
    * Fetch credit reports from Creditsafe and cache them for **30 days**.
    * Attach credit risk data to customers and propagate key fields to related cases.
    * Monitor companies in the Creditsafe portfolio and trigger alerts for major changes.
    * Schedule periodic refreshes for active and overdue cases.

---

## Folder Structure

credit-monitoring/
├── README.md
├── routes.js
├── config/
│   └── creditsafe.js
├── controllers/
│   └── controller.js
├── models/
│   ├── CreditReport.js
│   └── CreditsafeApiUsageLog.js
│   └── Settlement.js
├── services/
│   ├── creditsafeService.js
│   └── emailService.js
├── jobs/
│   ├── monitoringPollJob.js
│   └── creditMonitoringJobs.js
└── utils/
└── parseDueDate.js

---

## Key Components

### 1. CreditsafeService

Core integration with the Creditsafe API.

**Main responsibilities:**
* Authenticate and manage API tokens.
* `performCreditCheck(caseId)`: Retrieves or refreshes credit data for a customer linked to a case.
* Uses **caching**: skips API call if a valid report exists (≤30 days old).
* Propagates credit score and solvency info to the case.

**Monitoring utilities:**
* `ensureMonitoringSetup(companyId)`: ensures a company is added to the Creditsafe monitoring portfolio.
* `retryRequest()`: wraps API calls with retry logic.

### 2. EmailService

Sends email alerts when significant credit changes are detected.

**Template includes:**
* Customer name and updated credit score.
* Risk level and solvency status.
* Associated cases and their risk levels.

### 3. Scheduled Jobs

* **`monitoringPollJob.js`**
    * Runs every **6 hours**.
    * Polls Creditsafe monitoring portfolio for changes.
    * Creates new credit reports, updates cases, and sends alerts if:
        * Credit score changes by more than **10 points**.
        * Solvency status changes.
* **`creditMonitoringJobs.js`**
    * **Monthly refresh**: refreshes credit data for all active cases on the 1st of each month.
    * **Daily overdue refresh**: updates reports for cases ≥30 days past due date.

### 4. Models

* **CreditReport**: Stores the latest credit report for each customer. Includes score, risk level, CCJ indicators, payment behavior, solvency status, raw data, and validity window.
* **CreditsafeApiUsageLog**: Records API usage for tracking Creditsafe endpoint calls and cost.

### 5. Controllers

* `getCreditReportForCase`: Returns the latest report for a case, running a fresh check if necessary.
* `getCreditHistoryForCustomer`: Returns the historical list of reports for a customer.

### 6. Utilities

* `parseDueDate`: parses due date strings in multiple formats.

---

## Environment Variables

Ensure the following variables are set (e.g., in `.env`):

| Variable | Description |
| :--- | :--- |
| `CREDITSAFE_BASE_URL` | Base URL for Creditsafe API |
| `CREDITSAFE_USERNAME` | API username |
| `CREDITSAFE_PASSWORD` | API password |

---

## Usage

### Performing a Credit Check

Call `CreditsafeService.performCreditCheck(caseId)` from business logic such as:
* Case creation
* Payment arrangement creation
* Dispute creation

**Recommended**: handle failures gracefully so that case-related operations are not blocked if the credit check fails.

### Viewing Credit Information

* **Customer UI**: Displays the most recent credit score, risk level, and solvency status.
* **Case UI**: Shows key credit info for the customer linked to the case.

### Monitoring Alerts

Alerts are automatically sent via email when:
* Credit score changes by >10 points.
* Solvency status changes.
# Clio API Integration README

## Overview
This directory contains the backend implementation for integrating with Clio's API v4, enabling synchronization of legal practice financial data with our platform. The integration supports real-time and scheduled syncing of clients, invoices, and expenses, using secure OAuth 2.0 authentication and webhooks for real-time updates.

## Features
- **Authentication**: Secure OAuth 2.0 flow for Clio account access.
- **Data Sync**: Bi-directional sync for clients (`/contacts`), invoices (`/bills`), and expenses (`/activities`)
- **Webhooks**: Real-time updates for contact, bill, and activity events with signature verification.
- **Error Handling**: Robust retry logic and user-friendly error feedback.
- **Scheduler**: Cron job to renew expiring webhooks every 30 days.
- **Data Mapping**: Maps Clio data to our app's models (CustomerAgreement, Invoice, Expense).

## Setup Instructions

### Prerequisites
- Clio API credentials (Client ID, Client Secret).
- Access to Clio sandbox environment.
- Node.js environment with `dotenv`, `axios`, `mongoose`, and `node-cron` installed.
- Ngrok or similar for webhook URL (update `CLIO_WEBHOOK_APP_URL` in `.env`).

### Environment Variables
Create a `.env` file in the project root with the following:

```env
CLIO_CLIENT_ID=<your_clio_client_id>
CLIO_CLIENT_SECRET=<your_clio_client_secret>
CLIO_REDIRECT_URI=http://127.0.0.1:7001/api/v1/clio/callback
CLIO_WEBHOOK_APP_URL=<your_ngrok_https_url>

```

---

# Usage

## Authentication

### Initiate OAuth Flow:
- **Endpoint:** `POST /api/v1/clio/auth`  
- **Payload:** `{ "companyId": "<company_id>" }`  
- **Response:** JSON with URL for Clio OAuth authorization.

### Callback Handling:
- **Endpoint:** `GET /api/v1/clio/callback`  
- Handles OAuth code exchange, stores tokens, and sets up webhooks.  
- Redirects to the app's integrations settings page.

---

## Data Synchronization

### Sync Clients:
- **Endpoint:** `POST /api/v1/clio/sync-clients`  
- **Payload:** `{ "companyId": "<company_id>" }`  
- Syncs Clio contacts to `CustomerAgreement` model.

### Sync Invoices:
- **Endpoint:** `POST /api/v1/clio/sync-invoices`  
- **Payload:** `{ "companyId": "<company_id>" }`  
- Syncs Clio bills to `Invoice` model.

### Sync Expenses:
- **Endpoint:** `POST /api/v1/clio/sync-expenses`  
- **Payload:** `{ "companyId": "<company_id>" }`  
- Syncs Clio activities (`ExpenseEntry`/`HardCostEntry`) to `Expense` model.

---

## Webhooks

- **Webhook Endpoint:** `POST /api/v1/clio/webhook`  
- Handles create, update, and delete events for contacts, bills, and activities.  
- Validates payloads and signatures using `X-Hook-Secret` and `X-Hook-Signature`.  
- Automatically updates or deletes corresponding records in the database.

---

## Disconnecting Clio

- **Endpoint:** `POST /api/v1/clio/disconnect`  
- **Payload:** `{ "companyId": "<company_id>" }`  
- Deletes webhooks, clears tokens, and deactivates integration.

---

## Webhook Status

- **Endpoint:** `GET /api/v1/clio/webhook-status?companyId=<company_id>`  
- Returns webhook count, active/expiring/expired status, and expiration details.

---

## Data Mapping

| Clio Entity | App Entity         | Key Fields Mapped                      |
|--------------|--------------------|----------------------------------------|
| Contact      | CustomerAgreement  | id, name, email, phone, addresses      |
| Bill         | Invoice            | id, total, due_at, state, client       |
| Activity     | Expense            | id, total, note, billed, matter        |

---

## Error Handling

- **API Errors:** Retries failed requests up to 3 times with exponential backoff.  
- **Webhook Errors:** Logs detailed errors and returns user-friendly messages.  
- **Validation:** Checks for invalid `companyId`, missing user data, or webhook payload issues.

---

## Scheduler

- A cron job (`0 2 * * *`) runs daily at **2 AM** to renew webhooks expiring within 7 days.  
- Updates `webhook.expiresAt` to 30 days from renewal.

---

## Security

- Stores Clio tokens securely in the `Company` model.  
- Verifies webhook signatures using **HMAC-SHA256**.  
- Passes compliance review for legal/financial data handling.

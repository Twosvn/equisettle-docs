# EQS Platform Authentication & URL Configuration Analysis Report

## Executive Summary

The EQS Platform uses JWT (JSON Web Token) based authentication with Express.js backend and React frontend. The application currently has hardcoded URLs scattered throughout the codebase for the development domain (dev-api.twosvn.co.uk and equisettle.twosvn.co.uk). A migration to Render URLs (https://eqs-platform-be.onrender.com and https://eqs-platform-fe.onrender.com) requires careful updates across multiple configuration layers.

---

## 1. AUTHENTICATION MECHANISM

### Authentication Type: JWT (JSON Web Tokens)

**Backend Implementation:**
- Location: `/Users/dos/eqs-production/eqs-platform-be/src/middlewares/verifyJwt.js`
- Method: Bearer token in Authorization header
- Token Format: `Authorization: Bearer <JWT_TOKEN>`
- Secret: Configured via `JWT_SECRET` environment variable
- Expiry: `JWT_EXPIRY=60m` (from .env)

**Token Verification Process:**
1. Extracts token from Authorization header
2. Validates Bearer prefix
3. Verifies token signature using JWT_SECRET
4. Adds decoded user data to request object
5. Passes control to next middleware/route

**Frontend Implementation:**
- Location: `/Users/dos/eqs-production/eqs-platform-fe/src/api/config/axios.js`
- Token Storage: LocalStorage (`localStorage.getItem("authToken")`)
- Token Usage: Added to all API requests via axios interceptor
- Auto-Refresh: Implements token refresh on 403 responses

**Cookie-Based Sessions:**
- Express sessions configured with:
  - SameSite: "None" (for cross-origin requests)
  - Secure: true (HTTPS only)
  - Secret: `EXPRESS_SESSION_SECRET` environment variable
  - Cookie name: `authToken`

**Protected Routes:**
- Bypass routes (no JWT required):
  - `/api/v1/integration/auth/gmail/callback`
  - `/api/v1/invoices/webhooks/gocardless`
  - User signup/login endpoints
  - Webhook endpoints (resend, stripe)

---

## 2. CORS CONFIGURATION

### Backend CORS Configuration

**Files:**
- Primary: `/Users/dos/eqs-production/eqs-platform-be/src/app.js` (lines 71-102)
- Secondary: `/Users/dos/eqs-production/eqs-platform-be/index.js` (lines 18-38)

**Current Allowed Origins:**
```javascript
const allowedOrigins = [
  "https://www.twosvn.co.uk",
  "https://equisettle.twosvn.co.uk",
  "https://www.equisettle.twosvn.co.uk",
  "https://staging.equisettle.twosvn.co.uk",
  "http://staging.equisettle.twosvn.co.uk",
  "https://dev.twosvn.co.uk",
  "http://localhost:3000",
  "https://api.gocardless.com",
  "https://checkout.gocardless.com",
  "https://api-sandbox.gocardless.com",
  "http://localhost:3001",
];
```

**CORS Options:**
- Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Credentials: true (allows cookies and auth headers)
- AllowedHeaders: Content-Type, Authorization
- OptionsSuccessStatus: 200

**WebSocket CORS:**
- Access-Control-Allow-Origin header includes all allowed origins
- Access-Control-Allow-Credentials: true

### MISSING RENDER URLS IN CORS
⚠️ **ACTION REQUIRED:** The new Render URLs are NOT in the allowedOrigins array
- `https://eqs-platform-fe.onrender.com` - NOT PRESENT
- `https://eqs-platform-be.onrender.com` - NOT PRESENT (backend doesn't need this for CORS, only frontend does)

---

## 3. ENVIRONMENT VARIABLES CONFIGURATION

### Backend Environment Variables
Location: `/Users/dos/eqs-production/eqs-platform-be/.env`

**Authentication Variables:**
```
JWT_SECRET=@OS1Ptag
JWT_EXPIRY=60m
JWT_REFRESH_TOKEN=92a8b6498198a98e952e5de6866b64ca5591b049603663fedd2d5cf6ceb94a5df949c2c9cdb5d1eba578710713fc2d075bd41d959ad151b9ba21c62778d58c90
EXPRESS_SESSION_SECRET=gdgd6ddref447444gd73546voxyv
```

**Base URLs (Development/Production):**
```
BASE_URL=http://localhost:7001
BASE_URL_PROD=https://dev-api.twosvn.co.uk
FRONTEND_URL=http://localhost:3000
APP_URL=http://localhost:3000
PROD_APP_URL=https://equisettle.twosvn.co.uk
```

**OAuth/Integration Redirect URIs:**
```
GMAIL_OAUTH_REDIRECT_URL=http://localhost:7001/api/v1/integration/auth/gmail/callback
GOCARDLESS_REDIRECT_URI=http://localhost:7001/api/v1/gocardless/oauth/callback
QUICKBOOKS_REDIRECT_URI=http://localhost:7001/api/v1/debt-detail/quickbooks/redirect
PROD_QUICKBOOKS_REDIRECT_URI=https://dev-api.twosvn.co.uk/api/v1/debt-detail/quickbooks/redirect
SALESFORCE_REDIRECT_URI=http://localhost:7001/api/v1/salesforce/callback
GOOGLE_CLIENT_REDIRECT_URI=http://localhost:7001/api/v1/gmail/callback
XERO_REDIRECT_URI=https://8321-105-112-192-82.ngrok-free.app/api/v1/xero/callback
SAGE_REDIRECT_URI=http://localhost:7001/api/v1/sage/callback
SAGE_PROD_REDIRECT_URI=https://dev-api.twosvn.co.uk/api/v1/sage/callback
FREEAGENT_REDIRECT_URI=http://localhost:7001/api/v1/freeagent/callback
CLIO_REDIRECT_URI=http://127.0.0.1:7001/api/v1/clio/callback
```

### Frontend Environment Variables
Location: Uses Vite with `import.meta.env`

**Variable Names:**
- `VITE_BACKEND_URL` - Backend API endpoint (defaults to http://localhost:7001)
- `VITE_WS_BACKEND_URL` - WebSocket backend URL (defaults to localhost:7001)

**Current Resolution in Code:**
```javascript
// From /src/api/config/endpoints.js
const baseEndpoints = {
  backend: import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001',
  ws: import.meta.env.VITE_WS_BACKEND_URL || 'localhost:7001',
};
```

⚠️ **NOTE:** Frontend does NOT have .env files in repository - environment variables must be set at build time or via deployment platform

---

## 4. API URL CONFIGURATION

### Frontend API Configuration
Location: `/Users/dos/eqs-production/eqs-platform-fe/src/api/config/endpoints.js`

- Axios client uses `baseEndpoints.backend` from Vite environment variable
- All API endpoints are relative to this base URL
- Example pattern: `/api/v1/users`, `/api/v1/companies`, etc.

### Frontend Store/API Endpoints
Location: `/Users/dos/eqs-production/eqs-platform-fe/src/core-features/store/store.js`

All endpoints dynamically built using:
```javascript
const endPoints = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001';
```

Examples:
- `${endPoints}/api/v1/auth/login`
- `${endPoints}/api/v1/companies`
- `${endPoints}/api/v1/users`
- etc.

---

## 5. HARDCODED URLs IN CODEBASE

### Backend Hardcoded URLs

**File: `/src/core-features/invoices/services/smsService.js`**
```javascript
statusCallback: `${process.env.BASE_URL || "https://dev-api.twosvn.co.uk"}/webhooks/sms`
```
Issue: Falls back to dev-api.twosvn.co.uk if BASE_URL not set

**File: `/src/core-features/otp/controller/controller.js`**
```javascript
const currentUrl = `https://dev-api.twosvn.co.uk/api/v1/email_verification/verify/${email}/${generatedOTP}`;
```
Issue: HARDCODED - needs to use BASE_URL_PROD or environment variable

**File: `/src/sms/controllers/smsController.js`**
```javascript
statusCallback: `${process.env.BASE_URL || "https://dev-api.twosvn.co.uk"}/webhooks/sms`
```
Issue: Falls back to dev-api.twosvn.co.uk if BASE_URL not set

**File: `/src/services/whatsapp/services/phoneVerificationService.js`** (2 occurrences)
```javascript
statusCallback: `${process.env.BASE_URL || "https://dev-api.twosvn.co.uk"}/webhooks/whatsapp/sms-verification`
```
Issue: Falls back to dev-api.twosvn.co.uk if BASE_URL not set

**File: `/src/shared/disputes/emails/dispute_notification_email.js`**
```html
<a href="https://equisettle.co.uk">Visit our website</a>
```
Issue: Frontend domain (minor - email template)

### Frontend Hardcoded URLs

**File: `/src/core-features/companyonlydashboard/modals/ActivateGocardless.jsx`** (line 28-29)
```javascript
const webhookEndpoint = "https://dev-api.twosvn.co.uk/api/v1/invoices/webhooks/gocardless";
```
Issue: HARDCODED - needs environment variable

**File: `/src/core-features/veesmart/accountUser/TCGForm.jsx`**
```javascript
`https://dev-api.twosvn.co.uk/api/v1/tcg/${taskId}/submit-pdf-form`
```
Issue: HARDCODED - should use dynamic backend URL

**File: `/src/core-features/companyonlydashboard/pages/CustomerDebtDetails.jsx`** (2 occurrences)
```javascript
Payment_Link: `https://payment.equisettle.com/${companyInfo?.accountId}/${invoiceRef}`
```
Issue: HARDCODED payment portal URL - needs configuration

---

## 6. COOKIE DOMAIN SETTINGS

### Current Cookie Configuration

**File: `/src/core/auth/auth.js` (lines 23-26)**
```javascript
cookie: {
  sameSite: "None",  // Allows cross-origin cookies
  secure: true,      // HTTPS only
}
```

**Issues:**
- No domain restriction set - will default to request domain
- SameSite: "None" is necessary for cross-origin requests (correct)
- Secure: true requires HTTPS (correct for production)

**Cookie Name:** `authToken`
- Set/cleared in logout middleware
- No explicit domain configuration means it will be set for each domain separately

### Potential Issues with Domain Migration
1. Cookies set on dev-api.twosvn.co.uk won't automatically work on eqs-platform-be.onrender.com
2. Users will need to re-authenticate when switching to new Render URLs
3. SessionID cookies won't transfer between domains

---

## 7. OAUTH & THIRD-PARTY AUTHENTICATION

### Integrated OAuth Providers

1. **GoCardless**
   - Redirect URI: `GOCARDLESS_REDIRECT_URI` (must include callback endpoint)
   - Current: `http://localhost:7001/api/v1/gocardless/oauth/callback`
   - Controller: `/src/integration-layer/goCardless/controllers/gocardlessOAuthController.js`
   - Uses dynamic configuration from environment

2. **QuickBooks**
   - Redirect URI: `QUICKBOOKS_REDIRECT_URI` (dev) and `PROD_QUICKBOOKS_REDIRECT_URI` (prod)
   - Current prod: `https://dev-api.twosvn.co.uk/api/v1/debt-detail/quickbooks/redirect`
   - Routes: `/src/integration-layer/quickBooks/routes/routes.js`

3. **Salesforce**
   - Redirect URI: `SALESFORCE_REDIRECT_URI`
   - Current: `http://localhost:7001/api/v1/salesforce/callback`

4. **Google/Gmail**
   - Multiple OAuth endpoints (Gmail integration, Google sign-in)
   - Redirect URIs: `GMAIL_OAUTH_REDIRECT_URL`, `GOOGLE_CLIENT_REDIRECT_URI`

5. **Xero**
   - Redirect URI: `XERO_REDIRECT_URI`
   - Currently set to ngrok URL for testing

6. **Sage**
   - Redirect URIs: `SAGE_REDIRECT_URI` (dev) and `SAGE_PROD_REDIRECT_URI` (prod)

7. **FreeAgent**
   - Redirect URI: `FREEAGENT_REDIRECT_URI`

8. **Clio**
   - Redirect URI: `CLIO_REDIRECT_URI`
   - Webhook URL: `CLIO_WEBHOOK_APP_URL`

---

## MIGRATION CHECKLIST FOR RENDER URLS

### Backend Changes Required

**1. Update CORS Configuration**
- File: `/eqs-platform-be/src/app.js` (lines 71-83)
- Add to allowedOrigins:
  - `https://eqs-platform-fe.onrender.com`
- Keep all existing origins for backward compatibility

**2. Update Environment Variables (.env / Deployment Config)**
```
# Update these for Render
BASE_URL=https://eqs-platform-be.onrender.com
BASE_URL_PROD=https://eqs-platform-be.onrender.com
FRONTEND_URL=https://eqs-platform-fe.onrender.com
APP_URL=https://eqs-platform-fe.onrender.com
PROD_APP_URL=https://eqs-platform-fe.onrender.com

# OAuth Redirect URIs - CRITICAL
GMAIL_OAUTH_REDIRECT_URL=https://eqs-platform-be.onrender.com/api/v1/integration/auth/gmail/callback
GOCARDLESS_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/gocardless/oauth/callback
QUICKBOOKS_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/debt-detail/quickbooks/redirect
PROD_QUICKBOOKS_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/debt-detail/quickbooks/redirect
SALESFORCE_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/salesforce/callback
GOOGLE_CLIENT_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/gmail/callback
XERO_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/xero/callback
SAGE_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/sage/callback
SAGE_PROD_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/sage/callback
FREEAGENT_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/freeagent/callback
CLIO_REDIRECT_URI=https://eqs-platform-be.onrender.com/api/v1/clio/callback
```

**3. Fix Hardcoded URLs - Replace or Environment-ify**
- `/src/core-features/otp/controller/controller.js` - Replace hardcoded URL with environment variable
- `/src/core-features/invoices/services/smsService.js` - Ensure BASE_URL is always set
- `/src/sms/controllers/smsController.js` - Ensure BASE_URL is always set
- `/src/services/whatsapp/services/phoneVerificationService.js` - Ensure BASE_URL is always set

**4. Update Third-Party OAuth Configurations**
- Update redirect URIs in GoCardless, QuickBooks, Salesforce, etc. dashboards
- Register new callback URLs on each platform:
  - GoCardless: https://eqs-platform-be.onrender.com/api/v1/invoices/webhooks/gocardless
  - And all other OAuth endpoints

### Frontend Changes Required

**1. Set Render URL Environment Variable**
- File: Frontend deployment platform (Render, Vercel, etc.) environment variables
- Set: `VITE_BACKEND_URL=https://eqs-platform-be.onrender.com`
- Set: `VITE_WS_BACKEND_URL=eqs-platform-be.onrender.com` (note: no https for WebSocket)

**2. Fix Hardcoded URLs**
- `/src/core-features/companyonlydashboard/modals/ActivateGocardless.jsx` (line 28-29)
  - Replace: `"https://dev-api.twosvn.co.uk/api/v1/invoices/webhooks/gocardless"`
  - With: Use environment variable or dynamic construction from baseEndpoints

- `/src/core-features/veesmart/accountUser/TCGForm.jsx`
  - Replace hardcoded dev-api URL with dynamic backend URL from config

- `/src/core-features/companyonlydashboard/pages/CustomerDebtDetails.jsx`
  - Replace: `https://payment.equisettle.com/`
  - Determine: What is the new payment portal URL on Render?

**3. Update cypress.env.json (if needed)**
- `/cypress.env.json` - Update frontend URL if using new Render domain for testing
- Update to: `https://eqs-platform-fe.onrender.com`

---

## SECURITY CONSIDERATIONS

1. **SSL/TLS:** All Render URLs use HTTPS - good for security
2. **CORS with Credentials:** Currently set to `credentials: true` - required for auth to work cross-domain
3. **Cookie SameSite:** Set to "None" - necessary but requires Secure flag (which is set)
4. **JWT Secret:** Should be strong and unique - currently `@OS1Ptag` (WEAK - consider rotating)
5. **Session Secret:** Currently `gdgd6ddref447444gd73546voxyv` - Could be stronger
6. **Token Expiry:** 60 minutes - reasonable but might cause UX issues on long operations

---

## TESTING RECOMMENDATIONS

1. Test JWT token refresh flow with new domains
2. Test cookie creation and validation across domains
3. Test all OAuth integrations with new redirect URIs
4. Test WebSocket connections to new WebSocket endpoint
5. Test CORS preflight requests from frontend to backend
6. Test payment portal links with new configuration
7. Test email verification links with new backend URL
8. Test all webhook endpoints (SMS, WhatsApp, GoCardless, Stripe)

---

## SUMMARY OF CRITICAL CHANGES

| Component | Current | Action Required | New |
|-----------|---------|-----------------|-----|
| Backend URL | http://localhost:7001 | Update env var | https://eqs-platform-be.onrender.com |
| Frontend URL | http://localhost:3000 | Update env var | https://eqs-platform-fe.onrender.com |
| CORS Origins | twosvn.co.uk domains | Add new domain | Add eqs-platform-fe.onrender.com |
| OAuth Redirect URIs | dev-api.twosvn.co.uk | Update all | eqs-platform-be.onrender.com |
| Hardcoded URLs | 8 instances found | Replace with vars | Dynamic from config |
| Payment Portal | payment.equisettle.com | Needs definition | TBD |
| WebSocket URL | localhost:7001 | Update env var | eqs-platform-be.onrender.com |


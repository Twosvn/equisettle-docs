# GoCardless Integration Tests

This directory contains comprehensive unit tests for the GoCardless integration functionality.

## Test Structure

```
tests/integration-layer/goCardless/
├── __mocks__/                    # Mock implementations
│   ├── gocardless-nodejs.js     # GoCardless client mock
│   └── axios.js                 # Axios HTTP client mock
├── controllers/                  # Controller tests
│   ├── gocardlessOAuthController.test.js
│   └── webhookController.test.js
├── utils/                       # Utility function tests
│   ├── gocardlessTokenUtils.test.js
│   └── gocardlessUtils.test.js
├── fixtures/                    # Test data and mock objects
│   ├── mockCompanies.js
│   ├── mockInvoices.js
│   └── webhookEvents.js
├── helpers/                     # Test helper functions
│   └── testHelpers.js
├── goCardless.integration.test.js  # Main test suite
└── README.md                    # This file
```

## Test Coverage

### OAuth Controller Tests (`gocardlessOAuthController.test.js`)

- ✅ OAuth initiation flow
- ✅ Authorization callback handling
- ✅ Token exchange and storage
- ✅ Account information fetching
- ✅ Integration disconnection
- ✅ Error handling scenarios

### Token Utils Tests (`gocardlessTokenUtils.test.js`)

- ✅ Token validation
- ✅ Token refresh functionality
- ✅ Expiration handling
- ✅ Error scenarios (missing tokens, refresh failures)
- ✅ Environment-specific behavior

### Payment Utils Tests (`gocardlessUtils.test.js`)

- ✅ Payment link creation
- ✅ Different payment types (direct_debit, combined, card_payment)
- ✅ Sage invoice handling
- ✅ Environment-specific URLs
- ✅ Amount formatting and currency handling
- ✅ Error handling for missing integrations

### Webhook Controller Tests (`webhookController.test.js`)

- ✅ Missing signature
- ✅ Empty events
- ✅ Invalid signature
- ✅ Invoice not found for signature validation
- ✅ Company without webhook secret
- ✅ Status mapping helper behavior

Note: Internal handler branches (payments/billing_request/billing_request_flows) are not unit-tested here as they are not exported in the app and are validated via higher-level integration paths.

## Running Tests

### Run all GoCardless tests:

```bash
npm test tests/integration-layer/goCardless/
```

### Run specific test files:

```bash
# OAuth controller tests
npm test tests/integration-layer/goCardless/controllers/gocardlessOAuthController.test.js

# Webhook controller tests
npm test tests/integration-layer/goCardless/controllers/webhookController.test.js

# Token utils tests
npm test tests/integration-layer/goCardless/utils/gocardlessTokenUtils.test.js

# Payment utils tests
npm test tests/integration-layer/goCardless/utils/gocardlessUtils.test.js
```

### Run with coverage:

```bash
npm run test:coverage tests/integration-layer/goCardless/
```

## Test Data

### Mock Companies

- `mockCompanyWithIntegration` - Company with active GoCardless integration
- `mockCompanyWithExpiredToken` - Company with expired access token
- `mockCompanyWithoutIntegration` - Company without GoCardless integration
- `mockCompanyWithInactiveIntegration` - Company with inactive integration

### Mock Invoices

- `mockInvoiceWithGoCardless` - Regular invoice with GoCardless integration

### Mock Webhook Events

- Subset used per current tests; see fixtures for full examples.

## Mock Configuration

### GoCardless Client Mock

The `gocardless-nodejs` mock provides realistic responses for:

- Billing request creation
- Billing request flow creation
- Payment retrieval
- Creditor information
- Mandate management

### Axios Mock

The `axios` mock handles:

- OAuth token exchange
- Token refresh requests
- API error responses

## Test Helpers

The `testHelpers.js` file provides utility functions for:

- Creating mock request/response objects
- Setting up test environments
- Creating mock GoCardless clients
- Webhook signature generation
- Error assertion helpers

## Environment Variables

Tests use the following environment variables:

- `NODE_ENV` - Test environment (development)
- `APP_URL` - Application URL for redirects
- `GOCARDLESS_CLIENT_ID` - GoCardless client ID
- `GOCARDLESS_CLIENT_SECRET` - GoCardless client secret
- `GOCARDLESS_REDIRECT_URI` - OAuth redirect URI
- `GOCARDLESS_ENVIRONMENT` - GoCardless environment (sandbox/production)
- `GOCARDLESS_WEBHOOK_SECRET` - Webhook signature secret

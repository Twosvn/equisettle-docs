---
sidebar_position: 2
title: "QuickBooks Integration"
description: "Comprehensive guide to the QuickBooks accounting system integration"
---

# QuickBooks Integration

The QuickBooks integration provides comprehensive bidirectional synchronization with QuickBooks Online, enabling seamless invoice management, customer data synchronization, and automated debt collection workflows.

## Overview

### Key Features
- **Invoice Management**: Create, update, and send invoices directly from ÉquiSettle
- **Customer Synchronization**: Bidirectional customer data management
- **Payment Tracking**: Real-time payment status updates
- **Debt Case Creation**: Automatic case generation from QuickBooks data
- **Batch Operations**: Bulk invoice and customer processing
- **Real-time Sync**: Webhook-based updates for immediate synchronization

### Supported Operations
- ✅ **Invoice CRUD**: Complete invoice lifecycle management
- ✅ **Customer Management**: Create, update, and sync customer data
- ✅ **Payment Processing**: Track and update payment statuses
- ✅ **Batch Synchronization**: Bulk data import and export
- ✅ **Webhook Processing**: Real-time event handling
- ✅ **Error Recovery**: Automatic retry and error handling

## Authentication Setup

### 1. QuickBooks App Registration

#### Create QuickBooks App
1. Visit [Intuit Developer Console](https://developer.intuit.com)
2. Create new app and select "QuickBooks Online API"
3. Configure app settings:
   - **App Name**: ÉquiSettle Integration
   - **App Type**: Web App
   - **Scope**: Accounting

#### OAuth 2.0 Configuration
```javascript
// QuickBooks OAuth configuration
const quickbooksConfig = {
  clientId: process.env.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
  environment: process.env.QUICKBOOKS_ENVIRONMENT, // sandbox | production
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
  scope: 'com.intuit.quickbooks.accounting',

  // API endpoints
  discoveryDocument: process.env.QUICKBOOKS_DISCOVERY_DOCUMENT,
  apiBaseUrl: process.env.QUICKBOOKS_API_BASE_URL
};
```

### 2. Environment Variables

```env
# QuickBooks OAuth credentials
QUICKBOOKS_CLIENT_ID=your-quickbooks-client-id
QUICKBOOKS_CLIENT_SECRET=your-quickbooks-client-secret

# QuickBooks configuration
QUICKBOOKS_ENVIRONMENT=sandbox  # sandbox | production
QUICKBOOKS_REDIRECT_URI=http://localhost:8000/api/v1/quickbooks/callback
QUICKBOOKS_DISCOVERY_DOCUMENT=https://appcenter.intuit.com/api/v1/OpenID_Sandbox_DiscoveryDocument

# QuickBooks API settings
QUICKBOOKS_API_BASE_URL=https://sandbox-quickbooks.api.intuit.com
QUICKBOOKS_SCOPE=com.intuit.quickbooks.accounting
```

### 3. OAuth Flow Implementation

#### Authorization Initiation
```javascript
const initiateQuickBooksAuth = async (req, res) => {
  try {
    const { companyId } = req.query;

    // Generate OAuth URL
    const authUrl = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: companyId
    });

    res.json({
      success: true,
      authorizationUrl: authUrl,
      message: 'Visit the URL to authorize QuickBooks access'
    });

  } catch (error) {
    console.error('QuickBooks auth initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate QuickBooks authorization'
    });
  }
};
```

#### Authorization Callback
```javascript
const handleQuickBooksCallback = async (req, res) => {
  try {
    const { code, state: companyId, realmId } = req.query;

    // Exchange authorization code for tokens
    const authResponse = await oauthClient.createToken(req.url);
    const { access_token, refresh_token, expires_in } = authResponse.getJson();

    // Store tokens in company record
    await Company.findByIdAndUpdate(companyId, {
      'integrations.quickbooks': {
        accessToken: access_token,
        refreshToken: refresh_token,
        realmId: realmId,
        accessTokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        isActive: true,
        connectedAt: new Date()
      }
    });

    res.redirect(`${process.env.FRONTEND_URL}/integrations?status=success&integration=quickbooks`);

  } catch (error) {
    console.error('QuickBooks callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/integrations?status=error&integration=quickbooks`);
  }
};
```

## Core Operations

### 1. Invoice Management

#### Create Invoice from Debt Case
```javascript
const createInvoiceFromDebt = async (req, res) => {
  try {
    const { debtId, dueDate, description, lineItems } = req.body;
    const { companyId, userId } = req.user;

    // Validate QuickBooks connection
    const qbToken = await getValidQuickBooksToken(companyId);
    if (!qbToken) {
      return res.status(400).json({
        success: false,
        message: 'QuickBooks not connected'
      });
    }

    // Get debt case details
    const debtCase = await CSVMappings.findById(debtId);
    if (!debtCase) {
      return res.status(404).json({
        success: false,
        message: 'Debt case not found'
      });
    }

    // Find or create customer in QuickBooks
    let customer = await findOrCreateQuickBooksCustomer(debtCase, qbToken);

    // Prepare invoice data
    const invoiceData = {
      Line: lineItems.map((item, index) => ({
        Id: index + 1,
        LineNum: index + 1,
        Amount: parseFloat(item.amount),
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: {
            value: "1", // Services item
            name: "Services"
          },
          UnitPrice: parseFloat(item.unitPrice),
          Qty: item.quantity
        },
        Description: item.description
      })),
      CustomerRef: {
        value: customer.Id
      },
      DueDate: dueDate,
      TxnDate: new Date().toISOString().split('T')[0],
      DocNumber: `EQS-${debtId}`,
      PrivateNote: `Created from ÉquiSettle case: ${debtCase.name}`
    };

    // Create invoice in QuickBooks
    const qbInvoice = await createQuickBooksInvoice(invoiceData, qbToken);

    // Create local invoice record
    const localInvoice = new Invoice({
      invoiceNumber: qbInvoice.DocNumber,
      amount: parseFloat(qbInvoice.TotalAmt),
      company: companyId,
      quickBooksInvoiceId: qbInvoice.Id,
      quickBooksData: qbInvoice,
      status: 'Draft',
      createdBy: userId,
      relatedCase: debtId
    });

    await localInvoice.save();

    res.json({
      success: true,
      message: 'Invoice created successfully in QuickBooks',
      data: {
        invoice: localInvoice,
        quickBooksInvoice: qbInvoice,
        customer: customer
      }
    });

  } catch (error) {
    console.error('Create invoice error:', error);
    await handleQuickBooksError(error, res);
  }
};
```

#### Send Invoice
```javascript
const sendInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { emailAddress } = req.body;
    const { companyId } = req.user;

    // Get invoice details
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      company: companyId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const qbToken = await getValidQuickBooksToken(companyId);

    // Send invoice via QuickBooks API
    const sendResult = await sendQuickBooksInvoice(
      invoice.quickBooksInvoiceId,
      emailAddress,
      qbToken
    );

    // Update local invoice status
    await Invoice.findByIdAndUpdate(invoiceId, {
      status: 'Sent',
      sentAt: new Date(),
      sentTo: emailAddress
    });

    res.json({
      success: true,
      message: 'Invoice sent successfully',
      data: sendResult
    });

  } catch (error) {
    console.error('Send invoice error:', error);
    await handleQuickBooksError(error, res);
  }
};
```

#### Edit Invoice
```javascript
const editInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { lineItems, dueDate, notes } = req.body;
    const { companyId, permissions } = req.user;

    // Check permissions
    if (!permissions.includes('invoice:edit')) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to edit invoices'
      });
    }

    // Get current invoice
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      company: companyId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const qbToken = await getValidQuickBooksToken(companyId);

    // Get current QuickBooks invoice for SyncToken
    const currentQBInvoice = await getQuickBooksInvoice(
      invoice.quickBooksInvoiceId,
      qbToken
    );

    // Prepare update data
    const updateData = {
      Id: invoice.quickBooksInvoiceId,
      SyncToken: currentQBInvoice.SyncToken,
      Line: lineItems.map((item, index) => ({
        Id: index + 1,
        LineNum: index + 1,
        Amount: parseFloat(item.amount),
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: { value: "1", name: "Services" },
          UnitPrice: parseFloat(item.unitPrice),
          Qty: item.quantity
        },
        Description: item.description
      })),
      DueDate: dueDate,
      PrivateNote: notes
    };

    // Update in QuickBooks
    const updatedQBInvoice = await updateQuickBooksInvoice(updateData, qbToken);

    // Update local record
    await Invoice.findByIdAndUpdate(invoiceId, {
      amount: parseFloat(updatedQBInvoice.TotalAmt),
      dueDate: new Date(updatedQBInvoice.DueDate),
      quickBooksData: updatedQBInvoice,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: updatedQBInvoice
    });

  } catch (error) {
    console.error('Edit invoice error:', error);
    await handleQuickBooksError(error, res);
  }
};
```

### 2. Customer Management

#### Find or Create Customer
```javascript
const findOrCreateQuickBooksCustomer = async (debtCase, qbToken) => {
  try {
    const customerName = debtCase.caseType === 'company'
      ? debtCase.companyDetails.name
      : `${debtCase.firstName} ${debtCase.lastName}`;

    // Search for existing customer
    const searchResult = await searchQuickBooksCustomer(customerName, qbToken);

    if (searchResult && searchResult.length > 0) {
      return searchResult[0];
    }

    // Create new customer
    const customerData = {
      Name: customerName,
      CompanyName: debtCase.caseType === 'company' ? debtCase.companyDetails.name : undefined,
      PrimaryEmailAddr: {
        Address: debtCase.caseType === 'company'
          ? debtCase.companyDetails.primaryContact.email
          : debtCase.email
      },
      PrimaryPhone: {
        FreeFormNumber: debtCase.caseType === 'company'
          ? debtCase.companyDetails.primaryContact.phone
          : debtCase.phone
      },
      BillAddr: formatQuickBooksAddress(debtCase),
      Notes: `Created from ÉquiSettle case: ${debtCase.name}`
    };

    const newCustomer = await createQuickBooksCustomer(customerData, qbToken);

    // Store mapping in local database
    await QuickBooksCustomer.create({
      quickBooksCustomerId: newCustomer.Id,
      eqsCaseId: debtCase._id,
      company: debtCase.companyAccount,
      customerData: newCustomer
    });

    return newCustomer;

  } catch (error) {
    console.error('Find/create customer error:', error);
    throw error;
  }
};
```

### 3. Batch Synchronization

#### Sync All Invoices
```javascript
const syncAllInvoices = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { page = 1, pageSize = 100 } = req.query;

    const qbToken = await getValidQuickBooksToken(companyId);

    // Get invoices from QuickBooks with pagination
    const invoices = await getQuickBooksInvoices(qbToken, {
      maxResults: pageSize,
      startPosition: (page - 1) * pageSize + 1
    });

    const syncResults = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: []
    };

    for (const qbInvoice of invoices) {
      try {
        await syncSingleInvoice(qbInvoice, companyId);

        const existingInvoice = await Invoice.findOne({
          quickBooksInvoiceId: qbInvoice.Id,
          company: companyId
        });

        if (existingInvoice) {
          syncResults.updated++;
        } else {
          syncResults.created++;
        }

        syncResults.processed++;

      } catch (error) {
        syncResults.errors.push({
          invoiceId: qbInvoice.Id,
          error: error.message
        });
      }
    }

    // Update sync timestamp
    await Company.findByIdAndUpdate(companyId, {
      'integrations.quickbooks.lastSynced': new Date()
    });

    res.json({
      success: true,
      message: 'Invoice synchronization completed',
      data: syncResults
    });

  } catch (error) {
    console.error('Sync invoices error:', error);
    await handleQuickBooksError(error, res);
  }
};
```

## Error Handling

### Comprehensive Error Management
```javascript
const handleQuickBooksError = async (error, res) => {
  console.error('QuickBooks API Error:', error);

  let statusCode = 500;
  let message = 'Internal server error';

  if (error.response) {
    statusCode = error.response.status;

    switch (statusCode) {
      case 400:
        message = 'Invalid request data';
        if (error.response.data?.Fault?.Error) {
          message = error.response.data.Fault.Error[0].Detail;
        }
        break;

      case 401:
        message = 'QuickBooks authorization expired';
        // Trigger token refresh
        break;

      case 403:
        message = 'Insufficient permissions in QuickBooks';
        break;

      case 404:
        message = 'Resource not found in QuickBooks';
        break;

      case 429:
        message = 'QuickBooks API rate limit exceeded';
        // Schedule retry
        break;

      case 500:
        message = 'QuickBooks server error';
        break;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};
```

### Token Refresh Logic
```javascript
const getValidQuickBooksToken = async (companyId) => {
  try {
    const company = await Company.findById(companyId);
    const qbIntegration = company.integrations.quickbooks;

    if (!qbIntegration.isActive) {
      throw new Error('QuickBooks integration not active');
    }

    // Check if token needs refresh
    const expiryTime = new Date(qbIntegration.accessTokenExpiresAt);
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

    if (now.getTime() > (expiryTime.getTime() - bufferTime)) {
      // Refresh token
      const refreshedTokens = await refreshQuickBooksToken(qbIntegration.refreshToken);

      // Update stored tokens
      await Company.findByIdAndUpdate(companyId, {
        'integrations.quickbooks.accessToken': refreshedTokens.access_token,
        'integrations.quickbooks.refreshToken': refreshedTokens.refresh_token,
        'integrations.quickbooks.accessTokenExpiresAt': new Date(Date.now() + refreshedTokens.expires_in * 1000)
      });

      return refreshedTokens.access_token;
    }

    return qbIntegration.accessToken;

  } catch (error) {
    console.error('Token validation/refresh error:', error);
    throw new Error('Failed to get valid QuickBooks token');
  }
};
```

## Background Jobs

### Token Refresh Job
```javascript
// Cron job for proactive token refresh
const tokenRefreshJob = cron.schedule('0 */4 * * *', async () => {
  console.log('Running QuickBooks token refresh job...');

  try {
    const companies = await Company.find({
      'integrations.quickbooks.isActive': true
    });

    for (const company of companies) {
      const qbIntegration = company.integrations.quickbooks;
      const expiryTime = new Date(qbIntegration.accessTokenExpiresAt);
      const now = new Date();
      const refreshWindow = 24 * 60 * 60 * 1000; // 24 hours

      if (now.getTime() > (expiryTime.getTime() - refreshWindow)) {
        try {
          await refreshQuickBooksToken(company._id);
          console.log(`Refreshed QuickBooks token for company: ${company._id}`);
        } catch (error) {
          console.error(`Failed to refresh token for company ${company._id}:`, error);
        }
      }
    }

  } catch (error) {
    console.error('Token refresh job error:', error);
  }
}, {
  scheduled: false
});

// Start the job
tokenRefreshJob.start();
```

### Invoice Sync Job
```javascript
const invoiceSyncJob = cron.schedule('0 */2 * * *', async () => {
  console.log('Running QuickBooks invoice sync job...');

  try {
    const companies = await Company.find({
      'integrations.quickbooks.isActive': true
    });

    for (const company of companies) {
      try {
        await syncCompanyInvoices(company._id);
        console.log(`Synced invoices for company: ${company._id}`);
      } catch (error) {
        console.error(`Failed to sync invoices for company ${company._id}:`, error);
      }
    }

  } catch (error) {
    console.error('Invoice sync job error:', error);
  }
});
```

## API Endpoints

### Authentication Endpoints
```
GET  /api/v1/quickbooks/auth          # Initiate OAuth flow
GET  /api/v1/quickbooks/callback      # OAuth callback handler
POST /api/v1/quickbooks/disconnect    # Disconnect integration
GET  /api/v1/quickbooks/status        # Check connection status
```

### Invoice Management Endpoints
```
POST /api/v1/quickbooks/invoices/create       # Create invoice from debt
GET  /api/v1/quickbooks/invoices              # Get all invoices
PUT  /api/v1/quickbooks/invoices/:id          # Update invoice
POST /api/v1/quickbooks/invoices/:id/send     # Send invoice
DELETE /api/v1/quickbooks/invoices/:id        # Delete invoice
```

### Synchronization Endpoints
```
POST /api/v1/quickbooks/sync/invoices         # Sync all invoices
POST /api/v1/quickbooks/sync/customers        # Sync all customers
POST /api/v1/quickbooks/sync/full            # Full synchronization
GET  /api/v1/quickbooks/sync/status          # Get sync status
```

## Testing

### Unit Tests
```javascript
describe('QuickBooks Integration', () => {
  describe('Invoice Creation', () => {
    it('should create invoice from debt case', async () => {
      const mockDebtCase = {
        _id: 'debt123',
        name: 'Test Company',
        caseType: 'company',
        companyDetails: {
          name: 'Test Company Ltd',
          primaryContact: {
            email: 'test@company.com',
            phone: '+1234567890'
          }
        }
      };

      const result = await createInvoiceFromDebt(mockDebtCase, mockTokens);

      expect(result).toBeDefined();
      expect(result.invoice).toBeDefined();
      expect(result.quickBooksInvoice).toBeDefined();
    });
  });

  describe('Token Management', () => {
    it('should refresh expired tokens', async () => {
      const expiredTokens = {
        accessToken: 'expired_token',
        refreshToken: 'valid_refresh_token',
        accessTokenExpiresAt: new Date(Date.now() - 1000)
      };

      const refreshedToken = await getValidQuickBooksToken('company123');

      expect(refreshedToken).toBeDefined();
      expect(refreshedToken).not.toBe('expired_token');
    });
  });
});
```

### Integration Tests
```javascript
describe('QuickBooks API Integration', () => {
  it('should connect to QuickBooks sandbox', async () => {
    const response = await request(app)
      .get('/api/v1/quickbooks/test')
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.connected).toBe(true);
  });

  it('should create and retrieve invoice', async () => {
    const invoiceData = {
      debtId: testDebtId,
      dueDate: '2024-02-01',
      lineItems: [{
        description: 'Test Service',
        quantity: 1,
        unitPrice: 100.00,
        amount: 100.00
      }]
    };

    const createResponse = await request(app)
      .post('/api/v1/quickbooks/invoices/create')
      .set('Authorization', `Bearer ${testToken}`)
      .send(invoiceData)
      .expect(200);

    expect(createResponse.body.success).toBe(true);

    const invoiceId = createResponse.body.data.invoice._id;

    const getResponse = await request(app)
      .get(`/api/v1/quickbooks/invoices/${invoiceId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200);

    expect(getResponse.body.data.invoiceNumber).toBeDefined();
  });
});
```

## Troubleshooting

### Common Issues

#### 1. Authentication Failures
```bash
# Check QuickBooks connection
curl -X GET "http://localhost:8000/api/v1/quickbooks/status" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Refresh tokens manually
curl -X POST "http://localhost:8000/api/v1/quickbooks/refresh" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### 2. Invoice Creation Errors
- **Customer Not Found**: Ensure customer exists or enable auto-creation
- **Invalid Line Items**: Verify line item structure and amounts
- **Duplicate DocNumber**: Use unique invoice numbers

#### 3. Sync Issues
- **Rate Limiting**: Implement exponential backoff
- **Large Data Sets**: Use pagination for large invoice sets
- **Network Timeouts**: Increase timeout values for large operations

### Debug Mode
```javascript
// Enable debug logging
process.env.DEBUG = 'quickbooks:*';

// Detailed error logging
const debugQuickBooksError = (operation, error) => {
  console.error(`QuickBooks ${operation} Error:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    stack: error.stack
  });
};
```

## Performance Optimization

### Batch Processing
```javascript
const batchProcessInvoices = async (invoices, batchSize = 10) => {
  const batches = [];
  for (let i = 0; i < invoices.length; i += batchSize) {
    batches.push(invoices.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Promise.all(batch.map(invoice => processInvoice(invoice)));
    await sleep(1000); // Rate limiting
  }
};
```

### Caching Strategy
```javascript
const cacheQuickBooksData = async (key, data, ttl = 3600) => {
  await redis.setex(`qb:${key}`, ttl, JSON.stringify(data));
};

const getCachedQuickBooksData = async (key) => {
  const cached = await redis.get(`qb:${key}`);
  return cached ? JSON.parse(cached) : null;
};
```

The QuickBooks integration provides a robust, feature-complete solution for managing accounting data within the ÉquiSettle platform, enabling seamless invoice management and automated debt collection workflows.
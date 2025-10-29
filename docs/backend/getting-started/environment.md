---
sidebar_position: 2
title: "Environment Variables"
description: "Complete reference for ÉquiSettle backend environment configuration"
---

# Environment Variables Configuration

This guide provides a comprehensive reference for all environment variables required to run the ÉquiSettle backend platform.

## Core Configuration

### Application Settings
```env
# Environment type
NODE_ENV=development  # development | staging | production

# Application port
PORT=8000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# API base URL
API_BASE_URL=http://localhost:8000

# Application secret for sessions
SESSION_SECRET=your-super-secret-session-key
```

### Database Configuration
```env
# MongoDB connection string
MONGODB_URL=mongodb://localhost:27017/equisettle-dev

# MongoDB options (optional)
MONGODB_OPTIONS=retryWrites=true&w=majority

# Database name override (optional)
DATABASE_NAME=equisettle
```

### Redis Configuration
```env
# Upstash Redis URL
UPSTASH_REDIS_URL=redis://localhost:6379

# Upstash Redis token (for cloud instances)
UPSTASH_REDIS_TOKEN=your-redis-token

# Redis connection options
REDIS_CONNECTION_NAME=equisettle-backend
REDIS_MAX_RETRIES=3
```

### JWT Authentication
```env
# JWT secret key (must be strong)
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random

# JWT expiration times
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# JWT issuer
JWT_ISSUER=equisettle-platform
```

## Email Configuration

### Gmail API Integration
```env
# Gmail OAuth credentials
GMAIL_CLIENT_ID=your-gmail-client-id.googleusercontent.com
GMAIL_CLIENT_SECRET=your-gmail-client-secret

# Gmail OAuth tokens
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
GMAIL_ACCESS_TOKEN=your-gmail-access-token

# Gmail configuration
GMAIL_USER=your-email@gmail.com
GMAIL_REDIRECT_URI=http://localhost:8000/auth/gmail/callback
```

### Email Templates
```env
# Email template configuration
EMAIL_TEMPLATE_PATH=./src/email/templates
DEFAULT_EMAIL_SENDER=noreply@equisettle.com
DEFAULT_EMAIL_SENDER_NAME=ÉquiSettle Platform
```

## SMS Configuration

### SMS Provider Settings
```env
# Primary SMS provider
SMS_PROVIDER=twilio  # twilio | vonage | aws-sns

# Twilio configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Vonage configuration
VONAGE_API_KEY=your-vonage-api-key
VONAGE_API_SECRET=your-vonage-api-secret
VONAGE_FROM_NUMBER=ÉquiSettle

# AWS SNS configuration
AWS_SNS_ACCESS_KEY_ID=your-aws-access-key
AWS_SNS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_SNS_REGION=us-east-1
```

## Integration Configurations

### QuickBooks Integration
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

### Zoho Integration
```env
# Zoho OAuth credentials
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-client-secret

# Zoho configuration
ZOHO_REDIRECT_URI=http://localhost:8000/api/v1/zoho/callback
ZOHO_SCOPE=ZohoBooks.fullaccess.all,ZohoCRM.modules.all

# Zoho API endpoints
ZOHO_BOOKS_API_URL=https://books.zoho.com/api/v3
ZOHO_CRM_API_URL=https://www.zohoapis.com/crm/v2
ZOHO_INVENTORY_API_URL=https://inventory.zoho.com/api/v1
```

### Clio Integration
```env
# Clio OAuth credentials
CLIO_CLIENT_ID=your-clio-client-id
CLIO_CLIENT_SECRET=your-clio-client-secret

# Clio configuration
CLIO_REDIRECT_URI=http://localhost:8000/api/v1/clio/callback
CLIO_API_BASE_URL=https://app.clio.com/api/v4
CLIO_WEBHOOK_SECRET=your-webhook-secret
```

### Sage Integration
```env
# Sage OAuth credentials
SAGE_CLIENT_ID=your-sage-client-id
SAGE_CLIENT_SECRET=your-sage-client-secret

# Sage configuration
SAGE_REDIRECT_URI=http://localhost:8000/api/v1/sage/callback
SAGE_API_BASE_URL=https://api.sageone.com/v3.1
SAGE_ENVIRONMENT=sandbox  # sandbox | production
```

### Xero Integration
```env
# Xero OAuth credentials
XERO_CLIENT_ID=your-xero-client-id
XERO_CLIENT_SECRET=your-xero-client-secret

# Xero configuration
XERO_REDIRECT_URI=http://localhost:8000/api/v1/xero/callback
XERO_SCOPES=accounting.transactions,accounting.contacts,accounting.settings
```

### FreeAgent Integration
```env
# FreeAgent OAuth credentials
FREEAGENT_CLIENT_ID=your-freeagent-client-id
FREEAGENT_CLIENT_SECRET=your-freeagent-client-secret

# FreeAgent configuration
FREEAGENT_REDIRECT_URI=http://localhost:8000/api/v1/freeagent/callback
FREEAGENT_API_BASE_URL=https://api.sandbox.freeagent.com/v2  # sandbox
FREEAGENT_ENVIRONMENT=sandbox  # sandbox | production
```

### Salesforce Integration
```env
# Salesforce OAuth credentials
SALESFORCE_CLIENT_ID=your-salesforce-client-id
SALESFORCE_CLIENT_SECRET=your-salesforce-client-secret

# Salesforce configuration
SALESFORCE_REDIRECT_URI=http://localhost:8000/api/v1/salesforce/callback
SALESFORCE_LOGIN_URL=https://test.salesforce.com  # test.salesforce.com | login.salesforce.com
SALESFORCE_API_VERSION=v58.0
```

## Payment Processing

### GoCardless Integration
```env
# GoCardless configuration
GOCARDLESS_ACCESS_TOKEN=your-gocardless-access-token
GOCARDLESS_ENVIRONMENT=sandbox  # sandbox | live
GOCARDLESS_WEBHOOK_SECRET=your-webhook-secret

# GoCardless API settings
GOCARDLESS_API_BASE_URL=https://api-sandbox.gocardless.com  # sandbox URL
```

### Stripe Integration
```env
# Stripe configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe configuration
STRIPE_API_VERSION=2023-10-16
```

### ChargeBee Integration
```env
# ChargeBee configuration
CHARGEBEE_SITE=your-chargebee-site
CHARGEBEE_API_KEY=your-chargebee-api-key

# ChargeBee webhook
CHARGEBEE_WEBHOOK_USERNAME=your-webhook-username
CHARGEBEE_WEBHOOK_PASSWORD=your-webhook-password
```

## AI and Analytics

### ChatGPT Integration
```env
# OpenAI configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ORGANIZATION=your-organization-id
OPENAI_MODEL=gpt-4  # gpt-3.5-turbo | gpt-4

# ChatGPT settings
CHATGPT_MAX_TOKENS=2000
CHATGPT_TEMPERATURE=0.7
```

### Predictive Analytics
```env
# Analytics configuration
ANALYTICS_ENGINE_URL=http://localhost:5000
ANALYTICS_API_KEY=your-analytics-api-key

# Machine learning settings
ML_MODEL_PATH=./models
ML_TRAINING_DATA_PATH=./data/training
```

## File Storage and Processing

### File Upload Configuration
```env
# File upload settings
MAX_FILE_SIZE=10MB
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,csv,jpg,jpeg,png
UPLOAD_PATH=./uploads

# CSV processing
CSV_BATCH_SIZE=1000
CSV_MAX_ROWS=50000
```

### AWS S3 Configuration (Optional)
```env
# AWS S3 for file storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=equisettle-files
```

## Logging and Monitoring

### Logging Configuration
```env
# Log level
LOG_LEVEL=info  # error | warn | info | debug

# Log format
LOG_FORMAT=json  # json | simple

# Log file paths
LOG_FILE_PATH=./logs/app.log
ERROR_LOG_FILE_PATH=./logs/error.log
```

### Monitoring
```env
# Health check configuration
HEALTH_CHECK_TIMEOUT=5000
HEALTH_CHECK_INTERVAL=30000

# Performance monitoring
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_SAMPLE_RATE=0.1
```

## Development Tools

### Development Configuration
```env
# Debug settings
DEBUG=equisettle:*
VERBOSE_LOGGING=true

# Development tools
ENABLE_SWAGGER_UI=true
ENABLE_GRAPHQL_PLAYGROUND=true
ENABLE_CORS_ALL_ORIGINS=true
```

### Testing Configuration
```env
# Test database
TEST_MONGODB_URL=mongodb://localhost:27017/equisettle-test
TEST_REDIS_URL=redis://localhost:6379/1

# Test settings
TEST_TIMEOUT=30000
TEST_PARALLEL=true
```

## Security Configuration

### Security Settings
```env
# CORS configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Security headers
HELMET_ENABLED=true
CSRF_PROTECTION=true
```

### Webhook Security
```env
# Webhook signature verification
WEBHOOK_SIGNATURE_HEADER=x-hub-signature-256
WEBHOOK_SIGNATURE_ALGORITHM=sha256

# Webhook retry settings
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_RETRY_DELAY=5000
```

## Environment-Specific Examples

### Development Environment (.env.development)
```env
NODE_ENV=development
PORT=8000
MONGODB_URL=mongodb://localhost:27017/equisettle-dev
UPSTASH_REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
ENABLE_SWAGGER_UI=true
```

### Staging Environment (.env.staging)
```env
NODE_ENV=staging
PORT=8000
MONGODB_URL=mongodb://staging-db:27017/equisettle-staging
UPSTASH_REDIS_URL=redis://staging-redis:6379
FRONTEND_URL=https://staging.equisettle.com
LOG_LEVEL=info
ENABLE_SWAGGER_UI=false
```

### Production Environment (.env.production)
```env
NODE_ENV=production
PORT=8000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/equisettle
UPSTASH_REDIS_URL=rediss://username:password@redis-cluster.upstash.io:6380
FRONTEND_URL=https://app.equisettle.com
LOG_LEVEL=warn
ENABLE_SWAGGER_UI=false
```

## Environment Validation

The application validates all required environment variables on startup:

```javascript
// Required variables that must be present
const requiredEnvVars = [
  'MONGODB_URL',
  'JWT_SECRET',
  'UPSTASH_REDIS_URL',
  'FRONTEND_URL'
];

// Integration-specific required variables
const integrationRequiredVars = {
  quickbooks: ['QUICKBOOKS_CLIENT_ID', 'QUICKBOOKS_CLIENT_SECRET'],
  zoho: ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET'],
  clio: ['CLIO_CLIENT_ID', 'CLIO_CLIENT_SECRET'],
  // ... additional integrations
};
```

## Configuration Best Practices

### Security Best Practices
1. **Never commit secrets** to version control
2. **Use strong, unique values** for JWT_SECRET and SESSION_SECRET
3. **Rotate credentials regularly** in production
4. **Use environment-specific values** for each deployment
5. **Validate all inputs** before using environment variables

### Performance Best Practices
1. **Cache environment variables** during application startup
2. **Use connection pooling** for database connections
3. **Set appropriate timeouts** for external API calls
4. **Configure rate limiting** to prevent abuse

### Monitoring Best Practices
1. **Enable comprehensive logging** in production
2. **Set up health checks** for all critical services
3. **Monitor environment variable changes**
4. **Alert on missing or invalid configuration**

## Troubleshooting Configuration Issues

### Common Issues and Solutions

#### MongoDB Connection Issues
```bash
# Check connection string format
MONGODB_URL=mongodb://username:password@host:port/database

# For MongoDB Atlas
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

#### Redis Connection Issues
```bash
# Local Redis
UPSTASH_REDIS_URL=redis://localhost:6379

# Upstash Redis with authentication
UPSTASH_REDIS_URL=rediss://username:password@host:port
```

#### Integration Authentication Issues
```bash
# Verify OAuth redirect URIs match exactly
# Check client IDs and secrets are correct
# Ensure proper URL encoding for special characters
```

## Next Steps

After configuring your environment variables:

1. **[Quick Start Guide](./quick-start)** - Test your configuration
2. **[Architecture Overview](../architecture/overview)** - Understand the system
3. **[Integration Setup](../integrations/overview)** - Configure third-party services
4. **[Security Guide](../development/security)** - Secure your deployment

For additional help with configuration, see the **[Troubleshooting Guide](../troubleshooting/common-issues)**.
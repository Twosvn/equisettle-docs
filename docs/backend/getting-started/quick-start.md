---
sidebar_position: 3
title: "Quick Start Guide"
description: "Get up and running with the ÉquiSettle backend platform in minutes"
---

# Quick Start Guide

This guide will get you up and running with the ÉquiSettle backend platform quickly. Follow these steps to set up a basic development environment and test core functionality.

## Prerequisites Checklist

Before starting, ensure you have completed:

- ✅ **[Development Setup](./setup)** - Installed Node.js, MongoDB, Redis
- ✅ **[Environment Configuration](./environment)** - Configured basic environment variables
- ✅ **Git Repository** - Cloned the backend repository

## 1. Quick Environment Setup

### Minimal .env Configuration
Create a `.env` file with these essential variables:

```env
# Core configuration
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URL=mongodb://localhost:27017/equisettle-quickstart

# Cache
UPSTASH_REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=quick-start-jwt-secret-change-in-production
SESSION_SECRET=quick-start-session-secret-change-in-production

# Email (optional for quick start)
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
```

### Start Required Services
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
# OR
sudo systemctl start mongod            # Linux

# Start Redis
brew services start redis              # macOS
# OR
sudo systemctl start redis-server      # Linux

# Verify services are running
mongosh --eval "db.adminCommand('ping')"  # Should return { ok: 1 }
redis-cli ping                             # Should return "PONG"
```

## 2. Application Startup

### Install Dependencies and Start
```bash
# Navigate to the project directory
cd eqs-platform-be

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Verify Application Startup
You should see output similar to:
```
[INFO] Starting ÉquiSettle Backend Platform...
[INFO] Environment: development
[INFO] Database connected: MongoDB
[INFO] Cache connected: Redis
[INFO] Server listening on port 8000
[INFO] Background jobs initialized
[INFO] Health check endpoint: http://localhost:8000/health
```

## 3. Health Check Verification

### Test the Application
```bash
# Basic health check
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  },
  "version": "1.0.0",
  "uptime": "00:00:30"
}
```

### Test API Endpoints
```bash
# Test the API root
curl http://localhost:8000/api/v1/

# Expected response:
{
  "message": "ÉquiSettle API v1",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "endpoints": {
    "auth": "/api/v1/auth",
    "companies": "/api/v1/companies",
    "cases": "/api/v1/csv-mappings",
    "invoices": "/api/v1/invoices"
  }
}
```

## 4. Create Your First Resources

### Create a Company Account
```bash
curl -X POST http://localhost:8000/api/v1/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QuickStart Company Ltd",
    "email": "quickstart@example.com",
    "currency": "GBP",
    "companyType": "Limited"
  }'
```

### Create an Admin User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Quick",
    "lastName": "Start",
    "email": "admin@quickstart.com",
    "password": "SecurePassword123!",
    "role": "ADMIN",
    "companyId": "YOUR_COMPANY_ID_FROM_ABOVE"
  }'
```

### Login and Get Authentication Token
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@quickstart.com",
    "password": "SecurePassword123!"
  }'

# Save the returned token for subsequent requests
export AUTH_TOKEN="your-jwt-token-here"
```

## 5. Test Core Features

### Create a Case (Debt Record)
```bash
curl -X POST http://localhost:8000/api/v1/csv-mappings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "name": "ABC Company Debt",
    "caseType": "company",
    "companyDetails": {
      "name": "ABC Company Ltd",
      "clientReference": "ABC-001",
      "amount": "5000.00",
      "dueDate": "2024-02-01",
      "primaryContact": {
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@abc.com",
        "phone": "+44 20 1234 5678"
      }
    }
  }'
```

### Create an Invoice
```bash
curl -X POST http://localhost:8000/api/v1/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "invoiceNumber": "INV-001",
    "amount": 5000.00,
    "dueDate": "2024-02-01",
    "status": "draft",
    "customerName": "ABC Company Ltd",
    "customerEmail": "billing@abc.com"
  }'
```

### Retrieve Your Data
```bash
# Get all cases
curl -H "Authorization: Bearer $AUTH_TOKEN" \
  http://localhost:8000/api/v1/csv-mappings

# Get all invoices
curl -H "Authorization: Bearer $AUTH_TOKEN" \
  http://localhost:8000/api/v1/invoices

# Get company details
curl -H "Authorization: Bearer $AUTH_TOKEN" \
  http://localhost:8000/api/v1/companies/profile
```

## 6. Test Background Jobs

### Verify Cron Jobs are Running
```bash
# Check application logs for cron job initialization
tail -f logs/app.log | grep -i cron

# You should see messages like:
# [INFO] Cron job initialized: Case Outstanding Status
# [INFO] Cron job initialized: Invoice Reminders
# [INFO] Cron job initialized: Workflow Auto-Progression
```

### Test Automated Features
```bash
# Trigger a workflow on your case
curl -X PUT http://localhost:8000/api/v1/csv-mappings/YOUR_CASE_ID/workflow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "workflowId": "default-collection-workflow",
    "action": "start"
  }'
```

## 7. Development Tools and Testing

### API Documentation (Swagger)
If enabled in development:
```bash
# Access Swagger UI
open http://localhost:8000/api-docs
```

### Database Inspection
```bash
# Connect to MongoDB and inspect data
mongosh equisettle-quickstart

# List collections
show collections

# View your created company
db.companies.find().pretty()

# View your created case
db.csvmappings.find().pretty()

# Exit MongoDB
exit
```

### Redis Cache Inspection
```bash
# Connect to Redis and inspect cache
redis-cli

# List all keys
KEYS *

# Check session data
KEYS "sess:*"

# Exit Redis
exit
```

## 8. Integration Quick Test

### Test QuickBooks Integration (Optional)
If you have QuickBooks sandbox credentials:

```bash
# Start OAuth flow
curl http://localhost:8000/api/v1/quickbooks/auth?companyId=YOUR_COMPANY_ID

# This will return an authorization URL - visit it in your browser
# After authorization, test the connection:
curl -H "Authorization: Bearer $AUTH_TOKEN" \
  http://localhost:8000/api/v1/quickbooks/status
```

### Test Email Integration (Optional)
If you have Gmail API configured:

```bash
# Send a test email
curl -X POST http://localhost:8000/api/v1/email/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "to": "test@example.com",
    "subject": "Quick Start Test",
    "template": "test",
    "variables": {
      "name": "Quick Start User"
    }
  }'
```

## 9. Performance and Monitoring

### Monitor Application Performance
```bash
# Check memory usage
curl -H "Authorization: Bearer $AUTH_TOKEN" \
  http://localhost:8000/api/v1/system/stats

# Check active connections
curl -H "Authorization: Bearer $AUTH_TOKEN" \
  http://localhost:8000/api/v1/system/connections
```

### Load Testing (Optional)
```bash
# Install artillery for load testing
npm install -g artillery

# Create a simple load test
cat > load-test.yml << EOF
config:
  target: 'http://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Health check load test"
    requests:
      - get:
          url: "/health"
EOF

# Run load test
artillery run load-test.yml
```

## 10. Next Steps and Learning Path

### Immediate Next Steps
1. **[Explore API Documentation](../api/authentication)** - Learn all available endpoints
2. **[Set Up Integrations](../integrations/overview)** - Connect external services
3. **[Understand Architecture](../architecture/overview)** - Deep dive into system design

### Development Path
1. **[Learn Core Features](../features/companies)** - Understand business logic
2. **[Testing Strategies](../testing/overview)** - Write tests for your code
3. **[Security Best Practices](../development/security)** - Secure your application

### Production Readiness
1. **[Environment Configuration](./environment)** - Production-ready config
2. **[Deployment Guide](../../deployment/overview)** - Deploy to cloud
3. **[Monitoring Setup](../../deployment/monitoring/logs)** - Production monitoring

## Common Quick Start Issues

### Port Already in Use
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=8001 npm run dev
```

### Database Connection Failed
```bash
# Check MongoDB is running
brew services list | grep mongodb

# Check connection string
echo $MONGODB_URL

# Test connection manually
mongosh $MONGODB_URL
```

### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Check Redis URL
echo $UPSTASH_REDIS_URL

# Test connection
redis-cli -u $UPSTASH_REDIS_URL ping
```

### Missing Dependencies
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Sample Development Workflow

Now that you have the basics running, here's a typical development workflow:

```bash
# 1. Create a new feature branch
git checkout -b feature/my-new-feature

# 2. Make your changes
# Edit files in src/

# 3. Test your changes
npm test
npm run lint

# 4. Start the dev server and test manually
npm run dev

# 5. Commit your changes
git add .
git commit -m "feat: add new feature"

# 6. Push and create pull request
git push origin feature/my-new-feature
```

Congratulations! You now have a fully functional ÉquiSettle backend platform running locally. You can create companies, manage cases, process invoices, and integrate with external services.

For more advanced features and production deployment, continue with the comprehensive documentation sections.
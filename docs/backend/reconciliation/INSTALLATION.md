# Reconciliation Module - Installation & Integration Guide

## Prerequisites

All required dependencies are already installed in the project:
- ✅ `csv-parser` - CSV file parsing
- ✅ `moment` - Date handling
- ✅ `nanoid` - Unique ID generation
- ✅ `pdf-parse` - PDF text extraction
- ✅ `tesseract.js` - OCR for PDF parsing
- ✅ `multer` - File upload handling
- ✅ `mongoose` - Database ORM

## Installation Steps

### 1. Module is Ready to Use

The reconciliation module is fully implemented and ready for integration. All files are located in:

```
eqs-platform-be/src/core-features/reconciliation/
├── models/
│   ├── BankStatement.js
│   ├── ReconciliationMatch.js
│   └── ReconciliationSession.js
├── controllers/
│   ├── upload.controller.js
│   ├── matching.controller.js
│   ├── review.controller.js
│   └── confirm.controller.js
├── services/
│   ├── csvParser.service.js
│   ├── pdfParser.service.js
│   └── matchingEngine.service.js
├── utils/
│   ├── bankFormats.js
│   ├── stringMatching.js
│   └── auditLogger.js
├── middlewares/
│   └── statementUploader.js
├── routes/
│   └── reconciliation.routes.js
├── index.js
├── README.md
└── INSTALLATION.md
```

### 2. Register Routes

Add the reconciliation routes to your main application file.

**File**: `eqs-platform-be/index.js` or your main app file

```javascript
// Import reconciliation routes
const { reconciliationRoutes } = require('./src/core-features/reconciliation');

// Register routes (after authentication middleware)
app.use('/api/reconciliation', authMiddleware, reconciliationRoutes);
```

### 3. Database Indexes (Recommended)

The models include index definitions, but you may want to create them manually for optimal performance:

```javascript
// Run this once or add to a migration script
const mongoose = require('mongoose');
const BankStatement = require('./src/core-features/reconciliation/models/BankStatement');
const ReconciliationMatch = require('./src/core-features/reconciliation/models/ReconciliationMatch');
const ReconciliationSession = require('./src/core-features/reconciliation/models/ReconciliationSession');

// Create indexes
async function createIndexes() {
  await BankStatement.createIndexes();
  await ReconciliationMatch.createIndexes();
  await ReconciliationSession.createIndexes();
  console.log('Reconciliation indexes created');
}

createIndexes();
```

### 4. Environment Variables (Optional)

Add these to your `.env` file if you want to customize:

```env
# Reconciliation Settings
RECONCILIATION_FILE_SIZE_LIMIT=20971520  # 20MB in bytes
RECONCILIATION_AMOUNT_TOLERANCE=5         # £5 default tolerance
RECONCILIATION_NAME_THRESHOLD=0.8         # 80% similarity threshold
```

### 5. Authentication & Authorization

Ensure your authentication middleware:
- Populates `req.user._id` with the authenticated user ID
- Validates company access for company-specific routes

Example middleware check:
```javascript
function requireAuth(req, res, next) {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

app.use('/api/reconciliation', requireAuth, reconciliationRoutes);
```

## Testing the Installation

### 1. Test Statement Upload

```bash
curl -X POST http://localhost:3000/api/reconciliation/statements/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "companyId=YOUR_COMPANY_ID" \
  -F "bankName=Barclays" \
  -F "statement=@path/to/statement.csv"
```

Expected response:
```json
{
  "success": true,
  "message": "Statement uploaded and parsed successfully",
  "data": {
    "statementId": "...",
    "transactionCount": 45,
    "bankName": "Barclays"
  }
}
```

### 2. Test Matching

```bash
curl -X POST http://localhost:3000/api/reconciliation/matching/run/STATEMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amountTolerance": 5, "nameThreshold": 0.8}'
```

Expected response:
```json
{
  "success": true,
  "message": "Matching completed successfully",
  "data": {
    "sessionId": "...",
    "stats": {
      "totalTransactions": 45,
      "highConfidenceMatches": 30,
      "mediumConfidenceMatches": 10,
      "unmatchedTransactions": 5
    }
  }
}
```

### 3. Test Dashboard

```bash
curl -X GET http://localhost:3000/api/reconciliation/review/dashboard/SESSION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Issues & Troubleshooting

### Issue: "Module not found"

**Solution**: Ensure you're importing from the correct path:
```javascript
const { reconciliationRoutes } = require('./src/core-features/reconciliation');
```

### Issue: "File upload failed"

**Solution**: Check multer is configured correctly and file size limits:
```javascript
// In your main app
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
```

### Issue: "Cannot read property '_id' of undefined"

**Solution**: Ensure authentication middleware populates `req.user`:
```javascript
// Your auth middleware should set:
req.user = { _id: userId, ... };
```

### Issue: "PDF parsing returns no transactions"

**Solution**:
1. PDF may be image-based and OCR quality is poor
2. Try CSV format instead for better accuracy
3. Check OCR service logs for errors

### Issue: "No invoices matched"

**Solution**:
1. Verify invoices exist in database with status 'unpaid' or 'partially_paid'
2. Check invoices don't have GoCardless payment IDs
3. Review matching thresholds (may need adjustment)
4. Use manual matching feature

## API Testing with Postman

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Reconciliation API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Upload Statement",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/reconciliation/statements/upload",
        "body": {
          "mode": "formdata",
          "formdata": [
            { "key": "companyId", "value": "{{companyId}}", "type": "text" },
            { "key": "bankName", "value": "Barclays", "type": "text" },
            { "key": "statement", "type": "file" }
          ]
        }
      }
    },
    {
      "name": "Run Matching",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/reconciliation/matching/run/{{statementId}}",
        "body": {
          "mode": "raw",
          "raw": "{\"amountTolerance\": 5, \"nameThreshold\": 0.8}"
        }
      }
    },
    {
      "name": "Get Dashboard",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/reconciliation/review/dashboard/{{sessionId}}"
      }
    }
  ]
}
```

## Monitoring & Logs

### View Reconciliation Logs

All reconciliation activities are logged to the `logs` collection:

```javascript
const Log = require('./src/system-logs/models/Logs');

// Get reconciliation logs
const logs = await Log.find({
  logType: 'reconciliation',
  company: companyId
}).sort({ createdAt: -1 }).limit(100);
```

### Monitor Performance

Track these metrics:
- Upload success rate
- Average matching time
- Auto-match acceptance rate
- Manual intervention rate

```javascript
const sessions = await ReconciliationSession.find({ company: companyId });

const metrics = {
  totalSessions: sessions.length,
  avgHighConfidence: sessions.reduce((sum, s) =>
    sum + (s.stats.highConfidenceMatches / s.stats.totalTransactions), 0
  ) / sessions.length,
  avgManualMatches: sessions.reduce((sum, s) =>
    sum + (s.stats.manualMatches || 0), 0
  ) / sessions.length
};
```

## Security Considerations

### 1. File Upload Security

The module uses multer with these security measures:
- File type validation (CSV/PDF only)
- File size limits (20MB)
- Memory storage (not disk) for processing

### 2. Company Isolation

All queries are scoped to company ID:
```javascript
// Example from matching engine
const invoices = await Invoice.find({
  company: companyId,  // <-- Company isolation
  status: { $in: ['unpaid', 'partially_paid'] }
});
```

### 3. GoCardless Protection

The system explicitly excludes invoices with GoCardless payments:
```javascript
$or: [
  { 'gocardless.paymentId': { $exists: false } },
  { 'gocardless.paymentId': null },
  { 'gocardless.paymentId': '' }
]
```

This prevents:
- Double payment reconciliation
- Overwriting GoCardless data
- Conflicts between payment systems

### 4. Transaction Safety

All payment-creating operations use MongoDB transactions:
- Atomic operations
- Automatic rollback on error
- Prevents partial updates

## Performance Optimization

### 1. Use Bulk Confirmation

For high confidence matches, use bulk confirmation:
```javascript
POST /api/reconciliation/confirm/bulk
{
  "matchIds": ["id1", "id2", "id3", ...],
  "notes": "Bulk confirmation"
}
```

### 2. Pagination

Always use pagination for large result sets:
```javascript
GET /api/reconciliation/review/auto-matched/:sessionId?page=1&limit=50
```

### 3. Index Usage

Ensure indexes are created for optimal query performance. Check with:
```javascript
db.bankstatements.getIndexes()
db.reconciliationmatches.getIndexes()
db.reconciliationsessions.getIndexes()
```

## Integration Checklist

- [ ] Routes registered in main application
- [ ] Authentication middleware applied
- [ ] Database indexes created
- [ ] File upload limits configured
- [ ] Tested with sample CSV upload
- [ ] Tested with sample PDF upload
- [ ] Verified matching engine works
- [ ] Confirmed payments are created correctly
- [ ] Checked audit logs are recording
- [ ] Tested undo functionality
- [ ] Verified GoCardless exclusion works
- [ ] Performance tested with large statements

## Next Steps

1. **Frontend Integration**
   - Build upload UI
   - Create reconciliation dashboard
   - Add match review interface

2. **Monitoring Setup**
   - Track usage metrics
   - Set up alerts for errors
   - Create reconciliation reports

3. **User Training**
   - Document workflow
   - Create training materials
   - Set up support processes

## Support

For questions or issues:
- Review logs: MongoDB `logs` collection with `logType: 'reconciliation'`
- Check README.md for API documentation
- Review matching algorithm details in README
- Contact development team

---

**Installation Complete!** 🎉

The reconciliation module is now ready to use. Start by uploading a test bank statement and running the matching engine.

# Reconciliation Module - Quick Start Guide

## 🚀 5-Minute Integration

### Step 1: Register Routes (30 seconds)

Add to your main app file:

```javascript
const { reconciliationRoutes } = require('./src/core-features/reconciliation');
app.use('/api/reconciliation', authMiddleware, reconciliationRoutes);
```

### Step 2: Test Upload (2 minutes)

```bash
curl -X POST http://localhost:3000/api/reconciliation/statements/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "companyId=COMPANY_ID" \
  -F "bankName=Barclays" \
  -F "statement=@statement.csv"
```

### Step 3: Run Matching (1 minute)

```bash
curl -X POST http://localhost:3000/api/reconciliation/matching/run/STATEMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amountTolerance": 5}'
```

### Step 4: Confirm Matches (1 minute)

```bash
# Bulk confirm high confidence matches
curl -X POST http://localhost:3000/api/reconciliation/confirm/bulk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"matchIds": ["match1", "match2", "match3"]}'
```

**Done!** Reconciliation is live. ✅

---

## 📋 Typical Workflow

```
1. Upload CSV/PDF → statementId
2. Run Matching → sessionId
3. Review Dashboard → Get match counts
4. Bulk Confirm High Confidence → Create payments
5. Manual Review Medium Confidence → Accept/Reject
6. Manual Match Unmatched → Search & link invoices
```

---

## 🎯 Key Endpoints

### Essential 4

```javascript
// 1. Upload
POST /api/reconciliation/statements/upload

// 2. Match
POST /api/reconciliation/matching/run/:statementId

// 3. Dashboard
GET /api/reconciliation/review/dashboard/:sessionId

// 4. Confirm
POST /api/reconciliation/confirm/bulk
```

### Common Operations

```javascript
// Get high confidence (auto-matched)
GET /api/reconciliation/review/auto-matched/:sessionId

// Get needs review
GET /api/reconciliation/review/needs-review/:sessionId

// Search invoices
GET /api/reconciliation/review/search-invoices/:companyId?query=INV-123&amount=250

// Manual match
POST /api/reconciliation/manual-match/:matchId
Body: { "invoiceId": "..." }

// Undo
POST /api/reconciliation/undo/:matchId
Body: { "notes": "Incorrect match" }
```

---

## 🔧 Configuration

Default values (can override per request):

```javascript
{
  amountTolerance: 5,        // £5 tolerance
  nameThreshold: 0.8,        // 80% similarity
  enableMultiInvoiceMatching: true
}
```

---

## 📊 Confidence Levels

- **High (>70)**: Auto-match, bulk confirmable
- **Medium (40-70)**: Needs review
- **Low (<40)**: Unmatched, requires manual

---

## ⚠️ Important Notes

1. **GoCardless Protection**: Automatically excludes invoices with GoCardless payments
2. **Transactions**: All payment operations use MongoDB transactions
3. **Audit**: Everything logged to `logs` collection with `logType: 'reconciliation'`
4. **Undo**: All confirmations can be reversed with `/undo/:matchId`
5. **Partial Payments**: Supported via `isPartialPayment: true` and `partialAmount`

---

## 🐛 Quick Debug

### No matches found?
- Check invoices exist with status 'unpaid' or 'partially_paid'
- Verify no GoCardless payment IDs on invoices
- Try lowering thresholds: `amountTolerance: 10, nameThreshold: 0.7`

### Upload failed?
- Check file size <20MB
- Verify MIME type is CSV or PDF
- Check auth middleware sets `req.user._id`

### Payment not created?
- Check invoice outstanding balance
- Verify amount doesn't exceed balance
- Review transaction rollback logs

---

## 📈 Performance Tips

1. **Use Bulk Confirm** for high confidence matches
2. **Enable Pagination** for large result sets
3. **Create Indexes** (optional but recommended):

```javascript
const { BankStatement, ReconciliationMatch, ReconciliationSession } = require('./src/core-features/reconciliation');

await BankStatement.createIndexes();
await ReconciliationMatch.createIndexes();
await ReconciliationSession.createIndexes();
```

---

## 📚 Full Documentation

- **README.md** - Complete technical docs
- **INSTALLATION.md** - Integration guide
- **RECONCILIATION_IMPLEMENTATION_SUMMARY.md** - Overview

---

## 🎉 You're Ready!

The reconciliation module is production-ready. Start with a test bank statement and see the magic happen! ✨

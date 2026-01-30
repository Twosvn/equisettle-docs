# Bank Statement Reconciliation Module

Comprehensive reconciliation system for matching bank transactions to invoices with automatic and manual matching capabilities.

## Features

### ✅ Phase 1: CSV Import & Parsing

- **Multi-Bank Support**: Automatic format detection for major UK banks
  - Barclays
  - HSBC
  - Lloyds
  - NatWest
  - Santander
  - Generic format fallback

- **PDF Support**: OCR-based parsing of PDF bank statements
  - Leverages existing OCR infrastructure
  - Extracts transactions, dates, amounts, and references
  - Confidence scoring for OCR quality

- **CSV Validation**:
  - Preview before processing
  - Error handling for corrupted files
  - Transaction validation and sanitization

### ✅ Phase 2: Matching Engine

#### Exact Matching (High Confidence >70)
- Amount matches exactly
- Customer name matches (case-insensitive)
- Invoice reference appears in payment description
- **Score**: 40 (amount) + 30 (name) + 30 (reference) = up to 100

#### Fuzzy Matching (Medium Confidence 40-70)
- Amount within £5 tolerance
- Customer name 80%+ similarity (Levenshtein distance)
- Partial reference matches
- **Score**: 35 (amount) + 30 (name) + 30 (reference) = up to 95

#### Multi-Invoice Matching
- Matches payment to combination of invoices
- Supports 2-3 invoice combinations
- Amount tolerance applied to sum

#### Confidence Scoring
- High: >70 points (auto-matched, bulk confirmable)
- Medium: 40-70 points (needs review)
- Low: <40 points (unmatched)

### ✅ Phase 3: Reconciliation Dashboard

#### Auto-Matched Section
- High confidence matches (>70%)
- One-click bulk confirmation
- Individual undo capability

#### Needs Review Section
- Medium confidence matches (40-70%)
- Shows match reasoning and confidence factors
- Accept/reject/manually select invoice

#### Unmatched Payments
- Low confidence or no matches (<40%)
- Manual search and link to invoices
- Mark as non-invoice payment option

#### Unmatched Invoices
- Invoices still unpaid after reconciliation
- Date range filtering
- Search and manual matching

## Architecture

### Data Models

#### BankStatement
Stores uploaded bank statements and their transactions.

```javascript
{
  company: ObjectId,
  fileName: String,
  fileType: 'csv' | 'pdf',
  bankName: String,
  accountNumber: String,
  sortCode: String,
  statementPeriod: { startDate, endDate },
  uploadedBy: ObjectId,
  parseStatus: 'pending' | 'parsed' | 'failed',
  transactions: [BankTransactionSchema],
  stats: { totalTransactions, reconciledCount, ... }
}
```

#### ReconciliationMatch
Stores match results between transactions and invoices.

```javascript
{
  company: ObjectId,
  session: ObjectId,
  bankStatement: ObjectId,
  transaction: { transactionId, date, amount, ... },
  suggestedInvoice: ObjectId,
  alternativeInvoices: [{ invoice, confidence, reason }],
  confidence: Number, // 0-100
  confidenceLevel: 'high' | 'medium' | 'low',
  matchFactors: [{ factor, score, details }],
  matchType: 'exact' | 'fuzzy' | 'multi_invoice' | 'manual',
  status: 'pending' | 'accepted' | 'rejected' | 'needs_review',
  createdPayment: ObjectId
}
```

#### ReconciliationSession
Tracks a reconciliation workflow for a statement.

```javascript
{
  company: ObjectId,
  bankStatement: ObjectId,
  startedBy: ObjectId,
  status: 'in_progress' | 'completed' | 'cancelled',
  stats: {
    totalTransactions,
    highConfidenceMatches,
    mediumConfidenceMatches,
    unmatchedTransactions,
    acceptedMatches,
    totalAmountReconciled
  }
}
```

### Services

#### CSV Parser Service
- Automatic bank format detection
- Multi-format date parsing
- Amount normalization
- Debit/credit handling

#### PDF Parser Service
- Uses existing OCR infrastructure
- Text extraction and structuring
- Transaction pattern recognition
- Bank identification

#### Matching Engine Service
- Three-phase matching (exact → fuzzy → multi-invoice)
- Configurable thresholds
- Customer name fuzzy matching
- Invoice reference extraction
- Batch processing support

### Controllers

#### Upload Controller
- Statement upload and parsing
- Preview functionality
- Statement management (list, detail, delete)

#### Matching Controller
- Run matching engine
- Session management
- Progress tracking

#### Review Controller
- Get matches by confidence level
- Search invoices
- Dashboard summaries

#### Confirm Controller
- Accept/reject matches
- Bulk operations
- Payment creation with transactions
- Invoice status updates
- Undo functionality
- Partial payment support

## API Endpoints

### Statement Upload
```
POST   /api/reconciliation/statements/upload
POST   /api/reconciliation/statements/preview
GET    /api/reconciliation/statements/:companyId
GET    /api/reconciliation/statements/detail/:statementId
DELETE /api/reconciliation/statements/:statementId
```

### Matching
```
POST /api/reconciliation/matching/run/:statementId
GET  /api/reconciliation/sessions/:sessionId
GET  /api/reconciliation/sessions/company/:companyId
PUT  /api/reconciliation/sessions/:sessionId/status
```

### Review
```
GET /api/reconciliation/review/auto-matched/:sessionId
GET /api/reconciliation/review/needs-review/:sessionId
GET /api/reconciliation/review/unmatched/:sessionId
GET /api/reconciliation/review/unmatched-invoices/:companyId
GET /api/reconciliation/review/match/:matchId
GET /api/reconciliation/review/search-invoices/:companyId
GET /api/reconciliation/review/dashboard/:sessionId
```

### Confirm/Reject
```
POST /api/reconciliation/confirm/:matchId
POST /api/reconciliation/confirm/bulk
POST /api/reconciliation/reject/:matchId
POST /api/reconciliation/undo/:matchId
POST /api/reconciliation/manual-match/:matchId
```

## Usage Flow

### 1. Upload Bank Statement

```javascript
// Upload CSV or PDF
POST /api/reconciliation/statements/upload
Content-Type: multipart/form-data

{
  companyId: "company_id",
  bankName: "Barclays",
  statement: <file>
}

Response: {
  success: true,
  data: {
    statementId: "...",
    transactionCount: 45,
    stats: { ... }
  }
}
```

### 2. Run Matching

```javascript
POST /api/reconciliation/matching/run/:statementId

{
  amountTolerance: 5,
  nameThreshold: 0.8
}

Response: {
  success: true,
  data: {
    sessionId: "...",
    stats: {
      totalTransactions: 45,
      highConfidenceMatches: 30,
      mediumConfidenceMatches: 10,
      unmatchedTransactions: 5
    }
  }
}
```

### 3. Review Matches

```javascript
// Get high confidence matches
GET /api/reconciliation/review/auto-matched/:sessionId

Response: {
  matches: [
    {
      matchId: "...",
      transaction: { amount: 250.00, payeeName: "ABC Ltd", ... },
      suggestedInvoice: { invoiceNumber: "INV-001", ... },
      confidence: 95,
      confidenceLevel: "high",
      matchFactors: [
        { factor: "exact_amount_match", score: 40 },
        { factor: "exact_customer_name_match", score: 30 },
        { factor: "invoice_reference_match", score: 25 }
      ]
    }
  ]
}
```

### 4. Confirm Matches

```javascript
// Bulk confirm high confidence matches
POST /api/reconciliation/confirm/bulk

{
  matchIds: ["match1", "match2", "match3"],
  notes: "Bulk confirmation of auto-matched payments"
}

// Or confirm individual with partial payment
POST /api/reconciliation/confirm/:matchId

{
  isPartialPayment: true,
  partialAmount: 100.00,
  notes: "Partial payment received"
}
```

### 5. Manual Matching

```javascript
// Search for invoice
GET /api/reconciliation/review/search-invoices/:companyId?query=INV-123&amount=250

// Manually match
POST /api/reconciliation/manual-match/:matchId

{
  invoiceId: "invoice_id",
  notes: "Manual match - customer used different name"
}
```

## Matching Algorithm Details

### Scoring System

**Exact Match (0-100 points)**
- Exact amount match: **40 points**
- Exact customer name: **30 points**
- Invoice ref in description: **30 points**

**Fuzzy Match (0-100 points)**
- Amount within tolerance: **35 points**
- Fuzzy customer name (>80%): **0-30 points** (scaled by similarity)
- Partial invoice ref: **0-30 points** (scaled by match confidence)

**Multi-Invoice Match**
- Sum matches amount: **35 points**
- Invoice ref found: **+15 points**
- Customer match: **0-21 points** (70% weight)

### String Matching

Uses Levenshtein distance for fuzzy matching:
- Normalizes business names (removes Ltd, Inc, etc.)
- Case-insensitive comparison
- Word-level matching bonus
- Configurable threshold (default 80%)

### Invoice Reference Matching

Extracts potential invoice numbers:
- Pattern: `INV-12345`, `INVOICE 12345`
- Standalone numbers (4+ digits)
- Partial matching with confidence scoring

## Integration with Existing Systems

### ✅ Payment Model Integration
- Creates standard `Payment` records
- Links to invoices and cases
- Compatible with existing payment flows

### ✅ Invoice Status Updates
- Updates `status`: unpaid → partially_paid → paid
- Adjusts `outstandingBalance`
- Maintains audit trail

### ✅ GoCardless Exclusion
- Ignores invoices with `gocardless.paymentId`
- Prevents double reconciliation
- Separate payment streams

### ✅ Audit Logging
- Uses existing `logsController`
- Tracks all reconciliation activities
- Searchable and filterable

### ✅ OCR Service Integration
- Reuses existing WhatsApp OCR infrastructure
- PDF parsing with confidence scoring
- No new dependencies

## Error Handling

### Upload Errors
- Invalid file format → Clear error message
- Corrupted CSV → Parse error with line number
- Empty file → Validation error

### Matching Errors
- No invoices found → Returns empty match list
- Database errors → Transaction rollback
- Timeout → Graceful degradation

### Confirmation Errors
- Invoice already reconciled → Rejected
- GoCardless payment exists → Rejected
- Amount exceeds balance → Validation error
- Transaction rollback on failure

## Security Considerations

### ✅ Company Isolation
- All queries filtered by company ID
- Users can only access their company's data

### ✅ File Validation
- MIME type checking
- File size limits (20MB)
- Malicious content scanning (via multer)

### ✅ Transaction Safety
- MongoDB transactions for atomic operations
- Rollback on any failure
- Concurrent operation handling

### ✅ Audit Trail
- All actions logged with user ID
- Timestamp tracking
- Undo capability with full history

## Performance Considerations

### Batch Processing
- Transactions matched in parallel where possible
- Pagination for large result sets
- Efficient database queries with indexes

### Indexes
```javascript
// BankStatement
{ company: 1, uploadedAt: -1 }
{ company: 1, 'statementPeriod.startDate': 1 }
{ 'transactions.reconciliationStatus': 1 }

// ReconciliationMatch
{ company: 1, status: 1 }
{ company: 1, confidenceLevel: 1 }
{ session: 1, status: 1 }
{ suggestedInvoice: 1 }

// ReconciliationSession
{ company: 1, startedAt: -1 }
{ company: 1, status: 1 }
```

### Caching
- Invoice lists cached during matching session
- Reduces database queries
- Configurable cache duration

## Testing

### Unit Tests Needed
- [ ] CSV parser for each bank format
- [ ] PDF parser with sample statements
- [ ] String matching algorithms
- [ ] Confidence scoring calculation
- [ ] Payment creation logic

### Integration Tests Needed
- [ ] End-to-end upload → match → confirm flow
- [ ] Bulk operations
- [ ] Undo functionality
- [ ] Partial payments
- [ ] Multi-invoice matching

### Test Data
Required test files:
- Sample CSV from each bank
- Sample PDF bank statements
- Edge cases (empty files, malformed data)

## Monitoring

### Metrics to Track
- Upload success rate
- Average matching time
- Match confidence distribution
- Auto-match acceptance rate
- Manual intervention rate

### Logs
All operations logged with:
- User ID
- Company ID
- Timestamp
- Action type
- Success/failure status
- Error details

## Future Enhancements

### Potential Features
- [ ] Machine learning for improved matching
- [ ] Automatic rule learning from manual matches
- [ ] Direct bank API integration (Open Banking)
- [ ] Multi-currency support
- [ ] Duplicate transaction detection
- [ ] Scheduled reconciliation reports
- [ ] Email notifications for new matches
- [ ] Export reconciliation reports

## Dependencies

### New Dependencies Required
```json
{
  "csv-parser": "^3.0.0",
  "moment": "^2.29.4",
  "uuid": "^9.0.0"
}
```

### Existing Dependencies Used
- mongoose (database)
- multer (file upload)
- pdf-parse (PDF extraction)
- tesseract.js (OCR)

## Installation

1. Install dependencies:
```bash
cd eqs-platform-be
npm install csv-parser moment uuid
```

2. Import routes in main app:
```javascript
const reconciliationRoutes = require('./src/core-features/reconciliation');
app.use('/api/reconciliation', reconciliationRoutes.reconciliationRoutes);
```

3. Ensure authentication middleware is applied to routes.

## Support

For issues or questions:
- Check logs in MongoDB `logs` collection
- Review audit trail in reconciliation sessions
- Contact development team

---

**Version**: 1.0.0
**Last Updated**: 2025-01-08
**Status**: ✅ Complete - Ready for Testing

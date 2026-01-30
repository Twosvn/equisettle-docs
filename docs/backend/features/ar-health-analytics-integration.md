# AR Health Assessment & Analytics Integration Analysis

## Executive Summary

**Status:** ⚠️ **PARTIALLY INTEGRATED** - Data sources overlap but not fully aligned

The AR Health Assessment and Overall Analytics systems use **different data sources** which can lead to discrepancies:

- **Analytics Dashboard**: Uses `CSVMappings` (legacy cases)
- **AR Health Assessment**: Uses `Invoices` from integrations (QuickBooks, Xero, Zoho, etc.) OR platform invoices

## Data Source Comparison

### Overall Analytics Dashboard

**Primary Data Source:** `CSVMappings`

```javascript
// Location: analytics/controllers/get.controller.js
const mappings = await CSVMappings.find({
  companyAccount: objectId,
  $or: [{ isClosed: false }, { isClosed: { $exists: false } }],
})
.populate("companyAccount")
.populate("invoices");
```

**What it tracks:**
- Cases created from CSV uploads
- Status distribution (Open, In Progress, Closed, etc.)
- Risk categories
- DSO (Days Sales Outstanding)
- Aging buckets
- Collected vs Outstanding amounts
- Dispute rates

**Key Metrics:**
```javascript
{
  totalCases,
  totalAmount,
  statusDistribution,
  highRiskCases,
  dsoDays,
  disputeRate,
  agingBuckets,
  collectedAmount,
  outstandingAmount,
  collectionEffectiveness,
  delinquencyRate
}
```

### AR Health Assessment

**Primary Data Sources:** Integration APIs + EQS Invoice Model

```javascript
// Location: arHealth/services/integrationService.js
switch (integrationType) {
  case "sage":
    rawData = await fetchSageData(companyId);
    break;
  case "quickbooks":
    rawData = await fetchQuickBooksData(companyId);
    break;
  case "zoho":
    rawData = await fetchZohoData(companyId);
    break;
  case "platform": // EQS internal invoices
    rawData = await fetchPlatformData(companyId);
    break;
  case "manual": // User-submitted data
    rawData = company.manualARData;
    break;
}
```

**What it tracks:**
- Invoices from accounting integrations
- Industry benchmarks (Dun & Bradstreet Q1 2025)
- Aging buckets (Current, 1-30, 31-60, 61-90, 90+ days)
- DSO with industry comparison
- Collection opportunities with risk scoring
- Payment patterns
- Trend analysis over time

**Key Metrics:**
```javascript
{
  agingBuckets: {
    current,
    days1_30,
    days31_60,
    days61_90,
    days91_plus
  },
  dso,
  totalAR,
  pastDuePercentage,
  averageDaysPastDue,
  averageDaysToPay,
  collectionEfficiency,
  topOverdueInvoices,
  topLateCustomers
}
```

## The Problem: Data Silos

### Scenario 1: Company Uses CSV Uploads Only
- ✅ **Analytics Dashboard**: Shows complete data
- ❌ **AR Health Assessment**: No data (requires integration or manual entry)

### Scenario 2: Company Uses QuickBooks/Xero Integration
- ❌ **Analytics Dashboard**: Shows only CSV cases (incomplete)
- ✅ **AR Health Assessment**: Shows complete data from integration

### Scenario 3: Company Uses Both CSV + Integration
- ⚠️ **Analytics Dashboard**: Shows CSV cases only
- ⚠️ **AR Health Assessment**: Shows integration invoices only
- **Result:** Split view, metrics don't match

## Where They Align

### 1. Platform Assessment Mode

The AR Health Assessment has a "platform" mode that uses EQS Invoice model:

```javascript
// arHealth/services/integrationService.js
async function fetchPlatformData(companyId) {
  const invoices = await Invoice.find({
    company: companyId,
    $or: [
      { status: 'unpaid' },
      { status: 'partially_paid' },
      { status: 'overdue' }
    ]
  })
  .populate('customerAgreement')
  .populate('payments')
  .lean();

  return invoices;
}
```

**This CAN align with Analytics if:**
- Invoices are created from CSV uploads
- OR Bank reconciliation creates invoices
- OR Manual invoice creation is used

### 2. Shared Metrics Definitions

Both systems calculate similar metrics:

| Metric | Analytics | AR Health | Match? |
|--------|-----------|-----------|--------|
| DSO | ✅ | ✅ | ✅ Same formula |
| Aging Buckets | ✅ | ✅ | ✅ Same buckets |
| Collection Efficiency | ✅ | ✅ | ⚠️ Different calc |
| Past Due % | ✅ | ✅ | ✅ Same formula |

**Collection Efficiency Difference:**

Analytics:
```javascript
const collectionEffectiveness = (paidInvoices / allInvoices.length) * 100;
```

AR Health:
```javascript
const collectionEfficiency = (collectedReceivables / totalBilled) * 100;
```

## Recommendations

### Option 1: Unified Data Source (Recommended)

**Make Analytics use Invoice model:**

```javascript
// analytics/controllers/get.controller.js
async function getGeneralAnalytics(req, res, next) {
  const { id } = req.params;

  // Get invoices from all sources
  const invoices = await Invoice.find({
    company: id,
    $or: [
      { isClosed: false },
      { isClosed: { $exists: false } }
    ]
  })
  .populate('customerAgreement')
  .populate('payments')
  .populate('case'); // Link to CSV case if exists

  // Also get CSV mappings for backwards compatibility
  const csvMappings = await CSVMappings.find({
    companyAccount: id,
    $or: [{ isClosed: false }, { isClosed: { $exists: false } }],
  });

  // Merge data
  const mergedData = mergeInvoicesAndCSV(invoices, csvMappings);

  // Calculate analytics from unified dataset
  const analytics = processGeneralAnalyticsData(mergedData, periodInDays, disputes);

  return sendResponse(res, 200, "Analytics data fetched successfully", analytics);
}
```

**Benefits:**
- Single source of truth
- AR Health and Analytics show same numbers
- Works with integrations, CSV, and bank reconciliation

### Option 2: Make AR Health Use CSVMappings

**Add CSV mode to AR Health:**

```javascript
// arHealth/services/integrationService.js
case "csv":
  rawData = await fetchCSVData(companyId);
  break;

async function fetchCSVData(companyId) {
  const mappings = await CSVMappings.find({
    companyAccount: companyId,
    $or: [{ isClosed: false }, { isClosed: { $exists: false } }],
  })
  .populate('invoices')
  .lean();

  // Convert CSV mappings to invoice format
  return mappings.flatMap(mapping =>
    (mapping.invoices || []).map(invoice => ({
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      paidDate: invoice.paidDate,
      status: invoice.status,
      customer: mapping.clientName
    }))
  );
}
```

**Benefits:**
- AR Health works with existing CSV workflow
- No breaking changes to Analytics
- Minimal code changes

### Option 3: Dual Mode Display (Current State Enhanced)

Keep both systems separate but show clear indicators:

```javascript
// Frontend: AR Health Dashboard
<Alert>
  <InfoIcon />
  AR Health Assessment shows data from: {integrationType}
  <br />
  Analytics Dashboard shows data from: CSV Uploads
  <br />
  Numbers may differ if using different data sources.
</Alert>
```

Add "Sync Status" indicator:
```javascript
const dataSyncStatus = compareDataSources(analyticsData, arHealthData);

{dataSyncStatus.aligned ? (
  <Badge color="green">Data Aligned</Badge>
) : (
  <Badge color="yellow">Multiple Data Sources - {dataSyncStatus.difference}% variance</Badge>
)}
```

## Implementation Roadmap

### Phase 1: Documentation & User Communication (Week 1)
- [x] Document data source differences
- [ ] Add UI warnings when data sources differ
- [ ] Create user guide explaining when to use each system

### Phase 2: Data Layer Unification (Weeks 2-3)
- [ ] Create unified `getARData()` function
- [ ] Support multiple data sources (CSV + Integrations + Reconciliation)
- [ ] Add data source tags to metrics

### Phase 3: Analytics Migration (Weeks 4-5)
- [ ] Migrate Analytics to use Invoice model
- [ ] Keep CSVMappings for backwards compatibility
- [ ] Add migration script for existing CSV data → Invoices

### Phase 4: Testing & Rollout (Week 6)
- [ ] Test with companies using different data sources
- [ ] A/B test unified view
- [ ] Gradual rollout with feature flag

## Current Workarounds

### For Users

**If using CSV uploads:**
- Use Analytics Dashboard for reporting
- Skip AR Health Assessment OR use "manual" mode

**If using QuickBooks/Xero/Zoho:**
- Use AR Health Assessment for reporting
- Analytics Dashboard will show zero/old data

**If using both:**
- Understand that metrics will differ
- Use AR Health for integration data
- Use Analytics for case management data

### For Developers

**When querying financial data:**

```javascript
// Get complete picture
async function getCompleteFinancialData(companyId) {
  // Get all invoice sources
  const [platformInvoices, csvCases, integrationInvoices] = await Promise.all([
    Invoice.find({ company: companyId }),
    CSVMappings.find({ companyAccount: companyId }).populate('invoices'),
    getIntegrationInvoices(companyId) // QuickBooks, Xero, etc.
  ]);

  // Deduplicate (same invoice might exist in multiple sources)
  const uniqueInvoices = deduplicateInvoices([
    ...platformInvoices,
    ...csvCases.flatMap(c => c.invoices),
    ...integrationInvoices
  ]);

  return uniqueInvoices;
}
```

## Testing the Integration

### Test Scenario 1: CSV Only Company

1. Upload CSV with invoices
2. Check Analytics Dashboard → Should show data
3. Run AR Health Assessment (Platform mode) → Should show same invoices
4. Verify DSO matches ±2%

### Test Scenario 2: QuickBooks Company

1. Connect QuickBooks integration
2. Run AR Health Assessment → Should pull QB invoices
3. Check Analytics Dashboard → May show zero (expected)
4. Create invoices in EQS → Should appear in both

### Test Scenario 3: Mixed Data Company

1. Upload CSV
2. Connect QuickBooks
3. Use Bank Reconciliation
4. Check all three data sources:
   - CSVMappings: CSV cases
   - Invoices: Reconciliation + manual
   - QB Integration: QuickBooks invoices
5. Run comparison query to see overlaps

## Metrics Alignment Check

Run this query to verify alignment:

```javascript
// Check if AR Health and Analytics show similar numbers
async function verifyMetricsAlignment(companyId) {
  // Get Analytics data
  const analyticsData = await getGeneralAnalytics(companyId);

  // Get AR Health data
  const arHealthData = await runAssessment(companyId, 'platform');

  // Compare key metrics
  const comparison = {
    dso: {
      analytics: analyticsData.dsoDays,
      arHealth: arHealthData.results.metrics.dso,
      variance: Math.abs(analyticsData.dsoDays - arHealthData.results.metrics.dso)
    },
    totalAR: {
      analytics: analyticsData.totalAmount,
      arHealth: arHealthData.results.metrics.totalAR,
      variance: Math.abs(analyticsData.totalAmount - arHealthData.results.metrics.totalAR)
    },
    pastDue: {
      analytics: analyticsData.delinquencyRate,
      arHealth: arHealthData.results.metrics.pastDuePercentage,
      variance: Math.abs(analyticsData.delinquencyRate - arHealthData.results.metrics.pastDuePercentage)
    }
  };

  // Flag if variance > 10%
  const misaligned = Object.entries(comparison).filter(([metric, data]) => {
    const percentVariance = (data.variance / data.analytics) * 100;
    return percentVariance > 10;
  });

  return {
    aligned: misaligned.length === 0,
    comparison,
    misaligned
  };
}
```

## Conclusion

**Current State:**
- AR Health and Analytics are **NOT fully integrated**
- They use different primary data sources
- Metrics can differ significantly depending on company setup

**Ideal State:**
- Single unified data layer
- All financial data flows through Invoice model
- CSVMappings link to Invoices (not duplicate)
- AR Health and Analytics show identical numbers

**Next Steps:**
1. Review this analysis with team
2. Decide on Option 1, 2, or 3
3. Create implementation plan
4. Update user documentation
5. Communicate changes to users

## Related Documentation

- [Bank Reconciliation](./bank-reconciliation.md)
- [Invoice Management](./invoice-management.md)
- [CSV Mapping System](./csv-mapping.md)
- [Analytics Dashboard](../analytics/overview.md)
- [AR Health Assessment](./ar-health-assessment.md)

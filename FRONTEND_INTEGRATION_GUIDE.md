# Frontend Integration Guide
## AR Assessment Trends & Benchmarks

This guide explains how to integrate the new AR assessment enhancements into your frontend.

---

## New Components Created

### 1. **ARTrendsAndBenchmarks.jsx**
Location: `/eqs-platform-fe/src/components/companySettings/ARTrendsAndBenchmarks.jsx`

Displays:
- Industry benchmark comparisons (DSO, Past Due %, Collection Efficiency)
- Historical trend analysis with arrows and percentages
- Trend insights and warnings
- Industry-specific red flags
- Performance badges

### 2. **IndustrySelector.jsx**
Location: `/eqs-platform-fe/src/components/companySettings/IndustrySelector.jsx`

Features:
- Radio button list of all industries
- Save industry selection via API
- Success/error handling
- Visual feedback

---

## Integration Steps

### Step 1: Update companyAssessment.jsx to Include Trends

Open: `/eqs-platform-fe/src/components/companySettings/companyAssessment.jsx`

**Add import at top:**
```javascript
import ARTrendsAndBenchmarks from './ARTrendsAndBenchmarks';
```

**Find the section after "Key Performance Metrics" (around line 260-300) and add:**
```jsx
{/* NEW: Trends and Benchmarks Section */}
<div className="px-6 pb-6">
  <ARTrendsAndBenchmarks results={results} />
</div>
```

**Suggested placement:**
Insert after the "Key Performance Metrics" section but before the "Strategic Recommendations" section.

**Full example:**
```jsx
{/* Key Performance Metrics */}
<div className="px-6 py-6 border-b border-gray-200">
  {/* ... existing metrics code ... */}
</div>

{/* NEW: Trends and Benchmarks */}
<div className="px-6 py-6 border-b border-gray-200">
  <ARTrendsAndBenchmarks results={results} />
</div>

{/* Strategic Recommendations */}
<div className="px-6 py-6 border-b border-gray-200">
  {/* ... existing recommendations code ... */}
</div>
```

---

### Step 2: Add Industry Selector to Company Settings

You have two options:

#### Option A: Add to ArQuestionare.jsx (Manual Assessment Form)

Open: `/eqs-platform-fe/src/core-features/global-components/ArQuestionare.jsx`

**Add import:**
```javascript
import IndustrySelector from '../../components/companySettings/IndustrySelector';
```

**Add before or after the form:**
```jsx
{/* Industry Selector - Add at top of component */}
<div className="mb-6">
  <IndustrySelector
    currentIndustry={company?.industry}
    companyId={companyId}
    onIndustryChange={(newIndustry) => {
      // Optionally refresh data or show message
      console.log('Industry changed to:', newIndustry);
    }}
  />
</div>

{/* Rest of the form */}
<form onSubmit={handleSubmit}>
  {/* ... existing form fields ... */}
</form>
```

#### Option B: Create a Dedicated Settings Page

Create: `/eqs-platform-fe/src/components/companySettings/ARSettings.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IndustrySelector from './IndustrySelector';
import { endPoints } from '../../core-features/store/store';

const ARSettings = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('authToken');
      const companyId = user?.companyAccountId;

      const response = await axios.get(
        `${endPoints}/api/v1/companies/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCompany(response.data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        AR Assessment Settings
      </h1>

      <IndustrySelector
        currentIndustry={company?.industry}
        companyId={company?._id}
        onIndustryChange={() => fetchCompanyData()}
      />

      {/* Add more settings sections as needed */}
    </div>
  );
};

export default ARSettings;
```

---

### Step 3: Update AR Analytics Page

Open: `/eqs-platform-fe/src/core-features/companyonlydashboard/components/dashboard/ArMetricsDashboard.jsx`

**Add import:**
```javascript
import ARTrendsAndBenchmarks from '../../../../components/companySettings/ARTrendsAndBenchmarks';
```

**Add trends section for each assessment:**
```jsx
{/* Existing assessment display */}
<CompanyAssessment
  isLoadingAssessment={false}
  onClose={() => {}}
  results={assessment.results}
  isModal={false}
/>

{/* NEW: Add trends below each assessment */}
<div className="mt-6">
  <ARTrendsAndBenchmarks results={assessment.results} />
</div>
```

---

## API Endpoints Available

### 1. Get Industry Benchmarks
```javascript
// Get all industries
GET /api/v1/ar-health/benchmarks

// Get specific industry benchmarks
GET /api/v1/ar-health/benchmarks?industry=technology_software

// Response:
{
  success: true,
  industry: "technology_software",
  benchmarks: {
    displayName: "Technology & Software",
    targetDSO: 32,
    agingBenchmarks: {...},
    // ... full benchmark data
  }
}
```

### 2. Update Company Industry
```javascript
PUT /api/v1/ar-health/company-industry
Body: {
  companyId: "123...",
  industry: "technology_software"
}

// Response:
{
  success: true,
  message: "Industry updated successfully",
  company: {
    _id: "123...",
    name: "Acme Corp",
    industry: "technology_software"
  }
}
```

### 3. Get Assessment History
```javascript
GET /api/v1/ar-health/history?companyId=123&integrationType=sage

// Response:
{
  success: true,
  integrationType: "sage",
  historicalSnapshots: [...],
  currentMetrics: {...},
  lastRunAt: "2025-01-06T..."
}
```

---

## Updating Enhanced Recommendations Display

The recommendations now include `cashImpact` field. Update your recommendations rendering:

**In companyAssessment.jsx, find the recommendations section and enhance it:**

```jsx
{hasRecommendations && (
  <div className="px-6 py-6 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Strategic Recommendations
    </h3>
    <div className="space-y-4">
      {recommendations.map((rec, idx) => (
        <div
          key={idx}
          className={`border-l-4 rounded-r-lg p-4 ${getImpactColor(rec.impact)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  rec.impact === 'high' ? 'bg-red-600 text-white' :
                  rec.impact === 'medium' ? 'bg-yellow-600 text-white' :
                  rec.impact === 'positive' ? 'bg-green-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {rec.impact?.toUpperCase()}
                </span>
                {/* NEW: Display cash impact if available */}
                {rec.cashImpact && (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                    {rec.cashImpact}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                {rec.description}
              </p>
              {rec.suggestedActions && rec.suggestedActions.length > 0 && (
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  {rec.suggestedActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

---

## Migration Script Usage

### Run Migration

```bash
# Navigate to backend directory
cd eqs-platform-be

# Auto-detect industries from company names
node scripts/migrations/addIndustryToCompanies.js --auto

# Interactive mode (prompts for each company)
node scripts/migrations/addIndustryToCompanies.js --interactive

# Load from CSV file
node scripts/migrations/addIndustryToCompanies.js --csv=./industry_mapping.csv

# Dry run (see what would change)
node scripts/migrations/addIndustryToCompanies.js --auto --dry-run

# Generate CSV template
node scripts/migrations/addIndustryToCompanies.js --template
```

### CSV Format

Create a CSV file with this format:
```csv
companyId,industry
507f1f77bcf86cd799439011,technology_software
507f1f77bcf86cd799439012,professional_services
507f1f77bcf86cd799439013,legal_services
```

---

## Testing Checklist

### Backend Testing

1. **Run migration script**
   ```bash
   node scripts/migrations/addIndustryToCompanies.js --auto --dry-run
   ```

2. **Test API endpoints**
   ```bash
   # Get all industries
   curl http://localhost:5000/api/v1/ar-health/benchmarks

   # Update company industry
   curl -X PUT http://localhost:5000/api/v1/ar-health/company-industry \
     -H "Content-Type: application/json" \
     -d '{"companyId":"123","industry":"technology_software"}'
   ```

3. **Run assessment with industry**
   - Set a company's industry
   - Run AR assessment
   - Verify benchmarkComparisons includes industry-specific data
   - Verify trendAnalysis appears on second assessment

### Frontend Testing

1. **Test IndustrySelector**
   - [ ] Loads current industry correctly
   - [ ] Saves new industry selection
   - [ ] Shows success message
   - [ ] Handles errors gracefully

2. **Test ARTrendsAndBenchmarks**
   - [ ] Shows industry benchmarks correctly
   - [ ] Displays performance badges
   - [ ] Shows "no trend data" message on first assessment
   - [ ] Shows trends on subsequent assessments
   - [ ] Trend arrows point correct direction
   - [ ] Red flags display when present

3. **Test Assessment Flow**
   - [ ] Run first assessment → no trends shown
   - [ ] Wait 1 minute, run second assessment → trends appear
   - [ ] Verify metrics have trend arrows
   - [ ] Cash impact displays in recommendations

---

## Customization Options

### Change Industry List

Edit: `/eqs-platform-fe/src/components/companySettings/IndustrySelector.jsx`

Add/remove from `INDUSTRY_OPTIONS` array.

### Customize Benchmark Display

Edit: `/eqs-platform-fe/src/components/companySettings/ARTrendsAndBenchmarks.jsx`

- Change colors in `PerformanceBadge`
- Modify grid layout (currently 2 columns on md+)
- Add/remove metric cards

### Add More Benchmarks

Edit: `/eqs-platform-be/src/core-features/arHealth/services/industryBenchmarks.js`

Add new industries to `INDUSTRY_BENCHMARKS` object.

---

## Troubleshooting

### Trends Not Showing

**Issue:** ARTrendsAndBenchmarks shows "No trend data available"

**Solution:**
- Check if `historicalSnapshots` array has data
- Run assessment twice (with a time gap)
- Verify assessment is completing successfully

### Industry Not Saving

**Issue:** IndustrySelector shows error when saving

**Solution:**
- Check API endpoint is accessible
- Verify auth token is valid
- Check console for error messages
- Ensure industry code is valid

### Benchmarks Show "Other" Industry

**Issue:** Company shows "Other" benchmarks instead of specific industry

**Solution:**
- Verify company.industry field is set correctly
- Check migration script ran successfully
- Update company industry via API or IndustrySelector

---

## Next Steps

1. **Run migration script** to set industries for existing companies
2. **Integrate ARTrendsAndBenchmarks** into companyAssessment.jsx
3. **Add IndustrySelector** to settings page
4. **Test complete flow** with a test company
5. **Train users** on new features
6. **Monitor feedback** for improvements

---

## Support

For issues or questions:
1. Check `AR_ASSESSMENT_ENHANCEMENTS.md` for technical details
2. Review API controller code in `eqs-platform-be/src/core-features/arHealth/controller.js`
3. Check component props and data structure
4. Test with browser dev tools console for errors

---

**Implementation Date:** January 6, 2025
**Version:** 1.0.0
**Status:** ✅ Ready for Integration

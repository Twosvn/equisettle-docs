# Frontend Integration Guide

## Where to Show AI Recommendations

### Option 1: Invoice Creation Form (Recommended)

**When:** User is creating a new invoice  
**Where:** Payment terms dropdown

```jsx
// InvoiceForm.jsx
import { useState, useEffect } from 'react';

function InvoiceForm({ customerId }) {
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get AI recommendation when customer is selected
  useEffect(() => {
    if (customerId) {
      fetchAIRecommendation();
    }
  }, [customerId]);

  async function fetchAIRecommendation() {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/agentic/recommend-terms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerId })
      });
      
      const data = await response.json();
      setAiRecommendation(data.data);
    } catch (error) {
      console.error('AI recommendation failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="invoice-form">
      {/* Customer selection */}
      <CustomerSelect onChange={setCustomerId} />
      
      {/* Payment Terms with AI Suggestion */}
      <div className="payment-terms-section">
        <label>Payment Terms</label>
        
        {loading && (
          <div className="ai-loading">
            🤖 AI is analyzing customer...
          </div>
        )}
        
        {aiRecommendation && (
          <div className="ai-recommendation">
            <div className="ai-badge">
              ✨ AI Recommended
            </div>
            <button 
              className="recommended-term"
              onClick={() => selectTerm(aiRecommendation.recommendation)}
            >
              {aiRecommendation.recommendation}
              <span className="confidence">
                {aiRecommendation.confidence} confidence
              </span>
            </button>
            
            {/* Show reasoning on hover/click */}
            <details className="ai-reasoning">
              <summary>Why this recommendation?</summary>
              <ul>
                {aiRecommendation.reasoning.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </details>
            
            {/* Alternative options */}
            <div className="alternatives">
              <small>Alternatives:</small>
              {aiRecommendation.alternatives.map((alt, i) => (
                <button 
                  key={i}
                  className="alt-option"
                  onClick={() => selectTerm(alt)}
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Manual selection dropdown */}
        <select name="paymentTerms">
          <option>Net 15</option>
          <option>Net 30</option>
          <option>Net 45</option>
          <option>Net 60</option>
          <option>Due on Receipt</option>
        </select>
      </div>
    </div>
  );
}
```

### Option 2: Customer Profile Page

**When:** Viewing customer details  
**Where:** Risk assessment section

```jsx
// CustomerProfile.jsx
function CustomerProfile({ customerId }) {
  const [riskAnalysis, setRiskAnalysis] = useState(null);

  async function analyzeCustomer() {
    const response = await fetch('/api/v1/agentic/analyze-customer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customerId })
    });
    
    const data = await response.json();
    setRiskAnalysis(data.data);
  }

  return (
    <div className="customer-profile">
      <h2>Customer Risk Assessment</h2>
      
      <button onClick={analyzeCustomer}>
        🤖 Get AI Risk Analysis
      </button>
      
      {riskAnalysis && (
        <div className="risk-card">
          <div className="risk-score">
            Risk Level: {riskAnalysis.riskLevel}
          </div>
          <div className="recommended-terms">
            Recommended Terms: {riskAnalysis.recommendation}
          </div>
          <div className="risk-factors">
            <h4>Risk Factors:</h4>
            <ul>
              {riskAnalysis.riskFactors.map((factor, i) => (
                <li key={i}>{factor}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Option 3: Backend Auto-Fill (No Frontend Changes)

**When:** Invoice is created via API  
**Where:** Backend automatically sets terms

```javascript
// In your existing invoice creation endpoint
// src/controllers/invoice-controller.js

async function createInvoice(req, res) {
  const { customerId, amount, ...invoiceData } = req.body;
  
  // Get AI recommendation if no terms specified
  if (!invoiceData.paymentTerms && amount > 5000) {
    try {
      const agenticEngine = getAgenticEngine();
      const recommendation = await agenticEngine.execute(
        'payment-terms-recommendation',
        { customerId },
        { userId: req.user.id }
      );
      
      // Auto-fill with AI recommendation
      invoiceData.paymentTerms = recommendation.recommendation;
      invoiceData.aiRecommended = true;
      invoiceData.aiReasoning = recommendation.reasoning;
      
    } catch (error) {
      // Fallback to default if AI fails
      invoiceData.paymentTerms = 'Net 30';
    }
  }
  
  // Create invoice as normal
  const invoice = await Invoice.create({
    customerId,
    amount,
    ...invoiceData
  });
  
  res.json({ success: true, data: invoice });
}
```

## UI/UX Recommendations

### Design Pattern 1: Inline Suggestion
```
┌─────────────────────────────────────┐
│ Payment Terms                       │
│ ┌─────────────────────────────────┐ │
│ │ ✨ AI Recommends: Net 15        │ │
│ │ High risk customer (75/100)     │ │
│ │ [Use This] [See Why]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Or choose manually:                 │
│ [ Net 15 ▼ ]                        │
└─────────────────────────────────────┘
```

### Design Pattern 2: Side Panel
```
┌──────────────┬──────────────────────┐
│ Invoice Form │ 🤖 AI Assistant      │
│              │                      │
│ Customer: X  │ Analyzing customer...│
│ Amount: $50k │                      │
│              │ ✓ Risk Score: 75     │
│ Terms: [?]   │ ✓ Payment History    │
│              │                      │
│              │ Recommendation:      │
│              │ Net 15 + prepayment  │
│              │                      │
│              │ [Apply]              │
└──────────────┴──────────────────────┘
```

### Design Pattern 3: Modal Dialog
```
User clicks "Get AI Recommendation"
         ↓
┌─────────────────────────────────────┐
│ 🤖 AI Payment Terms Analysis        │
├─────────────────────────────────────┤
│ Customer: ABC Corp                  │
│ Risk Score: 75 (High)               │
│                                     │
│ Recommendation:                     │
│ ┌─────────────────────────────────┐ │
│ │ Net 15 with 50% prepayment      │ │
│ │ Confidence: High                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Why?                                │
│ • High default risk (75/100)        │
│ • Only 45% on-time payment rate     │
│ • $50k invoice requires protection  │
│                                     │
│ Alternatives:                       │
│ • Cash on Delivery                  │
│ • Letter of Credit                  │
│                                     │
│ [Apply Recommendation] [Cancel]     │
└─────────────────────────────────────┘
```

## Backend Integration Points

### 1. Invoice Creation
```javascript
POST /api/v1/invoices
{
  "customerId": "123",
  "amount": 50000,
  "useAITerms": true  // ← Flag to use AI
}

Response:
{
  "invoice": {...},
  "aiRecommendation": {
    "terms": "Net 15",
    "reasoning": [...],
    "confidence": "high"
  }
}
```

### 2. Bulk Invoice Creation
```javascript
POST /api/v1/invoices/bulk
{
  "invoices": [
    { "customerId": "123", "amount": 50000 },
    { "customerId": "456", "amount": 25000 }
  ],
  "useAI": true
}

// Backend batches AI calls for efficiency
```

### 3. Webhook Integration
```javascript
// When invoice is created via integration (Xero, QuickBooks)
// Backend automatically gets AI recommendation

webhookHandler.on('invoice.created', async (invoice) => {
  const recommendation = await getAIRecommendation(invoice.customerId);
  
  // Update invoice with AI terms
  await updateInvoice(invoice.id, {
    paymentTerms: recommendation.recommendation,
    aiSuggested: true
  });
  
  // Notify user
  await notifyUser({
    message: `AI recommended ${recommendation.recommendation} for ${invoice.customer}`
  });
});
```

## Recommended Implementation Order

1. **Week 1:** Backend auto-fill (easiest, no frontend changes)
2. **Week 2:** Add to invoice creation form (best UX)
3. **Week 3:** Add to customer profile page (nice to have)
4. **Week 4:** Add bulk processing for existing customers

## Sample API Response

```json
{
  "success": true,
  "data": {
    "conversationId": "agentic_123",
    "recommendation": "Net 15 with 50% prepayment required",
    "confidence": "high",
    "reasoning": [
      "Customer risk score of 75 indicates high default risk",
      "Historical payment rate of 45% shows poor payment behavior",
      "Invoice amount of $50,000 requires additional protection",
      "Prepayment reduces maximum exposure to $25,000"
    ],
    "alternatives": [
      "Cash on Delivery (COD) for maximum protection",
      "Letter of Credit if customer can provide",
      "Progress billing tied to project milestones"
    ],
    "riskFactors": [
      "High default probability based on risk model",
      "Seasonal business with inconsistent cash flow",
      "Average 18-day payment delay on past invoices"
    ],
    "metadata": {
      "duration": 2500,
      "model": "claude-3-5-sonnet",
      "toolsCalled": 3
    }
  }
}
```

Want me to implement any of these integration patterns?

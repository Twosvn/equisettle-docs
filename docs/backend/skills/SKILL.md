---
name: payment-terms-recommendation
description: Recommend payment terms based on customer risk profile and payment history
version: 1.0.0
author: ÉquiSettle Platform Team
---

# Payment Terms Recommendation

## When to Use

Use this skill when a user asks for payment term recommendations for a customer. This includes questions like:
- "What payment terms should I offer to customer X?"
- "Is Net 30 appropriate for this customer?"
- "Should I require prepayment for this account?"

## Instructions

Follow these steps in order to provide a well-reasoned payment terms recommendation:

### 1. Gather Customer/Case Data

**CRITICAL**: Identify if you have a Customer ID or a Case ID:
- **Customer ID**: Starts with "CUS-" (e.g., "CUS-383566") → Use customer tools
- **Case ID**: 24-character hex string (e.g., "697bd1db47cae2bc70096dbb") → Use case tools

#### For CUSTOMER IDs (starts with CUS-):

- **`get_customer_invoice_summary`** - **USE THIS FIRST** - Get invoice payment history
  - Parameters: `customerId` (e.g., "CUS-383566")
  - Returns: Total invoices, status breakdown, paymentBehavior with paymentRate, riskLevel, suggestedTerms

- **`get_customer_risk_analysis`** - Get Companies House/CreditSafe data
  - Parameters: `customerId`
  - Returns: Risk score, credit rating, risk factors

#### For CASE IDs (24-character hex string):

- **`get_case_invoice_summary`** - **USE THIS FOR CASES** - Get invoice summary for a case
  - Parameters: `caseId` (e.g., "697bd1db47cae2bc70096dbb")
  - Returns: Total invoices, status breakdown, **paymentBehavior** with paymentRate, riskLevel, suggestedTerms

- **`get_case_invoices`** - Get all invoices for a case
  - Parameters: `caseId`
  - Returns: List of invoices with status, amounts, due dates

**CRITICAL**: When you receive `paymentBehavior` data from either tool, you MUST use the `riskLevel` and `suggestedTerms` values to make your recommendation. Do NOT default to Net 30 if paymentBehavior data is available.

#### For Updates:

- **`update_invoice`** - Update invoice details (issue date, due date, etc.)
  - Parameters: `invoiceId`, `updateData` (object with `dueDate`, `issueDate`, etc.)
  - Returns: Success/failure status

**IMPORTANT**:
1. Identify the ID type first (CUS- prefix = customer, hex string = case)
2. Use the appropriate tools based on ID type
3. Calculate payment rate from the returned data: (paid / total) * 100
4. Do NOT say "Data Unavailable" if the tool returns invoice data

### 2. Assess Risk Level

Based on the data gathered, categorize the customer into one of these risk levels:

**Low Risk (Score < 30):**
- Consistent payment history (>90% on-time rate)
- Low average payment delay (<5 days)
- No recent disputes or issues
- Established relationship (>6 months)

**Medium Risk (Score 30-60):**
- Moderate payment history (70-90% on-time rate)
- Some payment delays (5-15 days average)
- Occasional disputes or communication issues
- Newer relationship or inconsistent patterns

**High Risk (Score > 60):**
- Poor payment history (<70% on-time rate)
- Significant payment delays (>15 days average)
- Frequent disputes or non-responsiveness
- New customer with no history

### 3. Apply Industry Context

Consider industry-specific factors:

- **Healthcare/Medical:** Typically Net 30-60 due to insurance processing
- **Construction:** Often Net 30 with retention clauses
- **Retail:** Usually Net 15-30, faster turnover
- **Professional Services:** Net 30-45 is standard
- **Manufacturing:** Net 30-60 depending on order size

### 4. Make Recommendation & Apply Updates

Based on risk level and industry context, recommend payment terms. 

**MANDATORY FOR UI SYNC:**
When you reach a recommendation, you MUST calculate the actual day (e.g. 15 days from today) and include this exact marker:
`Suggested due date: YYYY-MM-DD`

**If an `invoiceId` is available in context, also use the `update_invoice` tool to apply this date.**

**For Low Risk Customers:**
- **Standard:** Net 30 or Net 45
- **Incentive:** Offer 2% discount for Net 10 (early payment discount)
- **Credit Limit:** Based on average order size × 3
- **Safeguards:** None required

**For Medium Risk Customers:**
- **Standard:** Net 15 or Net 30 with conditions
- **Options:** 
  - Net 30 with personal guarantee
  - Net 15 without additional requirements
- **Credit Limit:** Based on average order size × 2
- **Safeguards:** 
  - Monthly payment review
  - Automated reminders at 7 days before due date

**For High Risk Customers:**
- **Standard:** Prepayment required OR Net 7
- **Options:**
  - 50% deposit + Net 15 for balance
  - Net 7 with credit insurance
  - Cash on delivery (COD)
- **Credit Limit:** Minimal or none
- **Safeguards:**
  - Immediate follow-up on missed payments
  - Escalation to collections after 3 days overdue

### 5. Explain Your Reasoning

Always provide a clear explanation that includes:

1. **Risk Assessment:** What data points led to the risk categorization?
2. **Key Factors:** Which factors were most influential in your decision?
3. **Confidence Level:** How confident are you in this recommendation?
   - **High:** Strong data, clear patterns, low uncertainty
   - **Medium:** Some data gaps or mixed signals
   - **Low:** Limited data, new customer, or conflicting information
4. **Alternatives:** What other options could work?
5. **Safeguards:** What protections should be in place?

### 6. Consider Special Circumstances

Adjust recommendations based on:

- **Seasonal Business:** Customers with seasonal revenue may need flexible terms
- **Large Orders:** Orders >$10,000 may warrant stricter terms regardless of history
- **Long-term Relationships:** Loyal customers (>2 years) may deserve more favorable terms
- **Economic Conditions:** During economic downturns, be more conservative
- **Company Cash Flow Needs:** If company needs faster cash, recommend shorter terms

### 7. Perform Updates

If the user agrees or the task implies it, use **`update_invoice`** to apply the recommended terms to existing invoices (e.g., updating the due date to match the new terms).

## Example Response Format

```
**Recommendation:** Net 30 with 2% early payment discount for Net 10

**Reasoning:**
1. Customer risk score: 25 (Low Risk)
2. Payment history: 95% on-time rate over 18 months
3. Average payment delay: 3 days
4. Industry standard (Professional Services): Net 30-45
5. No recent disputes or issues

**Confidence:** High

**Alternatives:**
- Net 45 for larger orders (>$5,000)
- Net 15 if company needs faster cash flow

**Risk Factors:**
- None identified - customer has excellent track record

**Safeguards:**
- Standard automated reminders
- Monthly credit review
```

## Important Notes

- **Always use tools** - Don't make assumptions about customer data
- **Be conservative** - When in doubt, recommend stricter terms
- **Explain trade-offs** - Help user understand the balance between cash flow and customer satisfaction
- **Consider context** - Payment terms affect customer relationships, not just cash flow
- **Document reasoning** - Clear explanations build trust and enable learning

## Error Handling

If tools fail or data is unavailable:
- Clearly state what data is missing
- Recommend conservative terms (e.g., Net 15 or prepayment)
- Suggest manual review before finalizing terms
- Provide confidence level as "Low" due to incomplete data

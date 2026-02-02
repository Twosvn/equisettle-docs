---
sidebar_position: 3
title: Agentic Platform Architecture
description: Comprehensive documentation of the EQS agentic platform with MCP tools, architecture diagrams, and roadmap
---

# EQS Agentic Platform - Current State & Strategic Roadmap

## Executive Summary

**Key Finding**: The EQS-115 tools are **already fully implemented**. Your platform has 47 MCP tools including all 6 action-oriented workflow tools. This document provides the current state analysis, architecture diagrams, and a roadmap for next-level agentic capabilities.

---

## 1. Current State Analysis (EQS-114 + EQS-115 Complete)

### Tool Inventory - 47 Total MCP Tools

| Category | Tool Count | Type | Status |
|----------|------------|------|--------|
| Invoice Tools | 11 | READ + WRITE | ✅ Complete |
| Customer Tools | 5 | READ | ✅ Complete |
| Case Tools | 6 | READ | ✅ Complete |
| Payment Arrangement | 4 | READ | ✅ Complete |
| Remittance Tools | 4 | READ | ✅ Complete |
| Workflow Tools | 12 | READ + ACTION | ✅ **Complete (EQS-115)** |
| Dispute Tools | 3 | READ | ✅ Complete |
| Followup Tools | 3 | READ | ✅ Complete |

### EQS-115 Tools - Already Implemented

| Tool | File Location | Status |
|------|---------------|--------|
| `get_document_types` | `eqs-mcp-server/src/tools/workflow-tools.ts:154` | ✅ Implemented |
| `get_document_templates` | `eqs-mcp-server/src/tools/workflow-tools.ts:187` | ✅ Implemented |
| `request_documents` | `eqs-mcp-server/src/tools/workflow-tools.ts:257` | ✅ Implemented |
| `switch_case_workflow` | `eqs-mcp-server/src/tools/workflow-tools.ts:297` | ✅ Implemented |
| `close_case_workflow` | `eqs-mcp-server/src/tools/workflow-tools.ts:335` | ✅ Implemented |
| `fill_document_template` | `eqs-mcp-server/src/tools/workflow-tools.ts:413` | ✅ Implemented |
| `progress_case_workflow` | `eqs-mcp-server/src/tools/workflow-tools.ts:372` | ✅ Bonus tool |
| `add_workflow_note` | `eqs-mcp-server/src/tools/workflow-tools.ts:452` | ✅ Bonus tool |

---

## 2. Architecture Diagrams

### 2.1 Current System Architecture

```mermaid
flowchart TB
    subgraph "Client Layer"
        UI[Web UI]
        API[API Consumers]
        CHAT[Chatbot Interface]
    end

    subgraph "Agentic Engine"
        AE[AgenticEngine<br/>src/services/agentic/agentic-engine.js]
        LLM[LLMProvider<br/>Claude/GPT-4]
        SM[SkillsManager<br/>Markdown Skills]
        BQ[BullMQ Worker<br/>eqs-agentic-queue]
    end

    subgraph "MCP Server Layer"
        MCP_CLIENT[MCPClient<br/>src/services/agentic/mcp-client.js]
        MCP_TS[TypeScript MCP Server<br/>eqs-mcp-server - Port 3002]
        MCP_PY[Python MCP Server<br/>Port 8001 - TensorFlow]
    end

    subgraph "47 MCP Tools"
        direction LR
        subgraph "READ Tools 35"
            INV_R[Invoice: 9 read tools]
            CUST_R[Customer: 5 tools]
            CASE_R[Case: 6 tools]
            PAY_R[Payment: 4 tools]
            REM_R[Remittance: 4 tools]
            DISP_R[Dispute: 3 tools]
            FOLLOW_R[Followup: 3 tools]
            WF_R[Workflow Read: 3 tools]
        end
        subgraph "ACTION Tools 12"
            INV_W[Invoice: create, update]
            WF_W[Workflow Actions: 8 tools]
        end
    end

    subgraph "Backend Services"
        WFS[WorkflowService<br/>activateOrSwitchWorkflow<br/>closeWorkflowService]
        DS[DocumentService<br/>handleDocumentRequest]
        PDF[PDFGenerator<br/>generateAndUploadDoc]
        EMAIL[EmailService<br/>Resend Integration]
    end

    subgraph "Data Layer"
        MONGO[(MongoDB)]
        S3[(AWS S3<br/>Documents/PDFs)]
        REDIS[(Redis<br/>Job Queue)]
    end

    UI & API & CHAT --> AE
    AE <--> LLM
    AE --> SM
    AE <--> BQ
    AE <--> MCP_CLIENT

    MCP_CLIENT <--> MCP_TS
    MCP_CLIENT <--> MCP_PY

    MCP_TS --> INV_R & CUST_R & CASE_R & PAY_R & REM_R & DISP_R & FOLLOW_R & WF_R
    MCP_TS --> INV_W & WF_W

    WF_W --> WFS & DS & PDF
    DS --> EMAIL

    WFS --> MONGO
    PDF --> S3
    BQ --> REDIS
```

### 2.2 Agentic Tool Flow

```mermaid
sequenceDiagram
    participant User
    participant AE as Agentic Engine
    participant LLM as Claude/GPT-4
    participant MCP as MCP Server
    participant SVC as Backend Services
    participant DB as MongoDB/S3

    User->>AE: Task: "Case ABC needs escalation workflow"
    AE->>MCP: discoverTools()
    MCP-->>AE: 47 tool definitions

    AE->>LLM: System prompt + Task + Tools

    loop Reasoning Loop (max 10 iterations)
        LLM->>AE: Tool call: get_case_profile(caseId)
        AE->>MCP: callTool("get_case_profile", {caseId})
        MCP->>SVC: GET /mcp/cases/:caseId
        SVC->>DB: Query case data
        DB-->>SVC: Case data
        SVC-->>MCP: Case profile
        MCP-->>AE: Tool result
        AE->>LLM: Result + Continue

        LLM->>AE: Tool call: get_company_workflows()
        AE->>MCP: callTool("get_company_workflows", {})
        MCP-->>AE: Available workflows

        LLM->>AE: Tool call: switch_case_workflow(caseId, escalationId)
        AE->>MCP: callTool("switch_case_workflow", params)
        MCP->>SVC: POST /mcp/workflows/case/:id/switch
        SVC->>DB: Activate workflow
        DB-->>SVC: Success
        SVC-->>MCP: Workflow switched
        MCP-->>AE: Success result
    end

    AE-->>User: "Case switched to Escalation workflow"
```

### 2.3 Tool Category Mind Map

```mermaid
mindmap
  root((EQS Agent<br/>47 Tools))
    Invoice Management
      search_invoices
      quick_search_invoices
      get_customer_invoices
      get_customer_overdue_invoices
      get_customer_invoice_summary
      get_case_invoices
      get_case_invoice_summary
      get_invoice_status_summary
      get_overdue_trends
      create_invoices
      update_invoice
    Customer Intelligence
      search_customers
      quick_search_customers
      get_customer_profile
      get_customer_risk_analysis
      get_customer_portfolio_summary
    Case Management
      search_cases
      quick_search_cases
      get_case_profile
      get_case_summary
      get_case_status_summary
      get_customer_cases
    Workflow Control
      Read
        get_case_workflow
        get_workflow
        get_company_workflows
      Document Discovery
        get_document_types
        get_document_templates
        get_case_documents
      Actions
        request_documents
        switch_case_workflow
        close_case_workflow
        progress_case_workflow
        fill_document_template
        add_workflow_note
    Payment Tracking
      get_payment_plan
      get_case_payment_plan
      get_payment_plan_summary
      get_customer_payment_plans
    Remittances
      get_remittance
      get_case_remittances
      get_customer_remittances
      get_remittance_summary
    Disputes
      get_dispute
      get_case_disputes
      get_dispute_summary
    Followups
      get_followup
      get_source_followups
      get_followup_summary
```

### 2.4 Autonomous Workflow Execution

```mermaid
stateDiagram-v2
    [*] --> CaseAssessment: Agent receives task

    state CaseAssessment {
        [*] --> GetCaseProfile
        GetCaseProfile --> AnalyzeInvoices: get_case_profile
        AnalyzeInvoices --> CheckWorkflow: get_case_invoices
        CheckWorkflow --> [*]: get_case_workflow
    }

    CaseAssessment --> Decision: Analysis complete

    state Decision {
        [*] --> EvaluateRisk
        EvaluateRisk --> DetermineAction: Risk score + overdue amount
        DetermineAction --> [*]
    }

    Decision --> WorkflowAction: Action determined

    state WorkflowAction {
        [*] --> NeedsEscalation
        NeedsEscalation --> SwitchWorkflow: High risk
        NeedsEscalation --> RequestDocs: Missing documents
        NeedsEscalation --> GeneratePDF: Legal action needed
        NeedsEscalation --> CloseWorkflow: Case resolved
        SwitchWorkflow --> AddNote: switch_case_workflow
        RequestDocs --> AddNote: request_documents
        GeneratePDF --> AddNote: fill_document_template
        CloseWorkflow --> AddNote: close_case_workflow
        AddNote --> [*]: add_workflow_note
    }

    WorkflowAction --> [*]: Task complete
```

---

## 3. Best Practices & Design Patterns

### 3.1 Tool Design Pattern (Current Implementation)

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: Tool Definition (definitions.ts)                       │
│ - Name, description, inputSchema                                │
│ - Helps LLM understand when/how to use tool                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ Layer 2: Schema Validation (schema.ts)                          │
│ - Zod schemas for type safety                                   │
│ - Runtime validation of parameters                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ Layer 3: Tool Handler (workflow-tools.ts)                       │
│ - Business logic orchestration                                  │
│ - Error handling and response formatting                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ Layer 4: API Client (api/workflows.ts)                          │
│ - HTTP calls to backend                                         │
│ - Token management                                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ Layer 5: REST Routes (workflows.routes.js)                      │
│ - Express endpoints                                             │
│ - Database operations                                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ Layer 6: Service Functions (workflowService.js)                 │
│ - Core business logic                                           │
│ - Transaction management                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Key Files Reference

| Purpose | File Path |
|---------|-----------|
| Tool Definitions | `eqs-mcp-server/src/tools/definitions.ts` |
| Zod Schemas | `eqs-mcp-server/src/tools/schema.ts` |
| Workflow Handlers | `eqs-mcp-server/src/tools/workflow-tools.ts` |
| Handler Registry | `eqs-mcp-server/src/tools/index.ts` |
| REST Routes | `eqs-platform-be/src/core-features/mcp/routes/workflows.routes.js` |
| Core Services | `eqs-platform-be/src/core-features/internalManagement/workflows/services/workflowService.js` |
| Agentic Engine | `eqs-platform-be/src/services/agentic/agentic-engine.js` |
| MCP Client | `eqs-platform-be/src/services/agentic/mcp-client.js` |
| LLM Provider | `eqs-platform-be/src/services/agentic/llm-provider.js` |

### 3.3 Security Model (Implemented)

```mermaid
flowchart LR
    subgraph "Authentication"
        JWT[JWT Token]
        AUTH[Auth Middleware]
    end

    subgraph "Authorization"
        COMPANY[Company Scope]
        ROLE[Role Check]
    end

    subgraph "Audit"
        LOG[Action Logging]
        TRAIL[Audit Trail]
    end

    JWT --> AUTH --> COMPANY --> ROLE
    ROLE --> LOG --> TRAIL
```

**Current Security Features:**
- JWT-based authentication via `accessToken` in context
- Company-scoped queries (all data filtered by `companyId`)
- User attribution on all write operations
- Audit trail with `performedBy` tracking
- Transaction support for multi-step operations

---

## 4. Scalability Architecture

### 4.1 Horizontal Scaling (Production Ready)

```mermaid
flowchart TB
    subgraph "Load Balancer"
        ALB[AWS ALB / NGINX]
    end

    subgraph "API Gateway Cluster"
        GW1[Gateway 1]
        GW2[Gateway 2]
        GW3[Gateway N]
    end

    subgraph "Agentic Worker Pool"
        W1[Worker 1<br/>Concurrency: 2]
        W2[Worker 2<br/>Concurrency: 2]
        W3[Worker N<br/>Concurrency: 2]
    end

    subgraph "MCP Server Cluster"
        MCP1[MCP TS 1]
        MCP2[MCP TS 2]
        MCP_PY[Python ML Server]
    end

    subgraph "Shared State"
        REDIS[(Redis Cluster<br/>BullMQ Jobs)]
        MONGO[(MongoDB Replica<br/>Primary + Secondary)]
        S3[(S3<br/>Documents)]
    end

    ALB --> GW1 & GW2 & GW3
    GW1 & GW2 & GW3 --> W1 & W2 & W3
    W1 & W2 & W3 --> REDIS
    W1 & W2 & W3 --> MCP1 & MCP2 & MCP_PY
    MCP1 & MCP2 --> MONGO & S3
```

### 4.2 Current Configuration

```javascript
// Environment Variables (from agentic code)
ENABLE_AGENTIC=true
LLM_PROVIDER=anthropic          // or 'openai'
LLM_MODEL=claude-3-5-sonnet     // Model selection
ANTHROPIC_API_KEY=xxx
MCP_TYPESCRIPT_URL=http://localhost:3002
AGENTIC_MAX_ITERATIONS=10       // Reasoning loop limit
AGENTIC_TIMEOUT_MS=30000        // 30s timeout
AGENTIC_STREAMING=true          // Real-time updates
AGENTIC_WORKER_CONCURRENCY=2    // BullMQ workers
```

### 4.3 Rate Limiting Strategy (Recommended)

| Tool Category | Suggested Rate | Rationale |
|---------------|----------------|-----------|
| READ tools | 100/min | High volume, low cost |
| Invoice WRITE | 20/min | Financial impact |
| Workflow Actions | 30/min | State changes |
| Document generation | 10/min | PDF processing cost |
| Email actions | 5/min | External service limits |

---

## 5. Next Steps - Future Roadmap

### 5.1 Immediate Actions (EQS-116)

Since EQS-115 is complete, recommended next steps:

| Priority | Task | Effort |
|----------|------|--------|
| P1 | **Integration Testing**: Test all 8 workflow action tools end-to-end | Medium |
| P1 | **Agent Skill Creation**: Create debt collection skill using new tools | Medium |
| P2 | **Error Handling**: Add retry logic for failed tool calls | Small |
| P2 | **Monitoring**: Add tool usage metrics and success rate tracking | Medium |

### 5.2 Enhanced Agentic Capabilities (EQS-117+)

```mermaid
gantt
    title Agentic Platform Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1 - Validation
    Integration Testing     :a1, 2024-01-01, 5d
    E2E Agent Testing      :a2, after a1, 3d

    section Phase 2 - Skills
    Debt Collection Skill   :b1, after a2, 5d
    Payment Plan Skill     :b2, after b1, 3d
    Escalation Skill       :b3, after b2, 3d

    section Phase 3 - Advanced
    Multi-Agent Orchestration :c1, after b3, 10d
    Predictive Actions       :c2, after c1, 7d
    Self-Learning Loop       :c3, after c2, 10d
```

### 5.3 Potential New Tools (Future)

| Tool | Purpose | Complexity |
|------|---------|------------|
| `create_payment_plan` | Auto-generate payment arrangements | Medium |
| `send_chase_email` | Direct email sending | Small |
| `create_dispute` | Log customer disputes | Medium |
| `schedule_followup` | Create automated follow-ups | Small |
| `calculate_settlement` | Compute settlement offers | Medium |

---

## 6. Verification & Testing Plan

### 6.1 Test the Existing Tools

```bash
# 1. List all available tools via MCP
curl -X POST http://localhost:3002/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'

# 2. Test get_document_types
curl -X GET http://localhost:3001/api/mcp/documents/types \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Test get_company_workflows
curl -X GET http://localhost:3001/api/mcp/workflows \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Test switch_case_workflow
curl -X POST http://localhost:3001/api/mcp/workflows/case/CASE_ID/switch \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"workflowId":"WORKFLOW_ID","reason":"Agent escalation"}'
```

### 6.2 Agentic E2E Test

```javascript
// Test autonomous workflow management
const result = await agenticEngine.run({
  task: `Case ${caseId} has overdue invoices and is missing proof of income.
         1. Check the case status
         2. Request the missing document
         3. Switch to escalation workflow
         4. Add a note explaining the actions taken`,
  skill: "debt-collection",
  context: { companyId }
});

// Verify agent used the action tools
expect(result.toolsCalled).toContain('get_case_profile');
expect(result.toolsCalled).toContain('request_documents');
expect(result.toolsCalled).toContain('switch_case_workflow');
expect(result.toolsCalled).toContain('add_workflow_note');
```

---

## 7. Summary

### Current State (Achieved)
- **47 MCP tools** fully implemented
- **12 workflow tools** including all EQS-115 action tools
- **Agentic engine** with Claude/GPT-4 support
- **BullMQ** job processing for async tasks
- **Full audit trail** on all write operations

### Architecture Strengths
- Clean separation: Definitions → Schemas → Handlers → Routes → Services
- Type-safe with Zod validation
- Transaction support for data integrity
- Scalable worker pool design

### Recommended Next Steps
1. Validate all workflow action tools with integration tests
2. Create domain-specific skills (debt collection, escalation)
3. Add monitoring/metrics for tool usage
4. Consider multi-agent orchestration for complex cases

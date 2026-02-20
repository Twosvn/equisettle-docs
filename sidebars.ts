import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Backend documentation sidebar - only files that exist
  backendSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'backend/overview',
        'backend/getting-started/setup',
        'backend/getting-started/environment',
        'backend/getting-started/quick-start',
        'backend/getting-started/video-tutorials',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Architecture',
      items: [
        'backend/architecture/overview',
        'backend/architecture/pure-ledger',
        'backend/architecture/ledger-implementation-guide',
        'backend/architecture/accounting-analysis',
        'backend/architecture/unified-orchestrator',
        'backend/architecture/agentic-platform',
      ],
    },
    {
      type: 'category',
      label: '🔗 Integrations',
      items: [
        'backend/integrations/overview',
        'backend/integrations/quickbooks',
        'backend/integrations/ai-integration',
      ],
    },
    {
      type: 'category',
      label: '🎯 Core Features',
      items: [
        'backend/features/csv-mapping',
        'backend/features/scheduler',
      ],
    },
    {
      type: 'category',
      label: '🏦 Bank Reconciliation',
      items: [
        'backend/reconciliation/README',
        'backend/reconciliation/QUICK_START',
      ],
    },
    {
      type: 'category',
      label: '🤖 Agentic AI',
      items: [
        'backend/AGENTIC_SETUP',
        'backend/AGENTIC_QUICKSTART',
        'backend/TEST_AGENTIC',
        'backend/COST_OPTIMIZATION',
        'backend/USING_CLAUDE',
        'backend/WHAT_IT_DOES',
        'backend/FRONTEND_INTEGRATION',
      ],
    },
    {
      type: 'category',
      label: '📜 Skills',
      items: [
        'backend/skills/payment-terms-skill',
      ],
    },
    {
      type: 'category',
      label: '📦 Archive',
      items: [
        'backend/archive/legacy-cron-jobs',
      ],
    },
  ],

  // Frontend documentation sidebar - only files that exist
  frontendSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'frontend/overview',
      ],
    },
  ],

  // Deployment documentation sidebar - only files that exist
  deploymentSidebar: [
    {
      type: 'category',
      label: '🚀 Overview',
      items: [
        'deployment/overview',
      ],
    },
  ],

  // Knowledge Base sidebar - user-facing documentation
  knowledgeBaseSidebar: [
    {
      type: 'category',
      label: '📖 Getting Started',
      items: [
        'knowledge-base/overview',
        'knowledge-base/platform-overview',
      ],
    },
    {
      type: 'category',
      label: '📁 Cases',
      items: [
        'knowledge-base/cases/understanding-cases',
        'knowledge-base/cases/creating-cases',
        'knowledge-base/cases/managing-cases',
        'knowledge-base/cases/multi-invoice-cases',
      ],
    },
    {
      type: 'category',
      label: '🧾 Invoices',
      items: [
        'knowledge-base/invoices/understanding-invoices',
        'knowledge-base/invoices/managing-invoices',
        'knowledge-base/invoices/payment-links',
        'knowledge-base/invoices/accounting-integrations',
      ],
    },
    {
      type: 'category',
      label: '📅 Payment Plans',
      items: [
        'knowledge-base/payment-plans/setting-up-payment-plans',
        'knowledge-base/payment-plans/managing-payment-plans',
      ],
    },
    {
      type: 'category',
      label: '🔔 Reminders & Communications',
      items: [
        'knowledge-base/reminders/how-reminders-work',
        'knowledge-base/reminders/channels-and-templates',
        'knowledge-base/reminders/customising-reminders',
      ],
    },
    {
      type: 'category',
      label: '⚙️ Workflows',
      items: [
        'knowledge-base/workflows/understanding-workflows',
        'knowledge-base/workflows/stages-and-progression',
        'knowledge-base/workflows/documents-and-approvals',
      ],
    },
    {
      type: 'category',
      label: '📊 Analytics & Reporting',
      items: [
        'knowledge-base/analytics/dashboard-overview',
        'knowledge-base/analytics/invoice-analytics',
        'knowledge-base/analytics/metrics-explained',
      ],
    },
    {
      type: 'category',
      label: '👥 Customers & Disputes',
      items: [
        'knowledge-base/customers/customer-agreements',
        'knowledge-base/customers/monthly-statements',
        'knowledge-base/disputes/raising-disputes',
      ],
    },
    {
      type: 'category',
      label: '🏢 Teams & Portfolios',
      items: [
        'knowledge-base/teams/teams-and-portfolios',
      ],
    },
    {
      type: 'category',
      label: '🏦 Bank Reconciliation',
      items: [
        'knowledge-base/reconciliation/bank-reconciliation',
      ],
    },
  ],
};

export default sidebars;

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

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
};

export default sidebars;

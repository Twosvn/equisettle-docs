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
  // Backend documentation sidebar
  backendSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'backend/overview',
        'backend/getting-started/setup',
        'backend/getting-started/environment',
        'backend/getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Architecture',
      items: [
        'backend/architecture/overview',
        'backend/architecture/database',
        'backend/architecture/authentication',
        'backend/architecture/middleware',
        'backend/architecture/background-jobs',
      ],
    },
    {
      type: 'category',
      label: '🔌 API Reference',
      items: [
        'backend/api/authentication',
        'backend/api/companies',
        'backend/api/users',
        'backend/api/invoices',
        'backend/api/cases',
        'backend/api/payments',
        'backend/api/analytics',
        'backend/api/workflows',
      ],
    },
    {
      type: 'category',
      label: '🔗 Integrations',
      collapsed: false,
      items: [
        'backend/integrations/overview',
        {
          type: 'category',
          label: 'Accounting Systems',
          items: [
            'backend/integrations/quickbooks',
            'backend/integrations/sage',
            'backend/integrations/xero',
            'backend/integrations/freeagent',
          ],
        },
        {
          type: 'category',
          label: 'CRM Systems',
          items: [
            'backend/integrations/salesforce',
            'backend/integrations/zoho',
            'backend/integrations/clio',
          ],
        },
        {
          type: 'category',
          label: 'Payment Processing',
          items: [
            'backend/integrations/gocardless',
            'backend/integrations/stripe',
            'backend/integrations/chargebee',
          ],
        },
        {
          type: 'category',
          label: 'Communication',
          items: [
            'backend/integrations/gmail',
            'backend/integrations/sms',
            'backend/integrations/whatsapp',
            'backend/integrations/email',
          ],
        },
        {
          type: 'category',
          label: 'AI & Analytics',
          items: [
            'backend/integrations/chatgpt',
            'backend/integrations/predictive-analytics',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '🎯 Core Features',
      items: [
        'backend/features/companies',
        'backend/features/users',
        'backend/features/csv-mapping',
        'backend/features/invoices',
        'backend/features/cases',
        'backend/features/workflows',
        'backend/features/analytics',
        'backend/features/teams',
        'backend/features/portfolios',
        'backend/features/payments',
        'backend/features/disputes',
        'backend/features/follow-ups',
        'backend/features/notifications',
      ],
    },
    {
      type: 'category',
      label: '🧪 Testing',
      items: [
        'backend/testing/overview',
        'backend/testing/unit-tests',
        'backend/testing/integration-tests',
        'backend/testing/performance-tests',
      ],
    },
    {
      type: 'category',
      label: '🐛 Troubleshooting',
      items: [
        'backend/troubleshooting/common-issues',
        'backend/troubleshooting/debugging',
        'backend/troubleshooting/performance',
        'backend/troubleshooting/integrations',
      ],
    },
    {
      type: 'category',
      label: '📋 Development Guide',
      items: [
        'backend/development/coding-standards',
        'backend/development/patterns',
        'backend/development/security',
        'backend/development/monitoring',
      ],
    },
  ],

  // Frontend documentation sidebar
  frontendSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'frontend/overview',
        'frontend/getting-started/setup',
        'frontend/getting-started/environment',
        'frontend/getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Architecture',
      items: [
        'frontend/architecture/overview',
        'frontend/architecture/components',
        'frontend/architecture/state-management',
        'frontend/architecture/routing',
        'frontend/architecture/api-layer',
      ],
    },
    {
      type: 'category',
      label: '🎨 UI Components',
      items: [
        'frontend/components/overview',
        'frontend/components/forms',
        'frontend/components/tables',
        'frontend/components/charts',
        'frontend/components/modals',
        'frontend/components/navigation',
      ],
    },
    {
      type: 'category',
      label: '📱 Features',
      items: [
        'frontend/features/dashboard',
        'frontend/features/company-management',
        'frontend/features/case-management',
        'frontend/features/invoice-management',
        'frontend/features/analytics',
        'frontend/features/workflows',
        'frontend/features/user-management',
      ],
    },
    {
      type: 'category',
      label: '🔧 Development',
      items: [
        'frontend/development/coding-standards',
        'frontend/development/styling',
        'frontend/development/testing',
        'frontend/development/performance',
      ],
    },
    {
      type: 'category',
      label: '🐛 Troubleshooting',
      items: [
        'frontend/troubleshooting/common-issues',
        'frontend/troubleshooting/debugging',
        'frontend/troubleshooting/performance',
      ],
    },
  ],

  // Deployment documentation sidebar
  deploymentSidebar: [
    {
      type: 'category',
      label: '🚀 Overview',
      items: [
        'deployment/overview',
        'deployment/environments',
        'deployment/architecture',
      ],
    },
    {
      type: 'category',
      label: '🔧 Backend Deployment',
      items: [
        'deployment/backend/aws-setup',
        'deployment/backend/docker',
        'deployment/backend/environment-variables',
        'deployment/backend/database-setup',
        'deployment/backend/monitoring',
      ],
    },
    {
      type: 'category',
      label: '🌐 Frontend Deployment',
      items: [
        'deployment/frontend/vercel-setup',
        'deployment/frontend/build-process',
        'deployment/frontend/environment-config',
        'deployment/frontend/cdn-setup',
      ],
    },
    {
      type: 'category',
      label: '📊 Monitoring & Maintenance',
      items: [
        'deployment/monitoring/logs',
        'deployment/monitoring/alerts',
        'deployment/monitoring/performance',
        'deployment/monitoring/backup',
      ],
    },
    {
      type: 'category',
      label: '🔄 CI/CD',
      items: [
        'deployment/cicd/github-actions',
        'deployment/cicd/automated-testing',
        'deployment/cicd/deployment-pipeline',
        'deployment/cicd/rollback-procedures',
      ],
    },
  ],
};

export default sidebars;

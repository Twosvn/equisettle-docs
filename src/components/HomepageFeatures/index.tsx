import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
  stats?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'AI-Powered Automation',
    icon: '🤖',
    description: (
      <>
        Leverage advanced AI and machine learning to automate debt collection workflows,
        predict payment likelihood, and optimize collection strategies for maximum ROI.
      </>
    ),
    stats: '94% Success Rate',
  },
  {
    title: 'Comprehensive Integrations',
    icon: '🔗',
    description: (
      <>
        Seamlessly connect with 12+ platforms including QuickBooks, Sage, Salesforce,
        GoCardless, and more. Real-time sync keeps your data consistent across all systems.
      </>
    ),
    stats: '12+ Integrations',
  },
  {
    title: 'Enterprise-Grade Security',
    icon: '🔒',
    description: (
      <>
        Bank-level security with JWT authentication, role-based access control,
        comprehensive audit trails, and GDPR compliance built from the ground up.
      </>
    ),
    stats: 'GDPR Compliant',
  },
  {
    title: 'Intelligent Workflows',
    icon: '⚡',
    description: (
      <>
        Automated case progression, smart follow-ups, and configurable business rules
        that adapt to your organization's unique collection processes.
      </>
    ),
    stats: '10x Faster Processing',
  },
  {
    title: 'Advanced Analytics',
    icon: '📊',
    description: (
      <>
        Real-time dashboards, predictive insights, and comprehensive reporting
        to track performance and optimize your collection strategies.
      </>
    ),
    stats: 'Real-time Insights',
  },
  {
    title: 'Multi-Channel Communication',
    icon: '📱',
    description: (
      <>
        Automated emails, SMS, WhatsApp messaging, and traditional mail integration
        with intelligent timing and personalized content generation.
      </>
    ),
    stats: '5+ Channels',
  },
];

function Feature({title, icon, description, stats}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>
          <span className={styles.iconEmoji}>{icon}</span>
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description}</p>
          {stats && (
            <div className={styles.featureStats}>
              <span className={styles.statsLabel}>{stats}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <Heading as="h2" className={styles.featuresTitle}>
            Why Choose ÉquiSettle?
          </Heading>
          <p className={styles.featuresSubtitle}>
            Built for modern businesses that demand efficiency, compliance, and results
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <div className={styles.ctaSection}>
          <Heading as="h3">Ready to Transform Your Debt Collection?</Heading>
          <p>Join hundreds of businesses already using ÉquiSettle to recover more revenue faster.</p>
          <div className={styles.ctaButtons}>
            <a
              href="https://equisettle.twosvn.co.uk"
              className="button button--primary button--lg"
              target="_blank"
              rel="noopener noreferrer">
              Start Free Trial
            </a>
            <a
              href="/docs/backend/overview"
              className="button button--outline button--lg">
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

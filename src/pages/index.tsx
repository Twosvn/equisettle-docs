import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className="hero__title">
              ÉquiSettle
            </Heading>
            <p className="hero__subtitle">
              Revolutionary Debt Collection & Accounts Receivable Management Platform
            </p>
            <p className={styles.heroDescription}>
              Streamline your debt collection process with AI-powered automation,
              comprehensive integrations, and intelligent workflow management.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--secondary button--lg"
                to="/docs/backend/overview">
                📋 Technical Documentation
              </Link>
              <Link
                className={clsx('button button--outline button--lg', styles.platformButton)}
                to="https://equisettle.twosvn.co.uk">
                🚀 Visit Platform
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.platformPreview}>
              <div className={styles.browserWindow}>
                <div className={styles.browserBar}>
                  <div className={styles.browserButtons}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className={styles.browserUrl}>equisettle.twosvn.co.uk</div>
                </div>
                <div className={styles.browserContent}>
                  <div className={styles.dashboardPreview}>
                    <div className={styles.statsRow}>
                      <div className={styles.statCard}>
                        <div className={styles.statValue}>£2.4M</div>
                        <div className={styles.statLabel}>Recovered</div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statValue}>1,247</div>
                        <div className={styles.statLabel}>Cases</div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statValue}>94%</div>
                        <div className={styles.statLabel}>Success Rate</div>
                      </div>
                    </div>
                    <div className={styles.chartArea}>
                      <div className={styles.chartPlaceholder}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="ÉquiSettle Platform Documentation"
      description="Revolutionary debt collection and accounts receivable management platform with AI-powered automation and comprehensive integrations.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

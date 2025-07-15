import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { supporters } from '../data/adopters';
import styles from './SupportersSection.module.css';

function SupporterLogo({ supporter }) {
  return (
    <div className={clsx('col col--3', styles.supporterItem)}>
      <div className={styles.logoContainer}>
        {supporter.logo ? (
          <img 
            src={supporter.logo} 
            alt={supporter.name}
            className={styles.logo}
          />
        ) : (
          <div className={styles.placeholderLogo}>
            {supporter.name}
          </div>
        )}
      </div>
    </div>
  );
}



export default function SupportersSection() {
  return (
    <>
      {supporters && supporters.length > 0 && (
        <section className={styles.supportersSection}>
          <div className="container">
            <div className="text--center margin-bottom--lg">
              <h2 className={styles.sectionTitle}>
                <Translate>Recognition</Translate>
              </h2>
              <p className={styles.sectionSubtitle}>
                <Translate>
                  Companies that have contributed to OpenKruise with meaningful contributions
                </Translate>
              </p>
            </div>

            <div className="row">
              {supporters.map((supporter, idx) => (
                <SupporterLogo key={idx} supporter={supporter} />
              ))}
            </div>

            <div className="text--center margin-top--lg">
              <Link
                className={styles.becomeSupporter}
                href="https://kubernetes.slack.com/channels/openkruise">
                <Translate>Become a Supporter</Translate>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

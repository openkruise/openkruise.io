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
          </div>
        </section>
      )}

      <section className={styles.guidelinesSection}>
        <div className="container">
          <div className="text--center">
            <p className={styles.sectionSubtitle}>
              <Translate>
                We invite companies that have contributed to Kruise to provide their logos for the OpenKruise homepage.
                They will have the opportunity to be recognized for their contributions to the development of OpenKruise
                at various open-source conferences attended by Kruise. To recognize and reward companies that actively contribute to the community, we should consider setting a threshold
                for supporters. For instance, a company should have at least three contributors who have made meaningful
                contributions to Kruise, including submitting issues, creating pull requests, enhancing documentation,
                and improving the website.
              </Translate>
            </p>

            <div className="text--center margin-top--lg">
              <Link
                className={styles.becomeSupporter}
                href="https://kubernetes.slack.com/channels/openkruise">
                <Translate>Become a Supporter</Translate>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

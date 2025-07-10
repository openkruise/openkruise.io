import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import { adopters } from '../data/adopters';
import styles from './adopters.module.css';

function AdopterCard({ adopter }) {
  return (
    <div className={clsx('col col--3', styles.adopterCard)}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.companyName}>{adopter.name}</h3>
          <p className={styles.location}>{adopter.location}</p>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.useCase}>
            <h4><Translate>Use Case</Translate></h4>
            <p>{adopter.purpose}</p>
          </div>
        </div>
      </div>
    </div>
  );
}



function AdoptersSection() {
  return (
    <section className={styles.adoptersSection}>
      <div className="container">
        <div className="row">
          {adopters.map((adopter, idx) => (
            <AdopterCard key={idx} adopter={adopter} />
          ))}
        </div>
      </div>
    </section>
  );
}



function BecomeAdopterSection() {
  return (
    <section className={styles.becomeAdopterSection}>
      <div className="container">
        <div className="text--center">
          <h2 className={styles.becomeAdopterTitle}>
            <Translate>Already using Kruise? Fill the details in the below link</Translate>
          </h2>
          <Link
            className={styles.becomeAdopterButton}
            href="https://github.com/openkruise/kruise/issues/289">
            <Translate>Open</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Adopters() {
  return (
    <Layout
      title={translate({
        message: 'Adopters & Supporters',
        description: 'The title of the adopters page',
      })}
      description={translate({
        message: 'Companies and organizations using OpenKruise and supporting its development',
        description: 'The description of the adopters page',
      })}
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            <Translate>Adopters</Translate>
          </h1>
          <p className="hero__subtitle">
            <Translate>
              Companies and organizations using OpenKruise in production
            </Translate>
          </p>
        </div>
      </header>

      <main>
        <AdoptersSection />
        <BecomeAdopterSection />
      </main>
    </Layout>
  );
}

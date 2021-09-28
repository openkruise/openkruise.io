import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GitHubButton from 'react-github-btn';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function Feature({ imgUrl, title, description, reverse }) {
  return (
    <div className={clsx('row', styles.feature, reverse ? styles.featureReverse : '')}>
      <div className="col col--3">
        <div className="text--center">
          {imgUrl && <img className={styles.featureImage} src={useBaseUrl(imgUrl)} alt={title} />}
        </div>
      </div>
      <div className={clsx('col col--9', styles.featureDesc)}>
        <div>
          <h2>{title}</h2>
          <div>{description}</div>
        </div>
      </div>
    </div>
  )
}

const Button = ({ children, href }) => {
  return (
    <div className="col col--2 margin-horiz--sm">
      <Link
        className="button button--outline button--primary button--lg"
        to={href}>
        {children}
      </Link>
    </div>
  );
};

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout title={siteConfig.tagline} description={siteConfig.tagline}>
      <header className={clsx('hero', styles.hero)}>
        <div className="container text--center">
          {/* <div className={styles.heroLogoWrapper}>
            <img className={styles.heroLogo} src={useBaseUrl('img/logo_colorful.png')} alt="OpenKruise Logo" />
          </div> */}
          <h2 className={clsx('hero__title', styles.heroTitle)}>{siteConfig.title}</h2>
          <GitHubButton
            href="https://github.com/openkruise/kruise"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star facebook/metro on GitHub">
            Star
          </GitHubButton>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div
            className={clsx(styles.heroButtons, 'name', 'margin-vert--md')}>
            <Button href={useBaseUrl('docs/installation')}><Translate>Getting Started</Translate></Button>
            <Button href={useBaseUrl('docs/')}><Translate>Learn More</Translate></Button>
          </div>
        </div>
      </header>

      <WhatIs />

      <main className={clsx('hero', styles.hero)}>
        <div className="container">
          <section className={styles.features}>
            <div className="container">
              {HomepageFeatures.map((f, idx) => (
                <Feature key={idx} {...f} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <div className={clsx('hero', styles.hero)}>
      
        <div className="container text--center">
          <h3 className="hero__subtitle">
            <Translate>OpenKruise is a</Translate> <a href="https://cncf.io/">Cloud Native Computing Foundation</a> <Translate>sandbox project</Translate>
          </h3>
          <div className={clsx('cncf-logo', styles.cncfLogo)} />
        </div>
      </div>
    </Layout>
  );
}

const WhatIs = () => (
  <div className={clsx('hero', styles.hero)}>
    <div className="container">
      <div className="row">
        <div className="col col--7">
          <h1><Translate>What is OpenKruise?</Translate></h1>
          <p className="hero__subtitle">
            <small>
              <Translate>
                OpenKruise is an extended component suite for Kubernetes,
                which mainly focuses on application automations, such as
              </Translate> <i><Translate>deployment, upgrade, ops and avalibility protection.</Translate></i>
              <br />
              <br />
              <Translate>
                Mostly features provided by OpenKruise are built primarily based on CRD extensions.
                They can work in pure Kubernetes clusters without any other dependences.
              </Translate>
            </small>
          </p>
        </div>
        <div className="col">
          <img
            className="image"
            src={useBaseUrl("img/what-is-kruise.png")}
            align="right"
            alt="what is OpenKruise"
          />
        </div>
      </div>
    </div>
  </div>
);

import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useCompatibilityData } from '../data/useCompatibilityData';
import styles from './compatibility.module.css';


function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function K8sCompatibilityTab({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(20);

  const filteredVersions = useMemo(() => {
    return data.filter(item =>
      item.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.minK8sVersion.includes(searchTerm) ||
      item.maxK8sVersion.includes(searchTerm)
    );
  }, [searchTerm, data]);

  const displayedVersions = filteredVersions.slice(0, displayCount);
  const hasMore = filteredVersions.length > displayCount;

  return (
    <div className={styles.tabContent}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by version or K8s version..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          aria-label="Search K8s compatibility matrix"
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.compatibilityTable}>
          <thead>
            <tr>
              <th><Translate>OpenKruise Version</Translate></th>
              <th><Translate>Min K8s Version</Translate></th>
              <th><Translate>Max K8s Version</Translate></th>
              <th><Translate>Release Date</Translate></th>
              <th><Translate>Install Command</Translate></th>
              <th><Translate>Release</Translate></th>
            </tr>
          </thead>
          <tbody>
            {displayedVersions.map((item) => (
              <tr key={item.version}>
                <td className={styles.versionCell}>{item.version}</td>
                <td>{item.minK8sVersion}+</td>
                <td>{item.maxK8sVersion}</td>
                <td className={styles.dateCell}>{formatDate(item.releaseDate)}</td>
                <td className={styles.helmCell}>
                  <pre className={styles.helmCommandBlock}>
                    <code>helm install kruise openkruise/kruise --version {item.helmVersion}</code>
                  </pre>
                </td>
                <td className={styles.releaseCell}>
                  <a 
                    href={`https://github.com/openkruise/kruise/releases/tag/${item.version}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.releaseLink}
                    aria-label={`View release for ${item.version}`}
                  >
                    {item.version} <span className={styles.externalLinkIcon}>↗</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className={styles.showMoreContainer}>
          <button
            className={styles.showMoreButton}
            onClick={() => setDisplayCount(displayCount + 20)}
            aria-label="Load more versions"
          >
            <Translate>Show More</Translate>
          </button>
        </div>
      )}

      {filteredVersions.length === 0 && (
        <div className={styles.noResults}>
          <p><Translate>No matching versions found</Translate></p>
        </div>
      )}
    </div>
  );
}

export default function CompatibilityPage() {
  const { siteConfig } = useDocusaurusContext();

  const { k8sMatrix, loading, error } = useCompatibilityData();

  if (loading) {
    return (
      <Layout
        title={translate({ message: 'Kubernetes Compatibility' })}
        description={translate({
          message: 'Check OpenKruise compatibility with different Kubernetes versions',
        })}
      >
        <div className={styles.compatibilitySection}>
          <div className="container">
            <div className={styles.header}>
              <h1><Translate>Kubernetes Compatibility</Translate></h1>
            </div>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Translate>Loading compatibility data...</Translate>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={translate({ message: 'Kubernetes Compatibility' })}
      description={translate({
        message: 'Check OpenKruise compatibility with different Kubernetes versions',
      })}
    >
      <div className={styles.compatibilitySection}>
        <div className="container">
          <div className={styles.header}>
            <h1><Translate>Kubernetes Compatibility</Translate></h1>
            <p className={styles.subtitle}>
              <Translate>Check OpenKruise version compatibility with your Kubernetes version</Translate>
            </p>
          </div>

          <K8sCompatibilityTab data={k8sMatrix} />

          <div className={styles.infoBox}>
            <h3><Translate>Need Help?</Translate></h3>
            <p>
              <Translate>For detailed installation and feature documentation, please visit our</Translate>{' '}
              <a href="/docs/installation"><Translate>installation guide</Translate></a>
              {' '}<Translate>or explore the</Translate>{' '}
              <a href="/docs/user-manuals"><Translate>user manuals</Translate></a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import { adopters } from '../data/adopters';
import styles from './adopters.module.css';

// Extract Kruise feature keywords from adopter purpose
// IMPORTANT: When new Kruise features are released or added to adopter descriptions,
// add them to this list so they will be auto-extracted and displayed as tags on adopter cards.
// The matching is case-insensitive, so "cloneset" and "CloneSet" both work.
// Examples of features: CloneSet, SidecarSet, BroadcastJob, GameServerSet, etc.
const FEATURE_KEYWORDS = [
  'CloneSet', 
  'SidecarSet', 
  'BroadcastJob', 
  'GameServerSet', 
  'Rollouts', 
  'AdvancedCronTab', 
  'UnitedDeployment', 
  'WorkloadSpread', 
  'KruiseGame',
  'AdvancedStatefulSet',
  'AdvanceStatefulSet',
  'PersistentPodState',
  'ImagePullJobs',
  'ImagepullJobs',
  'ResourceDistribution',
  'DaemonSet'
];

function extractFeatures(purpose) {
  if (!purpose) return [];
  const features = [];
  FEATURE_KEYWORDS.forEach(keyword => {
    // Case-insensitive matching: catches "cloneset", "CloneSet", "CLONESET", etc.
    if (purpose.toLowerCase().includes(keyword.toLowerCase())) {
      features.push(keyword);
    }
  });
  // Remove duplicates in case of overlapping keywords (e.g., "AdvancedStatefulSet" vs "AdvanceStatefulSet")
  return [...new Set(features)];
}

function AdopterCard({ adopter }) {
  const features = extractFeatures(adopter.purpose);
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
          {features.length > 0 && (
            <div className={styles.features}>
              {features.map(feature => (
                <span key={feature} className={styles.featureTag}>{feature}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



function AdoptersSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Get all unique features
  const allFeatures = useMemo(() => {
    const featuresSet = new Set();
    adopters.forEach(adopter => {
      extractFeatures(adopter.purpose).forEach(f => featuresSet.add(f));
    });
    return Array.from(featuresSet).sort();
  }, []);

  // Filter adopters based on search term and selected features
  const filteredAdopters = useMemo(() => {
    return adopters.filter(adopter => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        adopter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adopter.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Feature filter
      const matchesFeatures = selectedFilters.length === 0 || 
        selectedFilters.some(filter => {
          const features = extractFeatures(adopter.purpose);
          return features.includes(filter);
        });
      
      return matchesSearch && matchesFeatures;
    });
  }, [searchTerm, selectedFilters]);

  const toggleFilter = (feature) => {
    setSelectedFilters(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFilters([]);
  };

  return (
    <section className={styles.adoptersSection}>
      <div className="container">
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by company name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Feature Filters */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Filter by Features</h3>
          <div className={styles.filterChips}>
            {allFeatures.map(feature => (
              <button
                key={feature}
                className={clsx(styles.filterChip, {
                  [styles.filterChipActive]: selectedFilters.includes(feature)
                })}
                onClick={() => toggleFilter(feature)}
              >
                {feature}
              </button>
            ))}
          </div>
          {selectedFilters.length > 0 && (
            <button className={styles.clearButton} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Adopter Count */}
        <div className={styles.adopterCount}>
          Showing {filteredAdopters.length} of {adopters.length} adopters
        </div>

        {/* Adopters Grid or Empty State */}
        {filteredAdopters.length > 0 ? (
          <div className="row">
            {filteredAdopters.map((adopter, idx) => (
              <AdopterCard key={idx} adopter={adopter} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p><Translate>No adopters found matching your criteria. Try adjusting your search or filters.</Translate></p>
          </div>
        )}
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

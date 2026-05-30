import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { adopters } from '../../data/adopters';
import styles from '../adopters.module.css';

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

// Chinese translations for feature names
const FEATURE_TRANSLATIONS = {
  'CloneSet': '克隆集',
  'SidecarSet': '边车集',
  'BroadcastJob': '广播任务',
  'GameServerSet': '游戏服务器集',
  'Rollouts': '灰度发布',
  'AdvancedCronTab': '高级定时任务',
  'UnitedDeployment': '联合部署',
  'WorkloadSpread': '工作负载扩展',
  'KruiseGame': 'Kruise游戏',
  'AdvancedStatefulSet': '高级有状态集',
  'AdvanceStatefulSet': '高级有状态集',
  'PersistentPodState': '持久化Pod状态',
  'ImagePullJobs': '镜像拉取任务',
  'ImagepullJobs': '镜像拉取任务',
  'ResourceDistribution': '资源分发',
  'DaemonSet': '守护进程集'
};

function getFeatureDisplayName(feature) {
  return FEATURE_TRANSLATIONS[feature] || feature;
}

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
            <h4>使用场景</h4>
            <p>{adopter.purpose}</p>
          </div>
          {features.length > 0 && (
            <div className={styles.features}>
              {features.map(feature => (
                <span key={feature} className={styles.featureTag}>{getFeatureDisplayName(feature)}</span>
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
            placeholder="按公司名或地址搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Feature Filters */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>
            按功能筛选
          </h3>
          <div className={styles.filterChips}>
            {allFeatures.map(feature => (
              <button
                key={feature}
                className={clsx(styles.filterChip, {
                  [styles.filterChipActive]: selectedFilters.includes(feature)
                })}
                onClick={() => toggleFilter(feature)}
              >
                {getFeatureDisplayName(feature)}
              </button>
            ))}
          </div>
          {selectedFilters.length > 0 && (
            <button className={styles.clearButton} onClick={clearFilters}>
              清除筛选
            </button>
          )}
        </div>

        {/* Adopter Count */}
        <div className={styles.adopterCount}>
          显示 {filteredAdopters.length} 个，共 {adopters.length} 个采纳者
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
            <p>没有找到符合条件的采纳者。请尝试调整你的搜索或筛选条件。</p>
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
            已经在使用 Kruise？填写以下链接中的详细信息
          </h2>
          <Link
            className={styles.becomeAdopterButton}
            href="https://github.com/openkruise/kruise/issues/289">
            打开
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Adopters() {
  return (
    <Layout
      title="采纳者与支持者"
      description="使用 OpenKruise 的公司和组织"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            采纳者
          </h1>
          <p className="hero__subtitle">
            在生产环境中使用 OpenKruise 的公司和组织
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

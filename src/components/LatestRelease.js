import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import styles from './LatestRelease.module.css';

// Extract first 3 meaningful highlights from release notes
// - Filters out technical lines (Full Changelog, pure URLs, comparisons)
// - Removes PR refs, URLs, and markdown formatting
// - Preserves author mentions (@author)
function parseReleaseHighlights(body) {
  if (!body) return [];
  
  const lines = body.split('\n');
  const highlights = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if ((trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) 
        && trimmed.length > 2) {
      
      let highlight = trimmed.substring(1).trim();
      
      if (highlight.toLowerCase().includes('full changelog')) continue;
      if (highlight.startsWith('https://github.com/') && highlight.includes('compare')) continue;
      if (highlight.startsWith('http') && highlight.length < 100) continue;
      
      highlight = highlight
        .replace(/\s*\(#\d+\)\s*/g, ' ')
        .replace(/\s+in\s+https?:\/\/.*$/g, '')
        .replace(/\s+https?:\/\/.*$/g, '')
        .replace(/[*_`]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();
      
      if (highlight.length > 5 && !/^[#\d\s@-]*$/.test(highlight)) {
        highlights.push(highlight);
      }
    }
    
    if (highlights.length >= 3) break;
  }
  
  return highlights;
}

// Cache management (1-hour TTL)
// The static JSON is baked at build time, so caching avoids re-fetching
// the same file on every page navigation.
function getCachedRelease() {
  try {
    const cached = localStorage.getItem('openkruise_latest_release');
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const ONE_HOUR = 60 * 60 * 1000;
    
    if (Date.now() - timestamp < ONE_HOUR) {
      return data;
    }
    
    localStorage.removeItem('openkruise_latest_release');
    return null;
  } catch (err) {
    console.error('Error reading cache:', err);
    return null;
  }
}

function cacheRelease(data) {
  try {
    localStorage.setItem('openkruise_latest_release', JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.error('Error caching release:', err);
  }
}

// Loading skeleton
function SkeletonLoader() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={clsx(styles.skeletonElement, styles.skeletonTitle)} />
      <div className={clsx(styles.skeletonElement, styles.skeletonText)} />
      <div className={clsx(styles.skeletonElement, styles.skeletonText, styles.skeletonTextShort)} />
      <div className={clsx(styles.skeletonElement, styles.skeletonText)} />
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorText}>
        <Translate>Unable to load latest release information.</Translate>
      </p>
      <Link
        href="https://github.com/openkruise/kruise/releases/latest"
        className="button button--primary button--sm"
      >
        <Translate>View Latest Release on GitHub</Translate>
      </Link>
    </div>
  );
}

export default function LatestRelease() {
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const cached = getCachedRelease();
        if (cached) {
          setRelease(cached);
          setLoading(false);
          return;
        }

        // Fetch from the static JSON generated at build time.
        // This avoids client-side GitHub API calls that hit the
        // 60 req/hour unauthenticated rate limit.
        const response = await fetch('/data/latest-release.json');

        if (!response.ok) {
          throw new Error(`Failed to load release data: ${response.status}`);
        }

        const data = await response.json();

        // If tag_name is empty, the build-time fetch failed — show fallback.
        if (!data.tag_name) {
          throw new Error('No release data available');
        }

        cacheRelease(data);
        setRelease(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch latest release:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRelease();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !release) {
    return <ErrorFallback />;
  }

  // Format release date
  const releaseDate = new Date(release.published_at);
  const formattedDate = releaseDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const highlights = parseReleaseHighlights(release.body);

  return (
    <section 
      className={styles.latestReleaseSection}
      aria-labelledby="whats-new-title"
    >
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <article className={styles.releaseCard}>
              <header className={styles.releaseHeader}>
                <h3 
                  id="whats-new-title"
                  className={styles.releaseTitle}
                >
                  <Translate>What's New</Translate>
                </h3>
                <div 
                  className={styles.versionBadge}
                  role="doc-subtitle"
                  aria-label={`Version ${release.tag_name}`}
                >
                  {release.tag_name}
                </div>
              </header>

              <time 
                className={styles.releaseDate}
                dateTime={release.published_at}
              >
                <Translate>Released on</Translate> {formattedDate}
              </time>

              {highlights.length > 0 && (
                <section 
                  className={styles.highlights}
                  aria-label="Release highlights"
                >
                  <h4 className={styles.highlightsTitle}>
                    <Translate>Highlights</Translate>
                  </h4>
                  <ul className={styles.highlightsList}>
                    {highlights.map((highlight, idx) => (
                      <li key={idx} className={styles.highlightItem}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className={styles.releaseActions}>
                <Link
                  href={release.html_url}
                  className="button button--primary"
                  aria-label={`View full release notes for ${release.tag_name}`}
                >
                  <Translate>View Full Release Notes</Translate>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

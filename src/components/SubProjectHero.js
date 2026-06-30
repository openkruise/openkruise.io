import React from 'react';
import styles from './SubProjectHero.module.css';

/**
 * Reusable hero section for sub-project introduction pages.
 *
 * Usage in .mdx files:
 *   import SubProjectHero from '@site/src/components/SubProjectHero';
 *
 *   <SubProjectHero
 *     title="Kruise Rollouts"
 *     tagline="Progressive delivery for Kubernetes"
 *     github="https://github.com/openkruise/rollouts"
 *     accent="#6f42c1"
 *   />
 */
export default function SubProjectHero({
  title,
  tagline,
  github,
  accent = 'var(--ifm-color-primary)',
}) {
  return (
    <div
      className={styles.hero}
      style={{
        '--hero-accent': accent,
        borderColor: accent,
      }}
    >
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle} style={{color: accent}}>
            {title}
          </h1>
          <p className={styles.heroTagline}>{tagline}</p>
        </div>
        {github && (
          <a
            href={github}
            className={styles.githubButton}
            target="_blank"
            rel="noopener noreferrer"
            style={{borderColor: accent, color: accent}}
          >
            <svg
              className={styles.starIcon}
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            <span>Star on GitHub</span>
          </a>
        )}
      </div>
    </div>
  );
}

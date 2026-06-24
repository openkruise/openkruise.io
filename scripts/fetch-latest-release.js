/**
 * Build-time script: fetches the latest release from GitHub API
 * and writes a trimmed JSON file to static/data/latest-release.json.
 *
 * This eliminates client-side GitHub API calls (which hit the
 * 60 req/hour unauthenticated rate limit per visitor IP).
 *
 * Usage:
 *   node scripts/fetch-latest-release.js
 *
 * Environment:
 *   GITHUB_TOKEN (optional) – increases rate limit to 5000 req/hour.
 *                             In GitHub Actions CI, `github.token` is available.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://api.github.com/repos/openkruise/kruise/releases/latest';
const OUTPUT_DIR = path.join(__dirname, '..', 'static', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'latest-release.json');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'openkruise-docs-build',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API returned ${res.statusCode}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

function writeReleaseFile(release) {
  const trimmed = {
    tag_name: release.tag_name,
    published_at: release.published_at,
    html_url: release.html_url,
    body: release.body || '',
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(trimmed, null, 2) + '\n', 'utf-8');
  console.log(`[fetch-latest-release] Wrote ${release.tag_name} to ${OUTPUT_FILE}`);
}

async function main() {
  try {
    console.log('[fetch-latest-release] Fetching latest release from GitHub API…');
    const release = await fetchJSON(API_URL);
    writeReleaseFile(release);
  } catch (err) {
    console.warn(`[fetch-latest-release] Warning: ${err.message}`);

    // Keep the existing file if it already exists
    if (fs.existsSync(OUTPUT_FILE)) {
      console.warn('[fetch-latest-release] Keeping existing latest-release.json');
      return;
    }

    // Write a minimal fallback so the build doesn't break
    const fallback = {
      tag_name: '',
      published_at: '',
      html_url: 'https://github.com/openkruise/kruise/releases/latest',
      body: '',
    };
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fallback, null, 2) + '\n', 'utf-8');
    console.warn('[fetch-latest-release] Wrote fallback latest-release.json');
  }
}

main();

import { useState, useEffect } from 'react';

function getCachedReleases() {
  try {
    const cached = localStorage.getItem('openkruise_releases_cache');
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (Date.now() - timestamp < ONE_DAY) {
      return data;
    }

    localStorage.removeItem('openkruise_releases_cache');
    return null;
  } catch (err) {
    console.error('Error reading releases cache:', err);
    return null;
  }
}

function cacheReleases(data) {
  try {
    localStorage.setItem('openkruise_releases_cache', JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.error('Error caching releases:', err);
  }
}

// Extract version number from tag 
function normalizeVersion(tag) {
  if (!tag) return null;
  const match = tag.match(/^v(\d+\.\d+)/);
  return match ? `v${match[1]}` : null;
}

function getFullVersion(tag) {
  if (!tag) return null;
  const match = tag.match(/^(v\d+\.\d+\.\d+)/);
  return match ? match[1] : tag;
}

// Strip v prefix for Install command 
function getHelmVersion(version) {
  if (!version) return null;
  return version.startsWith('v') ? version.substring(1) : version;
}

// Fetch releases from GitHub API
async function fetchGitHubReleases() {
  try {
    const cached = getCachedReleases();
    if (cached) return cached;

    
    const response = await fetch(
      'https://api.github.com/repos/openkruise/kruise/releases?per_page=100',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    let releases = await response.json();

    // Checking for Link header for pagination
    const linkHeader = response.headers.get('link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      // Fetch additional pages
      const nextPageMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      if (nextPageMatch) {
        const nextUrl = nextPageMatch[1];
        try {
          const nextResponse = await fetch(nextUrl, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          });
          if (nextResponse.ok) {
            const nextReleases = await nextResponse.json();
            releases = releases.concat(nextReleases);
          }
        } catch (err) {
          console.warn('Could not fetch next page of releases:', err);
        }
      }
    }

    cacheReleases(releases);
    return releases;
  } catch (err) {
    console.error('Failed to fetch releases from GitHub:', err);
    return null;
  }
}

// K8s version info cache with 24-hour expiration
function getCachedK8sVersionInfo() {
  try {
    const cached = localStorage.getItem('openkruise_k8s_info_cache');
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (Date.now() - timestamp < ONE_DAY) {
      return data;
    }

    localStorage.removeItem('openkruise_k8s_info_cache');
    return null;
  } catch (err) {
    console.error('Error reading K8s info cache:', err);
    return null;
  }
}

function cacheK8sVersionInfo(data) {
  try {
    localStorage.setItem('openkruise_k8s_info_cache', JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.error('Error caching K8s info:', err);
  }
}

// Parse kubeVersion field

function parseKubeVersion(kubeVersionStr) {
  if (!kubeVersionStr) return null;

  const result = {};

  const minMatch = kubeVersionStr.match(/>=?(\d+\.\d+)/);
  if (minMatch) {
    result.minK8sVersion = minMatch[1];
  }

  
  const maxMatch = kubeVersionStr.match(/<=?(\d+\.\d+)/);
  if (maxMatch) {
    result.maxK8sVersion = maxMatch[1];
  }

  // Handle range 
  const rangeMatch = kubeVersionStr.match(/(\d+\.\d+)\s*-\s*(\d+\.\d+)/);
  if (rangeMatch) {
    result.minK8sVersion = rangeMatch[1];
    result.maxK8sVersion = rangeMatch[2];
  }

  return (result.minK8sVersion || result.maxK8sVersion) ? result : null;
}

// Fetch K8s compatibility 
async function fetchK8sRangeFromChart(fullVersion) {
  try {
    // fullVersion format
    const chartUrl = `https://raw.githubusercontent.com/openkruise/kruise/${fullVersion}/helm/Chart.yaml`;
    
    const response = await fetch(chartUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      console.warn(`Could not fetch K8s version info for ${fullVersion}`);
      return null;
    }

    const chartContent = await response.text();
    
    // Extract kubeVersion field from YAML
    const kubeVersionMatch = chartContent.match(/kubeVersion:\s*["']?([^"\'\n]+)["']?/);
    if (kubeVersionMatch) {
      const kubeVersionStr = kubeVersionMatch[1];
      const parsed = parseKubeVersion(kubeVersionStr);
      
      if (parsed) {
        return {
          minK8sVersion: parsed.minK8sVersion || '1.16',
          maxK8sVersion: parsed.maxK8sVersion || '1.31+',
        };
      }
    }

    return null;
  } catch (err) {
    console.warn(`Failed to fetch K8s version info for ${fullVersion}:`, err.message);
    return null;
  }
}

// Fetch K8s info with caching
async function fetchK8sInfoForVersions(fullVersions) {
  try {
    const cached = getCachedK8sVersionInfo();
    if (cached) {
      return cached;
    }

    const k8sInfo = {};

   
    for (const version of fullVersions) {
      const normalizedVersion = normalizeVersion(version);
      if (!normalizedVersion) continue;

      const chartInfo = await fetchK8sRangeFromChart(version);
      
      if (chartInfo) {
        k8sInfo[normalizedVersion] = chartInfo;
      } else {
        // Fall back to hardcoded values, then to defaults if not defined
        k8sInfo[normalizedVersion] = K8S_INFO_FALLBACK[normalizedVersion] || {
          minK8sVersion: '1.16',
          maxK8sVersion: '1.31+',
        };
      }

      // Adding small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    cacheK8sVersionInfo(k8sInfo);
    return k8sInfo;
  } catch (err) {
    console.error('Error fetching K8s version info:', err);
    return {};
  }
}

// Building K8s compatibility matrix from GitHub data
function buildK8sCompatibilityMatrix(releases, k8sInfoMap = {}) {
  const versionMap = new Map();

  if (releases && Array.isArray(releases)) {
    releases.forEach(release => {
      if (release.draft || release.prerelease) return;
      
      const fullVersion = getFullVersion(release.tag_name);
      const normalizedVersion = normalizeVersion(release.tag_name);
      
      if (fullVersion && normalizedVersion && !versionMap.has(fullVersion)) {
        const k8sInfo = k8sInfoMap[normalizedVersion] || 
                       K8S_INFO_FALLBACK[normalizedVersion] || {
          minK8sVersion: '1.16',
          maxK8sVersion: '1.31+',
        };

        versionMap.set(fullVersion, {
          version: fullVersion,  
          helmVersion: getHelmVersion(fullVersion),  
          minK8sVersion: k8sInfo.minK8sVersion,
          maxK8sVersion: k8sInfo.maxK8sVersion,
          status: 'Stable',
          releaseDate: release.published_at,
          htmlUrl: release.html_url, 
        });
      }
    });
  }

  // Sort by version 
  const sorted = Array.from(versionMap.values()).sort((a, b) => {
    return b.version.localeCompare(a.version, undefined, { numeric: true });
  });

  return sorted;
}

// Hook to fetch and manage compatibility data
export function useCompatibilityData() {
  const [k8sMatrix, setK8sMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const releases = await fetchGitHubReleases();
        
        // Extract full versions from releases for fetching K8s info
        const fullVersions = releases
          ? releases
              .filter(r => !r.draft && !r.prerelease)
              .map(r => getFullVersion(r.tag_name))
              .filter(v => v)
          : [];

        const k8sInfoMap = fullVersions.length > 0 
          ? await fetchK8sInfoForVersions(fullVersions)
          : {};

        const k8sData = buildK8sCompatibilityMatrix(releases, k8sInfoMap);

        setK8sMatrix(k8sData);
        setError(null);
      } catch (err) {
        console.error('Error building compatibility data:', err);
        setError(err);
        // Fallback to hardcoded K8s info if GitHub fetch fails
        try {
          const releases = await fetchGitHubReleases();
          setK8sMatrix(buildK8sCompatibilityMatrix(releases, {}));
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
          setK8sMatrix([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { k8sMatrix, loading, error };
}

// Fallback K8s info
const K8S_INFO_FALLBACK = {
  'v1.10': { minK8sVersion: '1.20', maxK8sVersion: '1.31+' },
  'v1.9': { minK8sVersion: '1.16', maxK8sVersion: '1.28' },
  'v1.8': { minK8sVersion: '1.16', maxK8sVersion: '1.27' },
  'v1.7': { minK8sVersion: '1.16', maxK8sVersion: '1.26' },
  'v1.6': { minK8sVersion: '1.16', maxK8sVersion: '1.25' },
  'v1.5': { minK8sVersion: '1.16', maxK8sVersion: '1.24' },
  'v1.4': { minK8sVersion: '1.16', maxK8sVersion: '1.31+' },
  'v1.3': { minK8sVersion: '1.16', maxK8sVersion: '1.31+' },
  'v1.2': { minK8sVersion: '1.16', maxK8sVersion: '1.31+' },
  'v1.1': { minK8sVersion: '1.16', maxK8sVersion: '1.31+' },
  'v1.0': { minK8sVersion: '1.16', maxK8sVersion: '1.31+' },
};
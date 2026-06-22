// background.js

// Safe-list of protocols/domains to skip checking
const SKIP_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'newtab',
  'extensions'
];

const SKIP_PROTOCOLS = [
  'chrome:',
  'chrome-extension:',
  'edge:',
  'about:',
  'file:'
];

// Helper to check if a URL should be scanned
function shouldScan(urlStr) {
  try {
    const url = new URL(urlStr);
    if (SKIP_PROTOCOLS.includes(url.protocol)) return false;
    if (SKIP_DOMAINS.includes(url.hostname)) return false;
    if (url.hostname.endsWith('google.com') || url.hostname.endsWith('github.com')) return false;
    return true;
  } catch {
    return false;
  }
}

// Check domain using CyberSaathi API
async function checkDomainRisk(urlStr) {
  if (!shouldScan(urlStr)) return null;

  try {
    const url = new URL(urlStr);
    const domain = url.hostname;

    // Check storage cache first
    const { checkedDomains = {} } = await chrome.storage.local.get('checkedDomains');
    if (checkedDomains[domain]) {
      return checkedDomains[domain];
    }

    // Call API
    const { apiBase = 'http://localhost:3000' } = await chrome.storage.local.get('apiBase');
    const requestBody = {
      content: `Scan link safety: ${urlStr}. Domain to check: ${domain}`,
      language: 'en'
    };

    const response = await fetch(`${apiBase}/api/analyze-scam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const verdict = {
      domain,
      riskLevel: data.riskLevel || 'Low',
      probability: data.probability || 0,
      explanation: data.explanation || 'No details provided.',
      recommendedActions: data.recommendedActions || [],
      timestamp: Date.now()
    };

    // Cache the domain assessment
    checkedDomains[domain] = verdict;
    await chrome.storage.local.set({ checkedDomains });

    return verdict;
  } catch (error) {
    console.error('Error scanning domain:', error);
    return null;
  }
}

// Navigation listener to intercept high-risk URLs
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only check main frame navigation
  if (details.frameId !== 0) return;

  const urlStr = details.url;
  if (!shouldScan(urlStr)) return;

  const url = new URL(urlStr);
  const domain = url.hostname;

  // Read cache first to make it instantaneous if we already know it's bad
  const { checkedDomains = {} } = await chrome.storage.local.get('checkedDomains');
  if (checkedDomains[domain]) {
    const cached = checkedDomains[domain];
    if (cached.riskLevel === 'High') {
      const warningUrl = chrome.runtime.getURL(
        `warning.html?url=${encodeURIComponent(urlStr)}&reason=${encodeURIComponent(cached.explanation)}`
      );
      await chrome.tabs.update(details.tabId, { url: warningUrl });
      return;
    }
  }

  // Asynchronously scan the URL in the background. If it turns out to be high risk, redirect
  (async () => {
    const verdict = await checkDomainRisk(urlStr);
    if (verdict && verdict.riskLevel === 'High') {
      // Re-verify the tab is still on that URL or subdomain before redirecting
      const tab = await chrome.tabs.get(details.tabId);
      if (tab && tab.url && tab.url.includes(domain)) {
        const warningUrl = chrome.runtime.getURL(
          `warning.html?url=${encodeURIComponent(tab.url)}&reason=${encodeURIComponent(verdict.explanation)}`
        );
        await chrome.tabs.update(details.tabId, { url: warningUrl });
      }
    }
  })();
});

// Listener for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkUrl') {
    (async () => {
      const verdict = await checkDomainRisk(message.url);
      sendResponse({ verdict });
    })();
    return true; // Keep message channel open for async response
  }
  
  if (message.action === 'getCache') {
    (async () => {
      const { checkedDomains = {} } = await chrome.storage.local.get('checkedDomains');
      sendResponse({ checkedDomains });
    })();
    return true;
  }

  if (message.action === 'clearCache') {
    (async () => {
      await chrome.storage.local.set({ checkedDomains: {} });
      sendResponse({ success: true });
    })();
    return true;
  }
});

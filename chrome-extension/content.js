// content.js

// Short list of scam signatures in URL text/domain
const SCAM_PATTERNS = [
  /kyc-update/i,
  /free-rewards/i,
  /lottery-claim/i,
  /win-iphone/i,
  /part-time-job/i,
  /earn-money-daily/i,
  /secure-login-sbi/i,
  /paytm-verification/i,
  /giftcard-claim/i
];

function checkHeuristic(urlStr) {
  return SCAM_PATTERNS.some(pattern => pattern.test(urlStr));
}

// Add event listener to capture link clicks
document.addEventListener('click', (event) => {
  if (!event.target || typeof event.target.closest !== 'function') return;
  
  const anchor = event.target.closest('a');
  if (!anchor || !anchor.href) return;

  // Ignore clicks with modifiers (Cmd, Ctrl, Shift, Alt) or non-left clicks (button !== 0)
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const urlStr = anchor.href;
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) return;

  // If matches scam heuristic, check safety via background worker or intercept
  if (checkHeuristic(urlStr)) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      // Request background script to verify and cache
      chrome.runtime.sendMessage({ action: 'checkUrl', url: urlStr }, (response) => {
        // Fallback safety if extension context is invalidated or background fails
        if (chrome.runtime.lastError || !response) {
          if (anchor.target === '_blank') {
            window.open(urlStr, '_blank');
          } else {
            window.location.href = urlStr;
          }
          return;
        }

        const verdict = response?.verdict;
        if (verdict && verdict.riskLevel === 'High') {
          const warningUrl = chrome.runtime.getURL(
            `warning.html?url=${encodeURIComponent(urlStr)}&reason=${encodeURIComponent(verdict.explanation)}`
          );
          if (anchor.target === '_blank') {
            window.open(warningUrl, '_blank');
          } else {
            window.location.href = warningUrl;
          }
        } else {
          // Safe or low risk, proceed
          if (anchor.target === '_blank') {
            window.open(urlStr, '_blank');
          } else {
            window.location.href = urlStr;
          }
        }
      });
    } catch {
      // Direct navigation fallback on extension framework failures
      if (anchor.target === '_blank') {
        window.open(urlStr, '_blank');
      } else {
        window.location.href = urlStr;
      }
    }
  }
}, true);

// Scan all anchor tags and flag suspicious ones visually without blocking the main thread
async function scanAndHighlightLinks() {
  const anchors = Array.from(document.querySelectorAll('a[href]'));
  const suspiciousAnchors = [];

  for (const anchor of anchors) {
    const href = anchor.href;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (checkHeuristic(href)) {
        suspiciousAnchors.push(anchor);
      }
    }
  }

  if (suspiciousAnchors.length === 0) return;

  const BATCH_SIZE = 10;
  for (let i = 0; i < suspiciousAnchors.length; i += BATCH_SIZE) {
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        suspiciousAnchors.slice(i, i + BATCH_SIZE).forEach((anchor) => {
          anchor.style.borderBottom = '2px dashed #EF4444';
          anchor.title = 'Warning: This link matches common scam signatures detected by CyberSaathi!';
        });
        resolve();
      });
    });
    
    if (globalThis.scheduler?.yield) {
      await scheduler.yield();
    }
  }
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanAndHighlightLinks);
} else {
  scanAndHighlightLinks();
}

// Watch for DOM changes to scan dynamic links
const observer = new MutationObserver(() => {
  void scanAndHighlightLinks();
});
observer.observe(document.body, { childList: true, subtree: true });

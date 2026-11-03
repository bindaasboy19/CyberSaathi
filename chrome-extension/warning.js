// warning.js

document.addEventListener('DOMContentLoaded', () => {
  // Parse query parameters
  const params = new URLSearchParams(window.location.search);
  const blockedUrl = params.get('url') || 'Unknown site';
  const reason = params.get('reason') || 'This URL matched heuristic signatures of active financial scams or deceptive phishing attempts.';

  document.getElementById('blocked-url').textContent = blockedUrl;
  document.getElementById('threat-reason').textContent = reason;

  // Go back button
  document.getElementById('go-back-btn').addEventListener('click', () => {
    // Go back in history or close tab if no history
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  });

  // Bypass button
  document.getElementById('bypass-btn').addEventListener('click', () => {
    // Navigate anyway
    window.location.href = blockedUrl;
  });
});

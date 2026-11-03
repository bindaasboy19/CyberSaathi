// popup.js

document.addEventListener('DOMContentLoaded', async () => {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Load configured API Base
  const { apiBase = 'http://localhost:3000' } = await chrome.storage.local.get('apiBase');
  document.getElementById('api-base-input').value = apiBase;

  // Save Settings
  document.getElementById('save-settings-btn').addEventListener('click', async () => {
    const inputVal = document.getElementById('api-base-input').value.trim();
    const newBase = inputVal || 'http://localhost:3000';
    await chrome.storage.local.set({ apiBase: newBase });
    
    const btn = document.getElementById('save-settings-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Saved!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  });

  // Clear Cache
  document.getElementById('clear-cache-btn').addEventListener('click', async () => {
    chrome.runtime.sendMessage({ action: 'clearCache' }, (response) => {
      if (response?.success) {
        const btn = document.getElementById('clear-cache-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Cleared!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      }
    });
  });

  // Scan Button Handler
  const scanInput = document.getElementById('scan-input');
  const scanBtn = document.getElementById('scan-btn');
  const loadingMsg = document.getElementById('loading-msg');
  const resultBox = document.getElementById('result-box');

  scanBtn.addEventListener('click', () => {
    const content = scanInput.value.trim();
    if (content.length < 6) {
      alert('Please enter at least 6 characters to analyze.');
      return;
    }

    loadingMsg.style.display = 'block';
    resultBox.style.display = 'none';
    scanBtn.disabled = true;

    // Send check message to background or make direct fetch
    chrome.runtime.sendMessage({ action: 'checkUrl', url: content }, (response) => {
      loadingMsg.style.display = 'none';
      scanBtn.disabled = false;

      const verdict = response?.verdict;
      if (verdict) {
        const score = verdict.probability;
        const riskLevel = verdict.riskLevel;
        const explanation = verdict.explanation;

        const scoreEl = document.getElementById('result-score');
        scoreEl.textContent = `${score}%`;
        
        const verdictEl = document.getElementById('result-verdict');
        verdictEl.textContent = `${riskLevel} RISK`;
        
        // Remove old classes
        verdictEl.className = 'verdict-badge';
        scoreEl.style.borderColor = 'currentColor';

        if (riskLevel === 'High') {
          verdictEl.classList.add('verdict-high');
          scoreEl.style.color = '#ef4444';
        } else if (riskLevel === 'Medium') {
          verdictEl.classList.add('verdict-medium');
          scoreEl.style.color = '#f59e0b';
        } else {
          verdictEl.classList.add('verdict-low');
          scoreEl.style.color = '#10b981';
        }

        document.getElementById('result-explanation').textContent = explanation;

        // Add recommended actions list
        const actionsList = document.getElementById('result-actions');
        actionsList.innerHTML = '';
        
        const actions = verdict.recommendedActions && verdict.recommendedActions.length > 0 
          ? verdict.recommendedActions 
          : ['Do not share personal details.', 'Avoid clicking suspicious links.', 'Report fraud to helpline 1930 immediately.'];
        
        actions.forEach(action => {
          const li = document.createElement('li');
          li.textContent = action;
          actionsList.appendChild(li);
        });

        resultBox.style.display = 'flex';
      } else {
        alert('Failed to connect to CyberSaathi AI analysis server. Make sure the server is running and settings are correct.');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var detectButton = document.getElementById('detectFallacies');
  var statusDiv = document.getElementById('status');
  var resultsDiv = document.getElementById('results');
  var errorDiv = document.getElementById('error');

  detectButton.addEventListener('click', function() {
    statusDiv.textContent = 'Analyzing page content...';
    resultsDiv.textContent = '';
    errorDiv.textContent = '';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, function() {
        if (chrome.runtime.lastError) {
          errorDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
          statusDiv.textContent = '';
        } else {
          chrome.tabs.sendMessage(tabs[0].id, {action: "detect_fallacies"}, function(response) {
            if (chrome.runtime.lastError) {
              errorDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
              statusDiv.textContent = '';
            }
          });
        }
      });
    });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var statusDiv = document.getElementById('status');
  var resultsDiv = document.getElementById('results');
  var errorDiv = document.getElementById('error');

  if (request.action === "analysis_complete") {
    statusDiv.textContent = 'Analysis complete.';
    if (request.fallacies.length > 0) {
      resultsDiv.innerHTML = '<h3>Detected Fallacies:</h3>' + 
        request.fallacies.map(f => `<p><strong>${f.type}:</strong> ${f.text}<br><em>${f.explanation}</em></p>`).join('');
    } else {
      resultsDiv.textContent = 'No logical fallacies detected.';
    }
  } else if (request.action === "analysis_error") {
    statusDiv.textContent = '';
    errorDiv.textContent = 'Error: ' + request.error;
  }
});

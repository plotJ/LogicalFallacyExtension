chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "detect_fallacies") {
    const pageContent = document.body.innerText;
    chrome.runtime.sendMessage({action: "analyze_content", content: pageContent});
    sendResponse({status: "Content sent for analysis"});  // Add this line
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "highlight_fallacies") {
    highlightFallacies(request.fallacies);
  }
});

function highlightFallacies(fallacies) {
  fallacies.forEach(fallacy => {
    const range = document.createRange();
    const startNode = document.evaluate(
      `//text()[contains(., '${fallacy.text}')]`,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (startNode) {
      range.setStart(startNode, startNode.textContent.indexOf(fallacy.text));
      range.setEnd(startNode, startNode.textContent.indexOf(fallacy.text) + fallacy.text.length);

      const span = document.createElement('span');
      span.style.backgroundColor = 'yellow';
      span.title = `Fallacy: ${fallacy.type}\nExplanation: ${fallacy.explanation}`;
      range.surroundContents(span);
    }
  });
}

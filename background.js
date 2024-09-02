chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "analyze_content") {
    analyzeFallacies(request.content)
      .then(fallacies => {
        chrome.tabs.sendMessage(sender.tab.id, {action: "highlight_fallacies", fallacies: fallacies});
        chrome.runtime.sendMessage({action: "analysis_complete", fallacies: fallacies});
      })
      .catch(error => {
        console.error('Error analyzing fallacies:', error);
        chrome.runtime.sendMessage({action: "analysis_error", error: error.message});
      });
  }
});

async function analyzeFallacies(content) {
  const apiKey = 'your_api_key_here';
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {role: "system", content: "ou are a logical fallacy detector specialized in analyzing written content. Your task is to carefully read the provided text and identify any statements that contain logical fallacies. For each fallacy found, return the results as a JSON array of objects, each containing the following fields: \n\n1. 'text': The exact portion of the text that contains the fallacy.\n2. 'type': The specific type of logical fallacy (e.g., Ad Hominem, Straw Man, False Cause, etc.).\n3. 'explanation': A concise and accurate explanation of why this text represents the identified fallacy. \n\nEnsure that your analysis is thorough, focusing only on fallacious reasoning and not merely opinions or factual inaccuracies. Avoid overgeneralizing or misidentifying neutral statements as fallacies. Provide accurate, clear, and contextually appropriate results, and do not include any markdown formatting in your response."},
          {role: "user", content: content}
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    let jsonContent = data.choices[0].message.content;
    
    // Remove any potential markdown code block formatting
    jsonContent = jsonContent.replace(/```json\s?|\s?```/g, '');
    
    // Extract JSON array from the response
    const jsonMatch = jsonContent.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
    } else {
      throw new Error('No JSON array found in the response');
    }
    
    // Attempt to parse the JSON
    try {
      return JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse JSON:', jsonContent);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
  } catch (error) {
    throw new Error(`Failed to analyze fallacies: ${error.message}`);
  }
}

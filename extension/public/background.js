// background.js

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'makeApiRequest') {
    // Handle the API request here for a POST request
    fetch(request.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "question_description": request.questionDescription,
        "user_query": request.userQuery,
        "user_coding_language": request.userLanguage,
        "user_current_solution": request.currentSolution
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Send the API response as a chat message from another user
        chrome.runtime.sendMessage({ type: 'userMessage', message: { id: Date.now(), text: JSON.stringify(data.chat_response).slice(1, -1), isUser: false } });

        // Send the API response back to the original sender
        sendResponse(data);
      })
      .catch((error) => sendResponse({ error: error.message }));

    return true; // To indicate that sendResponse will be called asynchronously
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "showScores") {
        chrome.runtime.sendMessage(request);
    }
});

document.getElementById('showScores').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['content.js']
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "showScores") {
        const scoresContainer = document.getElementById('scores');
        scoresContainer.innerHTML = ''; // Önceki sonuçları temizle
        Object.entries(request.data).forEach(([name, score]) => {
            const scoreElement = document.createElement('div');
            scoreElement.textContent = `${name}: ${score}`;
            scoresContainer.appendChild(scoreElement);
        });
    }
});
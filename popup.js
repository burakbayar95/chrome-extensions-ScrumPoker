document.getElementById('showScores').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['content.js']
        }).catch(error => console.error("Scripting executeScript error:", error));
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "showScores") {
        updatePopupWithScores(request.data);
    }
});

function updatePopupWithScores(scores) {
    const scoresTable = document.getElementById('scoresTable');
    const scoresBody = document.getElementById('scoresBody');
    scoresBody.innerHTML = '';
    Object.entries(scores).forEach(([name, score]) => {
        const row = scoresBody.insertRow(-1);
        const cellName = row.insertCell(0);
        const cellScore = row.insertCell(1);
        cellName.textContent = name;
        cellScore.textContent = score;
    });
    scoresTable.style.display = 'table';
}

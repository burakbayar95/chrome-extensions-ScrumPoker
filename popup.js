let intervalId, timeoutId;

document.getElementById('startButton').addEventListener('click', function() {
    this.disabled = true;
    document.getElementById('timerAndTable').style.display = 'block';

    // Immediately fetch and update scores
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['content.js']
        });
    });

    // Start timer for 5 minutes
    const duration = 5 * 60;
    let elapsed = 0;
    updateTimer(duration);

    timeoutId = setInterval(function() {
        elapsed++;
        updateTimer(duration - elapsed);
        if (elapsed >= duration) {
            clearInterval(intervalId);
            clearInterval(timeoutId);
            document.getElementById('startButton').disabled = false;
            alert('Scanning complete!');
        }
    }, 1000);

    // Continue fetching every 3 seconds
    intervalId = setInterval(function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ['content.js']
            });
        });
    }, 3000);
});

function updateTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    document.getElementById('timer').textContent = `${pad(minutes)}:${pad(sec)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "showScores") {
        const scoresBody = document.getElementById('scoresBody');
        scoresBody.innerHTML = '';
        Object.entries(request.data).forEach(([name, score]) => {
            const row = scoresBody.insertRow();
            row.insertCell().textContent = name;
            row.insertCell().textContent = score;
        });
    }
});

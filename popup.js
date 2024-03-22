let intervalId, timeoutId;

document.getElementById('startButton').addEventListener('click', function() {
    // Taramayı başlat
    fetchAndUpdateScores();
    intervalId = setInterval(fetchAndUpdateScores, 3000); // Her 3 saniyede bir güncelle

    // Sayaç için
    let remainingTime = 5 * 60; // 5 dakika
    updateTimer(remainingTime);
    timeoutId = setInterval(function() {
        remainingTime -= 1;
        updateTimer(remainingTime);
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            clearInterval(timeoutId);
            alert('Tarama tamamlandı!');
        }
    }, 1000);
});

function fetchAndUpdateScores() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['content.js']
        });
    });
}

function updateTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    document.getElementById('timer').textContent = `${pad(minutes)}:${pad(sec)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "showScores") {
        updatePopupWithScores(request.data);
    }
});

function updatePopupWithScores(scores) {
    const scoresBody = document.getElementById('scoresBody');
    scoresBody.innerHTML = ''; // Önceki sonuçları temizle
    Object.entries(scores).forEach(([name, score]) => {
        const row = scoresBody.insertRow(-1);
        const cellName = row.insertCell(0);
        const cellScore = row.insertCell(1);
        cellName.textContent = name;
        cellScore.textContent = score;
    });
}

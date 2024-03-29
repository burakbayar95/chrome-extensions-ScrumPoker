let intervalId;
const scoresTable = document.getElementById('scoresTable');
const themeSwitcher = document.getElementById('themeSwitcher');
const langSwitcher = document.getElementById('langSwitcher');
const body = document.body;


const texts = {
    en: {
        themeButtonText: "Dark/Light",
        langButtonText: "TR/EN",
        nameColumn: "Name",
        scoreColumn: "Score"
    },
    tr: {
        themeButtonText: "Koyu/Açık",
        langButtonText: "TR/EN",
        nameColumn: "İsim",
        scoreColumn: "Puan"
    }
};
let currentLang = localStorage.getItem("pokerLanguage") ?? 'en';
let currentTheme =  localStorage.getItem("pokerTheme") ?? 'light-theme';
body.className = currentTheme

function updateLanguage(lang) {
    localStorage.setItem("pokerLanguage", lang);
    currentLang = lang;
    document.getElementById('themeSwitcher').innerText = texts[currentLang].themeButtonText;
    document.getElementById('langSwitcher').innerText = texts[currentLang].langButtonText;
    document.querySelector('#scoresTable thead tr th:first-child').innerText = texts[currentLang].nameColumn;
    document.querySelector('#scoresTable thead tr th:last-child').innerText = texts[currentLang].scoreColumn;
}

function toggleTheme() {
    currentTheme  = currentTheme == 'dark-theme' ? 'light-theme' : 'dark-theme';
    body.className = currentTheme
    localStorage.setItem("pokerTheme", currentTheme);
}

function fetchAndUpdateScores() {
    if (chrome.tabs && chrome.scripting) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
            });
        });
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "showScores") {
        const tbody = document.querySelector('#scoresTable tbody');
        tbody.innerHTML = ''; 
        Object.entries(request.data).forEach(([name, score]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${name}</td><td>${score}</td>`;
            tbody.appendChild(tr);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    updateLanguage(currentLang);
    fetchAndUpdateScores();
    intervalId = setInterval(fetchAndUpdateScores, 3000);
});

themeSwitcher.addEventListener('click', toggleTheme);
langSwitcher.addEventListener('click', () => updateLanguage(currentLang === 'en' ? 'tr' : 'en'));

window.addEventListener('blur', function() {
    clearInterval(intervalId);
});

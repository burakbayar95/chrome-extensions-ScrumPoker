var names = Array.prototype.map.call(document.querySelectorAll(".mat-column-displayName"), e => e.textContent.trim()).slice(1);
var scores = Array.prototype.map.call(document.querySelectorAll(".flip-card-back > span"), e => e.textContent.trim());
var result = names.reduce((obj, name, index) => {
    let score = scores[index] || "-";
    if (name) {
        obj[name] = score;
    }
    return obj;
}, {});

chrome.runtime.sendMessage({action: "showScores", data: result});

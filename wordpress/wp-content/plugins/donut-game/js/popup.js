document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById('game-popup');

    popup.style.display = 'flex';
    var startButton = document.getElementById('start-button');

    startButton.onclick = function() {
        popup.style.display = 'none';
        setTimeout(function() {
            window.character.run();
        }, 500);
    };
});

function openPopup() {
    document.getElementById('end-game-popup').style.display = 'flex';
}
function closePopup() {
    document.getElementById('end-game-popup').style.display = 'none';
    setTimeout(function() {
        window.character.run();
    }, 500);
}

(() => {
    "use strict";
    
    class Terrain {
        constructor() {
            this.rockMinOffset = 270;
            this.rockMaxOffset = 920;
            this.minRockSize = 40;
            this.maxRockSize = 85;
            this.rockClass = ".rock";
    
            this.rock = document.querySelector(this.rockClass);
            this.init();
        }

        init() {
            this.rockPosition = this.getRandomPosition(this.rockMinOffset, this.rockMaxOffset);
            this.rockSize = this.getRandomPosition(this.minRockSize, this.maxRockSize);
            this.rock.style.left = this.rockPosition.toString() + "px";
            this.rock.style.width = this.rockSize.toString() + "px";
            this.rock.style.height = this.rockSize.toString() + "px";
        }
    
        getRandomPosition(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);
        }
    }
    
    class Character {
        constructor(terrain, result) {
            this.characterClass = ".donut";
            this.annotationClass = ".annotation";
            this.annotationXPos = 50;
            this.annotationYPos = 320;
            this.isRunning = false;
            this.isJumping = false;
            this.isWin = false;
            this.characterPosition = 0;
            this.jumpStartPosition = 0;
            this.startTime = 0;
            this.runTime = 0;
            this.terrain = terrain;
            this.result = result;
    
            this.donut = document.querySelector(this.characterClass);
            this.characterAnnotation = document.querySelector(this.annotationClass);
        }
    
        run() {
            if (!this.isRunning) {
                this.donut.classList.add("running");
                this.startTime = performance.now();
                this.isRunning = setInterval(() => {
                    const collided = this.collide(this.donut, this.terrain.rock);
    
                    if (this.isWin || collided) {
                        this.stop();
                        this.runTime = performance.now() - this.startTime;
                        const result = collided ? "Ouch!" : "Yay!";
                        this.updateResults(result);
                        this.donut.style.left = "0px";
                        this.characterAnnotation.style.left = this.annotationXPos + "px";
    
                        window.character = new Character(new Terrain(), this.result);
                    } else {
                        let leftPos = parseInt(this.getProp("left"));
                        this.characterPosition = leftPos + 2;
                        this.characterAnnotation.style.left = (this.characterPosition + 50) + "px";
                        this.donut.style.left = this.characterPosition + "px";
    
                        const rockLeft = parseInt(this.terrain.rock.style.left);
                        const distanceToRock = rockLeft - this.characterPosition;
                        if (distanceToRock < 120 && distanceToRock > 0 && !this.isJumping) {
                            this.jump();
                        }
    
                        if (this.characterPosition >= 1020) {
                            this.stop();
                            this.isWin = true;
                            const result = "Yay!";
                            this.updateResults(result);
    
                            this.characterAnnotation.style.left = this.annotationXPos + "px";
                            this.donut.style.left = "0px";
                            window.character = new Character(new Terrain(), this.result);
    
                            setTimeout(() => {
                                this.annotate(result);
                            }, 10);
                        }
                    }
                }, 10);
            }
        }
    
        stop() {
            if (this.isRunning) {
                clearInterval(this.isRunning);
                this.isRunning = false;
                this.donut.classList.remove("running");
            }
        }
    
        jump() {
            if (!this.isJumping) {
                const groundLevel = parseInt(this.getProp("bottom"));
                const maxHeight = this.terrain.rockSize + 90;
                let currentHeight = groundLevel;
                let descending = false;
    
                this.jumpStartPosition = this.characterPosition;
                this.isJumping = setInterval(() => {
                    let bottomPos = parseInt(this.donut.style.bottom);
                    if (!descending) {
                        currentHeight = bottomPos + 15 >= groundLevel + maxHeight ? bottomPos + 2 : bottomPos + 3;
                        this.donut.style.bottom = currentHeight + "px";
                        this.characterAnnotation.style.bottom = (currentHeight + 160) + "px";
                        if (bottomPos + 2 >= groundLevel + maxHeight) descending = true;
                    } else {
                        currentHeight = bottomPos - 30 <= groundLevel ? bottomPos - 4 : bottomPos - 3;
                        this.donut.style.bottom = currentHeight + "px";
                        this.characterAnnotation.style.bottom = (currentHeight + 160) + "px";
    
                        if (bottomPos <= groundLevel) {
                            clearInterval(this.isJumping);
                            this.isJumping = false;
                            this.characterAnnotation.style.bottom = (groundLevel + 160) + "px";
                            this.donut.style.bottom = groundLevel + "px";
                        }
                    }
                }, 10);
            }
        }
    
        annotate(message) {
            this.characterAnnotation.style.opacity = "1";
            this.characterAnnotation.querySelector(".annotation-wrapper").innerText = message;
    
            setTimeout(() => {
                this.characterAnnotation.style.opacity = "0";
            }, 5000);
        }
    
        getProp(property) {
            return getComputedStyle(this.donut).getPropertyValue(property);
        }
    
        collide(donut, rock) {
            const donutRect = donut.getBoundingClientRect();
            const rockRect = rock.getBoundingClientRect();
    
            return !(donutRect.top - 20 > rockRect.bottom + 30 ||
                donutRect.right - 20 < rockRect.left + 30 ||
                donutRect.bottom - 20 < rockRect.top + 30 ||
                donutRect.left - 20 > rockRect.right - 50);
        }
    
        updateResults(result) {
            this.runTime = performance.now() - this.startTime;
            const resultData = {
                obstaclePosition: this.terrain.rockPosition,
                runTime: (this.runTime / 1000).toFixed(2) + "s",
                jumpDistance: this.jumpStartPosition,
                rockSize: this.terrain.rockSize,
                runResult: result === "Ouch!" ? "Провал" : "Успех"
            };
        
            this.result.addResult(resultData);
            window.saveGameResult(resultData);
        }
        
    }

    class Result {
        constructor() {
            this.results = [];
        }
    
        addResult(resultData) {
            this.results.push(resultData);
            this.updateUI(resultData);
        }
    
        updateUI(resultData) {
            const elements = {
                "rock-position": resultData.obstaclePosition,
                "run-time": resultData.runTime,
                "jump-distance": resultData.jumpDistance,
                "rock-size": resultData.rockSize,
                "run-result": resultData.runResult,
                "popup-result-title": resultData.runResult === "Провал" ? "Game Over :(" : "Финиш!"
            };
    
            for (const [id, value] of Object.entries(elements)) {
                document.getElementById(id).textContent = value;
            }
    
            window.popup.showEndPopup(); // Assuming you have a popup object defined somewhere.
        }
    
        async saveGameResult(data) {
            try {
                const response = await fetch(gameResultAjax.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        action: 'save_game_result',
                        obstacle_position: data.obstaclePosition,
                        run_time: data.runTime,
                        jump_distance: data.jumpDistance,
                        obstacle_size: data.rockSize,
                        run_result: data.runResult,
                        _ajax_nonce: gameResultAjax.nonce
                    })
                });
    
                const result = await response.json();
                console.log(result);
                this.updateGameResults();
            } catch (error) {
                console.error(error);
            }
        }
    
        async updateGameResults() {
            try {
                const response = await fetch(gameResultAjax.ajax_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        action: 'get_game_results',
                        _ajax_nonce: gameResultAjax.nonce
                    })
                });
    
                const data = await response.json();
                if (data.success) {
                    const results = data.data;
                    let tableHtml = `
                        <thead>
                            <tr>
                                <th>Время забега</th>
                                <th>Позиция препятствия</th>
                                <th>Дистанция прыжка</th>
                                <th>Размер препятствия</th>
                                <th>Результат</th>
                            </tr>
                        </thead>
                    `;
    
                    results.sort((a, b) => parseFloat(a.run_time) - parseFloat(b.run_time)).forEach(result => {
                        tableHtml += `
                            <tr>
                                <td>${result.run_time} s</td>
                                <td>${result.obstacle_position}</td>
                                <td>${result.jump_distance}</td>
                                <td>${result.obstacle_size}</td>
                                <td>${result.run_result}</td>
                            </tr>
                        `;
                    });
    
                    document.querySelector('.game-results-table').innerHTML = tableHtml;
                } else {
                    console.error('Error:', data.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const result = new Result();
        window.saveGameResult = (data) => {
            result.saveGameResult(data);
        };
        result.updateGameResults();
    });
    
    class Popup {
        constructor() {
            this.gamePopup = document.getElementById('game-popup');
            this.endGamePopup = document.getElementById('end-game-popup');
            this.startButton = document.getElementById('start-button');
        }

        showStartPopup() {
            this.gamePopup.style.display = 'flex';
            this.startButton.onclick = () => {
                this.gamePopup.style.display = 'none';
                setTimeout(() => {
                    window.character.run();
                }, 500);
            };
        }

        showEndPopup() {
            this.endGamePopup.style.display = 'flex';
        }

        closeEndPopup() {
            this.endGamePopup.style.display = 'none';
            setTimeout(() => {
                window.character.run();
            }, 500);
        }
    }

    class GameInit {
        constructor() {
            this.terrain = new Terrain();
            this.result = new Result();
            this.character = new Character(this.terrain, this.result);
            this.popup = new Popup();
            this.initEventListeners();
        }
        
        initEventListeners() {
            document.addEventListener("keyup", (event) => {
                if (event.code === "Space") {
                    this.character.jump();
                }
                if (event.code === "KeyS") {
                    this.character.stop();
                } else if (event.code === "KeyD") {
                    this.character.run();
                }
            });
        }

        start() {
            this.popup.showStartPopup();
            window.character = this.character;
            window.terrain = this.terrain;
            window.result = this.result;
            window.popup = this.popup; // Adding the Popup instance to the global window object
        }
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        const game = new GameInit();
        game.start();
    });
})();

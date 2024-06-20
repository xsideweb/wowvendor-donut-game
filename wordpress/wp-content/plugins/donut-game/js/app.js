(() => {
    "use strict";

    var TerrainModule, CharacterModule;
    var modules = {
        142: (module, exports, require) => {
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.Character = void 0;

            const Terrain = require(98).Terrain;

            class Character {
                constructor() {
                    this.characterClass = ".donut";
                    this.annotationClass = ".annotation";
                    this.annotationXPos = 50;
                    this.annotationYPos = 320;
                    this.isRunning = false;
                    this.isJumping = false;
                    this.isWin = false;
                    this.characterPosition = 0;
                    this.jumpStartPosition = 0;
                    // Время забега
                    this.startTime = 0;
                    this.runTime = 0;

                    this.donut = document.querySelector(this.characterClass);
                    this.characterAnnotation = document.querySelector(this.annotationClass);
                }

                run() {
                    if (this.isRunning === false) {
                        this.donut.classList.add("running");
                        // Начало отсчёта времени
                        this.startTime = performance.now();
                        this.isRunning = setInterval(() => {
                            const collided = this.collide(this.donut, window.terrain.rock);

                            if (this.isWin || collided) {
                                this.stop();
                                // Рассчёт времени забега
                                this.runTime = performance.now() - this.startTime;
                                this.updateResults(collided ? "Ouch!" : "Yay!");
                                this.donut.style.left = "0px";
                                this.characterAnnotation.style.left = this.annotationXPos + "px";
                                window.character = new Character();
                                window.terrain = new Terrain();
                            } else {
                                let leftPos = parseInt(this.getProp("left"));
                                this.characterPosition = leftPos + 2;
                                this.characterAnnotation.style.left = (this.characterPosition + 50) + "px";
                                this.donut.style.left = this.characterPosition + "px";

                                // Проверка расстояния до препятствия для автоматического прыжка
                                const rockLeft = parseInt(window.terrain.rock.style.left);
                                const distanceToRock = rockLeft - this.characterPosition;
                                if (distanceToRock < 120 && distanceToRock > 0 && !this.isJumping) {
                                    this.jump();
                                }

                                if (this.characterPosition >= 1020) {
                                    this.stop();
                                    this.isWin = true;
                                    this.updateResults("Yay!");

                                    this.characterAnnotation.style.left = this.annotationXPos + "px";
                                    this.donut.style.left = "0px";
                                    window.character = new Character();
                                    window.terrain = new Terrain();

                                    setTimeout(() => {
                                        this.annotate("Yay!");
                                    }, 10);
                                }
                            }
                        }, 10);
                    }
                }

                stop() {
                    if (this.isRunning !== false) {
                        clearInterval(this.isRunning);
                        this.isRunning = false;
                        this.donut.classList.remove("running");
                    }
                }

                jump() {
                    if (this.isJumping === false) {
                        const groundLevel = parseInt(this.getProp("bottom"));
                        const maxHeight = window.terrain.rockSize + 90;
                        let currentHeight = groundLevel;
                        let descending = false;

                        // Сохраняем позицию прыжка
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
                    document.getElementById("rock-position").textContent = window.terrain.rockPosition;

                    if (this.isWin) {
                        this.runTime = performance.now() - this.startTime;
                    }

                    document.getElementById("run-time").textContent = (this.runTime / 1000).toFixed(2) + "s";
                    document.getElementById("jump-distance").textContent = this.jumpStartPosition;
                    document.getElementById("rock-size").textContent = window.terrain.rockSize;
                    document.getElementById("run-result").textContent = result === "Ouch!" ? "провал" : "успех";
                    document.getElementById("popup-result-title").textContent = result === "Ouch!" ? "Game Over :(" : "Финиш!";

                    const resultData = {
                        obstaclePosition: window.terrain.rockPosition,
                        runTime: (this.runTime / 1000).toFixed(2) + "s",
                        jumpDistance: this.jumpStartPosition,
                        obstacleSize: window.terrain.rockSize,
                        runResult: result === "Ouch!" ? "Провал" : "Успех"
                    };
                
                    window.saveGameResult(resultData);

                    openPopup();
                }
            }

            exports.Character = Character;
        },

        98: (module, exports) => {
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.Terrain = void 0;

            class Terrain {
                constructor() {
                    this.rockMinOffset = 270;
                    this.rockMaxOffset = 920;
                    this.minRockSize = 40;
                    this.maxRockSize = 85;
                    this.rockClass = ".rock";

                    this.rock = document.querySelector(this.rockClass);
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
            exports.Terrain = Terrain;
        }
    };

    // Загружаем модули
    var instantiatedModules = {};
    function require(moduleId) {
        if (instantiatedModules[moduleId]) return instantiatedModules[moduleId].exports;
        var moduleInstance = instantiatedModules[moduleId] = { exports: {} };
        modules[moduleId](moduleInstance, moduleInstance.exports, require);
        return moduleInstance.exports;
    }
    TerrainModule = require(98);
    CharacterModule = require(142);

    
    document.addEventListener("DOMContentLoaded", () => {
        window.character = new CharacterModule.Character();
        window.terrain = new TerrainModule.Terrain();
        /* 
        document.addEventListener("keyup", (event) => {
            if (event.code === "Space") {
                window.character.jump();
            } 
            if (event.code === "KeyS") {
                window.character.stop();
            } else if (event.code === "KeyD") {
                window.character.run();
            }
        });
        */
    });
    
})();

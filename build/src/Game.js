"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var fixtures_1 = require("./fixtures");
var Game = /** @class */ (function () {
    function Game(userInterface) {
        var _this = this;
        this.snake = [];
        this.timer = null;
        this.point = { x: 0, y: 0 };
        this.score = 0;
        this.isChangingDirection = false;
        this.currentDirection = fixtures_1.DIRECTION.RIGHT;
        this.init = function () {
            _this.snake = [];
            _this.point = { x: 0, y: 0 };
            _this.score = 0;
        };
        this.createPoint = function () {
            _this.point.x = _this.generateRandomCoord(0, _this.userInterface.gameContainer.width - 1);
            _this.point.y = _this.generateRandomCoord(1, _this.userInterface.gameContainer.height - 1);
            _this.snake.forEach(function (segment) {
                if (segment.x === _this.point.x && segment.y === _this.point.y) {
                    _this.createPoint();
                }
            });
        };
        this.generateRandomCoord = function (min, max) {
            return Math.round(Math.random() * (max - min) + min);
        };
        this.changeDirection = function (_, key) {
            if ((key.name === fixtures_1.DIRECTION.UP || key.name === 'w') && _this.currentDirection !== fixtures_1.DIRECTION.DOWN) {
                _this.currentDirection = fixtures_1.DIRECTION.UP;
            }
            if ((key.name === fixtures_1.DIRECTION.DOWN || key.name === 's') && _this.currentDirection !== fixtures_1.DIRECTION.UP) {
                _this.currentDirection = fixtures_1.DIRECTION.DOWN;
            }
            if ((key.name === fixtures_1.DIRECTION.LEFT || key.name === 'a') && _this.currentDirection !== fixtures_1.DIRECTION.RIGHT) {
                _this.currentDirection = fixtures_1.DIRECTION.LEFT;
            }
            if ((key.name === fixtures_1.DIRECTION.RIGHT || key.name === 'd') && _this.currentDirection !== fixtures_1.DIRECTION.LEFT) {
                _this.currentDirection = fixtures_1.DIRECTION.RIGHT;
            }
        };
        this.tick = function () {
            if (_this.isGameOver()) {
                _this.showGameOverScreen();
                clearInterval(_this.timer);
                _this.timer = null;
                return;
            }
            _this.isChangingDirection = false;
            _this.userInterface.clearScreen();
            _this.drawPoint();
            _this.moveSnake();
            _this.drawSnake();
            _this.userInterface.render();
        };
        this.reset = function () {
            // Set up initial state
            _this.snake = [];
            for (var i = fixtures_1.INITIAL_SNAKE_SIZE; i >= 0; i--) {
                _this.snake[fixtures_1.INITIAL_SNAKE_SIZE - i] = { x: i, y: 0 };
            }
            _this.point = { x: 0, y: 0 };
            _this.score = 0;
            _this.currentDirection = fixtures_1.DIRECTION.RIGHT;
            _this.isChangingDirection = false;
            _this.timer = null;
            // Generate the first dot before the game begins
            _this.createPoint();
            _this.userInterface.resetScore();
            _this.userInterface.render();
        };
        this.start = function () {
            if (!_this.timer) {
                _this.reset();
                _this.timer = setInterval(_this.tick, fixtures_1.GAME_SPEED);
            }
        };
        this.quit = function () {
            process.exit(0);
        };
        this.userInterface = userInterface;
        this.init();
        this.userInterface.bindHandlers(this.changeDirection, this.quit, this.start);
        this.userInterface.render();
    }
    Game.prototype.drawSnake = function () {
        var _this = this;
        // Render each snake segment as a pixel
        this.snake.forEach(function (segment) {
            _this.userInterface.draw(segment, fixtures_1.SNAKE_COLOR);
        });
    };
    Game.prototype.drawPoint = function () {
        // Render the dot as a pixel
        this.userInterface.draw(this.point, fixtures_1.POINT_COLOR);
    };
    Game.prototype.moveSnake = function () {
        if (this.isChangingDirection) {
            return;
        }
        this.isChangingDirection = true;
        // Move the head forward by one pixel based on velocity
        var head = {
            x: this.snake[0].x + fixtures_1.DIRECTIONS[this.currentDirection].x,
            y: this.snake[0].y + fixtures_1.DIRECTIONS[this.currentDirection].y,
        };
        this.snake.unshift(head);
        // If the snake lands on a dot, increase the score and generate a new dot
        if (this.snake[0].x === this.point.x && this.snake[0].y === this.point.y) {
            this.score++;
            this.userInterface.updateScore(this.score);
            this.createPoint();
        }
        else {
            // Otherwise, slither
            this.snake.pop();
        }
    };
    Game.prototype.isGameOver = function () {
        var _this = this;
        // If the snake collides with itself, end the game
        var isColliding = this.snake
            // Filter out the head
            .filter(function (_, i) { return i > 0; })
            // If head collides with any segment, collision
            .some(function (segment) { return segment.x === _this.snake[0].x && segment.y === _this.snake[0].y; });
        return (isColliding ||
            // Right wall
            this.snake[0].x >= this.userInterface.gameContainer.width - 1 ||
            // Left wall
            this.snake[0].x <= -1 ||
            // Top wall
            this.snake[0].y >= this.userInterface.gameContainer.height - 1 ||
            // Bottom wall
            this.snake[0].y <= -1);
    };
    Game.prototype.showGameOverScreen = function () {
        this.userInterface.gameOverScreen();
        this.userInterface.render();
    };
    return Game;
}());
exports.Game = Game;

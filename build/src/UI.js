"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UI = void 0;
var blessed_1 = __importDefault(require("blessed"));
var UI = /** @class */ (function () {
    function UI() {
        var _this = this;
        this.bindHandlers = function (keyPressHandler, quitHandler, enterHandler) {
            // Event to handle keypress i/o
            _this.screen.on('keypress', keyPressHandler);
            _this.screen.key(['escape', 'q', 'C-c'], quitHandler);
            _this.screen.key(['enter'], enterHandler);
        };
        this.createGameBox = function () {
            return {
                parent: _this.screen,
                top: 1,
                left: 0,
                width: '100%',
                height: '100%-1',
                style: {
                    fg: 'black',
                    bg: 'gray',
                },
            };
        };
        this.createScoreBox = function () {
            return {
                parent: _this.screen,
                top: 0,
                left: 'left',
                width: '100%',
                height: 1,
                tags: true,
                style: {
                    fg: 'white',
                    bg: 'blue',
                },
            };
        };
        this.draw = function (coord, color) {
            _this.blessed.box({
                parent: _this.gameContainer,
                top: coord.y,
                left: coord.x,
                width: 1,
                height: 1,
                style: {
                    fg: color,
                    bg: color,
                },
            });
        };
        this.gameOverScreen = function () {
            _this.gameContainer = _this.blessed.box(_this.gameOverBox);
        };
        this.clearScreen = function () {
            _this.gameContainer.detach();
            _this.gameContainer = _this.blessed.box(_this.gameBox);
        };
        this.updateScore = function (score) {
            _this.scoreContainer.setLine(0, "{bold}Score:{/bold} " + score);
        };
        this.resetScore = function () {
            _this.scoreContainer.detach();
            _this.scoreContainer = _this.blessed.box(_this.scoreBox);
            _this.updateScore(0);
        };
        this.render = function () {
            _this.screen.render();
        };
        this.blessed = blessed_1.default;
        this.screen = blessed_1.default.screen();
        this.screen.title = 'TurboWonsz';
        this.gameBox = this.createGameBox();
        this.scoreBox = this.createScoreBox();
        this.gameOverBox = this.createGameOverBox();
        this.gameContainer = this.blessed.box(this.gameBox);
        this.scoreContainer = this.blessed.box(this.scoreBox);
    }
    UI.prototype.createGameOverBox = function () {
        return {
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: 20,
            height: 6,
            tags: true,
            valign: 'middle',
            content: "{center}Game Over!\n\nPress enter to try again{/center}",
            border: {
                type: 'line',
            },
            style: {
                fg: 'black',
                bg: 'magenta',
                border: {
                    fg: '#ffffff',
                },
            },
        };
    };
    return UI;
}());
exports.UI = UI;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POINT_COLOR = exports.SNAKE_COLOR = exports.INITIAL_SNAKE_SIZE = exports.GAME_SPEED = exports.DIRECTION = exports.DIRECTIONS = void 0;
exports.DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 },
};
var DIRECTION;
(function (DIRECTION) {
    DIRECTION["UP"] = "up";
    DIRECTION["DOWN"] = "down";
    DIRECTION["LEFT"] = "left";
    DIRECTION["RIGHT"] = "right";
})(DIRECTION = exports.DIRECTION || (exports.DIRECTION = {}));
exports.GAME_SPEED = 50;
exports.INITIAL_SNAKE_SIZE = 12;
exports.SNAKE_COLOR = '#0000ff';
exports.POINT_COLOR = 'red';

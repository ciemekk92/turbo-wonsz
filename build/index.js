"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./src/Game");
var UI_1 = require("./src/UI");
var game = new Game_1.Game(new UI_1.UI());
game.start();

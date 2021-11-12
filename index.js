"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var appScreen = blessed_1.default.screen({ smartCSR: true });
var box = blessed_1.default.box({
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%',
    style: {
        bg: 'red',
        border: {
            fg: 'white',
        },
    },
});
appScreen.append(box);
appScreen.render();

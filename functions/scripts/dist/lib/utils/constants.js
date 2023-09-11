"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = exports.failureIcon = exports.successIcon = void 0;
const emoji = require('node-emoji');
const rightArrow = emoji.get('arrow_right');
const id = emoji.get('id');
const bank = emoji.get('bank');
const user = emoji.get('ghost');
exports.successIcon = emoji.get('sunglasses');
exports.failureIcon = emoji.get('cry');
exports.questions = [
    `${bank} Please enter full path to your Service Account json file\n\n${rightArrow}   `,
    `\n${id} Please enter user's uid you want to update\n\n${rightArrow}    `,
    `\n${user} Please enter user's new role?\n\n${rightArrow}   `,
];

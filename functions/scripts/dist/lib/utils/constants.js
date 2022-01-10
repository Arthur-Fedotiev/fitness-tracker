"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = exports.failureIcon = exports.successIcon = void 0;
var emoji = require('node-emoji');
var rightArrow = emoji.get('arrow_right');
var id = emoji.get('id');
var bank = emoji.get('bank');
var user = emoji.get('ghost');
exports.successIcon = emoji.get('sunglasses');
exports.failureIcon = emoji.get('cry');
exports.questions = [
    "".concat(bank, " Please enter full path to your Service Account json file\n\n").concat(rightArrow, "   "),
    "\n".concat(id, " Please enter user's uid you want to update\n\n").concat(rightArrow, "    "),
    "\n".concat(user, " Please enter user's new role?\n\n").concat(rightArrow, "   "),
];

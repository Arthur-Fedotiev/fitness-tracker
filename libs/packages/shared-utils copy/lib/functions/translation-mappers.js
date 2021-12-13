"use strict";
exports.__esModule = true;
exports.mapTranslatedData = void 0;
var translation_consts_1 = require("../constants/translation.consts");
var extractDataForLangCode = function (langCode, data) {
    return function (acc, translatedKey) {
        acc[translatedKey] = data[translatedKey][langCode];
        return acc;
    };
};
var mapTranslatedData = function (data) {
    var translatedKeys = Object.keys(data);
    return translation_consts_1.LANG_CODES.reduce(function (acc, langCode) {
        acc[langCode] = translatedKeys.reduce(extractDataForLangCode(langCode, data), {});
        return acc;
    }, {});
};
exports.mapTranslatedData = mapTranslatedData;

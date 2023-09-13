"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTranslatedData = void 0;
const translation_consts_1 = require("../constants/translation.consts");
const identity = (data) => data;
const extractDataForLangCode = (langCode, data, transformersMap = {}) => (acc, translatedKey) => {
    const transformer = transformersMap[translatedKey] ?? identity;
    acc[translatedKey] = transformer(data[translatedKey][langCode]);
    return acc;
};
const mapTranslatedData = (data, transformersMap = {}) => {
    const translatedKeys = Object.keys(data);
    return translation_consts_1.LANG_CODES.reduce((acc, langCode) => {
        acc[langCode] = translatedKeys.reduce(extractDataForLangCode(langCode, data, transformersMap), {});
        return acc;
    }, {});
};
exports.mapTranslatedData = mapTranslatedData;
//# sourceMappingURL=translation-mappers.js.map
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = exports.I18n = exports.defaultVocabularies = void 0;
var vocabularyDe = require("./languages/de.json");
var vocabularyEn = require("./languages/en.json");
var vocabularyEs = require("./languages/es.json");
var vocabularyFr = require("./languages/fr.json");
var vocabularyNl = require("./languages/nl.json");
var vocabularyPt = require("./languages/pt.json");
var EventDispatcher_1 = require("../EventDispatcher");
exports.defaultVocabularies = {
    de: vocabularyDe,
    en: vocabularyEn,
    es: vocabularyEs,
    fr: vocabularyFr,
    nl: vocabularyNl,
    pt: vocabularyPt,
};
var defaultLocalizationConfig = {
    language: 'en',
    vocabularies: exports.defaultVocabularies,
    events: {
        onLanguageChanged: new EventDispatcher_1.EventDispatcher(),
    },
};
/**
 * @category Localization
 */
var I18n = /** @class */ (function () {
    function I18n(config) {
        this.setConfig(config);
    }
    I18n.prototype.setConfig = function (config) {
        this.config = __assign(__assign({}, defaultLocalizationConfig), config);
        var detectBrowserLanguage = this.config.language === 'auto';
        this.vocabularies = this.mergeVocabulariesWithDefaultVocabularies(this.config.vocabularies);
        this.initializeLanguage(this.config.language, detectBrowserLanguage, this.vocabularies);
        this.defaultLanguage = this.resolveDefaultLanguage(this.language);
        if (!I18n.containsLanguage(this.vocabularies, this.language)) {
            this.language = this.defaultLanguage;
        }
        this.initializeVocabulary(this.vocabularies);
    };
    I18n.prototype.getConfig = function () {
        return this.config;
    };
    I18n.prototype.setLanguage = function (language) {
        var oldLanguage = this.language;
        if (I18n.containsLanguage(this.vocabularies, language)) {
            this.language = language;
        }
        else if (I18n.containsLanguage(this.vocabularies, language.slice(0, 2))) {
            this.language = language.slice(0, 2);
        }
        else {
            this.language = this.defaultLanguage;
        }
        this.initializeVocabulary(this.vocabularies);
        if (this.language !== oldLanguage) {
            this.config.events.onLanguageChanged.dispatch(this, { newLanguage: this.language, oldLanguage: oldLanguage });
        }
    };
    I18n.containsLanguage = function (vocabularies, language) {
        return vocabularies.hasOwnProperty(language);
    };
    I18n.prototype.resolveDefaultLanguage = function (language) {
        if (I18n.containsLanguage(this.vocabularies, language)) {
            return language;
        }
        if (I18n.containsLanguage(this.vocabularies, 'en')) {
            return 'en';
        }
        var availableLanguages = Object.keys(this.vocabularies);
        return availableLanguages.length > 0 ? availableLanguages[0] : 'en';
    };
    I18n.prototype.mergeVocabulariesWithDefaultVocabularies = function (vocabularies) {
        if (vocabularies === void 0) { vocabularies = {}; }
        var rawVocabularies = __assign(__assign({}, exports.defaultVocabularies), vocabularies);
        return Object.keys(rawVocabularies).reduce(function (mergedVocabularies, language) {
            var _a;
            var vocabulary = rawVocabularies[language];
            if (I18n.containsLanguage(exports.defaultVocabularies, language) && I18n.containsLanguage(vocabularies, language)) {
                vocabulary = __assign(__assign({}, exports.defaultVocabularies[language]), vocabularies[language]);
            }
            return __assign(__assign({}, mergedVocabularies), (_a = {}, _a[language] = vocabulary, _a));
        }, {});
    };
    I18n.prototype.initializeLanguage = function (language, browserLanguageDetectionEnabled, vocabularies) {
        if (browserLanguageDetectionEnabled) {
            var userLanguage = window.navigator.language;
            if (I18n.containsLanguage(vocabularies, userLanguage)) {
                this.language = userLanguage;
                return;
            }
            var shortenedUserLanguage = userLanguage.slice(0, 2);
            if (I18n.containsLanguage(vocabularies, shortenedUserLanguage)) {
                this.language = shortenedUserLanguage;
                return;
            }
        }
        this.language = language;
    };
    I18n.prototype.initializeVocabulary = function (vocabularies) {
        this.vocabulary = ['en', this.language].reduce(function (vocab, lang) { return (__assign(__assign({}, vocab), (vocabularies[lang] || {}))); }, {});
    };
    I18n.prototype.replaceVariableWithPlaceholderIfExists = function (text, config) {
        var matches = text.match(new RegExp('{[a-zA-Z0-9]+}', 'g'));
        if (matches.length === 0) {
            return text;
        }
        return (matches
            .map(function (m) { return ({ match: m, key: m.slice(1, -1) }); })
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            .reduce(function (str, _a) {
            var key = _a.key, match = _a.match;
            return (config.hasOwnProperty(key) ? str.replace(match, config[key]) : str);
        }, text));
    };
    I18n.prototype.getLocalizer = function (key, config) {
        var _this = this;
        return function () {
            if (key == null) {
                // because sometimes we call toDomElement() without configuring the component or setting text...
                return undefined;
            }
            var vocabularyString = _this.vocabulary[key];
            if (vocabularyString == null) {
                vocabularyString = key;
            }
            if (config != null) {
                vocabularyString = _this.replaceVariableWithPlaceholderIfExists(vocabularyString, config);
            }
            return vocabularyString;
        };
    };
    I18n.prototype.performLocalization = function (text) {
        return typeof text === 'function' ? text() : text;
    };
    return I18n;
}());
exports.I18n = I18n;
/**
 * @category Localization
 */
exports.i18n = new I18n(defaultLocalizationConfig);

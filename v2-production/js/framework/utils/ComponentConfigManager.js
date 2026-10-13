"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentConfigManager = void 0;
/**
 * Provides {@link UIComponentConfigOverrides} overrides while a UI variant is being constructed.
 *
 * Component applies these overrides to the constructor config object before subclass constructors continue. Passing
 * this state through every component constructor would change the UIFactory and component APIs, so UIManager opens this
 * short-lived context around lazy UI construction instead.
 *
 * The context is intentionally synchronous: it is set before the variant factory runs and cleared immediately after.
 * Outside that construction window, components receive no UIConfig component override.
 */
var ComponentConfigManager = /** @class */ (function () {
    function ComponentConfigManager() {
    }
    /**
     * Runs a UI variant factory with component overrides enabled for the given variant.
     */
    ComponentConfigManager.run = function (config, variant, build) {
        ComponentConfigManager.componentConfig = config;
        ComponentConfigManager.variantIdentifier = variant;
        try {
            return build();
        }
        finally {
            ComponentConfigManager.componentConfig = undefined;
            ComponentConfigManager.variantIdentifier = undefined;
        }
    };
    /**
     * Returns the override config for a component constructor.
     *
     * Base class config is applied first, then specific component config. Variant-scoped config is applied after
     * top-level config, so variant entries win.
     */
    ComponentConfigManager.getConfigFor = function (componentConstructor) {
        if (!ComponentConfigManager.componentConfig) {
            return {};
        }
        var config = {};
        ComponentConfigManager.applyConfig(config, ComponentConfigManager.componentConfig, componentConstructor);
        ComponentConfigManager.applyConfig(config, ComponentConfigManager.componentConfig[ComponentConfigManager.variantIdentifier], componentConstructor);
        return config;
    };
    ComponentConfigManager.applyConfig = function (config, componentConfigMap, componentConstructor) {
        if (!componentConfigMap) {
            return;
        }
        var constructorNames = [];
        var prototype = componentConstructor.prototype;
        while (prototype && prototype.constructor && prototype.constructor.name) {
            constructorNames.unshift(prototype.constructor.name);
            prototype = Object.getPrototypeOf(prototype);
        }
        // Apply base classes first so a more specific component config can override inherited defaults.
        for (var _i = 0, constructorNames_1 = constructorNames; _i < constructorNames_1.length; _i++) {
            var constructorName = constructorNames_1[_i];
            Object.assign(config, componentConfigMap[constructorName]);
        }
    };
    return ComponentConfigManager;
}());
exports.ComponentConfigManager = ComponentConfigManager;

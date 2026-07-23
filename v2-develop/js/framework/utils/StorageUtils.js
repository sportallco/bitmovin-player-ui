"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageUtils = void 0;
/**
 * @category Utils
 */
var StorageUtils;
(function (StorageUtils) {
    var disableStorageApi;
    function setStorageApiDisabled(uiConfig) {
        disableStorageApi = uiConfig.disableStorageApi;
    }
    StorageUtils.setStorageApiDisabled = setStorageApiDisabled;
    function shouldUseLocalStorage() {
        try {
            return (!disableStorageApi &&
                window.localStorage &&
                typeof localStorage.getItem === 'function' &&
                typeof localStorage.setItem === 'function');
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Stores a string item into localStorage.
     * @param key the item's key
     * @param data the item's data
     */
    function setItem(key, data) {
        if (shouldUseLocalStorage()) {
            try {
                window.localStorage.setItem(key, data);
            }
            catch (e) {
                console.debug("Failed to set storage item ".concat(key), e);
            }
        }
    }
    StorageUtils.setItem = setItem;
    /**
     * Gets an item's string value from the localStorage.
     * @param key the key to look up its associated value
     * @return {string | null} Returns the string if found, null if there is no data stored for the key
     */
    function getItem(key) {
        if (shouldUseLocalStorage()) {
            try {
                return window.localStorage.getItem(key);
            }
            catch (e) {
                console.debug("Failed to get storage item ".concat(key), e);
            }
        }
        return null;
    }
    StorageUtils.getItem = getItem;
    /**
     * Removes an item from localStorage.
     * @param key the item's key
     */
    function removeItem(key) {
        if (shouldUseLocalStorage()) {
            try {
                window.localStorage.removeItem(key);
            }
            catch (e) {
                console.debug("Failed to remove storage item ".concat(key), e);
            }
        }
    }
    StorageUtils.removeItem = removeItem;
    /**
     * Stores an object into localStorage. The object will be serialized to JSON. The following types are supported
     * in addition to the default types:
     *  - ColorUtils.Color
     *
     * @param key the key to store the data to
     * @param data the object to store
     */
    function setObject(key, data) {
        var json = JSON.stringify(data);
        setItem(key, json);
    }
    StorageUtils.setObject = setObject;
    /**
     * Gets an object for the given key from localStorage. The object will be deserialized from JSON. Beside the
     * default types, the following types are supported:
     *  - ColorUtils.Color
     *
     * @param key the key to look up its associated object
     * @return {any} Returns the object if found, null otherwise
     */
    function getObject(key) {
        var json = getItem(key);
        if (json) {
            var object = JSON.parse(json);
            return object;
        }
        return null;
    }
    StorageUtils.getObject = getObject;
})(StorageUtils || (exports.StorageUtils = StorageUtils = {}));

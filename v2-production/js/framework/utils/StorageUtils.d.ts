import { UIConfig } from '../UIConfig';
/**
 * @category Utils
 */
export declare namespace StorageUtils {
    function setStorageApiDisabled(uiConfig: UIConfig): void;
    /**
     * Stores a string item into localStorage.
     * @param key the item's key
     * @param data the item's data
     */
    function setItem(key: string, data: string): void;
    /**
     * Gets an item's string value from the localStorage.
     * @param key the key to look up its associated value
     * @return {string | null} Returns the string if found, null if there is no data stored for the key
     */
    function getItem(key: string): string | null;
    /**
     * Removes an item from localStorage.
     * @param key the item's key
     */
    function removeItem(key: string): void;
    /**
     * Stores an object into localStorage. The object will be serialized to JSON. The following types are supported
     * in addition to the default types:
     *  - ColorUtils.Color
     *
     * @param key the key to store the data to
     * @param data the object to store
     */
    function setObject<T>(key: string, data: T): void;
    /**
     * Gets an object for the given key from localStorage. The object will be deserialized from JSON. Beside the
     * default types, the following types are supported:
     *  - ColorUtils.Color
     *
     * @param key the key to look up its associated object
     * @return {any} Returns the object if found, null otherwise
     */
    function getObject<T>(key: string): T | null;
}

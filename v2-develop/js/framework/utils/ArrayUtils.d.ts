/**
 * @category Utils
 */
export declare namespace ArrayUtils {
    /**
     * Removes an item from an array.
     * @param array the array that may contain the item to remove
     * @param item the item to remove from the array
     * @returns {any} the removed item or null if it wasn't part of the array
     */
    function remove<T>(array: T[], item: T): T | null;
}

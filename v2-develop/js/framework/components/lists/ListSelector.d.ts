import { Component, ComponentConfig } from '../Component';
import { Event } from '../../EventDispatcher';
import { NoArgs } from '../../EventDispatcher';
import { LocalizableText } from '../../localization/i18n';
/**
 * A map of items (key/value -> label} for a {@link ListSelector} in a {@link ListSelectorConfig}.
 */
export interface ListItem {
    key: string;
    label: LocalizableText;
    sortedInsert?: boolean;
    ariaLabel?: string;
}
/**
 * Filter function that can be used to filter out list items added through {@link ListSelector.addItem}.
 *
 * This is intended to be used in conjunction with subclasses that populate themselves automatically
 * via the player API, e.g. {@link SubtitleSelectBox}.
 */
export interface ListItemFilter {
    /**
     * Takes a list item and decides whether it should pass or be discarded.
     * @param {ListItem} listItem the item to apply the filter to
     * @returns {boolean} true to let the item pass through the filter, false to discard the item
     */
    (listItem: ListItem): boolean;
}
/**
 * Translator function to translate labels of list items added through {@link ListSelector.addItem}.
 *
 * This is intended to be used in conjunction with subclasses that populate themselves automatically
 * via the player API, e.g. {@link SubtitleSelectBox}.
 */
export interface ListItemLabelTranslator {
    /**
     * Takes a list item, optionally changes the label, and returns the new label.
     * @param {ListItem} listItem the item to translate
     * @returns {string} the translated or original label
     */
    (listItem: ListItem): string;
}
/**
 * Comparator function to define a custom display order for list items.
 *
 * Follows the same contract as {@link Array.prototype.sort}.
 *
 * @param listItemA the first item to compare
 * @param listItemB the second item to compare
 * @returns negative when A should come first, positive when B should come first, `0` if equal
 */
export type ListItemComparator = (listItemA: ListItem, listItemB: ListItem) => number;
/**
 * Configuration interface for a {@link ListSelector}.
 *
 * @category Configs
 */
export interface ListSelectorConfig extends ComponentConfig {
    items?: ListItem[];
    filter?: ListItemFilter;
    translator?: ListItemLabelTranslator;
    /**
     * Optional comparator to control the display order of list items.
     *
     * Requires a custom UI. The default {@link UIFactory} presets do not expose this option.
     *
     * Note: For subtitle UIs, the built-in `Off` option is pinned at the top regardless of the
     * comparator result.
     */
    comparator?: ListItemComparator;
}
export declare abstract class ListSelector<Config extends ListSelectorConfig> extends Component<ListSelectorConfig> {
    protected items: ListItem[];
    protected selectedItem: string | null;
    private listSelectorEvents;
    constructor(config?: ListSelectorConfig);
    /**
     * Applies list-item filtering and label translation before the item enters the effective selector state.
     */
    private normalizeItem;
    private getItemIndex;
    /**
     * Detects whether the effective UI items changed, including localized labels and aria labels.
     */
    private haveItemsChanged;
    private insertItem;
    /**
     * Returns all current items of this selector.
     * * @returns {ListItem[]}
     */
    getItems(): ListItem[];
    /**
     * Checks if the specified item is part of this selector.
     * @param key the key of the item to check
     * @returns {boolean} true if the item is part of this selector, else false
     */
    hasItem(key: string): boolean;
    /**
     * Adds an item to this selector by doing a sorted insert or by appending the element to the end of the list of items.
     * If an item with the specified key already exists, it is replaced.
     * @param key the key of the item to add
     * @param label the (human-readable) label of the item to add
     * @param sortedInsert whether the item should be added respecting the order of keys
     * @param ariaLabel custom aria label for the listItem
     */
    addItem(key: string | null, label: LocalizableText, sortedInsert?: boolean, ariaLabel?: string): void;
    /**
     * Removes an item from this selector.
     * @param key the key of the item to remove
     * @returns {boolean} true if removal was successful, false if the item is not part of this selector
     */
    removeItem(key: string): boolean;
    /**
     * Selects an item from the items in this selector.
     *
     * This represents an actual value change in the UI state. It should be used when the
     * selection is updated based on the current player/component state (e.g. from a player event),
     * not as a user-intent signal.
     *
     * @param key the key of the item to select
     * @returns {boolean} true is the selection was successful, false if the selected item is not part of the selector
     */
    selectItem(key: string): boolean;
    /**
     * Returns the key of the selected item.
     * @returns {string} the key of the selected item or null if no item is selected
     */
    getSelectedItem(): string | null;
    /**
     * Returns the items for the given key or undefined if no item with the given key exists.
     * @param key the key of the item to return
     * @returns {ListItem} the item with the requested key. Undefined if no item with the given key exists.
     */
    getItemForKey(key: string): ListItem | null;
    /**
     * Synchronize the current items of this selector with the given ones. This will remove and add items selectively.
     * For each removed item the ItemRemovedEvent and for each added item the ItemAddedEvent will be triggered. Favour
     * this method over using clearItems and adding all items again afterwards.
     *
     * If the currently selected item is not present in `newItems`, the selection is cleared silently:
     * no selection event is fired. Callers that need to preserve or restore selection should call
     * {@link selectItem} after synchronizing.
     *
     * @param newItems
     */
    synchronizeItems(newItems: ListItem[]): void;
    /**
     * Removes all items from this selector.
     */
    clearItems(): void;
    /**
     * Returns the number of items in this selector.
     * @returns {number}
     */
    itemCount(): number;
    protected onItemAddedEvent(key: string): void;
    protected onItemRemovedEvent(key: string): void;
    /**
     * Fired after the selector's effective item state has changed.
     *
     * This includes item additions/removals, order changes, localized label changes,
     * and aria-label changes. The event is dispatched only after `items` and
     * `selectedItem` have been fully synchronized, so listeners always observe
     * the final state.
     */
    protected onItemsChangedEvent(): void;
    protected onItemSelectedEvent(key: string): void;
    protected onItemSelectionChangedEvent(key: string): void;
    /**
     * Dispatches a selection-changed event and optionally updates the selected item.
     *
     * This is the entry point for user-driven interactions. It exists separately from {@link selectItem}
     * so we can distinguish intent (user interaction that should call into the e.g. player or other components)
     * from actual value changes (state updates originating from the player).
     *
     * @param key the key of the item to select
     * @param updateSelectedItem when true, updates the selected item
     */
    dispatchItemSelectionChanged(key: string, updateSelectedItem?: boolean): void;
    /**
     * Gets the event that is fired when an item is added to the list of items.
     * @returns {Event<ListSelector<Config>, string>}
     */
    get onItemAdded(): Event<ListSelector<Config>, string>;
    /**
     * Gets the event that is fired when an item is removed from the list of items.
     * @returns {Event<ListSelector<Config>, string>}
     */
    get onItemRemoved(): Event<ListSelector<Config>, string>;
    /**
     * Gets the event that is fired after the selector's effective item state has changed.
     *
     * Includes additions/removals, order changes, localized label changes, and
     * aria-label changes. Dispatched after internal state has been fully synchronized.
     *
     * Use this to rebuild from {@link getItems()} when the effective list changes.
     *
     * @returns {Event<ListSelector<Config>, NoArgs>}
     */
    get onItemsChanged(): Event<ListSelector<Config>, NoArgs>;
    /**
     * Gets the event that is fired when the selected item value changes.
     *
     * Use this to react to actual value changes (e.g. player state updates). This should not
     * trigger new player calls to avoid feedback loops.
     *
     * @returns {Event<ListSelector<Config>, string>}
     */
    get onItemSelected(): Event<ListSelector<Config>, string>;
    /**
     * Gets the event that is fired when a selection change is requested.
     *
     * Use this to react to user interaction and call into the player or other components.
     * It intentionally does not represent a confirmed value change.
     *
     * @returns {Event<ListSelector<Config>, string>}
     */
    get onItemSelectionChanged(): Event<ListSelector<Config>, string>;
}

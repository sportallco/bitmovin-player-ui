import { ListSelector, ListSelectorConfig } from '../lists/ListSelector';
import { DOM } from '../../DOM';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
/**
 * A simple select box providing the possibility to select a single item out of a list of available items.
 *
 * DOM example:
 * <code>
 *     <select class='ui-selectbox'>
 *         <option value='key'>label</option>
 *         ...
 *     </select>
 * </code>
 *
 * @category Components
 */
export declare class SelectBox extends ListSelector<ListSelectorConfig> {
    private selectElement;
    private dropdownCloseListenerTimeoutId;
    private removeDropdownCloseListeners;
    private uiContainer;
    private removeDropdownOpenedListeners;
    private uiWrapperElement;
    constructor(config?: ListSelectorConfig);
    protected toDomElement(): DOM;
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    private readonly onChange;
    private getSelectElement;
    protected updateDomItems(selectedValue?: string): void;
    protected onItemsChangedEvent(): void;
    protected onItemSelectedEvent(value: string, updateDomItems?: boolean): void;
    readonly closeDropdown: () => void;
    private readonly onPlayerStateChange;
    private onDropdownOpened;
    private onDropdownClosed;
    private addDropdownCloseListeners;
    private addDropdownOpenedListeners;
    release(): void;
}

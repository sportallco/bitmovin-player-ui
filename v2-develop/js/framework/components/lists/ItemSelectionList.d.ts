import { ListSelector, ListSelectorConfig } from './ListSelector';
import { DOM } from '../../DOM';
/**
 * @category Components
 */
export declare class ItemSelectionList extends ListSelector<ListSelectorConfig> {
    private static readonly CLASS_SELECTED;
    private listElement;
    constructor(config?: ListSelectorConfig);
    protected isActive(): boolean;
    protected toDomElement(): DOM;
    protected updateDomItems(selectedValue?: string): void;
    protected onItemsChangedEvent(): void;
    protected onItemSelectedEvent(value: string, updateDomItems?: boolean): void;
}

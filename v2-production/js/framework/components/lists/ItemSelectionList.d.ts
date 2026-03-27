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
    protected onItemAddedEvent(value: string): void;
    protected onItemRemovedEvent(value: string): void;
    protected onItemSelectedEvent(value: string, updateDomItems?: boolean): void;
}

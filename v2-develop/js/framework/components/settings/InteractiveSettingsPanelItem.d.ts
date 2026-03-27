import { SettingsPanelItem, SettingsPanelItemConfig } from './SettingsPanelItem';
import { Event, NoArgs } from '../../EventDispatcher';
import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../UIManager';
/**
 * A settings panel item that can be interacted with using the keyboard or mouse.
 * Can be used when no interactive element is present as child item.
 */
export declare class InteractiveSettingsPanelItem<Config extends SettingsPanelItemConfig> extends SettingsPanelItem<Config> {
    private events;
    constructor(config: Config);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
    protected onClickEvent(): void;
    /**
     * Gets the event that is fired when the SettingsPanelItem is clicked.
     * @returns {Event<InteractiveSettingsPanelItem<Config>, NoArgs>}
     */
    get onClick(): Event<InteractiveSettingsPanelItem<Config>, NoArgs>;
}

import { PlayerAPI } from 'bitmovin-player';
import { UIInstanceManager } from '../../../UIManager';
import { SettingsPanelItem, SettingsPanelItemConfig } from '../../settings/SettingsPanelItem';
interface PlayerInsightsPanelTitleTarget {
    hide(): void;
}
export declare class PlayerInsightsPanelTitleItem extends SettingsPanelItem<SettingsPanelItemConfig> {
    private readonly closeButton;
    private target;
    constructor(config?: SettingsPanelItemConfig);
    setTarget(target: PlayerInsightsPanelTitleTarget): void;
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}
export {};

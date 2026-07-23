import { LocalizableText } from '../../../localization/i18n';
import { SettingsPanelItem, SettingsPanelItemConfig } from '../../settings/SettingsPanelItem';
export interface PlayerInsightsPanelItemConfig extends SettingsPanelItemConfig {
    leadingLabel: LocalizableText;
}
export declare class PlayerInsightsPanelItem extends SettingsPanelItem<PlayerInsightsPanelItemConfig> {
    private readonly trailingLabel;
    constructor(config: PlayerInsightsPanelItemConfig);
    setTrailingLabel(text: LocalizableText): void;
}

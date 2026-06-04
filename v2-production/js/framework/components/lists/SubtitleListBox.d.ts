import { ListBox, ListBoxConfig } from './ListBox';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../../localization/i18n';
export interface SubtitleListBoxConfig extends Omit<ListBoxConfig, 'listSelector'> {
}
/**
 * An element that is similar to a select box where the user can select a subtitle
 *
 * When a comparator is configured, the built-in "Off" option remains fixed at the top
 * and is not reordered together with the subtitle tracks.
 *
 * @category Components
 */
export declare class SubtitleListBox extends ListBox {
    constructor(title?: LocalizableText);
    constructor(config?: SubtitleListBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}

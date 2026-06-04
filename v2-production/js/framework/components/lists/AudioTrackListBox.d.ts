import { ListBox, ListBoxConfig } from './ListBox';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../../localization/i18n';
export interface AudioTrackListBoxConfig extends Omit<ListBoxConfig, 'listSelector'> {
}
/**
 * An element that is similar to a select box where the user can select an audio track
 *
 * @category Components
 */
export declare class AudioTrackListBox extends ListBox {
    constructor(title?: LocalizableText);
    constructor(config?: AudioTrackListBoxConfig);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}

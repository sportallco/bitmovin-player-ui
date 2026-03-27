import { ListBox } from './ListBox';
import { UIInstanceManager } from '../../UIManager';
import { PlayerAPI } from 'bitmovin-player';
import { LocalizableText } from '../../localization/i18n';
/**
 * A element that is similar to a select box where the user can select a subtitle
 *
 * @category Components
 */
export declare class AudioTrackListBox extends ListBox {
    constructor(title?: LocalizableText);
    configure(player: PlayerAPI, uimanager: UIInstanceManager): void;
}

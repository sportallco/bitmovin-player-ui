import { ListSelector, ListSelectorConfig } from '../components/lists/ListSelector';
import { UIInstanceManager } from '../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Helper class to handle all subtitle related events
 *
 * This class listens to player events as well as the `ListSelector` event if selection changed
 *
 * @category Utils
 */
export declare class SubtitleSwitchHandler {
    private static SUBTITLES_OFF_KEY;
    private player;
    private listElement;
    private uimanager;
    constructor(player: PlayerAPI, element: ListSelector<ListSelectorConfig>, uimanager: UIInstanceManager);
    private bindSelectionEvent;
    private bindPlayerEvents;
    private onSubtitleEnabled;
    private addSubtitle;
    private removeSubtitle;
    private selectCurrentSubtitle;
    private clearSubtitles;
    private refreshSubtitles;
}

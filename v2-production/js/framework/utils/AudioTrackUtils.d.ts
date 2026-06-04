import { ListSelector, ListSelectorConfig } from '../components/lists/ListSelector';
import { UIInstanceManager } from '../UIManager';
import { PlayerAPI } from 'bitmovin-player';
/**
 * Helper class to handle all audio tracks related events
 *
 * This class listens to player events as well as the `ListSelector` event if selection changed
 *
 * @category Utils
 */
export declare class AudioTrackSwitchHandler {
    private player;
    private listElement;
    private uimanager;
    constructor(player: PlayerAPI, element: ListSelector<ListSelectorConfig>, uimanager: UIInstanceManager);
    private bindSelectionEvent;
    private bindPlayerEvents;
    private hasComparator;
    private audioTrackToListItem;
    private addAudioTrack;
    private removeAudioTrack;
    private selectCurrentAudioTrack;
    private refreshAudioTracks;
}

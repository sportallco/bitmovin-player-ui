import { SubtitleRegionContainer, SubtitleLabel } from '../components/overlays/SubtitleOverlay';
import { VTTRegionProperties } from 'bitmovin-player/types/subtitles/vtt/API';
import { Size } from '../DOM';
/**
 * @category Utils
 */
export declare namespace VttUtils {
    const setVttCueBoxStyles: (cueContainer: SubtitleLabel, subtitleOverlaySize: Size) => void;
    /** https://www.w3.org/TR/webvtt1/#regions
     *  https://www.speechpad.com/captions/webvtt#toc_16
     */
    const setVttRegionStyles: (regionContainer: SubtitleRegionContainer, region: VTTRegionProperties, overlaySize: Size) => void;
}

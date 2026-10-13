import { DOM } from '../DOM';
import { PlayerAPI } from 'bitmovin-player';
import { VolumeController } from './VolumeController';
export declare enum SeekBarType {
    Vod = 0,
    Live = 1,
    Volume = 2
}
interface Range {
    min: number;
    max: number;
}
interface KeyStepIncrementsConfig {
    leftRight: number;
    upDown: number;
}
/**
 * @category Utils
 */
export declare class SeekBarController {
    protected keyStepIncrements: KeyStepIncrementsConfig;
    protected player: PlayerAPI;
    protected volumeController: VolumeController;
    constructor(keyStepIncrements: KeyStepIncrementsConfig, player: PlayerAPI, volumeController: VolumeController);
    protected arrowKeyControls(currentValue: number, range: Range, valueUpdate: (value: number) => void): {
        left: () => void;
        right: () => void;
        up: () => void;
        down: () => void;
        home: () => void;
        end: () => void;
    };
    protected seekBarControls(type: SeekBarType): {
        left: () => void;
        right: () => void;
        up: () => void;
        down: () => void;
        home: () => void;
        end: () => void;
    };
    setSeekBarControls(domElement: DOM, type: () => SeekBarType): void;
    /**
     * Steps the playback position by one frame in the given direction (-1 = back, 1 = forward).
     * Pauses the player first if necessary so the step lands on a stable frame. The frame
     * duration is derived from the active video quality's `frameRate` and falls back to
     * 30 fps when the player doesn't expose one (e.g. progressive sources).
     *
     * Only supported for VOD: on live streams `timeShift` is measured against the constantly
     * advancing live edge, and `getTimeShift()` is not a stable reference while paused, so a
     * sub-frame step gets swamped by the edge movement and the position drifts forward instead
     * of stepping. Live frame stepping needs absolute-time seeking on the player side.
     */
    protected stepFrame(direction: number): void;
    private getFrameRate;
}
export {};

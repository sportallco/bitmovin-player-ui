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
}
export {};

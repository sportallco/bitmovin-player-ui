import { Event } from '../EventDispatcher';
import { PlayerAPI } from 'bitmovin-player';
export interface VolumeSettingChangedArgs {
    volume: number;
    muted: boolean;
}
/**
 * Can be used to centrally manage and control the volume and mute state of the player from multiple components.
 */
export declare class VolumeController {
    private readonly player;
    private static readonly issuerName;
    private static readonly defaultVolume;
    private readonly events;
    private storedVolume;
    private transitionActive;
    constructor(player: PlayerAPI);
    setVolume(volume: number): void;
    getVolume(): number;
    setMuted(muted: boolean): void;
    toggleMuted(): void;
    isMuted(): boolean;
    /**
     * Stores (saves) the current volume so it can later be restored with {@link recallVolume}.
     */
    storeVolume(): void;
    /**
     * Recalls (sets) the volume previously stored with {@link storeVolume}.
     */
    recallVolume(): void;
    startTransition(): VolumeTransition;
    endTransition(): void;
    onChangedEvent(): void;
    /**
     * Gets the event that is fired when the volume settings have changed.
     */
    get onChanged(): Event<VolumeController, VolumeSettingChangedArgs>;
}
export declare class VolumeTransition {
    private controller;
    constructor(controller: VolumeController);
    update(volume: number): void;
    finish(volume: number): void;
}

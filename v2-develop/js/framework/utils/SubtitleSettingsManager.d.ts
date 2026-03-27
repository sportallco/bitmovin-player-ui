import { Event } from '../EventDispatcher';
/**
 * @category Utils
 */
export declare class SubtitleSettingsManager {
    private userSettings;
    private localStorageKey;
    private _properties;
    constructor();
    reset(): void;
    get fontColor(): SubtitleSettingsProperty<string>;
    get fontOpacity(): SubtitleSettingsProperty<string>;
    get fontFamily(): SubtitleSettingsProperty<string>;
    get fontSize(): SubtitleSettingsProperty<string>;
    get fontStyle(): SubtitleSettingsProperty<string>;
    get characterEdge(): SubtitleSettingsProperty<string>;
    get characterEdgeColor(): SubtitleSettingsProperty<string>;
    get backgroundColor(): SubtitleSettingsProperty<string>;
    get backgroundOpacity(): SubtitleSettingsProperty<string>;
    get windowColor(): SubtitleSettingsProperty<string>;
    get windowOpacity(): SubtitleSettingsProperty<string>;
    initialize(): void;
    /**
     * Saves the settings to local storage.
     */
    save(): void;
    /**
     * Loads the settings from local storage
     */
    load(): void;
}
export declare class SubtitleSettingsProperty<T> {
    private _manager;
    private _onChanged;
    private _value;
    constructor(manager: SubtitleSettingsManager);
    isSet(): boolean;
    clear(): void;
    get value(): T;
    set value(value: T);
    protected onChangedEvent(value: T): void;
    get onChanged(): Event<SubtitleSettingsManager, SubtitleSettingsProperty<T>>;
}

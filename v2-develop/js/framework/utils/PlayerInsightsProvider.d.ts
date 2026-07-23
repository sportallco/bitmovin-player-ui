import type { PlayerAPI } from 'bitmovin-player';
import type { UIInstanceManager } from '../UIManager';
import { Event } from '../EventDispatcher';
import { LocalizableText } from '../localization/i18n';
export type PlayerInsightValueProvider = (player: PlayerAPI) => LocalizableText | null | undefined;
export interface PlayerInsightSnapshot {
    value: LocalizableText | null | undefined;
    visible: boolean;
}
export declare class PlayerInsightsProvider {
    private readonly properties;
    private readonly events;
    private playerApi;
    private uimanager;
    private refreshTimer;
    private refreshIntervalMs;
    private active;
    getInsights(): PlayerInsightProperty[];
    initialize(player: PlayerAPI, uimanager: UIInstanceManager, refreshIntervalMs: number): void;
    activate(): void;
    deactivate(): void;
    release(): void;
    get onChanged(): Event<PlayerInsightsProvider, PlayerInsightSnapshot[]>;
    private readonly updateAndStartTimer;
    private readonly dispatchChanged;
    private getSnapshots;
    private startTimer;
    private readonly stopTimer;
}
export declare class PlayerInsightProperty {
    private readonly label;
    private readonly valueProvider;
    constructor(leadingLabel: LocalizableText, valueProvider: PlayerInsightValueProvider);
    get leadingLabel(): LocalizableText;
    getSnapshot(player: PlayerAPI): PlayerInsightSnapshot;
}

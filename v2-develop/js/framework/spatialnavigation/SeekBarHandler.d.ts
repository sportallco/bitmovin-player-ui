import { RootNavigationGroup } from './RootNavigationGroup';
/**
 * Handles Spatial Navigation interaction with the seek bar. Ensures, that seek operations can be executed and that the
 * scrubbing tooltip is shown as if the user scrubbed using the mouse/touchscreen.
 */
export declare class SeekBarHandler {
    private readonly rootNavigationGroup;
    private readonly cursorPosition;
    private readonly eventSubscriber;
    private isScrubbing;
    private scrubSpeedResetTimeout;
    private scrubSpeedPercentage;
    constructor(rootNavigationGroup: RootNavigationGroup);
    private updateScrubSpeedPercentage;
    private getIncrement;
    private resetCursorPosition;
    private updateCursorPosition;
    private initializeCursorPosition;
    private initializeOrUpdateCursorPosition;
    private getCursorPositionMouseEventInit;
    private dispatchMouseMoveEvent;
    private readonly onNavigation;
    private dispatchMouseClickEvent;
    private stopSeeking;
    private dispatchMouseLeaveEvent;
    private readonly onAction;
    /**
     * Releases the SeekBraHandler, making sure all event subscribers are removed.
     */
    release(): void;
}

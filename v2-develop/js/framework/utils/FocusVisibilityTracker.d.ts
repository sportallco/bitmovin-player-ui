import { DOM } from '../DOM';
export declare class FocusVisibilityTracker {
    private bitmovinUiPrefix;
    private readonly eventHandlerMap;
    private lastInteractionWasKeyboard;
    private uiWrapperElement;
    constructor(bitmovinUiPrefix: string, uiWrapperElement: DOM);
    private onKeyDown;
    private onMouseOrPointerOrTouch;
    private onFocus;
    private onBlur;
    private registerEventListeners;
    private unregisterEventListeners;
    release(): void;
}

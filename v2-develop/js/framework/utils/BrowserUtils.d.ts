declare global {
    interface Navigator {
        msMaxTouchPoints?: number;
    }
}
/**
 * @category Utils
 */
export declare class BrowserUtils {
    static get isMobile(): boolean;
    static get isChrome(): boolean;
    static get isAndroid(): boolean;
    static get isIOS(): boolean;
    static get isMacIntel(): boolean;
    static get isTv(): boolean;
    static get isHisense(): boolean;
    static get isPlayStation(): boolean;
    static get isWebOs(): boolean;
    static get isTizen(): boolean;
    static get isVizio(): boolean;
    static get isXumo(): boolean;
    static get isXbox(): boolean;
    static get isVidaa(): boolean;
    static get isTouchSupported(): boolean;
    private static windowExists;
}

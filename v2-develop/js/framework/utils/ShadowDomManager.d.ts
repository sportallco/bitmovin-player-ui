import { DOM } from '../DOM';
import { ShadowDomConfig } from '../UIConfig';
/**
 * Encapsulates Shadow DOM initialization.
 */
export declare class ShadowDomManager {
    private static readonly DEFAULT_SHADOW_STYLESHEET_NAME;
    private shadowRoot?;
    private shadowHost?;
    static isShadowDomSupported(): boolean;
    initialize(containerElement: DOM, shadowDomConfig: ShadowDomConfig): void;
    getShadowRoot(): ShadowRoot | undefined;
    release(): void;
    /**
     * Looks for existing stylesheets on the document for the given names and injects them into the ShadowRoot to include
     * default UI styles (and custom additional styles).
     */
    private injectStyles;
}

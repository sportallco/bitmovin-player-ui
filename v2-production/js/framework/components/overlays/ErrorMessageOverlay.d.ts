import { ContainerConfig, Container } from '../Container';
import { UIInstanceManager } from '../../UIManager';
import { ErrorEvent, PlayerAPI } from 'bitmovin-player';
import { MobileV3PlayerAPI, MobileV3PlayerErrorEvent } from '../../utils/MobileV3PlayerAPI';
export interface ErrorMessageTranslator {
    (error: ErrorEvent | MobileV3PlayerErrorEvent): string;
}
export interface ErrorMessageMap {
    [code: number]: string | ErrorMessageTranslator;
}
/**
 * Configuration interface for the {@link ErrorMessageOverlay}.
 *
 * @category Configs
 */
export interface ErrorMessageOverlayConfig extends ContainerConfig {
    /**
     * Allows overwriting of the error messages displayed in the overlay for customization and localization.
     * This is either a function that receives any {@link ErrorEvent} as parameter and translates error messages,
     * or a map of error codes that overwrites specific error messages with a plain string or a function that
     * receives the {@link ErrorEvent} as parameter and returns a customized string.
     * The translation functions can be used to extract data (e.g. parameters) from the original error message.
     *
     * Example 1 (catch-all translation function):
     * <code>
     * errorMessageOverlayConfig = {
     *   messages: function(error) {
     *     switch (error.code) {
     *       // Overwrite error 1000 'Unknown error'
     *       case 1000:
     *         return 'Houston, we have a problem'
     *
     *       // Transform error 1201 'The downloaded manifest is invalid' to uppercase
     *       case 1201:
     *         var description = ErrorUtils.defaultErrorMessages[error.code];
     *         return description.toUpperCase();
     *
     *       // Customize error 1207 'The manifest could not be loaded'
     *       case 1207:
     *         var statusCode = error.data.statusCode;
     *         return 'Manifest loading failed with HTTP error ' + statusCode;
     *     }
     *     // Return unmodified error message for all other errors
     *     return error.message;
     *   }
     * };
     * </code>
     *
     * Example 2 (translating specific errors):
     * <code>
     * errorMessageOverlayConfig = {
     *   messages: {
     *     // Overwrite error 1000 'Unknown error'
     *     1000: 'Houston, we have a problem',
     *
     *     // Transform error 1201 'Unsupported manifest format' to uppercase
     *     1201: function(error) {
     *       var description = ErrorUtils.defaultErrorMessages[error.code];
     *       return description.toUpperCase();
     *     },
     *
     *     // Customize error 1207 'The manifest could not be loaded'
     *     1207: function(error) {
     *       var statusCode = error.data.statusCode;
     *       return 'Manifest loading failed with HTTP error ' + statusCode;
     *     }
     *   }
     * };
     * </code>
     */
    messages?: ErrorMessageMap | ErrorMessageTranslator;
}
/**
 * Overlays the player and displays error messages.
 *
 * @category Components
 */
export declare class ErrorMessageOverlay extends Container<ErrorMessageOverlayConfig> {
    private errorLabel;
    private tvNoiseBackground;
    constructor(config?: ErrorMessageOverlayConfig);
    configure(player: PlayerAPI | MobileV3PlayerAPI, uimanager: UIInstanceManager): void;
    display(errorMessage: string): void;
    private clear;
    release(): void;
}

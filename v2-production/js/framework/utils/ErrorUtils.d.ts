import { ErrorMessageMap, ErrorMessageTranslator } from '../components/overlays/ErrorMessageOverlay';
import { MobileV3PlayerErrorEvent, MobileV3SourceErrorEvent } from './MobileV3PlayerAPI';
/**
 * @category Utils
 */
export declare namespace ErrorUtils {
    const defaultErrorMessages: ErrorMessageMap;
    const defaultMobileV3ErrorMessageTranslator: (error: MobileV3PlayerErrorEvent | MobileV3SourceErrorEvent) => string;
    const defaultWebErrorMessageTranslator: ErrorMessageTranslator;
}

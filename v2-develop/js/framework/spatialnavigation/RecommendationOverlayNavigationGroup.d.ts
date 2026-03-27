import { NavigationGroup } from './NavigationGroup';
import { RecommendationOverlay } from '../components/overlays/RecommendationOverlay';
import { Focusable } from './types';
export declare class RecommendationOverlayNavigationGroup extends NavigationGroup {
    private readonly recommendationOverlay;
    constructor(recommendationOverlay: RecommendationOverlay);
    protected getComponents(): Focusable[];
}

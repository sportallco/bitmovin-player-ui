import { NavigationGroup } from './NavigationGroup';
import { RootNavigationGroup } from './RootNavigationGroup';
/**
 * SpatialNavigation keeps track of all navigation groups, and updates the active navigation group when visibility
 * changes on group container.
 *
 * It listens to key events, and triggers either handleNavigation or handleAction on the active group.
 * SeekBarHandler will get instantiated with root navigation group and disposed on release of the spatial navigation.
 */
export declare class SpatialNavigation {
    private unsubscribeVisibilityChangesFns;
    private readonly navigationGroups;
    private readonly activeNavigationGroups;
    private readonly eventSubscriber;
    private readonly seekBarHandler;
    private readonly keyMap;
    constructor(rootNavigationGroup: RootNavigationGroup, ...navigationGroups: NavigationGroup[]);
    private attachKeyEventHandler;
    private onShow;
    private onHide;
    /**
     * Subscribes to onHide and onShow on all navigation groups containers as Spatial navigation tracks active navigation
     * group based on their container visibility.
     */
    private subscribeToNavigationGroupVisibilityChanges;
    private unsubscribeFromNavigationGroupVisibilityChanges;
    /**
     * It will enable group of which container is currently shown
     * If there are no groups with containers that are currently visible, it will enable root navigation group
     */
    private enableDefaultNavigationGroup;
    /**
     * Disables navigation groups that are no longer active and calls enable on last pushed navigation group
     */
    private updateEnabledNavigationGroup;
    /**
     * Returns currently active navigation group
     */
    getActiveNavigationGroup(): NavigationGroup | undefined;
    /**
     * Checks if keyboard event keycode is tracked either as Direction or Action and calls appropriate handler on active
     * navigation group
     *
     * @param e {KeyboardEvent}
     */
    private handleKeyEvent;
    /**
     * Dispose of SpatialNavigation
     *
     * Remove all event handlers, release seekbar handler and release all navigation groups.
     */
    release(): void;
}

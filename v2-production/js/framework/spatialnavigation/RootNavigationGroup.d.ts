import { NavigationGroup } from './NavigationGroup';
import { UIContainer } from '../components/UIContainer';
import { Action, Direction, Focusable } from './types';
/**
 * Extends NavigationGroup and provides additional logic for hiding and showing the UI on the root container.
 *
 * @category Components
 */
export declare class RootNavigationGroup extends NavigationGroup {
    readonly container: UIContainer;
    constructor(container: UIContainer, ...elements: Focusable[]);
    handleAction(action: Action): boolean;
    handleNavigation(direction: Direction): boolean;
    protected defaultActionHandler(action: Action): boolean;
    private isUiShown;
    release(): void;
}

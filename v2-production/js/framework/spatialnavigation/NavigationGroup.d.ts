import { Container, ContainerConfig } from '../components/Container';
import { Action, ActionCallback, AnyComponent, Direction, Focusable, NavigationCallback } from './types';
/**
 * Used as part of spatial navigation. Groups together different components to which you can navigate to, in a single
 * navigation group.
 *
 * Responsible for finding elements in direction on navigation and for tracking active element inside the group.
 * Triggers blur and focus on element when active element is changed, as well as click on element on `Action.SELECT`.
 * Will call `hideUi()` on passed in container if `Action.BACK` is called.
 *
 * To have more control over grouping related elements together, you can use `FocusableContainer`.
 *
 * Example 1:
 * <code>
 *   new RootNavigationGroup(uiContainer, playbackToggleOverlay, seekBar, bottomControlBar, titleBar)
 * </code>
 *
 * In this example all components which are passed to the `RootNavigationGroup` will be navigable on a 'flat' hierarchy.
 * Elements form within the bottomControlBar and the titleBar will be resolved lazily and it's possible to navigate
 * from/to every element.
 *
 * Example 2:
 * <code>
 *   new RootNavigationGroup(
 *     uiContainer, playbackToggleOverlay, seekBar, new FocusableContainer(bottomControlBar, playbackToggleButton), new FocusableContainer(titleBar)
 *   )
 * </code>
 *
 * In this example the bottomControlBar and the titleBar are considered as a group of elements. Their components
 * will still be resolved lazily, but the navigation will target the whole container instead of the individual
 * components. In addition, a primary component can be set for each `FocusableContainer`, which will be component that
 * receives focus first when the container is focused.
 *
 * @category Components
 */
export declare class NavigationGroup {
    readonly container: Container<ContainerConfig>;
    protected activeComponent?: AnyComponent;
    private activeComponentBeforeDisable?;
    private readonly _components;
    private removeElementHoverEventListeners;
    private readonly eventSubscriber;
    constructor(container: Container<ContainerConfig>, ...components: Focusable[]);
    protected getComponents(): Focusable[];
    /**
     * If overwritten, allows to implement custom navigation behavior. Per default, the internal handler will still be
     * executed. To prevent execution of the default navigation handler, call `preventDefault()`;
     *
     * @param direction {Direction} The direction to move along
     * @param target {HTMLElement} The target element for the event
     * @param preventDefault {() => void} A function that, when called, will prevent the execution of the default handler
     */
    onNavigation?: NavigationCallback;
    /**
     * If overwritten, allows to implement custom action behavior. Per default, the internal handler will still be
     * executed. To prevent execution of the default action handler, call `preventDefault()`;
     *
     * @param action {Action} The action that was called
     * @param target {HTMLElement} The target element that action was called on
     * @param preventDefault {() => void} A function that, when called, will prevent the execution of the default handler
     */
    onAction?: ActionCallback;
    /**
     * Returns the active HTMLElement.
     */
    getActiveComponent(): AnyComponent | undefined;
    protected focusComponent(component: Focusable): void;
    private blurActiveComponent;
    focusFirstComponent(): void;
    protected defaultNavigationHandler(direction: Direction): void;
    protected defaultActionHandler(action: Action): void;
    private handleInput;
    /**
     * Handles a navigation event.
     *
     * @param direction The direction of the navigation event
     * @returns true if navigation was successful, false otherwise
     */
    handleNavigation(direction: Direction): void;
    /**
     * Handles an action event.
     *
     * @param action The action of the event
     */
    handleAction(action: Action): void;
    /**
     * Disable navigation group
     *
     * Call blur on active element, set as undefined, and track it as element before disable.
     */
    disable(): void;
    /**
     * Enable navigation group
     *
     * Sets active element to either element that was active before disable, or first element of tracked elements.
     * If it is settings panel, it will always focus first element in the list.
     */
    enable(): void;
    /**
     * Adds event listener for `mouseenter` on tracked elements to ensure tracking of active element will work together
     * in combination of using mouse and key events.
     */
    private trackElementHover;
    /**
     * Dispose of navigation group
     */
    release(): void;
    private getActiveFocusableContainer;
}

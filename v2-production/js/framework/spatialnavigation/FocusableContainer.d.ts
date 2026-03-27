import { Component, ComponentConfig } from '../components/Component';
import { AnyComponent, AnyContainer } from './types';
/**
 * Enables grouping of focusable components within a container.
 * Spatial navigation can prioritize elements within this container over others.
 * The primary component is the one that receives focus first when the container is focused.
 */
export declare class FocusableContainer {
    readonly container: AnyContainer;
    private readonly _primaryComponent;
    /**
     * Creates a new FocusableContainer.
     *
     * @param container The container that holds focusable components.
     * @param primaryComponent The primary component that should receive focus first when the container is focused.
     *                         If not provided, the first focusable component in the container will be used.
     */
    constructor(container: AnyContainer, primaryComponent?: Component<ComponentConfig> | undefined);
    get primaryComponent(): AnyComponent;
    get components(): AnyComponent[];
}

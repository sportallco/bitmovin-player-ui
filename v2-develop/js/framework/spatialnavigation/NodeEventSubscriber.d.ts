/**
 * Allows to subscribe to Node events.
 */
export declare class NodeEventSubscriber {
    private readonly attachedListeners;
    constructor();
    private getEventListenersOfType;
    /**
     * Adds the given event listener to the node.
     *
     * @param node The node to remove the event listener from
     * @param type The event to listen to
     * @param listener The listener to remove
     * @param options The event listener options
     */
    on(node: Node, type: keyof HTMLElementEventMap, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    /**
     * Removes the given event listener from the node.
     *
     * @param node The node to attach the event listener to
     * @param type The event to listen to
     * @param listener The listener to add
     * @param options The event listener options
     */
    off(node: Node, type: keyof HTMLElementEventMap, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    /**
     * Removes all attached event listeners.
     */
    release(): void;
}

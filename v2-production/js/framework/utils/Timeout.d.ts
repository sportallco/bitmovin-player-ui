/**
 * Executes a callback after a specified amount of time, optionally repeatedly until stopped.
 */
export declare class Timeout {
    private readonly delay;
    private readonly callback;
    private readonly repeat;
    private timeoutOrIntervalId;
    private active;
    private suspended;
    /**
     * Creates a new timeout callback handler.
     * @param delay the delay in milliseconds after which the callback should be executed
     * @param callback the callback to execute after the delay time
     * @param repeat if true, call the callback repeatedly in delay intervals
     */
    constructor(delay: number, callback: () => void, repeat?: boolean);
    /**
     * Starts the timeout and calls the callback when the timeout delay has passed. Has no effect when the timeout is
     * suspended.
     * @returns {Timeout} the current timeout (so the start call can be chained to the constructor)
     */
    start(): this;
    /**
     * Clears the timeout. The callback will not be called if clear is called during the timeout.
     */
    clear(): void;
    /**
     * Suspends the timeout. The callback will not be called and calls to `start` and `reset` will be ignored until the
     * timeout is resumed.
     */
    suspend(): this;
    /**
     * Resumes the timeout.
     * @param reset whether to reset the timeout after resuming
     */
    resume(reset: boolean): this;
    /**
     * Resets the passed timeout delay to zero. Can be used to defer the calling of the callback. Has no effect if the
     * timeout is suspended.
     */
    reset(): void;
    isActive(): boolean;
    private clearInternal;
}

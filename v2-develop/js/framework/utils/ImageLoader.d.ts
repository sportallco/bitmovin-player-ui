export interface ImageLoadedCallback {
    (url: string, width: number, height: number): void;
}
/**
 * Tracks the loading state of images.
 */
export declare class ImageLoader {
    private state;
    /**
     * Loads an image and call the callback once the image is loaded. If the image is already loaded, the callback
     * is called immediately, else it is called once loading has finished. Calling this method multiple times for the
     * same image while it is loading calls only let callback passed into the last call.
     * @param url The url to the image to load
     * @param loadedCallback The callback that is called when the image is loaded
     */
    load(url: string, loadedCallback: ImageLoadedCallback): void;
    private callLoadedCallback;
}

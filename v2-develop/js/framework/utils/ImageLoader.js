"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageLoader = void 0;
var DOM_1 = require("../DOM");
/**
 * Tracks the loading state of images.
 */
var ImageLoader = /** @class */ (function () {
    function ImageLoader() {
        this.state = {};
    }
    /**
     * Loads an image and call the callback once the image is loaded. If the image is already loaded, the callback
     * is called immediately, else it is called once loading has finished. Calling this method multiple times for the
     * same image while it is loading calls only let callback passed into the last call.
     * @param url The url to the image to load
     * @param loadedCallback The callback that is called when the image is loaded
     */
    ImageLoader.prototype.load = function (url, loadedCallback) {
        var _this = this;
        if (!this.state[url]) {
            // When the image was never attempted to be loaded before, we create a state and store it in the state map
            // for later use when the same image is requested to be loaded again.
            var state_1 = {
                url: url,
                image: new DOM_1.DOM('img', {}),
                loadedCallback: loadedCallback,
                loaded: false,
                width: 0,
                height: 0,
            };
            this.state[url] = state_1;
            // Listen to the load event, update the state and call the callback once the image is loaded
            state_1.image.on('load', function (e) {
                state_1.loaded = true;
                state_1.width = state_1.image.get(0).width;
                state_1.height = state_1.image.get(0).height;
                _this.callLoadedCallback(state_1);
            });
            // Set the image URL to start the loading
            state_1.image.attr('src', state_1.url);
        }
        else {
            // We have a state for the requested image, so it is either already loaded or currently loading
            var state = this.state[url];
            // We overwrite the callback to make sure that only the callback of the latest call gets executed.
            // Earlier callbacks become invalid once a new load call arrives, and they are not called as long as the image
            // is not loaded.
            state.loadedCallback = loadedCallback;
            // When the image is already loaded, we directly execute the callback instead of waiting for the load event
            if (state.loaded) {
                this.callLoadedCallback(state);
            }
        }
    };
    ImageLoader.prototype.callLoadedCallback = function (state) {
        state.loadedCallback(state.url, state.width, state.height);
    };
    return ImageLoader;
}());
exports.ImageLoader = ImageLoader;

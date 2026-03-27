"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIContainer = void 0;
var Container_1 = require("./Container");
var DOM_1 = require("../DOM");
var Timeout_1 = require("../utils/Timeout");
var PlayerUtils_1 = require("../utils/PlayerUtils");
var EventDispatcher_1 = require("../EventDispatcher");
var i18n_1 = require("../localization/i18n");
var Button_1 = require("./buttons/Button");
var TouchControlOverlay_1 = require("./overlays/TouchControlOverlay");
var SettingsPanel_1 = require("./settings/SettingsPanel");
/**
 * The base container that contains all of the UI. The UIContainer is passed to the {@link UIManager} to build and
 * setup the UI.
 *
 * @category Containers
 */
var UIContainer = /** @class */ (function (_super) {
    __extends(UIContainer, _super);
    function UIContainer(config) {
        var _this = _super.call(this, config) || this;
        _this.hideUi = function () { };
        _this.showUi = function () { };
        _this.toggleUiShown = function () { };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-uicontainer',
            role: 'region',
            ariaLabel: i18n_1.i18n.getLocalizer('player'),
            hideDelay: 2000,
            hideImmediatelyOnMouseLeave: true,
            deferUiHideWhileSettingsOpen: true,
        }, _this.config);
        _this.playerStateChange = new EventDispatcher_1.EventDispatcher();
        _this.hidingPrevented = function () { return false; };
        return _this;
    }
    UIContainer.prototype.configure = function (player, uimanager) {
        var config = this.getConfig();
        if (config.userInteractionEventSource) {
            this.userInteractionEventSource = new DOM_1.DOM(config.userInteractionEventSource);
        }
        else {
            this.userInteractionEventSource = this.getDomElement();
        }
        _super.prototype.configure.call(this, player, uimanager);
        this.configureUIShowHide(player, uimanager);
        this.configurePlayerStates(player, uimanager);
    };
    UIContainer.prototype.configureUIShowHide = function (player, uimanager) {
        var _this = this;
        var config = this.getConfig();
        var isUiShown = false;
        var isSettingsPanelShown = false;
        var isHideUiPending = false;
        uimanager.onConfigured.subscribe(function () {
            if (isUiShown) {
                uimanager.onControlsShow.dispatch(_this);
            }
            else {
                uimanager.onControlsHide.dispatch(_this);
            }
        });
        if (config.hideDelay === -1) {
            isUiShown = true;
            return;
        }
        var isSeeking = false;
        var isFirstTouch = true;
        var playerState;
        if (config.deferUiHideWhileSettingsOpen) {
            uimanager.onComponentShow.subscribe(function (component) {
                if (component instanceof SettingsPanel_1.SettingsPanel) {
                    isSettingsPanelShown = true;
                }
            });
            uimanager.onComponentHide.subscribe(function (component) {
                if (component instanceof SettingsPanel_1.SettingsPanel) {
                    isSettingsPanelShown = false;
                    if (isHideUiPending) {
                        _this.hideUi(true);
                        isHideUiPending = false;
                    }
                }
            });
        }
        this.hidingPrevented = function () {
            return config.hidePlayerStateExceptions && config.hidePlayerStateExceptions.indexOf(playerState) > -1;
        };
        this.showUi = function () {
            isHideUiPending = false;
            if (!isUiShown) {
                // Let subscribers know that they should reveal themselves
                uimanager.onControlsShow.dispatch(_this);
                isUiShown = true;
            }
            // Don't trigger timeout while seeking (it will be triggered once the seek is finished) or casting
            if (!isSeeking && !player.isCasting() && !_this.hidingPrevented()) {
                _this.uiHideTimeout.start();
            }
        };
        this.hideUi = function (force) {
            if (force === void 0) { force = false; }
            // Hide the UI only if it is shown, and if not casting
            if (isUiShown && !player.isCasting()) {
                if (force) {
                    uimanager.onControlsHide.dispatch(_this);
                    isUiShown = false;
                    return;
                }
                if (config.deferUiHideWhileSettingsOpen && isSettingsPanelShown) {
                    isHideUiPending = true;
                    return;
                }
                // Issue a preview event to check if we are good to hide the controls
                var previewHideEventArgs = {};
                uimanager.onPreviewControlsHide.dispatch(_this, previewHideEventArgs);
                if (!previewHideEventArgs.cancel) {
                    // If the preview wasn't canceled, let subscribers know that they should now hide themselves
                    uimanager.onControlsHide.dispatch(_this);
                    isUiShown = false;
                }
                else {
                    // If the hide preview was canceled, continue to show UI
                    _this.showUi();
                }
            }
        };
        this.toggleUiShown = function () {
            isUiShown ? _this.hideUi() : _this.showUi();
        };
        // Timeout to defer UI hiding by the configured delay time
        this.uiHideTimeout = new Timeout_1.Timeout(config.hideDelay, this.hideUi);
        var checkActionAllowed = function (e) {
            /**
             * The super-modern-UI has its own component, with its own listeners,
             * to detect touches on empty space {@link TouchControlOverlay}.
             * Because the {@link UIContainer} is the root container, it also detects these touches.
             * In order to let the {@link TouchControlOverlay} do its work correctly,
             * we check if the touched target is an instance of it.
             */
            return !(e.target.component instanceof TouchControlOverlay_1.TouchControlOverlay);
        };
        this.userInteractionEvents = [
            {
                // On touch displays, the first touch reveals the UI
                name: 'touchend',
                handler: function (e) {
                    if (!checkActionAllowed(e)) {
                        return;
                    }
                    var shouldPreventDefault = function (e) {
                        var findButtonComponent = function (element) {
                            if (!element ||
                                element === _this.userInteractionEventSource.get(0) ||
                                element.component instanceof UIContainer) {
                                return null;
                            }
                            if ((element.component && element.component instanceof Button_1.Button) ||
                                element.component instanceof TouchControlOverlay_1.TouchControlOverlay) {
                                return element.component;
                            }
                            else {
                                return findButtonComponent(element.parentElement);
                            }
                        };
                        var buttonComponent = findButtonComponent(e.target);
                        return !(buttonComponent && buttonComponent.getConfig().acceptsTouchWithUiHidden);
                    };
                    if (!isUiShown) {
                        // Only if the UI is hidden, we prevent other actions (except for the first touch) and reveal the UI
                        // instead. The first touch is not prevented to let other listeners receive the event and trigger an
                        // initial action, e.g. the huge playback button can directly start playback instead of requiring a double
                        // tap which 1. reveals the UI and 2. starts playback.
                        if (isFirstTouch && !player.isPlaying()) {
                            isFirstTouch = false;
                        }
                        else {
                            // On touch input devices, the first touch is expected to display the UI controls and not be propagated to
                            // other components.
                            // When buttons are always visible this causes UX problems, as the first touch is not recognized.
                            // This is the case for the {@link AdSkipButton} and {@link AdClickOverlay}.
                            // To prevent UX issues where the buttons need to be touched twice, we do not prevent the first touch event.
                            if (shouldPreventDefault(e)) {
                                e.preventDefault();
                            }
                        }
                        _this.showUi();
                    }
                },
            },
            {
                // When the mouse enters, we show the UI
                name: 'mouseenter',
                handler: function (e) {
                    if (checkActionAllowed(e)) {
                        _this.showUi();
                    }
                },
            },
            {
                // When the mouse moves within, we show the UI
                name: 'mousemove',
                handler: function (e) {
                    if (checkActionAllowed(e)) {
                        _this.showUi();
                    }
                },
            },
            {
                name: 'focusin',
                handler: function (e) {
                    if (checkActionAllowed(e)) {
                        _this.showUi();
                    }
                },
            },
            {
                name: 'keydown',
                handler: function (e) {
                    if (checkActionAllowed(e)) {
                        _this.showUi();
                    }
                },
            },
            {
                // When the mouse leaves, we can prepare to hide the UI, except a seek is going on
                name: 'mouseleave',
                handler: function () {
                    // When a seek is going on, the seek scrub pointer may exit the UI area while still seeking, and we do not
                    // hide the UI in such cases
                    if (!isSeeking && !_this.hidingPrevented()) {
                        if (_this.config.hideImmediatelyOnMouseLeave) {
                            _this.hideUi(true);
                        }
                        else {
                            _this.uiHideTimeout.start();
                        }
                    }
                },
            },
            {
                // When scrolling, we show the UI
                name: 'wheel',
                handler: function (e) {
                    if (checkActionAllowed(e)) {
                        _this.showUi();
                    }
                },
            },
        ];
        this.userInteractionEvents.forEach(function (event) { return _this.userInteractionEventSource.on(event.name, event.handler); });
        // Add click listener running on capture phase to intercept clicks before stopPropagation() in buttons
        this.userInteractionEventSource.on('click', function (e) {
            if (checkActionAllowed(e)) {
                _this.showUi();
            }
        }, { capture: true });
        uimanager.onSeek.subscribe(function () {
            _this.uiHideTimeout.clear(); // Don't hide UI while a seek is in progress
            isSeeking = true;
        });
        uimanager.onSeeked.subscribe(function () {
            isSeeking = false;
            if (!_this.hidingPrevented()) {
                _this.uiHideTimeout.start(); // Re-enable UI hide timeout after a seek
            }
        });
        uimanager.onComponentViewModeChanged.subscribe(function (_, _a) {
            var mode = _a.mode;
            return _this.trackComponentViewMode(mode);
        });
        player.on(player.exports.PlayerEvent.CastStarted, function () {
            _this.showUi(); // Show UI when a Cast session has started (UI will then stay permanently on during the session)
        });
        this.playerStateChange.subscribe(function (_, state) {
            playerState = state;
            if (_this.hidingPrevented()) {
                // Entering a player state that prevents hiding and forces the controls to be shown
                _this.uiHideTimeout.clear();
                _this.showUi();
            }
            else {
                // Entering a player state that allows hiding
                _this.uiHideTimeout.start();
            }
        });
    };
    UIContainer.prototype.configurePlayerStates = function (player, uimanager) {
        var _this = this;
        var container = this.getDomElement();
        // Convert player states into CSS class names
        var stateClassNames = [];
        for (var state in PlayerUtils_1.PlayerUtils.PlayerState) {
            if (isNaN(Number(state))) {
                var enumName = PlayerUtils_1.PlayerUtils.PlayerState[PlayerUtils_1.PlayerUtils.PlayerState[state]];
                stateClassNames[PlayerUtils_1.PlayerUtils.PlayerState[state]] = this.prefixCss(UIContainer.STATE_PREFIX + enumName.toLowerCase());
            }
        }
        var removeStates = function () {
            container.removeClass(stateClassNames[PlayerUtils_1.PlayerUtils.PlayerState.Idle]);
            container.removeClass(stateClassNames[PlayerUtils_1.PlayerUtils.PlayerState.Prepared]);
            container.removeClass(stateClassNames[PlayerUtils_1.PlayerUtils.PlayerState.Playing]);
            container.removeClass(stateClassNames[PlayerUtils_1.PlayerUtils.PlayerState.Paused]);
            container.removeClass(stateClassNames[PlayerUtils_1.PlayerUtils.PlayerState.Finished]);
        };
        var updateState = function (state) {
            removeStates();
            container.addClass(stateClassNames[state]);
            _this.playerStateChange.dispatch(_this, state);
        };
        player.on(player.exports.PlayerEvent.SourceLoaded, function () {
            updateState(PlayerUtils_1.PlayerUtils.PlayerState.Prepared);
        });
        player.on(player.exports.PlayerEvent.Play, function () {
            updateState(PlayerUtils_1.PlayerUtils.PlayerState.Playing);
        });
        player.on(player.exports.PlayerEvent.Playing, function () {
            updateState(PlayerUtils_1.PlayerUtils.PlayerState.Playing);
        });
        player.on(player.exports.PlayerEvent.Paused, function () {
            updateState(PlayerUtils_1.PlayerUtils.PlayerState.Paused);
        });
        player.on(player.exports.PlayerEvent.PlaybackFinished, function () {
            updateState(PlayerUtils_1.PlayerUtils.PlayerState.Finished);
        });
        player.on(player.exports.PlayerEvent.SourceUnloaded, function () {
            updateState(PlayerUtils_1.PlayerUtils.PlayerState.Idle);
        });
        uimanager.getConfig().events.onUpdated.subscribe(function () {
            updateState(PlayerUtils_1.PlayerUtils.getState(player));
        });
        // Fullscreen marker class
        player.on(player.exports.PlayerEvent.ViewModeChanged, function () {
            if (player.getViewMode() === player.exports.ViewMode.Fullscreen) {
                container.addClass(_this.prefixCss(UIContainer.FULLSCREEN));
            }
            else {
                container.removeClass(_this.prefixCss(UIContainer.FULLSCREEN));
            }
        });
        // Init fullscreen state
        if (player.getViewMode() === player.exports.ViewMode.Fullscreen) {
            container.addClass(this.prefixCss(UIContainer.FULLSCREEN));
        }
        // Buffering marker class
        player.on(player.exports.PlayerEvent.StallStarted, function () {
            container.addClass(_this.prefixCss(UIContainer.BUFFERING));
        });
        player.on(player.exports.PlayerEvent.StallEnded, function () {
            container.removeClass(_this.prefixCss(UIContainer.BUFFERING));
        });
        // Init buffering state
        if (player.isStalled()) {
            container.addClass(this.prefixCss(UIContainer.BUFFERING));
        }
        // RemoteControl marker class
        player.on(player.exports.PlayerEvent.CastStarted, function () {
            container.addClass(_this.prefixCss(UIContainer.REMOTE_CONTROL));
        });
        player.on(player.exports.PlayerEvent.CastStopped, function () {
            container.removeClass(_this.prefixCss(UIContainer.REMOTE_CONTROL));
        });
        // Init RemoteControl state
        if (player.isCasting()) {
            container.addClass(this.prefixCss(UIContainer.REMOTE_CONTROL));
        }
        // Controls visibility marker class
        uimanager.onControlsShow.subscribe(function () {
            container.removeClass(_this.prefixCss(UIContainer.CONTROLS_HIDDEN));
            container.addClass(_this.prefixCss(UIContainer.CONTROLS_SHOWN));
        });
        uimanager.onControlsHide.subscribe(function () {
            container.removeClass(_this.prefixCss(UIContainer.CONTROLS_SHOWN));
            container.addClass(_this.prefixCss(UIContainer.CONTROLS_HIDDEN));
        });
        // Layout size classes
        var updateLayoutSizeClasses = function (width, height) {
            container.removeClass(_this.prefixCss('layout-max-width-400'));
            container.removeClass(_this.prefixCss('layout-max-width-600'));
            container.removeClass(_this.prefixCss('layout-max-width-800'));
            container.removeClass(_this.prefixCss('layout-max-width-1200'));
            if (width <= 400) {
                container.addClass(_this.prefixCss('layout-max-width-400'));
            }
            else if (width <= 600) {
                container.addClass(_this.prefixCss('layout-max-width-600'));
            }
            else if (width <= 800) {
                container.addClass(_this.prefixCss('layout-max-width-800'));
            }
            else if (width <= 1200) {
                container.addClass(_this.prefixCss('layout-max-width-1200'));
            }
        };
        player.on(player.exports.PlayerEvent.PlayerResized, function (e) {
            // Convert strings (with "px" suffix) to ints
            var width = Math.round(Number(e.width.substring(0, e.width.length - 2)));
            var height = Math.round(Number(e.height.substring(0, e.height.length - 2)));
            updateLayoutSizeClasses(width, height);
        });
        // Init layout state
        updateLayoutSizeClasses(new DOM_1.DOM(player.getContainer()).width(), new DOM_1.DOM(player.getContainer()).height());
    };
    UIContainer.prototype.release = function () {
        var _this = this;
        // Explicitly unsubscribe user interaction event handlers because they could be attached to an external element
        // that isn't owned by the UI and therefore not removed on release.
        if (this.userInteractionEvents) {
            this.userInteractionEvents.forEach(function (event) { return _this.userInteractionEventSource.off(event.name, event.handler); });
        }
        _super.prototype.release.call(this);
        if (this.uiHideTimeout) {
            this.uiHideTimeout.clear();
        }
    };
    UIContainer.prototype.onPlayerStateChange = function () {
        return this.playerStateChange.getEvent();
    };
    UIContainer.prototype.suspendHideTimeout = function () {
        this.uiHideTimeout.suspend();
    };
    UIContainer.prototype.resumeHideTimeout = function () {
        this.uiHideTimeout.resume(!this.hidingPrevented());
    };
    UIContainer.prototype.toDomElement = function () {
        var container = _super.prototype.toDomElement.call(this);
        // Detect flexbox support (not supported in IE9)
        if (document && typeof document.createElement('p').style.flex !== 'undefined') {
            container.addClass(this.prefixCss('flexbox'));
        }
        else {
            container.addClass(this.prefixCss('no-flexbox'));
        }
        return container;
    };
    UIContainer.STATE_PREFIX = 'player-state-';
    UIContainer.FULLSCREEN = 'fullscreen';
    UIContainer.BUFFERING = 'buffering';
    UIContainer.REMOTE_CONTROL = 'remote-control';
    UIContainer.CONTROLS_SHOWN = 'controls-shown';
    UIContainer.CONTROLS_HIDDEN = 'controls-hidden';
    return UIContainer;
}(Container_1.Container));
exports.UIContainer = UIContainer;

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
exports.SettingsPanel = exports.NavigationDirection = void 0;
var Container_1 = require("../Container");
var SelectBox_1 = require("./SelectBox");
var Timeout_1 = require("../../utils/Timeout");
var EventDispatcher_1 = require("../../EventDispatcher");
var SettingsPanelPage_1 = require("./SettingsPanelPage");
var getKeyMapForPlatform_1 = require("../../spatialnavigation/getKeyMapForPlatform");
var types_1 = require("../../spatialnavigation/types");
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection[NavigationDirection["Forwards"] = 0] = "Forwards";
    NavigationDirection[NavigationDirection["Backwards"] = 1] = "Backwards";
})(NavigationDirection || (exports.NavigationDirection = NavigationDirection = {}));
/**
 * A panel containing a list of {@link SettingsPanelPage items}.
 *
 * To configure pages just pass them in the components array.
 *
 * Example:
 *  let settingsPanel = new SettingsPanel({
 *    hidden: true,
 *  });
 *
 *  let settingsPanelPage = new SettingsPanelPage({
 *    components: […]
 *  });
 *
 *  let secondSettingsPanelPage = new SettingsPanelPage({
 *    components: […]
 *  });
 *
 *  settingsPanel.addComponent(settingsPanelPage);
 *  settingsPanel.addComponent(secondSettingsPanelPage);
 *
 * For an example how to navigate between pages @see SettingsPanelPageNavigatorButton
 *
 * @category Components
 */
var SettingsPanel = /** @class */ (function (_super) {
    __extends(SettingsPanel, _super);
    function SettingsPanel(config) {
        var _this = _super.call(this, config) || this;
        _this.navigationStack = [];
        _this.currentState = null;
        _this.resetStateTimerId = null;
        _this.shouldResetStateImmediately = false;
        _this.settingsPanelEvents = {
            onSettingsStateChanged: new EventDispatcher_1.EventDispatcher(),
            onActivePageChanged: new EventDispatcher_1.EventDispatcher(),
        };
        _this.config = _this.mergeConfig(config, {
            cssClass: 'ui-settings-panel',
            hideDelay: 5000,
            pageTransitionAnimation: true,
            stateResetDelay: 5000,
        }, _this.config);
        _this.activePage = _this.getRootPage();
        _this.onActivePageChangedEvent();
        return _this;
    }
    SettingsPanel.prototype.configure = function (player, uimanager) {
        var _this = this;
        _super.prototype.configure.call(this, player, uimanager);
        var config = this.getConfig();
        uimanager.onControlsHide.subscribe(function () { return _this.hideHoveredSelectBoxes(); });
        uimanager.onComponentViewModeChanged.subscribe(function (_, _a) {
            var mode = _a.mode;
            return _this.trackComponentViewMode(mode);
        });
        if (config.hideDelay > -1) {
            this.hideTimeout = new Timeout_1.Timeout(config.hideDelay, function () {
                _this.hide();
                _this.hideHoveredSelectBoxes();
            });
            this.getDomElement().on('mouseenter mousemove', function () {
                _this.hideTimeout.reset();
            });
            this.getDomElement().on('mouseleave', function () {
                // On mouse leave activate the timeout
                _this.hideTimeout.reset();
            });
            this.getDomElement().on('focusin', function () {
                _this.hideTimeout.clear();
            });
            this.getDomElement().on('focusout', function () {
                _this.hideTimeout.reset();
            });
        }
        if (config.pageTransitionAnimation) {
            var handleResize = function () {
                // Reset the dimension of the settingsPanel to let the browser calculate the new dimension after resizing
                _this.getDomElement().css({ width: '', height: '' });
            };
            player.on(player.exports.PlayerEvent.PlayerResized, handleResize);
        }
        var maybeCloseSettingsPanel = function (event) {
            var action = (0, getKeyMapForPlatform_1.getKeyMapForPlatform)()[event.keyCode];
            if (action === types_1.Action.BACK) {
                _this.hide();
                _this.resetState();
            }
        };
        var scheduleResetState = function () {
            if (_this.resetStateTimerId !== null) {
                clearTimeout(_this.resetStateTimerId);
                _this.resetStateTimerId = null;
            }
            if (config.stateResetDelay > -1) {
                _this.resetStateTimerId = window.setTimeout(function () { return _this.resetState(); }, config.stateResetDelay);
            }
        };
        this.onHide.subscribe(function () {
            if (_this.shouldResetStateImmediately) {
                _this.currentState = null;
                _this.shouldResetStateImmediately = false;
            }
            else {
                _this.currentState = _this.maybeSaveCurrentState();
                scheduleResetState();
            }
            if (config.hideDelay > -1) {
                // Clear timeout when hidden from outside
                _this.hideTimeout.clear();
            }
            // Since we don't reset the actual navigation here we need to simulate a onInactive event in case some panel
            // needs to do something when they become invisible / inactive.
            _this.activePage.onInactiveEvent();
            document.removeEventListener('keyup', maybeCloseSettingsPanel);
        });
        this.onShow.subscribe(function () {
            if (_this.resetStateTimerId !== null) {
                clearTimeout(_this.resetStateTimerId);
                _this.resetStateTimerId = null;
            }
            if (_this.currentState !== null) {
                _this.restoreNavigationState(_this.currentState);
            }
            else {
                // No saved state (was reset), ensure visual classes are updated
                _this.updateActivePageClass();
            }
            // Since we don't need to navigate to the root page again we need to fire the onActive event when the settings
            // panel gets visible.
            _this.activePage.onActiveEvent();
            if (config.hideDelay > -1) {
                // Activate timeout when shown
                _this.hideTimeout.start();
            }
            document.addEventListener('keyup', maybeCloseSettingsPanel);
        });
        // pass event from root page through
        this.getRootPage().onSettingsStateChanged.subscribe(function () {
            _this.onSettingsStateChangedEvent();
        });
        uimanager.onControlsHide.subscribe(function () {
            _this.hide();
        });
        uimanager.onControlsShow.subscribe(function () {
            if (_this.currentState !== null) {
                _this.show();
            }
        });
        this.updateActivePageClass();
    };
    /**
     * Returns the current active / visible page
     * @return {SettingsPanelPage}
     */
    SettingsPanel.prototype.getActivePage = function () {
        return this.activePage;
    };
    /**
     * Sets the
     * @deprecated Use {@link setActivePage} instead
     * @param index
     */
    SettingsPanel.prototype.setActivePageIndex = function (index) {
        this.setActivePage(this.getPages()[index]);
    };
    /**
     * Adds the passed page to the navigation stack and makes it visible.
     * Use {@link popSettingsPanelPage} to navigate backwards.
     *
     * Results in no-op if the target page is the current page.
     * @param targetPage
     */
    SettingsPanel.prototype.setActivePage = function (targetPage) {
        if (targetPage === this.getActivePage()) {
            console.warn('Page is already the current one ... skipping navigation');
            return;
        }
        this.navigateToPage(targetPage, this.getActivePage(), NavigationDirection.Forwards, !this.config.pageTransitionAnimation);
    };
    /**
     * Resets the navigation stack by navigating back to the root page and displaying it.
     */
    SettingsPanel.prototype.popToRootSettingsPanelPage = function () {
        this.resetNavigation(this.config.pageTransitionAnimation);
    };
    /**
     * Removes the current page from the navigation stack and makes the previous one visible.
     * Results in a no-op if we are already on the root page.
     */
    SettingsPanel.prototype.popSettingsPanelPage = function () {
        if (this.navigationStack.length === 0) {
            console.warn('Already on the root page ... skipping navigation');
            return;
        }
        var targetPage = this.navigationStack[this.navigationStack.length - 2];
        // The root part isn't part of the navigation stack so handle it explicitly here
        if (!targetPage) {
            targetPage = this.getRootPage();
        }
        var currentActivePage = this.activePage;
        this.navigateToPage(targetPage, this.activePage, NavigationDirection.Backwards, !this.config.pageTransitionAnimation);
        if (currentActivePage.getConfig().removeOnPop) {
            this.removeComponent(currentActivePage);
            this.updateComponents();
        }
    };
    /**
     * Checks if there are active settings within the root page of the settings panel.
     * An active setting is a setting that is visible and enabled, which the user can interact with.
     * @returns {boolean} true if there are active settings, false if the panel is functionally empty to a user
     */
    SettingsPanel.prototype.rootPageHasActiveSettings = function () {
        return this.getRootPage().hasActiveSettings();
    };
    /**
     * Return all configured pages
     * @returns {SettingsPanelPage[]}
     */
    SettingsPanel.prototype.getPages = function () {
        return this.config.components.filter(function (component) { return component instanceof SettingsPanelPage_1.SettingsPanelPage; });
    };
    /**
     * Returns the root page of the settings panel.
     * @returns {SettingsPanelPage}
     */
    SettingsPanel.prototype.getRootPage = function () {
        return this.getPages()[0];
    };
    Object.defineProperty(SettingsPanel.prototype, "onSettingsStateChanged", {
        get: function () {
            return this.settingsPanelEvents.onSettingsStateChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SettingsPanel.prototype, "onActivePageChanged", {
        get: function () {
            return this.settingsPanelEvents.onActivePageChanged.getEvent();
        },
        enumerable: false,
        configurable: true
    });
    SettingsPanel.prototype.hideAndReset = function () {
        this.shouldResetStateImmediately = true;
        this.hide();
        this.resetState();
    };
    SettingsPanel.prototype.release = function () {
        _super.prototype.release.call(this);
        if (this.hideTimeout) {
            this.hideTimeout.clear();
        }
    };
    // Support adding settingsPanelPages after initialization
    SettingsPanel.prototype.addComponent = function (component) {
        if (this.getPages().length === 0 && component instanceof SettingsPanelPage_1.SettingsPanelPage) {
            this.activePage = component;
            this.onActivePageChangedEvent();
        }
        _super.prototype.addComponent.call(this, component);
    };
    SettingsPanel.prototype.addPage = function (page) {
        this.addComponent(page);
        this.updateComponents();
    };
    SettingsPanel.prototype.suspendHideTimeout = function () {
        this.hideTimeout.suspend();
    };
    SettingsPanel.prototype.resumeHideTimeout = function () {
        this.hideTimeout.resume(true);
    };
    SettingsPanel.prototype.updateActivePageClass = function () {
        var _this = this;
        this.getPages().forEach(function (page) {
            if (page === _this.activePage) {
                page.getDomElement().addClass(_this.prefixCss(SettingsPanel.CLASS_ACTIVE_PAGE));
            }
            else {
                page.getDomElement().removeClass(_this.prefixCss(SettingsPanel.CLASS_ACTIVE_PAGE));
            }
        });
    };
    SettingsPanel.prototype.resetNavigation = function (resetNavigationOnShow) {
        var sourcePage = this.getActivePage();
        var rootPage = this.getRootPage();
        if (sourcePage) {
            // Since the onInactiveEvent was already fired in the onHide we need to suppress it here
            if (!resetNavigationOnShow) {
                sourcePage.onInactiveEvent();
            }
        }
        this.navigationStack = [];
        this.animateNavigation(rootPage, sourcePage, resetNavigationOnShow);
        this.activePage = rootPage;
        this.updateActivePageClass();
        this.onActivePageChangedEvent();
    };
    Object.defineProperty(SettingsPanel.prototype, "wrapperScrollTop", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.innerContainerElement.get(0)) === null || _a === void 0 ? void 0 : _a.scrollTop) !== null && _b !== void 0 ? _b : 0;
        },
        set: function (value) {
            var element = this.innerContainerElement.get(0);
            if (element) {
                element.scrollTop = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    SettingsPanel.prototype.resetState = function () {
        this.activePage = this.getRootPage();
        this.navigationStack = [];
        this.currentState = null;
        this.resetStateTimerId = null;
        if (this.isHidden()) {
            // Clear dimensions only when hidden to avoid visible transition animation
            this.getDomElement().css({ width: '', height: '' });
        }
    };
    SettingsPanel.prototype.buildCurrentState = function () {
        var pages = this.getPages();
        var activePageIndex = pages.indexOf(this.getActivePage());
        var navigationStackIndices = this.navigationStack.map(function (p) { return pages.indexOf(p); });
        var panelElement = this.getDomElement().get(0);
        return {
            activePageIndex: activePageIndex,
            navigationStackIndices: navigationStackIndices,
            scrollTop: panelElement.scrollTop,
            wrapperScrollTop: this.wrapperScrollTop,
        };
    };
    SettingsPanel.prototype.isDefaultPanelState = function () {
        var _a;
        var panelElement = this.getDomElement().get(0);
        var atRoot = this.getActivePage() === this.getRootPage();
        var noNav = this.navigationStack.length === 0;
        var noScroll = ((_a = panelElement === null || panelElement === void 0 ? void 0 : panelElement.scrollTop) !== null && _a !== void 0 ? _a : 0) === 0 && this.wrapperScrollTop === 0;
        return atRoot && noNav && noScroll;
    };
    SettingsPanel.prototype.maybeSaveCurrentState = function () {
        return this.isDefaultPanelState() ? null : this.buildCurrentState();
    };
    SettingsPanel.prototype.restoreNavigationState = function (state) {
        var _a;
        var pages = this.getPages();
        this.activePage = (_a = pages[state.activePageIndex]) !== null && _a !== void 0 ? _a : this.getRootPage();
        this.navigationStack = state.navigationStackIndices.map(function (i) { return pages[i]; }).filter(Boolean);
        this.updateActivePageClass();
        this.onActivePageChangedEvent();
        this.activePage.onActiveEvent();
        this.getDomElement().get(0).scrollTop = state.scrollTop;
        this.wrapperScrollTop = state.wrapperScrollTop;
    };
    SettingsPanel.prototype.navigateToPage = function (targetPage, sourcePage, direction, skipAnimation) {
        this.activePage = targetPage;
        if (direction === NavigationDirection.Forwards) {
            this.navigationStack.push(targetPage);
        }
        else {
            this.navigationStack.pop();
        }
        this.animateNavigation(targetPage, sourcePage, skipAnimation);
        this.updateActivePageClass();
        sourcePage.onInactiveEvent();
        targetPage.onActiveEvent();
        this.onActivePageChangedEvent();
    };
    /**
     * @param targetPage
     * @param sourcePage
     * @param skipAnimation This is just an internal flag if we want to have an animation. It is set true when we reset
     * the navigation within the onShow callback of the settingsPanel. In this case we don't want an actual animation but
     * the recalculation of the dimension of the settingsPanel.
     * This is independent of the pageTransitionAnimation flag.
     */
    SettingsPanel.prototype.animateNavigation = function (targetPage, sourcePage, skipAnimation) {
        if (!this.config.pageTransitionAnimation) {
            return;
        }
        var settingsPanelDomElement = this.getDomElement();
        var settingsPanelHTMLElement = this.getDomElement().get(0);
        // get current dimension
        var settingsPanelWidth = settingsPanelHTMLElement.scrollWidth;
        var settingsPanelHeight = settingsPanelHTMLElement.scrollHeight;
        // calculate target size of the settings panel
        sourcePage.getDomElement().css('display', 'none');
        this.getDomElement().css({ width: '', height: '' }); // let css auto settings kick in again
        var targetPageHtmlElement = targetPage.getDomElement().get(0);
        // clone the targetPage DOM element so that we can calculate the width / height how they will be after
        // switching the page. We are using a clone to prevent (mostly styling) side-effects on the real DOM element
        var clone = targetPageHtmlElement.cloneNode(true);
        // append to parent so we get the 'real' size
        var containerWrapper = targetPageHtmlElement.parentNode;
        containerWrapper.appendChild(clone);
        // set clone visible
        clone.style.display = 'block';
        // collect target dimension
        var targetSettingsPanelWidth = settingsPanelHTMLElement.scrollWidth;
        var targetSettingsPanelHeight = settingsPanelHTMLElement.scrollHeight;
        // remove clone from the DOM
        clone.parentElement.removeChild(clone); // .remove() is not working in IE
        sourcePage.getDomElement().css('display', '');
        // set the values back to the current ones that the browser animates it (browsers don't animate 'auto' values)
        settingsPanelDomElement.css({
            width: settingsPanelWidth + 'px',
            height: settingsPanelHeight + 'px',
        });
        if (!skipAnimation) {
            // We need to force the browser to reflow between setting the width and height that we actually get a animation
            this.forceBrowserReflow();
        }
        // set the values to the target dimension
        settingsPanelDomElement.css({
            width: targetSettingsPanelWidth + 'px',
            height: targetSettingsPanelHeight + 'px',
        });
    };
    SettingsPanel.prototype.forceBrowserReflow = function () {
        // Force the browser to reflow the layout
        // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.getDomElement().get(0).offsetLeft;
    };
    /**
     * Workaround for IE, Firefox and Safari
     * when the settings panel fades out while an item of a select box is still hovered, the select box will not fade out
     * while the settings panel does. This would leave a floating select box, which is just weird
     */
    SettingsPanel.prototype.hideHoveredSelectBoxes = function () {
        this.getComputedItems()
            .map(function (item) { return item['settingComponent']; })
            .filter(function (component) { return component instanceof SelectBox_1.SelectBox; })
            .forEach(function (selectBox) { return selectBox.closeDropdown(); });
    };
    // collect all items from all pages (see hideHoveredSelectBoxes)
    SettingsPanel.prototype.getComputedItems = function () {
        var allItems = [];
        for (var _i = 0, _a = this.getPages(); _i < _a.length; _i++) {
            var page = _a[_i];
            allItems.push.apply(allItems, page.getItems());
        }
        return allItems;
    };
    SettingsPanel.prototype.onSettingsStateChangedEvent = function () {
        this.settingsPanelEvents.onSettingsStateChanged.dispatch(this);
    };
    SettingsPanel.prototype.onActivePageChangedEvent = function () {
        this.settingsPanelEvents.onActivePageChanged.dispatch(this);
    };
    SettingsPanel.CLASS_ACTIVE_PAGE = 'active';
    return SettingsPanel;
}(Container_1.Container));
exports.SettingsPanel = SettingsPanel;

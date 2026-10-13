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
exports.EcoModeContainer = void 0;
var i18n_1 = require("../localization/i18n");
var Container_1 = require("./Container");
var EcoModeToggleButton_1 = require("./buttons/EcoModeToggleButton");
var Label_1 = require("./labels/Label");
var SettingsPanelItem_1 = require("./settings/SettingsPanelItem");
var ToggleSettingsPanelItem_1 = require("./settings/ToggleSettingsPanelItem");
/**
 * @category Containers
 */
var EcoModeContainer = /** @class */ (function (_super) {
    __extends(EcoModeContainer, _super);
    function EcoModeContainer(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, config) || this;
        _this.savedEmissons = 0;
        var ecoModeToggleButton = new EcoModeToggleButton_1.EcoModeToggleButton();
        var labelEcoMode = new Label_1.Label({
            text: i18n_1.i18n.getLocalizer('ecoMode.title'),
            for: ecoModeToggleButton.getConfig().id,
            id: 'ecomodelabel',
        });
        _this.emissionsSavedLabel = new Label_1.Label({
            text: "".concat(_this.savedEmissons.toFixed(4), " gCO2"),
            cssClass: 'ui-label-savedEnergy',
        });
        _this.ecoModeToggleButtonItem = new ToggleSettingsPanelItem_1.ToggleSettingsPanelItem({
            label: labelEcoMode,
            settingComponent: ecoModeToggleButton,
        });
        _this.ecoModeSavedEmissionsItem = new SettingsPanelItem_1.SettingsPanelItem({
            label: 'Saved Emissions',
            settingComponent: _this.emissionsSavedLabel,
            hidden: true,
        });
        _this.addComponent(_this.ecoModeToggleButtonItem);
        _this.addComponent(_this.ecoModeSavedEmissionsItem);
        ecoModeToggleButton.onToggleOn.subscribe(function () {
            _this.ecoModeSavedEmissionsItem.show();
            _this.onToggleCallback();
        });
        ecoModeToggleButton.onToggleOff.subscribe(function () {
            _this.ecoModeSavedEmissionsItem.hide();
            _this.onToggleCallback();
        });
        return _this;
    }
    EcoModeContainer.prototype.setOnToggleCallback = function (callback) {
        this.onToggleCallback = callback;
    };
    EcoModeContainer.prototype.configure = function (player) {
        var _this = this;
        player.on(player.exports.PlayerEvent.SegmentPlayback, function (segment) {
            if (!segment.mimeType.includes('video')) {
                return;
            }
            var _a = segment.mediaInfo, height = _a.height, width = _a.width, bitrate = _a.bitrate, frameRate = _a.frameRate;
            var _b = _this.getMaxQualityAvailable(player.getAvailableVideoQualities()), maxHeight = _b.height, maxBitrate = _b.bitrate, maxWidth = _b.width;
            var currentEnergyKwh = _this.calculateEnergyConsumption(frameRate, height, width, bitrate, segment.duration);
            var maxEnergyKwh = _this.calculateEnergyConsumption(frameRate, maxHeight, maxWidth, maxBitrate, segment.duration);
            if (_this.ecoModeSavedEmissionsItem.isShown()) {
                _this.updateSavedEmissions(currentEnergyKwh, maxEnergyKwh, _this.emissionsSavedLabel);
            }
        });
    };
    EcoModeContainer.prototype.updateSavedEmissions = function (currentEnergyConsuption, maxEnergyConsuption, emissionsSavedLabel) {
        // 475 is the average carbon intensity of all countries in gCO2/kWh
        var averageCarbonIntensity = 475;
        this.currentEnergyEmission = currentEnergyConsuption * averageCarbonIntensity;
        var maxEnergyEmisson = maxEnergyConsuption * averageCarbonIntensity;
        this.savedEmissons += maxEnergyEmisson - this.currentEnergyEmission;
        emissionsSavedLabel.setText(this.savedEmissons.toFixed(4) + ' gCO2');
    };
    /**
     * The calculations are based on the following paper: https://arxiv.org/pdf/2210.05444.pdf
     */
    EcoModeContainer.prototype.calculateEnergyConsumption = function (fps, height, width, bitrate, duration) {
        var fpsWeight = 0.035;
        var pixeldWeight = 5.76e-9;
        var birateWeight = 6.97e-6;
        var constantOffset = 8.52;
        var bitrateInternetWeight = 3.24e-5;
        var internetConnectionOffset = 1.15;
        var videoCodec = 4.16;
        var energyConsumptionW = fpsWeight * fps +
            pixeldWeight * height * width +
            (birateWeight + bitrateInternetWeight) * (bitrate / 1000) +
            videoCodec +
            constantOffset +
            internetConnectionOffset;
        // Convert energy consumption from Watts (W) to Kilowatt-hours (kWh) for the given time duration of the segment
        var energyConsumptionKwh = (energyConsumptionW * duration) / 3.6e6;
        return energyConsumptionKwh;
    };
    EcoModeContainer.prototype.getMaxQualityAvailable = function (availableVideoQualities) {
        var sortedQualities = availableVideoQualities.sort(function (a, b) { return a.bitrate - b.bitrate; });
        return sortedQualities[sortedQualities.length - 1];
    };
    return EcoModeContainer;
}(Container_1.Container));
exports.EcoModeContainer = EcoModeContainer;

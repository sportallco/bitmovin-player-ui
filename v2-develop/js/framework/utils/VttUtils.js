"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VttUtils = void 0;
// Our default height of a line
var lineHeight = 28;
// Default relative line height
var lineHeightPercent = 5;
var lineCount = 1;
var defaultLineNumber = 21; // Our default amount of lines
var Direction;
(function (Direction) {
    Direction["Top"] = "top";
    Direction["Bottom"] = "bottom";
    Direction["Left"] = "left";
    Direction["Right"] = "right";
})(Direction || (Direction = {}));
var VttVerticalWriting;
(function (VttVerticalWriting) {
    VttVerticalWriting["GrowingRight"] = "lr";
    VttVerticalWriting["GrowingLeft"] = "rl";
})(VttVerticalWriting || (VttVerticalWriting = {}));
var DirectionPair = new Map([
    [Direction.Top, Direction.Bottom],
    [Direction.Bottom, Direction.Top],
    [Direction.Left, Direction.Right],
    [Direction.Right, Direction.Left],
]);
/**
 * Sets the default standardized styles for the Cue Box
 * https://w3.org/TR/webvtt1/#applying-css-properties
 */
var setDefaultVttStyles = function (cueContainerDom, vtt) {
    if (vtt.region) {
        cueContainerDom.css('position', 'relative');
        cueContainerDom.css('unicode-bidi', 'plaintext');
    }
    else {
        cueContainerDom.css('position', 'absolute');
        cueContainerDom.css('overflow-wrap', 'break-word');
        cueContainerDom.css('overflow', 'hidden');
        cueContainerDom.css('flex-flow', 'column');
    }
    cueContainerDom.css('display', 'inline-flex');
};
/**
 * Align the Cue Box's line
 * https://w3.org/TR/webvtt1/#webvtt-cue-line-alignment
 */
var setVttLineAlign = function (cueContainerDom, _a, direction, relativeCueBoxPosition) {
    var lineAlign = _a.lineAlign;
    switch (lineAlign) {
        case 'center':
            setCssForCenterLineAlign(cueContainerDom, direction, relativeCueBoxPosition);
            break;
        case 'end':
            setCssForEndLineAlign(cueContainerDom, direction, relativeCueBoxPosition);
    }
};
/**
 * Defines the line positioning of the Cue Box
 * https://w3.org/TR/webvtt1/#webvtt-cue-line
 */
var setVttLine = function (cueContainerDom, vtt, direction, subtitleOverLaySize) {
    var overlayReferenceEdge = DirectionPair.get(direction);
    if (vtt.line === 'auto' && vtt.vertical) {
        cueContainerDom.css(overlayReferenceEdge, '0');
        return;
    }
    if (vtt.line === 'auto' && !vtt.vertical) {
        return;
    }
    var relativeLinePosition = parseFloat(vtt.line);
    if (vtt.snapToLines) {
        var targetLine = Number(vtt.line);
        if (targetLine < 0) {
            targetLine = defaultLineNumber + targetLine;
        }
        var lineHeight_1 = subtitleOverLaySize.height / defaultLineNumber;
        var absoluteLinePosition = lineHeight_1 * targetLine;
        relativeLinePosition = (100 * absoluteLinePosition) / subtitleOverLaySize.height;
    }
    if (vtt.lineAlign !== 'end')
        cueContainerDom.css(overlayReferenceEdge, "".concat(relativeLinePosition, "%"));
    setVttLineAlign(cueContainerDom, vtt, direction, relativeLinePosition);
};
/**
 * Defines the writing direction of the Cue Box
 * https://w3.org/TR/webvtt1/#webvtt-cue-writing-direction
 */
var setVttWritingDirectionAndCueBoxPositioning = function (cueContainerDom, vtt, subtitleOverlaySize) {
    switch (vtt.vertical) {
        case '':
            cueContainerDom.css('writing-mode', 'horizontal-tb');
            cueContainerDom.css(Direction.Bottom, '0');
            setVttLine(cueContainerDom, vtt, Direction.Bottom, subtitleOverlaySize);
            break;
        case VttVerticalWriting.GrowingRight:
            setCueBoxPositionForVerticalWriting(cueContainerDom, Direction.Right, vtt, subtitleOverlaySize);
            break;
        case VttVerticalWriting.GrowingLeft:
            setCueBoxPositionForVerticalWriting(cueContainerDom, Direction.Left, vtt, subtitleOverlaySize);
            break;
    }
};
var setCueBoxPositionForVerticalWriting = function (cueContainerDom, direction, vtt, subtitleOverlaySize) {
    var writingMode = direction === Direction.Right ? 'vertical-lr' : 'vertical-rl';
    cueContainerDom.css('writing-mode', writingMode);
    cueContainerDom.css(Direction.Top, '0');
    setVttLine(cueContainerDom, vtt, direction, subtitleOverlaySize);
};
/**
 * Defines the Cue position alignment
 * https://w3.org/TR/webvtt1/#webvtt-cue-position-alignment
 */
var setVttPositionAlign = function (cueContainerDom, vtt, direction) {
    // https://www.w3.org/TR/webvtt1/#webvtt-cue-position
    if (vtt.position === 'auto') {
        cueContainerDom.css(direction, '0');
    }
    else {
        switch (vtt.positionAlign) {
            case 'line-left':
                cueContainerDom.css(direction, "".concat(vtt.position, "%"));
                cueContainerDom.css(DirectionPair.get(direction), 'auto');
                cueContainerDom.css('justify-content', 'flex-start');
                break;
            case 'center':
                cueContainerDom.css(direction, "".concat(vtt.position - vtt.size / 2, "%"));
                cueContainerDom.css(DirectionPair.get(direction), 'auto');
                cueContainerDom.css('justify-content', 'center');
                break;
            case 'line-right':
                cueContainerDom.css(direction, 'auto');
                cueContainerDom.css(DirectionPair.get(direction), "".concat(100 - vtt.position, "%"));
                cueContainerDom.css('justify-content', 'flex-end');
                break;
            default:
                cueContainerDom.css(direction, "".concat(vtt.position, "%"));
                cueContainerDom.css('justify-content', 'flex-start');
        }
    }
};
var countLines = function (innerHtml) { return innerHtml.split('<br />').length; };
var setCssForCenterLineAlign = function (cueContainerDom, direction, relativeCueBoxPosition) {
    switch (direction) {
        case Direction.Bottom:
            cueContainerDom.css('transform', 'translateY(-50%)');
            break;
        case Direction.Left:
            cueContainerDom.css('transform', 'translateX(50%)');
            break;
        case Direction.Right:
            cueContainerDom.css('transform', 'translateX(-50%)');
            break;
    }
};
var setCssForEndLineAlign = function (cueContainerDom, direction, offset) {
    var opositeToOverlayReferenceEdge = direction;
    cueContainerDom.css(opositeToOverlayReferenceEdge, "".concat(100 - offset, "%"));
};
/**
 * @category Utils
 */
var VttUtils;
(function (VttUtils) {
    VttUtils.setVttCueBoxStyles = function (cueContainer, subtitleOverlaySize) {
        var vtt = cueContainer.vtt;
        var cueContainerDom = cueContainer.getDomElement();
        setDefaultVttStyles(cueContainerDom, vtt);
        lineCount = countLines(cueContainer.getText());
        setVttWritingDirectionAndCueBoxPositioning(cueContainerDom, vtt, subtitleOverlaySize);
        // https://w3.org/TR/webvtt1/#webvtt-cue-text-alignment
        var textAlign = vtt.align === 'middle' ? 'center' : vtt.align;
        cueContainerDom.css('text-align', textAlign);
        // https://w3.org/TR/webvtt1/#webvtt-cue-size
        var containerSize = vtt.size;
        if (vtt.vertical === '') {
            cueContainerDom.css('width', "".concat(containerSize, "%"));
            setVttPositionAlign(cueContainerDom, vtt, Direction.Left);
        }
        else {
            cueContainerDom.css('height', "".concat(containerSize, "%"));
            setVttPositionAlign(cueContainerDom, vtt, Direction.Top);
        }
    };
    /** https://www.w3.org/TR/webvtt1/#regions
     *  https://www.speechpad.com/captions/webvtt#toc_16
     */
    VttUtils.setVttRegionStyles = function (regionContainer, region, overlaySize) {
        var regionContainerDom = regionContainer.getDomElement();
        var regionPositionX = (overlaySize.width * region.viewportAnchorX) / 100 -
            (((overlaySize.width * region.width) / 100) * region.regionAnchorX) / 100;
        var regionPositionY = (overlaySize.height * region.viewportAnchorY) / 100 - (region.lines * lineHeight * region.regionAnchorY) / 100;
        regionContainerDom.css('position', 'absolute');
        regionContainerDom.css('overflow', 'hidden');
        regionContainerDom.css('width', "".concat(region.width, "%"));
        regionContainerDom.css(Direction.Left, "".concat(regionPositionX, "px"));
        regionContainerDom.css(Direction.Right, 'unset');
        regionContainerDom.css(Direction.Top, "".concat(regionPositionY, "px"));
        regionContainerDom.css(Direction.Bottom, 'unset');
        regionContainerDom.css('height', "".concat(region.lines * lineHeight, "px"));
    };
})(VttUtils || (exports.VttUtils = VttUtils = {}));

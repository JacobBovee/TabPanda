"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var getAdjustedSize = function (originalWidth, originalHeight, finalHeight) {
    var adjustedWidth = finalHeight * (originalWidth / originalHeight);
    return {
        width: adjustedWidth + "px",
        height: finalHeight + "px"
    };
};
function Icon(props) {
    var type = props.type, iconSrc = props.iconSrc, size = props.size, className = props.className;
    if (type === 'custom' && iconSrc) {
        var iconImg = new Image();
        iconImg.src = iconSrc;
        var _a = getAdjustedSize(iconImg.width, iconImg.height, size || 12), width = _a.width, height = _a.height;
        var style = {
            width: width,
            height: height,
            backgroundImage: "url('" + iconSrc + "')",
            backgroundSize: 'contain',
            display: 'inline-block'
        };
        return (preact_1.h("i", { className: "custom-icon " + className, style: style }));
    }
    else {
        return (preact_1.h("i", { className: type + "-icon " + className }));
    }
}
exports.default = Icon;

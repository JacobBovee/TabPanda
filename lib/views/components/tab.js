"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var icon_1 = __importDefault(require("./icon"));
var constants_1 = require("../../constants");
function Tab(props) {
    var _a;
    var tab = props.tab;
    var ico = tab.favIconUrl ? preact_1.h(icon_1.default, { type: 'custom', iconSrc: tab.favIconUrl }) : preact_1.h(icon_1.default, { type: "link" });
    var dataAttributes = (_a = {}, _a[constants_1.DATA_TAB_ID_ATTRIBUTE_NAME] = tab.id, _a);
    return (preact_1.h("li", __assign({ class: "tab" }, dataAttributes),
        preact_1.h("span", null,
            ico,
            tab.title),
        preact_1.h(icon_1.default, { className: 'more', type: 'more' })));
}
exports.default = Tab;

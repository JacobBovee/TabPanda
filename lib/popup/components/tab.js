"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var icon_1 = __importDefault(require("./icon"));
function Tab(props) {
    var tab = props.tab;
    var ico = tab.favIconUrl ? preact_1.h(icon_1.default, { type: 'custom', iconSrc: tab.favIconUrl }) : preact_1.h(icon_1.default, { type: "link" });
    return (preact_1.h("li", { class: "tab", "data-tab-id": tab.index },
        preact_1.h("span", null,
            ico,
            tab.title),
        preact_1.h(icon_1.default, { className: 'more', type: 'more' })));
}
exports.default = Tab;

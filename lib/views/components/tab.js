"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var tabManager_1 = require("../../manager/tabManager");
var Tab = /** @class */ (function (_super) {
    __extends(Tab, _super);
    function Tab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tab.prototype.render = function () {
        var _a;
        var _b = this.props, tab = _b.tab, folder = _b.folder, updateFolder = _b.updateFolder;
        var ico = tab.favIconUrl ? preact_1.h(icon_1.default, { type: 'custom', iconSrc: tab.favIconUrl }) : preact_1.h(icon_1.default, { type: "link" });
        var dataAttributes = (_a = {}, _a[constants_1.DATA_TAB_ID_ATTRIBUTE_NAME] = tab.id, _a);
        return (preact_1.h("li", __assign({ onDblClick: function () { return folder && tabManager_1.TabFolder.restoreStatic(folder, tab); }, draggable: true, onDragStart: function (ev) { var _a; return tab.id && ((_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('tabId', tab.id.toString())); }, onDrag: function (ev) { }, onDragEnd: function (ev) {
                if (folder && ev.target) {
                    var target = ev.target;
                    var targetId = target.getAttribute('data-folder');
                    if (targetId && parseInt(targetId) !== folder.id) {
                        folder.deleteTab(tab);
                        updateFolder();
                    }
                }
            }, class: "tab" }, dataAttributes),
            preact_1.h("span", null,
                ico,
                tab.title),
            preact_1.h(icon_1.default, { className: 'more-tab', type: 'more' })));
    };
    return Tab;
}(preact_1.Component));
exports.default = Tab;

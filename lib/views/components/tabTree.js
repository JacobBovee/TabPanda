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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var tabList_1 = __importDefault(require("./tabList"));
var TabTree = /** @class */ (function (_super) {
    __extends(TabTree, _super);
    function TabTree(props) {
        var _this = _super.call(this, props) || this;
        _this.contextMenuClick = function (event) {
            _this.setState({ contextVisible: true });
        };
        _this.state = {
            contextVisible: false
        };
        return _this;
    }
    TabTree.prototype.render = function () {
        var _a = this.props, tabFolders = _a.tabFolders, activeTabs = _a.activeTabs;
        return (preact_1.h("div", { id: "tabTree" },
            preact_1.h("ul", { class: "parent" },
                tabFolders && tabFolders.map(function (folder) {
                    return preact_1.h(tabList_1.default, { folder: folder });
                }),
                activeTabs && preact_1.h(tabList_1.default, { tabs: activeTabs }))));
    };
    return TabTree;
}(preact_1.Component));
exports.default = TabTree;

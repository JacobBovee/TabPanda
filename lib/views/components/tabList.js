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
var folderItem_1 = __importDefault(require("./folderItem"));
var TabList = /** @class */ (function (_super) {
    __extends(TabList, _super);
    function TabList(props) {
        var _this = _super.call(this, props) || this;
        _this.getTabById = _this.getTabById.bind(_this);
        _this.updateFolder = _this.updateFolder.bind(_this);
        return _this;
    }
    TabList.prototype.getTabById = function (id) {
        var allTabs = this.props.allTabs;
        return allTabs.find(function (tab) { return tab.id === id; });
    };
    TabList.prototype.updateFolder = function () {
        this.forceUpdate();
    };
    TabList.prototype.render = function () {
        var folder = this.props.folder;
        return preact_1.h(folderItem_1.default, { getTabById: this.getTabById, folder: folder });
    };
    return TabList;
}(preact_1.Component));
exports.default = TabList;

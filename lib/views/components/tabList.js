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
var tab_1 = __importDefault(require("./tab"));
var folderItem_1 = __importDefault(require("./folderItem"));
var TabList = /** @class */ (function (_super) {
    __extends(TabList, _super);
    function TabList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabList.prototype.render = function () {
        var _a = this.props, tabs = _a.tabs, folder = _a.folder;
        if (folder) {
            return preact_1.h(folderItem_1.default, { folder: folder });
        }
        if (tabs) {
            return (preact_1.h("ul", null, tabs && tabs.map(function (tab) { return preact_1.h(tab_1.default, { tab: tab }); })));
        }
    };
    return TabList;
}(preact_1.Component));
exports.default = TabList;

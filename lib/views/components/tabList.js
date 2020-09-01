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
var icon_1 = __importDefault(require("./icon"));
var TabList = /** @class */ (function (_super) {
    __extends(TabList, _super);
    function TabList(props) {
        var _this = _super.call(this, props) || this;
        _this.saveFolderName = _this.saveFolderName.bind(_this);
        _this.handleInputKeyDown = _this.handleInputKeyDown.bind(_this);
        _this.inputField = _this.inputField.bind(_this);
        _this.toggleCollapse = _this.toggleCollapse.bind(_this);
        return _this;
    }
    TabList.prototype.componentDidUpdate = function () {
        var folder = this.props.folder;
        if (folder && folder.editTitle && this.input) {
            this.input.focus();
        }
    };
    TabList.prototype.saveFolderName = function () {
        var _a;
        var name = (_a = this.input) === null || _a === void 0 ? void 0 : _a.value;
        var folder = this.props.folder;
        if (folder) {
            if (name && name.length) {
                folder.name = name;
            }
            else {
                folder.name = 'New folder';
            }
            folder.editTitle = false;
            this.setState({ folder: folder });
        }
    };
    TabList.prototype.handleInputKeyDown = function (e) {
        var _a;
        if (e.key === 'Enter') {
            this.saveFolderName();
            (_a = this.input) === null || _a === void 0 ? void 0 : _a.blur();
        }
    };
    TabList.prototype.inputField = function () {
        var _this = this;
        var _a;
        if (document.activeElement) {
            try {
                document.activeElement.blur();
                (_a = this.input) === null || _a === void 0 ? void 0 : _a.focus();
            }
            catch (e) {
                // no autofocus available
            }
        }
        return (preact_1.h("input", { type: "text", autoFocus: true, tabIndex: 1, onBlur: this.saveFolderName, onKeyPress: this.handleInputKeyDown, ref: function (input) { return _this.input = input; } }));
    };
    TabList.prototype.toggleCollapse = function () {
        var collapsed = this.state.collapsed;
        this.setState({ collapsed: !collapsed });
    };
    TabList.prototype.render = function () {
        var _a = this.props, tabs = _a.tabs, folder = _a.folder;
        var collapsed = this.state.collapsed;
        if (folder) {
            return (preact_1.h("div", null,
                preact_1.h("li", { className: "folder " + (collapsed ? 'collapsed' : ''), "data-folder": "" + folder.id, onClick: this.toggleCollapse },
                    preact_1.h("div", null,
                        preact_1.h(icon_1.default, { type: 'triangle' }),
                        preact_1.h(icon_1.default, { type: 'folder' }),
                        folder.editTitle ?
                            this.inputField()
                            :
                                folder.name),
                    !collapsed &&
                        preact_1.h("ul", null, folder && folder.tabs.map(function (tab) { return preact_1.h(tab_1.default, { tab: tab }); })))));
        }
        if (tabs) {
            return (preact_1.h("ul", null, tabs && tabs.map(function (tab) { return preact_1.h(tab_1.default, { tab: tab }); })));
        }
    };
    return TabList;
}(preact_1.Component));
exports.default = TabList;

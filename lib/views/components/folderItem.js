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
var icon_1 = __importDefault(require("./icon"));
var tab_1 = __importDefault(require("./tab"));
var FolderItem = /** @class */ (function (_super) {
    __extends(FolderItem, _super);
    function FolderItem(props) {
        var _this = _super.call(this, props) || this;
        _this.saveFolderName = _this.saveFolderName.bind(_this);
        _this.handleInputKeyDown = _this.handleInputKeyDown.bind(_this);
        _this.inputField = _this.inputField.bind(_this);
        _this.toggleCollapse = _this.toggleCollapse.bind(_this);
        _this.onTabDrop = _this.onTabDrop.bind(_this);
        _this.updateFolder = _this.updateFolder.bind(_this);
        return _this;
    }
    FolderItem.prototype.componentDidUpdate = function () {
        var folder = this.props.folder;
        if (folder.editTitle && this.input) {
            this.input.focus();
        }
    };
    FolderItem.prototype.saveFolderName = function () {
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
        }
    };
    FolderItem.prototype.handleInputKeyDown = function (e) {
        var _a;
        if (e.key === 'Enter') {
            this.saveFolderName();
            (_a = this.input) === null || _a === void 0 ? void 0 : _a.blur();
        }
    };
    FolderItem.prototype.inputField = function () {
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
    FolderItem.prototype.toggleCollapse = function () {
        var collapsed = this.state.collapsed;
        this.setState({ collapsed: !collapsed });
    };
    FolderItem.prototype.onTabDrop = function (ev) {
        ev.preventDefault();
        var _a = this.props, getTabById = _a.getTabById, folder = _a.folder;
        if (ev.target && ev.dataTransfer) {
            var tabId = parseInt(ev.dataTransfer.getData('tabId'));
            var tab = getTabById(tabId);
            ev.dataTransfer.setData('droppedFolder', folder.id.toString());
            if (tab) {
                if (!folder.tabs.includes(tab)) {
                    folder.setTab(tab);
                    this.forceUpdate();
                }
                else {
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }
        }
    };
    FolderItem.prototype.updateFolder = function () {
        this.forceUpdate();
    };
    FolderItem.prototype.render = function () {
        var _this = this;
        var collapsed = this.state.collapsed;
        var _a = this.props, folder = _a.folder, hideFolder = _a.hideFolder;
        if (folder.id === -1 || hideFolder) {
            return (preact_1.h("ul", null, folder.tabs.map(function (tab) { return preact_1.h(tab_1.default, { updateFolder: _this.updateFolder, folder: folder, tab: tab }); })));
        }
        return (preact_1.h("div", { onDragOver: function (event) {
                event.stopPropagation();
                event.preventDefault();
            }, onDrop: this.onTabDrop },
            preact_1.h("li", { className: "folder " + (collapsed ? 'collapsed' : ''), "data-folder": "" + folder.id },
                preact_1.h("div", { onClick: this.toggleCollapse },
                    preact_1.h(icon_1.default, { type: 'triangle' }),
                    preact_1.h(icon_1.default, { type: 'folder' }),
                    folder.editTitle ?
                        this.inputField()
                        :
                            folder.name),
                !collapsed &&
                    preact_1.h("ul", null, folder && folder.tabs.map(function (tab) { return preact_1.h(tab_1.default, { updateFolder: _this.updateFolder, folder: folder, tab: tab }); })))));
    };
    return FolderItem;
}(preact_1.Component));
exports.default = FolderItem;

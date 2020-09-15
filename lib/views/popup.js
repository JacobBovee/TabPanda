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
var header_1 = __importDefault(require("./components/header"));
var tabTree_1 = __importDefault(require("./components/tabTree"));
var actionItems_1 = __importDefault(require("./components/actionItems"));
var tabManager_1 = require("../manager/tabManager");
var contextMenu_1 = __importDefault(require("./components/contextMenu"));
var warning_1 = __importDefault(require("./components/warning"));
var constants_1 = require("../constants");
var Popup = /** @class */ (function (_super) {
    __extends(Popup, _super);
    function Popup(props) {
        var _this = _super.call(this, props) || this;
        _this.setTabFolders = _this.setTabFolders.bind(_this);
        _this.collapseActiveAction = _this.collapseActiveAction.bind(_this);
        _this.saveAction = _this.saveAction.bind(_this);
        _this.cancelAction = _this.cancelAction.bind(_this);
        _this.newFolderAction = _this.newFolderAction.bind(_this);
        _this.updateState = _this.updateState.bind(_this);
        return _this;
    }
    Popup.prototype.componentDidMount = function () {
        var tabManager = this.props.tabManager;
        this.setTabFolders(tabManager.tabFolders);
    };
    Popup.prototype.setTabFolders = function (folders) {
        this.setState({ tabFolders: folders });
    };
    Popup.prototype.collapseActiveAction = function () {
        var tabManager = this.props.tabManager;
        var activeTabs = tabManager.activeTabs;
        tabManager.createTabFolder('New folder', activeTabs.tabs, true);
        activeTabs.tabs = [];
        this.setState({
            tabFolders: tabManager.tabFolders,
        });
    };
    Popup.prototype.newFolderAction = function () {
        var tabManager = this.props.tabManager;
        tabManager.createTabFolder('New folder', [], true);
        this.updateState(tabManager);
    };
    Popup.prototype.cancelAction = function () {
        window.close();
    };
    Popup.prototype.saveAction = function () {
        var tabManager = this.props.tabManager;
        tabManager.store({ tabFolders: this.state.tabFolders });
    };
    Popup.prototype.updateState = function (tabManager) {
        this.setTabFolders(tabManager.tabFolders);
    };
    Popup.prototype.render = function () {
        var _this = this;
        var tabManager = this.props.tabManager;
        var _a = this.state, tabFolders = _a.tabFolders, warning = _a.warning;
        var activeTabs = tabManager.activeTabs;
        var actions = [
            {
                title: 'New folder',
                onClick: function (_) { return function () {
                    _this.newFolderAction();
                    _this.updateState(tabManager);
                }; },
                contexts: [{
                        id: 'tabTree'
                    }],
                leftContext: {
                    class: 'more-folder'
                }
            },
            {
                title: 'Restore folder',
                onClick: function (event) {
                    var folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        tabManager.restoreFolder(folder);
                        _this.updateState(tabManager);
                    }
                },
                contexts: [{
                        class: 'folder'
                    }],
                leftContext: {
                    class: 'more-folder'
                }
            },
            {
                title: 'Delete folder',
                onClick: function (event) {
                    var folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        tabManager.deleteFolder(folder);
                        _this.updateState(tabManager);
                        tabManager.store();
                    }
                },
                contexts: [{
                        class: 'folder'
                    }],
                leftContext: {
                    class: 'more-folder'
                }
            },
            {
                title: 'Restore tab',
                onClick: function (event) {
                    var folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        var tab = tabManager.getTabFromEvent(event, folder.tabs, constants_1.DATA_TAB_ID_ATTRIBUTE_NAME);
                        if (tab) {
                            tabManager_1.TabFolder.restoreStatic(folder, tab);
                            tabManager.store();
                        }
                    }
                },
                contexts: [{
                        class: 'tab'
                    }],
                leftContext: {
                    class: 'more-tab'
                }
            },
            {
                title: 'Delete tab',
                onClick: function (event) {
                    var folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        var folderTab = tabManager.getTabFromEvent(event, folder.tabs, constants_1.DATA_TAB_ID_ATTRIBUTE_NAME);
                        if (folderTab) {
                            tabManager_1.TabFolder.deleteTabStatic(folder, folderTab);
                        }
                    }
                    _this.updateState(tabManager);
                },
                contexts: [{
                        class: 'tab'
                    }],
                leftContext: {
                    class: 'more more-tab'
                }
            }
        ];
        return (preact_1.h("div", { id: "wrapper" },
            preact_1.h(header_1.default, { title: 'Edit tabs', id: 'collapseActiveBtn', actionTitle: 'Collapse Active', actionFn: this.collapseActiveAction }),
            preact_1.h(tabTree_1.default, { tabFolders: tabFolders, activeTabs: activeTabs }),
            preact_1.h(actionItems_1.default, { saveAction: this.saveAction, cancelAction: this.cancelAction, newFolderAction: this.newFolderAction }),
            preact_1.h(contextMenu_1.default, { actions: actions }),
            warning && preact_1.h(warning_1.default, { title: 'You have unsaved changes', message: 'Would you like to save your changes?', cancelAction: this.cancelAction, saveAction: this.saveAction })));
    };
    return Popup;
}(preact_1.Component));
exports.default = Popup;

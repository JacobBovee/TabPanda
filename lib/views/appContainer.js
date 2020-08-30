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
var utils_1 = require("../utils");
var warning_1 = __importDefault(require("./components/warning"));
var constants_1 = require("../constants");
var Popup = /** @class */ (function (_super) {
    __extends(Popup, _super);
    function Popup(props) {
        var _this = _super.call(this, props) || this;
        _this.setTabFolders = _this.setTabFolders.bind(_this);
        _this.setActiveTabs = _this.setActiveTabs.bind(_this);
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
        tabManager_1.TabManager.getActiveTabs(this.setActiveTabs, true);
    };
    Popup.prototype.setTabFolders = function (folders) {
        this.setState({ tabFolders: folders });
    };
    Popup.prototype.setActiveTabs = function (tabs) {
        this.setState({ activeTabs: tabs });
    };
    Popup.prototype.collapseActiveAction = function () {
        var tabManager = this.props.tabManager;
        var activeTabs = this.state.activeTabs;
        tabManager.createTabFolder('New folder', activeTabs, true);
        this.setState({
            tabFolders: tabManager.tabFolders,
            activeTabs: []
        });
    };
    Popup.prototype.newFolderAction = function () {
        var tabManager = this.props.tabManager;
        tabManager.createTabFolder('New folder', [], true);
    };
    Popup.prototype.cancelAction = function () {
        window.close();
    };
    Popup.prototype.saveAction = function () {
        var tabManager = this.props.tabManager;
        tabManager.store(this.state);
    };
    Popup.prototype.updateState = function (tabManager) {
        this.setTabFolders(tabManager.tabFolders);
    };
    Popup.prototype.getTabFromEvent = function (event, folder) {
        var activeTabs = this.state.activeTabs;
        var rootElement = event.target;
        var tabElement = utils_1.findParentWithMatchingAttribute(rootElement, constants_1.DATA_TAB_ID_ATTRIBUTE_NAME);
        var tabIndexString = tabElement.getAttribute(constants_1.DATA_TAB_ID_ATTRIBUTE_NAME);
        var tabId = tabIndexString ? parseInt(constants_1.DATA_TAB_ID_ATTRIBUTE_NAME) : 0;
        if (folder) {
            return folder.tabs.find(function (tab) { return tab.id === tabId; });
            ;
        }
        return activeTabs.find(function (tab) { return tab.id === tabId; });
    };
    Popup.prototype.render = function () {
        var _this = this;
        var tabManager = this.props.tabManager;
        var _a = this.state, tabFolders = _a.tabFolders, activeTabs = _a.activeTabs, warning = _a.warning;
        var actions = [
            {
                title: 'New folder',
                onClick: function (_) { return _this.newFolderAction(); },
                contexts: [{
                        id: 'tabTree'
                    }],
                leftContext: {
                    class: 'more'
                }
            },
            {
                title: 'Restore folder',
                onClick: function (event) {
                    var folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        tabManager_1.TabFolder.restoreAllStatic(folder);
                        tabManager.store();
                    }
                },
                contexts: [{
                        class: 'folder'
                    }]
            },
            {
                title: 'Delete folder',
                onClick: function (event) {
                    var folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        tabManager.deleteFolder(folder);
                    }
                },
                contexts: [{
                        class: 'folder'
                    }]
            },
            {
                title: 'Restore tab',
                onClick: function (event) {
                    var folder = tabManager.getFolderFromEvent(event);
                    var tab = _this.getTabFromEvent(event, folder);
                    if (folder && tab) {
                        tabManager_1.TabFolder.restoreStatic(folder, tab);
                        tabManager.store();
                    }
                },
                contexts: [{
                        class: 'tab'
                    }]
            },
            {
                title: 'Delete tab',
                onClick: function (event) {
                    var activeTabs = _this.state.activeTabs;
                    var folder = tabManager.getFolderFromEvent(event);
                    var tab = _this.getTabFromEvent(event, folder);
                    if (folder && tab) {
                        tabManager_1.TabFolder.deleteTabStatic(folder, tab);
                    }
                    else if (tab) {
                        var tabs = activeTabs.filter(function (_tab) { return tab.id === _tab.id; });
                        _this.setActiveTabs(tabs);
                    }
                },
                contexts: [{
                        class: 'tab'
                    }]
            }
        ];
        ;
        return (preact_1.h("div", { id: "wrapper" },
            preact_1.h(header_1.default, { title: 'Edit tabs', id: 'collapseActiveBtn', actionTitle: 'Collapse Action', actionFn: this.collapseActiveAction }),
            preact_1.h(tabTree_1.default, { tabFolders: tabFolders, activeTabs: activeTabs }),
            preact_1.h(actionItems_1.default, { saveAction: this.saveAction, cancelAction: this.cancelAction, newFolderAction: this.newFolderAction }),
            preact_1.h(contextMenu_1.default, { actions: actions }),
            warning && preact_1.h(warning_1.default, { title: 'You have unsaved changes', message: 'Would you like to save your changes?', cancelAction: this.cancelAction, saveAction: this.saveAction })));
    };
    return Popup;
}(preact_1.Component));
exports.default = Popup;

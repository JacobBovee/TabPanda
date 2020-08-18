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
var header_1 = __importDefault(require("./components/header"));
var tabTree_1 = __importDefault(require("./components/tabTree"));
var actionItems_1 = __importDefault(require("./components/actionItems"));
var tabManager_1 = require("../manager/tabManager");
var contextMenu_1 = __importDefault(require("./components/contextMenu"));
var utils_1 = require("../manager/utils");
var warning_1 = __importDefault(require("./components/warning"));
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
        _this.getFolderFromEvent = _this.getFolderFromEvent.bind(_this);
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
        this.updateState(tabManager);
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
    Popup.prototype.getTabFromEvent = function (event) {
        var rootElement = event.target;
        var tabFolder = this.getFolderFromEvent(event);
        var tabElement = utils_1.findParentWithMatchingAttribute(rootElement, 'data-tab-id');
        var tabIndex = tabElement.getAttribute('data-tab-id');
        return tabFolder.tabs[tabIndex ? parseInt(tabIndex) : 0];
    };
    Popup.prototype.getFolderFromEvent = function (event) {
        var tabManager = this.props.tabManager;
        var rootElement = event.target;
        var folderElement = utils_1.findParentWithMatchingAttribute(rootElement, 'data-folder');
        var folderIndex = folderElement.getAttribute('data-folder');
        return tabManager.getTabFolderById(folderIndex ? parseInt(folderIndex) : 0);
    };
    Popup.prototype.render = function () {
        var _this = this;
        var tabManager = this.props.tabManager;
        var _a = this.state, tabFolders = _a.tabFolders, activeTabs = _a.activeTabs, warning = _a.warning;
        var actions = [
            {
                title: 'New folder',
                onClick: function (_) {
                    console.log('New folder');
                    _this.newFolderAction();
                },
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
                    var folder = _this.getFolderFromEvent(event);
                    debugger;
                    tabManager_1.TabFolder.restoreAllStatic(folder);
                    tabManager.store();
                },
                contexts: [{
                        class: 'folder'
                    }]
            },
            {
                title: 'Delete folder',
                onClick: function (event) {
                    var folder = _this.getFolderFromEvent(event);
                    console.log('Foldr');
                    console.dir(folder);
                    tabManager.deleteFolder(folder);
                    _this.updateState(tabManager);
                },
                contexts: [{
                        class: 'folder'
                    }]
            },
            {
                title: 'Restore tab',
                onClick: function (event) {
                    var folder = _this.getFolderFromEvent(event);
                    var tab = _this.getTabFromEvent(event);
                    debugger;
                    tabManager_1.TabFolder.restoreStatic(folder, tab);
                    tabManager.store();
                },
                contexts: [{
                        class: 'tab'
                    }]
            },
            {
                title: 'Delete tab',
                onClick: function (event) {
                    var folder = _this.getFolderFromEvent(event);
                    var tab = _this.getTabFromEvent(event);
                    tabManager_1.TabFolder.deleteTabStatic(folder, tab);
                    _this.updateState(tabManager);
                },
                contexts: [{
                        class: 'tab'
                    }]
            }
        ];
        ;
        return (preact_1.h("div", { id: "wrapper" },
            preact_1.h(header_1.default, { collapseAction: this.collapseActiveAction }),
            preact_1.h(tabTree_1.default, { tabFolders: tabFolders, activeTabs: activeTabs }),
            preact_1.h(actionItems_1.default, { saveAction: this.saveAction, cancelAction: this.cancelAction, newFolderAction: this.newFolderAction }),
            preact_1.h(contextMenu_1.default, { actions: actions }),
            warning && preact_1.h(warning_1.default, { title: 'You have unsaved changes', message: 'Would you like to save your changes?', cancelAction: this.cancelAction, saveAction: this.saveAction })));
    };
    return Popup;
}(preact_1.Component));
var renderCb = function (manager) {
    var state = {
        tabManager: manager
    };
    preact_1.render(preact_1.h(Popup, __assign({}, state)), document.getElementById('App'));
};
var manager = new tabManager_1.TabManager();
manager.init(renderCb);
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'local' && changes.tabManager) {
        manager.init(renderCb);
    }
});
// Menu
chrome.contextMenus.create({ title: 'Restore folder', contexts: ['page'] });

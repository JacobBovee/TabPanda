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
var tabManager_1 = require("../manager/tabManager");
var header_1 = __importDefault(require("./components/header"));
var tabTree_1 = __importDefault(require("./components/tabTree"));
var icon_1 = __importDefault(require("./components/icon"));
var constants_1 = require("../constants");
var contextMenu_1 = __importDefault(require("./components/contextMenu"));
var Folder = /** @class */ (function (_super) {
    __extends(Folder, _super);
    function Folder(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            tabManager: props.tabManager
        };
        _this.restoreFolder = _this.restoreFolder.bind(_this);
        return _this;
    }
    Folder.prototype.getFolder = function () {
        var tabManager = this.state.tabManager;
        var folderId = this.props.folderId;
        return tabManager.getTabFolderById(folderId);
    };
    Folder.prototype.componentDidMount = function () {
        this.setState({ tabManager: this.props.tabManager });
        var folder = this.getFolder();
        window.document.title = folder.name;
    };
    Folder.prototype.updateState = function (tabManager) {
        this.setState({ tabManager: tabManager });
    };
    Folder.prototype.restoreFolder = function () {
        var tabManager = this.state.tabManager;
        var folder = this.getFolder();
        tabManager.restoreFolder(folder);
    };
    Folder.prototype.render = function () {
        var _this = this;
        var tabManager = this.state.tabManager;
        var tabFolder = this.getFolder();
        var activeTabs = tabManager.activeTabs;
        var actions = [
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
                    class: 'more'
                }
            },
            {
                title: 'Delete tab',
                onClick: function (event) {
                    var tab = tabManager.getTabFromEvent(event, tabFolder.tabs, constants_1.DATA_TAB_ID_ATTRIBUTE_NAME);
                    if (tab) {
                        tabManager_1.TabFolder.deleteTabStatic(tabFolder, tab);
                        tabManager.store();
                    }
                    _this.updateState(tabManager);
                },
                contexts: [{
                        class: 'tab'
                    }],
                leftContext: {
                    class: 'more'
                }
            }
        ];
        if (tabManager && tabFolder) {
            return (preact_1.h("div", { className: 'folder-wrapper' },
                preact_1.h(header_1.default, { actionTitle: 'Restore folder', actionFn: this.restoreFolder, title: preact_1.h("div", { className: 'folder-title' },
                        preact_1.h(icon_1.default, { type: "folder" }),
                        " ",
                        tabFolder.name) }),
                preact_1.h(tabTree_1.default, { activeTabs: activeTabs }),
                preact_1.h(contextMenu_1.default, { actions: actions })));
        }
    };
    return Folder;
}(preact_1.Component));
exports.default = Folder;

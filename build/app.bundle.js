(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_TAB_ID_ATTRIBUTE_NAME = exports.DATA_TAB_INDEX_ATTRIBUTE_NAME = void 0;
exports.DATA_TAB_INDEX_ATTRIBUTE_NAME = 'data-tab-index';
exports.DATA_TAB_ID_ATTRIBUTE_NAME = 'data-tab-id';

},{}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabFolder = exports.TabManager = void 0;
var utils_1 = require("../utils");
var TabManager = /** @class */ (function () {
    function TabManager() {
        this.tabFolders = [];
        this.mountExtension();
        this.activeTabs = new TabFolder('active_tabs_folder', -1);
    }
    TabManager.prototype.setCurrentWindow = function (cb) {
        var _this = this;
        try {
            chrome.windows.getCurrent(function (current) {
                _this.currentWindow = current.id;
                if (cb) {
                    cb();
                }
            });
        }
        catch (error) {
            throw new Error('Could not assign current window ID');
        }
    };
    TabManager.prototype.init = function (cb) {
        this.mountExtension(cb);
    };
    TabManager.getActiveTabs = function (cb, ignoreFolders) {
        chrome.windows.getCurrent({ populate: true }, function (currentWindow) {
            chrome.tabs.query({ currentWindow: true, active: true }, function (currentTabs) {
                if (currentWindow && currentWindow.tabs) {
                    var tabs = ignoreFolders ?
                        currentWindow.tabs.filter(function (tab) { var _a; return !((_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('/folder.html')); })
                        : currentWindow.tabs;
                    cb(tabs);
                }
            });
        });
    };
    TabManager.prototype.getFolderTabs = function (_cb) {
        var cb = function (tabs) {
            var folderTabs = tabs.filter(function (tab) { var _a; return (_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('folder.html'); });
            _cb(folderTabs);
        };
        TabManager.getActiveTabs(cb);
    };
    TabManager.collapseTabs = function (tabs) {
        for (var tab in tabs) {
            TabManager.collapseTab(tabs[tab]);
        }
    };
    TabManager.collapseTab = function (tab) {
        if (tab.id) {
            chrome.tabs.remove(tab.id);
        }
    };
    TabManager.prototype.createFolderFromActiveTabs = function (name) {
        var _this = this;
        var cb = function (tabs) { return _this.createTabFolder(name, tabs); };
        TabManager.getActiveTabs(cb, true);
    };
    TabManager.prototype.createTabFolder = function (name, tabs, editTitle) {
        var id = this.tabFolders.length ? this.tabFolders[this.tabFolders.length - 1].id + 1 : 0;
        var tabFolder = new TabFolder(name, id, tabs, editTitle);
        this.tabFolders.push(tabFolder);
    };
    TabManager.prototype.getFolderIdFromTab = function (tab) {
        return tab.url && parseInt(tab.url.split('folderId=')[1]);
    };
    TabManager.prototype.getFolderIdFromTabs = function (tabs) {
        var _this = this;
        return tabs
            .filter(function (tab) { var _a; return (_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('folderId='); })
            .map(function (tab) { return _this.getFolderIdFromTab(tab); });
    };
    TabManager.prototype.restoreFolder = function (folder) {
        TabFolder.restoreAllStatic(folder);
        this.deleteFolder(folder);
        this.store();
    };
    TabManager.prototype.createFolderWindows = function (folders, activeTabs) {
        var _this = this;
        var folderIds = this.getFolderIdFromTabs(activeTabs);
        folders.forEach(function (folder) {
            if (!folderIds.length || !folderIds.includes(folder.id)) {
                _this.createFolderWindow(folder);
            }
        });
    };
    TabManager.prototype.createFolderWindow = function (folder) {
        // Inject folder data into html
        var folderUrl = chrome.extension.getURL('./folder.html');
        var cb = function (tab) {
            folder.tabId = tab.id;
        };
        chrome.tabs.create({
            url: folderUrl + "?folderId=" + folder.id,
            active: false
        }, cb);
    };
    TabManager.prototype.removeTabByFolderId = function (id) {
        var _this = this;
        var cb = function (tabs) {
            tabs.map(function (tab) {
                if (_this.getFolderIdFromTab(tab) === id) {
                    TabManager.collapseTab(tab);
                }
            });
        };
        this.getFolderTabs(cb);
    };
    TabManager.prototype.cleanupFolders = function () {
        var _this = this;
        var cb = function (folderTabs) {
            folderTabs.forEach(function (folderTab) {
                var id = _this.getFolderIdFromTab(folderTab);
                if (id && !_this.getTabFolderById(id)) {
                    TabManager.collapseTab(folderTab);
                }
            });
        };
        this.getFolderTabs(cb);
    };
    TabManager.prototype.deleteFolder = function (folder) {
        var index = this.tabFolders.indexOf(folder);
        this.tabFolders.splice(index, 1);
        this.removeTabByFolderId(folder.id);
    };
    TabManager.prototype.getTabFolderById = function (id) {
        var folder = this.tabFolders.find(function (folder) { return folder.id === id; });
        if (!folder) {
            throw new Error('Folder id does not exist');
        }
        else {
            return folder;
        }
    };
    TabManager.prototype.getTabsIds = function (tabs) {
        return tabs.map(function (tab) { return tab.id; });
    };
    TabManager.prototype.updateActiveTabs = function (newActiveTabs, prevActiveTabs) {
        var activeIds = this.getTabsIds(newActiveTabs);
        var collapseTabs = prevActiveTabs.filter(function (tab) { return !activeIds.includes(tab.id); });
        collapseTabs.forEach(function (tab) { return TabManager.collapseTab(tab); });
    };
    TabManager.prototype.setActiveTabs = function (cb) {
        var _this = this;
        TabManager.getActiveTabs(function (tabs) {
            _this.activeTabs.setTabs(tabs);
            if (cb) {
                cb(_this);
            }
        }, true);
    };
    TabManager.prototype.mapManagerStateToObject = function (managerState, cb) {
        for (var propName in managerState) {
            var property = this[propName];
            if (property) {
                var statePropValue = managerState[propName];
                if (propName === 'tabFolders') {
                    this.tabFolders = statePropValue.map(function (folder) { return new TabFolder(folder.name, folder.id, folder.tabs); });
                }
                else if (propName !== 'activeTabs') {
                    this[propName] = statePropValue;
                    this.setActiveTabs(cb);
                }
            }
        }
    };
    TabManager.prototype.mountExtension = function (cb) {
        var _this = this;
        var _cb = function (tabManager) {
            ;
            if (!tabManager) {
                _this.store();
            }
            else {
                _this.mapManagerStateToObject(tabManager, cb);
            }
        };
        var storedTabManagerCb = function () { return _this.getStoredTabManager(_cb); };
        this.setCurrentWindow(storedTabManagerCb);
    };
    TabManager.prototype.updateBrowser = function (manager) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTabsCb;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!manager) return [3 /*break*/, 4];
                        activeTabsCb = function (prevTabs) {
                            _this.updateActiveTabs(_this.activeTabs.tabs, prevTabs);
                        };
                        return [4 /*yield*/, TabManager.getActiveTabs(function (prevTabs) { return _this.createFolderWindows(manager.tabFolders, prevTabs); }, false)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, TabManager.getActiveTabs(activeTabsCb, true)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.cleanupFolders()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TabManager.prototype.getTabFromEvent = function (event, tabs, attributeName) {
        var rootElement = event.target;
        var tabElement = utils_1.findParentWithMatchingAttribute(rootElement, attributeName);
        var tabIndexString = tabElement.getAttribute(attributeName);
        var tabId = tabIndexString ? parseInt(tabIndexString) : 0;
        return tabs.find(function (tab) { return tab.id === tabId; });
    };
    TabManager.prototype.getFolderFromEvent = function (event) {
        var rootElement = event.target;
        var folderElement = utils_1.findParentWithMatchingAttribute(rootElement, 'data-folder');
        if (folderElement) {
            var folderIndex = folderElement.getAttribute('data-folder');
            return this.getTabFolderById(folderIndex ? parseInt(folderIndex) : 0);
        }
    };
    TabManager.prototype.currentWindowName = function () {
        return "tm_" + this.currentWindow;
    };
    TabManager.prototype.compareTabStateToManager = function (state) {
        return state.tabFolders == this.tabFolders;
    };
    TabManager.prototype.getStoredTabManager = function (cb) {
        var _this = this;
        var id = this.currentWindowName();
        chrome.storage.local.get([id], function (data) {
            if (_this.currentWindow) {
                var tabManager = data[id];
                cb(tabManager);
            }
            else {
                throw new Error('Could not get stored tab manager');
            }
        });
    };
    TabManager.prototype.store = function (manager) {
        var _a;
        if (manager) {
            if (this.tabFolders !== manager.tabFolders) {
                this.tabFolders = manager.tabFolders;
            }
        }
        this.updateBrowser(manager);
        chrome.storage.local.set((_a = {}, _a[this.currentWindowName()] = this, _a), function () { });
    };
    return TabManager;
}());
exports.TabManager = TabManager;
var TabFolder = /** @class */ (function () {
    function TabFolder(name, id, tabs, editTitle) {
        this.tabs = tabs || [];
        this.name = name;
        this.editTitle = editTitle || false;
        this.id = id;
    }
    TabFolder.prototype.setTab = function (tab) {
        this.tabs.push(tab);
        return this.tabs.length;
    };
    TabFolder.prototype.setTabs = function (tabs) {
        this.tabs = __spreadArrays(tabs);
    };
    TabFolder.prototype.deleteTab = function (argTab) {
        var tabs = this.tabs.filter(function (tab) { return tab.id !== argTab.id; });
        this.tabs = tabs;
    };
    TabFolder.restoreAllStatic = function (tabFolder) {
        for (var _i = 0, _a = tabFolder.tabs; _i < _a.length; _i++) {
            var tab = _a[_i];
            TabFolder.restoreStatic(tabFolder, tab);
        }
        TabFolder.destroyStatic(tabFolder);
    };
    TabFolder.restoreStatic = function (tabFolder, tab) {
        chrome.tabs.create({
            url: tab.url
        });
        TabFolder.deleteTabStatic(tabFolder, tab);
    };
    TabFolder.deleteTabStatic = function (tabFolder, tab) {
        var index = tabFolder.tabs.indexOf(tab);
        tabFolder.tabs.splice(index, 1);
    };
    TabFolder.destroyStatic = function (tabFolder) {
        tabFolder.tabs = [];
    };
    return TabFolder;
}());
exports.TabFolder = TabFolder;

},{"../utils":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementTreeHasAnyAttributePair = exports.elementTreeHasAttributePair = exports.findParentWithMatchingAttribute = void 0;
function findParentWithMatchingAttribute(element, attribute) {
    var elementHasAttribute = element.hasAttribute(attribute);
    if (elementHasAttribute) {
        return element;
    }
    else {
        if (element.parentElement) {
            return findParentWithMatchingAttribute(element.parentElement, attribute);
        }
        else {
            return false;
        }
    }
}
exports.findParentWithMatchingAttribute = findParentWithMatchingAttribute;
function elementTreeHasAttributePair(element, attribute) {
    var key = Object.keys(attribute)[0];
    var elementHasAttributePair = element.getAttribute(key);
    if (elementHasAttributePair === null || elementHasAttributePair === void 0 ? void 0 : elementHasAttributePair.split(' ').includes(attribute[key])) {
        return true;
    }
    else {
        if (element.parentElement) {
            return elementTreeHasAttributePair(element.parentElement, attribute);
        }
        else {
            return false;
        }
    }
}
exports.elementTreeHasAttributePair = elementTreeHasAttributePair;
function elementTreeHasAnyAttributePair(element, attributes) {
    for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
        var attribute = attributes_1[_i];
        var hasAttribute = elementTreeHasAttributePair(element, attribute);
        if (hasAttribute) {
            return true;
        }
    }
    return false;
}
exports.elementTreeHasAnyAttributePair = elementTreeHasAnyAttributePair;

},{}],4:[function(require,module,exports){
"use strict";
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
var popup_1 = __importDefault(require("./popup"));
var tabManager_1 = require("../manager/tabManager");
var folder_1 = __importDefault(require("./folder"));
// Render popup when popup element is found
var POPUP_APP_ID_ELEMENT = document.getElementById('App');
if (POPUP_APP_ID_ELEMENT) {
    window.addEventListener("beforeunload", function (e) {
        var confirmationMessage = "\o/";
        return confirmationMessage;
    });
    var renderCb_1 = function (manager) {
        var state = {
            tabManager: manager
        };
        preact_1.render(preact_1.h(popup_1.default, __assign({}, state)), POPUP_APP_ID_ELEMENT);
    };
    var manager_1 = new tabManager_1.TabManager();
    manager_1.init(renderCb_1);
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'local' && changes[manager_1.currentWindowName()]) {
            manager_1.init(renderCb_1);
        }
    });
}
// Render folder if folder element is found
var FOLDER_APP_ID_ELEMENT = document.getElementById('folderApp');
if (FOLDER_APP_ID_ELEMENT) {
    window.addEventListener("beforeunload", function (e) {
        e.preventDefault();
        var confirmationMessage = "This folder will be deleted and you will lose your changes";
        return confirmationMessage;
    });
    var renderCb_2 = function (manager) {
        try {
            var folderId = parseInt(window.location.href.split('?folderId=')[1]);
            var state = {
                tabManager: manager,
                folderId: folderId
            };
            preact_1.render(preact_1.h(folder_1.default, __assign({}, state)), FOLDER_APP_ID_ELEMENT);
        }
        catch (e) {
            throw new Error(e);
        }
    };
    var manager_2 = new tabManager_1.TabManager();
    manager_2.init(renderCb_2);
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'local' && changes[manager_2.currentWindowName()]) {
            manager_2.init(renderCb_2);
        }
    });
}

},{"../manager/tabManager":2,"./folder":14,"./popup":15,"preact":16}],5:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var ActionItems = /** @class */ (function (_super) {
    __extends(ActionItems, _super);
    function ActionItems() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionItems.prototype.render = function () {
        var _a = this.props, saveAction = _a.saveAction, cancelAction = _a.cancelAction, newFolderAction = _a.newFolderAction;
        return (preact_1.h("div", { id: "actionItems" },
            preact_1.h("div", { class: 'col left' },
                preact_1.h("button", { id: "newFolderBtn", onClick: newFolderAction }, "New folder")),
            preact_1.h("div", { class: "col right" },
                preact_1.h("button", { id: "cancelBtn", onClick: cancelAction }, "Cancel"),
                preact_1.h("button", { id: "saveBtn", class: "primary", onClick: saveAction }, "Save"))));
    };
    return ActionItems;
}(preact_1.Component));
exports.default = ActionItems;

},{"preact":16}],6:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var utils_1 = require("../../utils");
var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.resetState = function () {
            _this.setState({
                visible: false,
                x: 0,
                y: 0,
                targetEvent: undefined
            });
        };
        _this.state = {
            x: 0,
            y: 0,
            visible: false
        };
        _this.filterActionsByContexts = _this.filterActionsByContexts.bind(_this);
        return _this;
    }
    ContextMenu.prototype.openIfLeftContext = function (event, leftContext) {
        var target = event.target;
        var isContextClick = utils_1.elementTreeHasAttributePair(target, leftContext);
        return isContextClick;
    };
    ContextMenu.prototype.calculateMenuCoords = function (x, y) {
        var menu = document.querySelector('div#contextMenu');
        if (menu) {
            var menuWidth = menu.clientWidth;
            var menuHeight = menu.clientHeight;
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            if ((windowWidth - x) < menuWidth) {
                x = (windowWidth - menuWidth) - 10;
            }
            if ((windowHeight - y) < menuHeight) {
                y = (windowHeight - menuHeight) - 10;
            }
        }
        this.setState({ x: x, y: y });
    };
    ContextMenu.prototype.setContextMenu = function (event) {
        var _this = this;
        event.preventDefault();
        this.setState({
            visible: true,
            targetEvent: event
        }, function () { return _this.calculateMenuCoords(event.clientX, event.clientY); });
    };
    ContextMenu.prototype.componentDidMount = function () {
        var _this = this;
        var actions = this.props.actions;
        document.addEventListener('contextmenu', function (event) {
            _this.setContextMenu(event);
        });
        document.addEventListener('click', function (event) {
            var contextMenu = document.querySelector('div#contextMenuOverlay');
            if (contextMenu && !contextMenu.contains(event.target)) {
                event.preventDefault();
                _this.resetState();
            }
            actions.forEach(function (action) {
                if (action.leftContext) {
                    if (_this.openIfLeftContext(event, action.leftContext)) {
                        _this.setContextMenu(event);
                    }
                }
            });
        });
    };
    ContextMenu.prototype.filterActionsByContexts = function (actions) {
        var targetEvent = this.state.targetEvent;
        if (targetEvent) {
            var element_1 = targetEvent.target;
            var filteredActions = actions
                .filter(function (action) { return utils_1.elementTreeHasAnyAttributePair(element_1, action.contexts); });
            return filteredActions;
        }
        else {
            throw new Error('Target event not set');
        }
    };
    ContextMenu.prototype.render = function () {
        var _this = this;
        var actions = this.props.actions;
        var _a = this.state, x = _a.x, y = _a.y, visible = _a.visible, targetEvent = _a.targetEvent;
        var style = {
            position: 'absolute',
            top: y + "px",
            left: x + "px",
            zIndex: 9999
        };
        return (preact_1.h("div", { className: 'context-menu-overlay', id: 'contextMenuOverlay' }, visible && targetEvent &&
            preact_1.h("div", { className: 'context-menu', style: style, id: "contextMenu" },
                preact_1.h("ul", null, this.filterActionsByContexts(actions).map(function (action) {
                    return preact_1.h("li", { className: 'conext-menu-action', onClick: function () {
                            _this.resetState();
                            action.onClick(targetEvent);
                        } }, action.title);
                })))));
    };
    return ContextMenu;
}(preact_1.Component));
exports.default = ContextMenu;

},{"../../utils":3,"preact":16}],7:[function(require,module,exports){
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
                preact_1.h("div", { className: 'folder-container' },
                    preact_1.h("span", { onClick: this.toggleCollapse },
                        preact_1.h(icon_1.default, { type: 'triangle' }),
                        preact_1.h(icon_1.default, { type: 'folder' }),
                        folder.editTitle ?
                            this.inputField()
                            :
                                folder.name),
                    preact_1.h(icon_1.default, { className: 'more-folder', type: 'more' })),
                !collapsed &&
                    preact_1.h("ul", null, folder && folder.tabs.map(function (tab) { return preact_1.h(tab_1.default, { updateFolder: _this.updateFolder, folder: folder, tab: tab }); })))));
    };
    return FolderItem;
}(preact_1.Component));
exports.default = FolderItem;

},{"./icon":9,"./tab":10,"preact":16}],8:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Header.prototype.render = function () {
        var _a = this.props, id = _a.id, title = _a.title, actionTitle = _a.actionTitle, actionFn = _a.actionFn;
        return (preact_1.h("header", null,
            preact_1.h("h1", null, title),
            actionTitle && actionFn &&
                preact_1.h("button", { id: id ? id : '', onClick: actionFn }, actionTitle)));
    };
    return Header;
}(preact_1.Component));
exports.default = Header;

},{"preact":16}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var getAdjustedSize = function (originalWidth, originalHeight, finalHeight) {
    var adjustedWidth = finalHeight * (originalWidth / originalHeight);
    return {
        width: adjustedWidth + "px",
        height: finalHeight + "px"
    };
};
function Icon(props) {
    var type = props.type, iconSrc = props.iconSrc, size = props.size, className = props.className;
    if (type === 'custom' && iconSrc) {
        var iconImg = new Image();
        iconImg.src = iconSrc;
        var _a = getAdjustedSize(iconImg.width, iconImg.height, size || 12), width = _a.width, height = _a.height;
        var style = {
            width: width,
            height: height,
            backgroundImage: "url('" + iconSrc + "')",
            backgroundSize: 'contain',
            display: 'inline-block'
        };
        return (preact_1.h("i", { className: "custom-icon " + className, style: style }));
    }
    else {
        return (preact_1.h("i", { className: type + "-icon " + className }));
    }
}
exports.default = Icon;

},{"preact":16}],10:[function(require,module,exports){
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

},{"../../constants":1,"../../manager/tabManager":2,"./icon":9,"preact":16}],11:[function(require,module,exports){
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
        return _this;
    }
    TabList.prototype.getTabById = function (id) {
        var allTabs = this.props.allTabs;
        return allTabs.find(function (tab) { return tab.id === id; });
    };
    TabList.prototype.render = function () {
        var _a = this.props, folder = _a.folder, hideFolder = _a.hideFolder;
        return preact_1.h(folderItem_1.default, { hideFolder: hideFolder, getTabById: this.getTabById, folder: folder });
    };
    return TabList;
}(preact_1.Component));
exports.default = TabList;

},{"./folderItem":7,"preact":16}],12:[function(require,module,exports){
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
    TabTree.prototype.allTabs = function () {
        var _a = this.props, tabFolders = _a.tabFolders, activeTabs = _a.activeTabs;
        var allTabs = [];
        var pushFolder = function (folder) { return folder
            .map(function (tabFolder) { return tabFolder.tabs; })
            .forEach(function (folderTab) { return allTabs.push.apply(allTabs, folderTab); }); };
        if (tabFolders) {
            pushFolder(tabFolders);
        }
        if (activeTabs) {
            allTabs.push.apply(allTabs, activeTabs.tabs);
        }
        return allTabs;
    };
    TabTree.prototype.render = function () {
        var _this = this;
        var _a = this.props, tabFolders = _a.tabFolders, activeTabs = _a.activeTabs;
        return (preact_1.h("div", { id: "tabTree" },
            preact_1.h("ul", { class: "parent" },
                tabFolders && tabFolders.map(function (folder) {
                    return preact_1.h(tabList_1.default, { folder: folder, allTabs: _this.allTabs() });
                }),
                activeTabs && preact_1.h(tabList_1.default, { folder: activeTabs, allTabs: this.allTabs(), hideFolder: true }))));
    };
    return TabTree;
}(preact_1.Component));
exports.default = TabTree;

},{"./tabList":11,"preact":16}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
function Warning(props) {
    var title = props.title, message = props.message, cancelAction = props.cancelAction, saveAction = props.saveAction;
    return (preact_1.h("div", { className: 'warning-overlay' },
        preact_1.h("div", { className: 'warning-message' },
            preact_1.h("h1", null, title),
            preact_1.h("p", null, message),
            preact_1.h("div", { className: 'warning-actions' },
                preact_1.h("button", { onClick: cancelAction }, "Cancel"),
                preact_1.h("button", { onClick: saveAction }, "Save")))));
}
exports.default = Warning;

},{"preact":16}],14:[function(require,module,exports){
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
                preact_1.h(tabTree_1.default, { activeTabs: tabFolder }),
                preact_1.h(contextMenu_1.default, { actions: actions })));
        }
    };
    return Folder;
}(preact_1.Component));
exports.default = Folder;

},{"../constants":1,"../manager/tabManager":2,"./components/contextMenu":6,"./components/header":8,"./components/icon":9,"./components/tabTree":12,"preact":16}],15:[function(require,module,exports){
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

},{"../constants":1,"../manager/tabManager":2,"./components/actionItems":5,"./components/contextMenu":6,"./components/header":8,"./components/tabTree":12,"./components/warning":13,"preact":16}],16:[function(require,module,exports){
var n,l,u,t,i,o,r,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n)}function p(n,l,u){var t,i=arguments,o={};for(t in l)"key"!==t&&"ref"!==t&&(o[t]=l[t]);if(arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(i[t]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(t in n.defaultProps)void 0===o[t]&&(o[t]=n.defaultProps[t]);return v(n,o,l&&l.key,l&&l.ref,null)}function v(l,u,t,i,o){var r={type:l,props:u,key:t,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),n.vnode&&n.vnode(r),r}function h(n){return n.children}function y(n,l){this.props=n,this.context=l}function d(n,l){if(null==l)return n.__?d(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?d(n):null}function _(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return _(n)}}function w(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!x.__r++||i!==n.debounceRendering)&&((i=n.debounceRendering)||t)(x)}function x(){for(var n;x.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,t,i,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(t=s({},o)).__v=t,i=N(f,o,t,l.__n,void 0!==f.ownerSVGElement,null,u,null==r?d(o):r),z(u,o),i!=r&&_(o)))})}function k(n,l,u,t,i,o,r,c,s,p){var y,_,w,x,k,g,b,A=t&&t.__k||e,P=A.length;for(s==f&&(s=null!=r?r[0]:P?d(t,0):null),u.__k=[],y=0;y<l.length;y++)if(null!=(x=u.__k[y]=null==(x=l[y])||"boolean"==typeof x?null:"string"==typeof x||"number"==typeof x?v(null,x,null,null,x):Array.isArray(x)?v(h,{children:x},null,null,null):null!=x.__e||null!=x.__c?v(x.type,x.props,x.key,null,x.__v):x)){if(x.__=u,x.__b=u.__b+1,null===(w=A[y])||w&&x.key==w.key&&x.type===w.type)A[y]=void 0;else for(_=0;_<P;_++){if((w=A[_])&&x.key==w.key&&x.type===w.type){A[_]=void 0;break}w=null}k=N(n,x,w=w||f,i,o,r,c,s,p),(_=x.ref)&&w.ref!=_&&(b||(b=[]),w.ref&&b.push(w.ref,null,x),b.push(_,x.__c||k,x)),null!=k?(null==g&&(g=k),s=m(n,x,w,A,r,k,s),p||"option"!=u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&w.__e==s&&s.parentNode!=n&&(s=d(w))}if(u.__e=g,null!=r&&"function"!=typeof u.type)for(y=r.length;y--;)null!=r[y]&&a(r[y]);for(y=P;y--;)null!=A[y]&&j(A[y],A[y]);if(b)for(y=0;y<b.length;y++)$(b[y],b[++y],b[++y])}function m(n,l,u,t,i,o,r){var f,e,c;if(void 0!==l.__d)f=l.__d,l.__d=void 0;else if(i==u||o!=r||null==o.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(o),f=null;else{for(e=r,c=0;(e=e.nextSibling)&&c<t.length;c+=2)if(e==o)break n;n.insertBefore(o,r),f=r}return void 0!==f?f:o.nextSibling}function g(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||A(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||A(n,o,l[o],u[o],t)}function b(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":null==u?"":u}function A(n,l,u,t,i){var o,r,f,e,c;if(i?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else{if("string"==typeof t&&(o.cssText="",t=null),t)for(e in t)u&&e in u||b(o,e,"");if(u)for(c in u)t&&u[c]===t[c]||b(o,c,u[c])}else"o"===l[0]&&"n"===l[1]?(r=l!==(l=l.replace(/Capture$/,"")),f=l.toLowerCase(),l=(f in n?f:l).slice(2),u?(t||n.addEventListener(l,P,r),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,P,r)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&"download"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u))}function P(l){this.l[l.type](n.event?n.event(l):l)}function C(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,i.__e&&("function"==typeof i.type&&i.__k.length>1&&C(i,l,u),l=m(u,i,i,n.__k,null,i.__e,l),"function"==typeof n.type&&(n.__d=l)))}function N(l,u,t,i,o,r,f,e,c){var a,p,v,d,_,w,x,m,g,b,A,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(m=u.props,g=(a=P.contextType)&&i[a.__c],b=a?g?g.props.value:a.__:i,t.__c?x=(p=u.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?u.__c=p=new P(m,b):(u.__c=p=new y(m,b),p.constructor=P,p.render=H),g&&g.sub(p),p.props=m,p.state||(p.state={}),p.context=b,p.__n=i,v=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=s({},p.__s)),s(p.__s,P.getDerivedStateFromProps(m,p.__s))),d=p.props,_=p.state,v)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&m!==d&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(m,b),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(m,p.__s,b)||u.__v===t.__v){p.props=m,p.state=p.__s,u.__v!==t.__v&&(p.__d=!1),p.__v=u,u.__e=t.__e,u.__k=t.__k,p.__h.length&&f.push(p),C(u,e,l);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(m,p.__s,b),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(d,_,w)})}p.context=b,p.props=m,p.state=p.__s,(a=n.__r)&&a(u),p.__d=!1,p.__v=u,p.__P=l,a=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(i=s(s({},i),p.getChildContext())),v||null==p.getSnapshotBeforeUpdate||(w=p.getSnapshotBeforeUpdate(d,_)),A=null!=a&&a.type==h&&null==a.key?a.props.children:a,k(l,Array.isArray(A)?A:[A],u,t,i,o,r,f,e,c),p.base=u.__e,p.__h.length&&f.push(p),x&&(p.__E=p.__=null),p.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=T(t.__e,u,t,i,o,r,f,c);(a=n.diffed)&&a(u)}catch(l){u.__v=null,n.__e(l,u,t)}return u.__e}function z(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u)})}catch(l){n.__e(l,u.__v)}})}function T(n,l,u,t,i,o,r,c){var s,a,p,v,h,y=u.props,d=l.props;if(i="svg"===l.type||i,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,c=!1}if(null===l.type)y!==d&&n.data!==d&&(n.data=d);else{if(null!=o&&(o=e.slice.call(n.childNodes)),p=(y=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,!c){if(null!=o)for(y={},h=0;h<n.attributes.length;h++)y[n.attributes[h].name]=n.attributes[h].value;(v||p)&&(v&&p&&v.__html==p.__html||(n.innerHTML=v&&v.__html||""))}g(n,d,y,i,c),v?l.__k=[]:(s=l.props.children,k(n,Array.isArray(s)?s:[s],l,u,t,"foreignObject"!==l.type&&i,o,r,f,c)),c||("value"in d&&void 0!==(s=d.value)&&s!==n.value&&A(n,"value",s,y.value,!1),"checked"in d&&void 0!==(s=d.checked)&&s!==n.checked&&A(n,"checked",s,y.checked,!1))}return n}function $(l,u,t){try{"function"==typeof l?l(u):l.current=u}catch(l){n.__e(l,t)}}function j(l,u,t){var i,o,r;if(n.unmount&&n.unmount(l),(i=l.ref)&&(i.current&&i.current!==l.__e||$(i,null,u)),t||"function"==typeof l.type||(t=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(l){n.__e(l,u)}i.base=i.__P=null}if(i=l.__k)for(r=0;r<i.length;r++)i[r]&&j(i[r],u,t);null!=o&&a(o)}function H(n,l,u){return this.constructor(n,u)}function I(l,u,t){var i,r,c;n.__&&n.__(l,u),r=(i=t===o)?null:t&&t.__k||u.__k,l=p(h,null,[l]),c=[],N(u,(i?u:t||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:r?null:u.childNodes.length?e.slice.call(u.childNodes):null,c,t||f,i),z(c,l)}n={__e:function(n,l){for(var u,t;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(t=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(t=!0,u.componentDidCatch(n)),t)return w(u.__E=u)}catch(l){n=l}throw n}},l=function(n){return null!=n&&void 0===n.constructor},y.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),w(this))},y.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),w(this))},y.prototype.render=h,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,x.__r=0,o=f,r=0,exports.render=I,exports.hydrate=function(n,l){I(n,l,o)},exports.createElement=p,exports.h=p,exports.Fragment=h,exports.createRef=function(){return{current:null}},exports.isValidElement=l,exports.Component=y,exports.cloneElement=function(n,l){var u,t;for(t in l=s(s({},n.props),l),arguments.length>2&&(l.children=e.slice.call(arguments,2)),u={},l)"key"!==t&&"ref"!==t&&(u[t]=l[t]);return v(n.type,u,l.key||n.key,l.ref||n.ref,null)},exports.createContext=function(n){var l={},u={__c:"__cC"+r++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var t,i=this;return this.getChildContext||(t=[],this.getChildContext=function(){return l[u.__c]=i,l},this.shouldComponentUpdate=function(n){i.props.value!==n.value&&t.some(function(l){l.context=n.value,w(l)})},this.sub=function(n){t.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){t.splice(t.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Consumer.contextType=u,u.Provider.__=u,u},exports.toChildArray=function n(l){return null==l||"boolean"==typeof l?[]:Array.isArray(l)?e.concat.apply([],l.map(n)):[l]},exports.__u=j,exports.options=n;


},{}]},{},[4]);

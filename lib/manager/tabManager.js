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
    TabManager.prototype.collapseTabs = function (tabs) {
        for (var tab in tabs) {
            this.collapseTab(tabs[tab]);
        }
    };
    TabManager.prototype.collapseTab = function (tab) {
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
    TabManager.prototype.deleteFolder = function (folder) {
        var index = this.tabFolders.indexOf(folder);
        this.tabFolders.splice(index, 1);
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
        var _this = this;
        var activeIds = this.getTabsIds(newActiveTabs);
        var collapseTabs = prevActiveTabs.filter(function (tab) { return !activeIds.includes(tab.id); });
        collapseTabs.forEach(function (tab) { return _this.collapseTab(tab); });
    };
    TabManager.prototype.mapManagerStateToObject = function (managerState, cb) {
        for (var propName in managerState) {
            var property = this[propName];
            if (property) {
                var statePropValue = managerState[propName];
                this[propName] = statePropValue;
                if (cb) {
                    cb(this);
                }
            }
        }
    };
    TabManager.prototype.mountExtension = function (cb) {
        var _this = this;
        var _cb = function (tabManager) {
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
                        if (!manager) return [3 /*break*/, 3];
                        activeTabsCb = function (prevTabs) {
                            _this.updateActiveTabs(manager.activeTabs, prevTabs);
                        };
                        return [4 /*yield*/, TabManager.getActiveTabs(function (prevTabs) { return _this.createFolderWindows(manager.tabFolders, prevTabs); }, false)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, TabManager.getActiveTabs(activeTabsCb, true)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
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
        this.tabs = __spreadArrays(this.tabs, tabs);
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

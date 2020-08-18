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
var TabManager = /** @class */ (function () {
    function TabManager() {
        this.tabFolders = [];
        this.mountExtension();
    }
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
        debugger;
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
        var largestId = this.tabFolders[this.tabFolders.length - 1].id + 1;
        var tabFolder = new TabFolder(name, largestId || 0, tabs, editTitle);
        this.tabFolders.push(tabFolder);
    };
    TabManager.prototype.createFolderWindows = function (folders, activeTabs) {
        var _this = this;
        folders.forEach(function (folder) { return _this.createFolderWindow(folder, activeTabs); });
    };
    TabManager.prototype.createFolderWindow = function (folder, activeTabs) {
        // Inject folder data into html
        var folderUrl = chrome.extension.getURL('./folder.html');
        var tabIds = activeTabs.map(function (tab) { return tab.id; });
        var cb = function (tab) {
            debugger;
            folder.tabId = tab.id;
        };
        debugger;
        console.log(folder.tabId);
        console.log(tabIds);
        console.log(tabIds.indexOf(folder.tabId));
        console.log(!tabIds.indexOf(folder.tabId));
        if (!folder.tabId || !!tabIds.indexOf(folder.tabId)) {
            chrome.tabs.create({
                url: folderUrl
            }, cb);
        }
    };
    TabManager.prototype.deleteFolder = function (folder) {
        debugger;
        var index = this.tabFolders.indexOf(folder);
        this.tabFolders.splice(index, 1);
        debugger;
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
    TabManager.getStaticTabFolder = function (index, cb) {
        chrome.storage.local.get(['tabManager'], function (data) {
            var tabManager = data.tabManager;
            cb(tabManager.tabFolders[index]);
        });
    };
    TabManager.getStaticTabFolders = function (cb) {
        chrome.storage.local.get(['tabManager'], function (data) {
            var tabManager = data.tabManager;
            cb(tabManager.tabFolders);
        });
    };
    TabManager.prototype.updateActiveTabs = function (newActiveTabs, prevActiveTabs) {
        return __awaiter(this, void 0, void 0, function () {
            var collapseTabs;
            var _this = this;
            return __generator(this, function (_a) {
                collapseTabs = prevActiveTabs.filter(function (tab) { return newActiveTabs.indexOf(tab); });
                debugger;
                collapseTabs.forEach(function (tab) { return _this.collapseTab(tab); });
                return [2 /*return*/];
            });
        });
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
        chrome.storage.local.get(['tabManager'], function (data) {
            if (!data.tabManager) {
                _this.store();
            }
            else {
                _this.mapManagerStateToObject(data.tabManager, cb);
            }
        });
    };
    TabManager.prototype.updateBrowser = function (manager) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTabsCb;
            var _this = this;
            return __generator(this, function (_a) {
                if (manager) {
                    debugger;
                    activeTabsCb = function (prevTabs) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            debugger;
                            this.updateActiveTabs(manager.activeTabs, prevTabs);
                            return [2 /*return*/];
                        });
                    }); };
                    TabManager.getActiveTabs(activeTabsCb, true);
                    TabManager.getActiveTabs(function (prevTabs) { return _this.createFolderWindows(manager.tabFolders, prevTabs); }, false);
                }
                return [2 /*return*/];
            });
        });
    };
    TabManager.prototype.store = function (manager) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (manager) {
                    if (this.tabFolders !== manager.tabFolders) {
                        this.tabFolders = manager.tabFolders;
                    }
                }
                this.updateBrowser(manager);
                chrome.storage.local.set({ tabManager: this }, function () { });
                return [2 /*return*/];
            });
        });
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

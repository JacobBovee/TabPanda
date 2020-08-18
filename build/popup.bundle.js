(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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
    if (elementHasAttributePair === attribute[key]) {
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

},{}],3:[function(require,module,exports){
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

},{"preact":12}],4:[function(require,module,exports){
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
var utils_1 = require("../../manager/utils");
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
    ContextMenu.prototype.openIfLeftContext = function (target, leftContext) {
        var isContextClick = utils_1.elementTreeHasAttributePair(target, leftContext);
    };
    ContextMenu.prototype.setContextMenu = function (event) {
        event.preventDefault();
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        this.setState({
            visible: true,
            x: mouseX,
            y: mouseY,
            targetEvent: event
        });
    };
    ContextMenu.prototype.componentDidMount = function () {
        // const { actions } = this.props;
        var _this = this;
        document.addEventListener('contextmenu', function (event) {
            _this.setContextMenu(event);
        });
        document.addEventListener('click', function (event) {
            var contextMenu = document.querySelector('div#contextMenu');
            if (contextMenu && !contextMenu.contains(event.target)) {
                event.preventDefault();
                _this.resetState();
            }
            // actions.forEach((action) => action.leftContext && this.openIfLeftContext((event.target as Element), action.leftContext));
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
            left: x + "px"
        };
        return (preact_1.h("div", { className: 'context-menu-overlay', id: 'contextMenu' }, visible && targetEvent &&
            preact_1.h("div", { className: 'context-menu', style: style },
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

},{"../../manager/utils":2,"preact":12}],5:[function(require,module,exports){
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
        var collapseAction = this.props.collapseAction;
        return (preact_1.h("header", null,
            preact_1.h("h1", null, "Edit tabs"),
            preact_1.h("button", { id: "collapseActiveBtn", onClick: function () { return collapseAction(); } }, "Collapse active")));
    };
    return Header;
}(preact_1.Component));
exports.default = Header;

},{"preact":12}],6:[function(require,module,exports){
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

},{"preact":12}],7:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var icon_1 = __importDefault(require("./icon"));
function Tab(props) {
    var tab = props.tab;
    var ico = tab.favIconUrl ? preact_1.h(icon_1.default, { type: 'custom', iconSrc: tab.favIconUrl }) : preact_1.h(icon_1.default, { type: "link" });
    return (preact_1.h("li", { class: "tab", "data-tab-id": tab.index },
        preact_1.h("span", null,
            ico,
            tab.title),
        preact_1.h(icon_1.default, { className: 'more', type: 'more' })));
}
exports.default = Tab;

},{"./icon":6,"preact":12}],8:[function(require,module,exports){
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
        return _this;
    }
    TabList.prototype.componentDidUpdate = function () {
        var _a = this.props, folder = _a.folder, tabs = _a.tabs;
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
        if (document.activeElement) {
            try {
                document.activeElement.blur();
            }
            catch (e) {
                // no autofocus
            }
        }
        return (preact_1.h("input", { type: "text", autoFocus: true, tabIndex: 1, onBlur: this.saveFolderName, onKeyPress: this.handleInputKeyDown, ref: function (input) { return _this.input = input; } }));
    };
    TabList.prototype.render = function () {
        var _a = this.props, tabs = _a.tabs, folder = _a.folder;
        if (folder) {
            return (preact_1.h("div", null,
                preact_1.h("li", { class: "folder", "data-folder": "" + folder.id },
                    preact_1.h("div", null,
                        preact_1.h(icon_1.default, { type: 'folder' }),
                        folder.editTitle ?
                            this.inputField()
                            :
                                folder.name),
                    preact_1.h("ul", null, folder && folder.tabs.map(function (tab) { return preact_1.h(tab_1.default, { tab: tab }); })))));
        }
        if (tabs) {
            return (preact_1.h("ul", null, tabs && tabs.map(function (tab) { return preact_1.h(tab_1.default, { tab: tab }); })));
        }
    };
    return TabList;
}(preact_1.Component));
exports.default = TabList;

},{"./icon":6,"./tab":7,"preact":12}],9:[function(require,module,exports){
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
    TabTree.prototype.render = function () {
        var _a = this.props, tabFolders = _a.tabFolders, activeTabs = _a.activeTabs;
        console.log('Tab folders props');
        console.dir(tabFolders);
        return (preact_1.h("div", { id: "tabTree" },
            preact_1.h("ul", { class: "parent" },
                tabFolders && tabFolders.map(function (folder) {
                    console.log('Rendering folder');
                    console.dir(folder);
                    return preact_1.h(tabList_1.default, { folder: folder });
                }),
                activeTabs && preact_1.h(tabList_1.default, { tabs: activeTabs }))));
    };
    return TabTree;
}(preact_1.Component));
exports.default = TabTree;

},{"./tabList":8,"preact":12}],10:[function(require,module,exports){
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

},{"preact":12}],11:[function(require,module,exports){
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

},{"../manager/tabManager":1,"../manager/utils":2,"./components/actionItems":3,"./components/contextMenu":4,"./components/header":5,"./components/tabTree":9,"./components/warning":10,"preact":12}],12:[function(require,module,exports){
var n,l,u,t,i,o,r,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n)}function p(n,l,u){var t,i=arguments,o={};for(t in l)"key"!==t&&"ref"!==t&&(o[t]=l[t]);if(arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(i[t]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(t in n.defaultProps)void 0===o[t]&&(o[t]=n.defaultProps[t]);return v(n,o,l&&l.key,l&&l.ref,null)}function v(l,u,t,i,o){var r={type:l,props:u,key:t,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),n.vnode&&n.vnode(r),r}function h(n){return n.children}function y(n,l){this.props=n,this.context=l}function d(n,l){if(null==l)return n.__?d(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?d(n):null}function _(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return _(n)}}function w(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!x.__r++||i!==n.debounceRendering)&&((i=n.debounceRendering)||t)(x)}function x(){for(var n;x.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,t,i,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(t=s({},o)).__v=t,i=N(f,o,t,l.__n,void 0!==f.ownerSVGElement,null,u,null==r?d(o):r),z(u,o),i!=r&&_(o)))})}function k(n,l,u,t,i,o,r,c,s,p){var y,_,w,x,k,g,b,A=t&&t.__k||e,P=A.length;for(s==f&&(s=null!=r?r[0]:P?d(t,0):null),u.__k=[],y=0;y<l.length;y++)if(null!=(x=u.__k[y]=null==(x=l[y])||"boolean"==typeof x?null:"string"==typeof x||"number"==typeof x?v(null,x,null,null,x):Array.isArray(x)?v(h,{children:x},null,null,null):null!=x.__e||null!=x.__c?v(x.type,x.props,x.key,null,x.__v):x)){if(x.__=u,x.__b=u.__b+1,null===(w=A[y])||w&&x.key==w.key&&x.type===w.type)A[y]=void 0;else for(_=0;_<P;_++){if((w=A[_])&&x.key==w.key&&x.type===w.type){A[_]=void 0;break}w=null}k=N(n,x,w=w||f,i,o,r,c,s,p),(_=x.ref)&&w.ref!=_&&(b||(b=[]),w.ref&&b.push(w.ref,null,x),b.push(_,x.__c||k,x)),null!=k?(null==g&&(g=k),s=m(n,x,w,A,r,k,s),p||"option"!=u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&w.__e==s&&s.parentNode!=n&&(s=d(w))}if(u.__e=g,null!=r&&"function"!=typeof u.type)for(y=r.length;y--;)null!=r[y]&&a(r[y]);for(y=P;y--;)null!=A[y]&&j(A[y],A[y]);if(b)for(y=0;y<b.length;y++)$(b[y],b[++y],b[++y])}function m(n,l,u,t,i,o,r){var f,e,c;if(void 0!==l.__d)f=l.__d,l.__d=void 0;else if(i==u||o!=r||null==o.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(o),f=null;else{for(e=r,c=0;(e=e.nextSibling)&&c<t.length;c+=2)if(e==o)break n;n.insertBefore(o,r),f=r}return void 0!==f?f:o.nextSibling}function g(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||A(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||A(n,o,l[o],u[o],t)}function b(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":null==u?"":u}function A(n,l,u,t,i){var o,r,f,e,c;if(i?"className"===l&&(l="class"):"class"===l&&(l="className"),"style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else{if("string"==typeof t&&(o.cssText="",t=null),t)for(e in t)u&&e in u||b(o,e,"");if(u)for(c in u)t&&u[c]===t[c]||b(o,c,u[c])}else"o"===l[0]&&"n"===l[1]?(r=l!==(l=l.replace(/Capture$/,"")),f=l.toLowerCase(),l=(f in n?f:l).slice(2),u?(t||n.addEventListener(l,P,r),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,P,r)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&"download"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u))}function P(l){this.l[l.type](n.event?n.event(l):l)}function C(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,i.__e&&("function"==typeof i.type&&i.__k.length>1&&C(i,l,u),l=m(u,i,i,n.__k,null,i.__e,l),"function"==typeof n.type&&(n.__d=l)))}function N(l,u,t,i,o,r,f,e,c){var a,p,v,d,_,w,x,m,g,b,A,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(m=u.props,g=(a=P.contextType)&&i[a.__c],b=a?g?g.props.value:a.__:i,t.__c?x=(p=u.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?u.__c=p=new P(m,b):(u.__c=p=new y(m,b),p.constructor=P,p.render=H),g&&g.sub(p),p.props=m,p.state||(p.state={}),p.context=b,p.__n=i,v=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=s({},p.__s)),s(p.__s,P.getDerivedStateFromProps(m,p.__s))),d=p.props,_=p.state,v)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&m!==d&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(m,b),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(m,p.__s,b)||u.__v===t.__v){p.props=m,p.state=p.__s,u.__v!==t.__v&&(p.__d=!1),p.__v=u,u.__e=t.__e,u.__k=t.__k,p.__h.length&&f.push(p),C(u,e,l);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(m,p.__s,b),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(d,_,w)})}p.context=b,p.props=m,p.state=p.__s,(a=n.__r)&&a(u),p.__d=!1,p.__v=u,p.__P=l,a=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(i=s(s({},i),p.getChildContext())),v||null==p.getSnapshotBeforeUpdate||(w=p.getSnapshotBeforeUpdate(d,_)),A=null!=a&&a.type==h&&null==a.key?a.props.children:a,k(l,Array.isArray(A)?A:[A],u,t,i,o,r,f,e,c),p.base=u.__e,p.__h.length&&f.push(p),x&&(p.__E=p.__=null),p.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=T(t.__e,u,t,i,o,r,f,c);(a=n.diffed)&&a(u)}catch(l){u.__v=null,n.__e(l,u,t)}return u.__e}function z(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u)})}catch(l){n.__e(l,u.__v)}})}function T(n,l,u,t,i,o,r,c){var s,a,p,v,h,y=u.props,d=l.props;if(i="svg"===l.type||i,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,c=!1}if(null===l.type)y!==d&&n.data!==d&&(n.data=d);else{if(null!=o&&(o=e.slice.call(n.childNodes)),p=(y=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,!c){if(null!=o)for(y={},h=0;h<n.attributes.length;h++)y[n.attributes[h].name]=n.attributes[h].value;(v||p)&&(v&&p&&v.__html==p.__html||(n.innerHTML=v&&v.__html||""))}g(n,d,y,i,c),v?l.__k=[]:(s=l.props.children,k(n,Array.isArray(s)?s:[s],l,u,t,"foreignObject"!==l.type&&i,o,r,f,c)),c||("value"in d&&void 0!==(s=d.value)&&s!==n.value&&A(n,"value",s,y.value,!1),"checked"in d&&void 0!==(s=d.checked)&&s!==n.checked&&A(n,"checked",s,y.checked,!1))}return n}function $(l,u,t){try{"function"==typeof l?l(u):l.current=u}catch(l){n.__e(l,t)}}function j(l,u,t){var i,o,r;if(n.unmount&&n.unmount(l),(i=l.ref)&&(i.current&&i.current!==l.__e||$(i,null,u)),t||"function"==typeof l.type||(t=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(l){n.__e(l,u)}i.base=i.__P=null}if(i=l.__k)for(r=0;r<i.length;r++)i[r]&&j(i[r],u,t);null!=o&&a(o)}function H(n,l,u){return this.constructor(n,u)}function I(l,u,t){var i,r,c;n.__&&n.__(l,u),r=(i=t===o)?null:t&&t.__k||u.__k,l=p(h,null,[l]),c=[],N(u,(i?u:t||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:r?null:u.childNodes.length?e.slice.call(u.childNodes):null,c,t||f,i),z(c,l)}n={__e:function(n,l){for(var u,t;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(t=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(t=!0,u.componentDidCatch(n)),t)return w(u.__E=u)}catch(l){n=l}throw n}},l=function(n){return null!=n&&void 0===n.constructor},y.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),w(this))},y.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),w(this))},y.prototype.render=h,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,x.__r=0,o=f,r=0,exports.render=I,exports.hydrate=function(n,l){I(n,l,o)},exports.createElement=p,exports.h=p,exports.Fragment=h,exports.createRef=function(){return{current:null}},exports.isValidElement=l,exports.Component=y,exports.cloneElement=function(n,l){var u,t;for(t in l=s(s({},n.props),l),arguments.length>2&&(l.children=e.slice.call(arguments,2)),u={},l)"key"!==t&&"ref"!==t&&(u[t]=l[t]);return v(n.type,u,l.key||n.key,l.ref||n.ref,null)},exports.createContext=function(n){var l={},u={__c:"__cC"+r++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var t,i=this;return this.getChildContext||(t=[],this.getChildContext=function(){return l[u.__c]=i,l},this.shouldComponentUpdate=function(n){i.props.value!==n.value&&t.some(function(l){l.context=n.value,w(l)})},this.sub=function(n){t.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){t.splice(t.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Consumer.contextType=u,u.Provider.__=u,u},exports.toChildArray=function n(l){return null==l||"boolean"==typeof l?[]:Array.isArray(l)?e.concat.apply([],l.map(n)):[l]},exports.__u=j,exports.options=n;


},{}]},{},[11]);

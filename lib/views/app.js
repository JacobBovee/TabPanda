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
    var renderCb_1 = function (manager) {
        var state = {
            tabManager: manager
        };
        preact_1.render(preact_1.h(popup_1.default, __assign({}, state)), POPUP_APP_ID_ELEMENT);
    };
    var manager_1 = new tabManager_1.TabManager();
    manager_1.init(renderCb_1);
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'local' && changes.tabManager) {
            manager_1.init(renderCb_1);
        }
    });
}
// Render folder if folder element is found
var FOLDER_APP_ID_ELEMENT = document.getElementById('folderApp');
if (FOLDER_APP_ID_ELEMENT) {
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
        if (namespace === 'local' && changes.tabManager) {
            manager_2.init(renderCb_2);
        }
    });
}

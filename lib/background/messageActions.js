"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
var storeTabManager = function (manager) {
    chrome.storage.local.set({ tabManager: manager });
};
exports.actions = {
    storeTabManager: storeTabManager,
};

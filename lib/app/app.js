"use strict";
// // Start app
// import { tabManager } from "../background/tabManager";
// type TabFolder = any;
// // Action items
// function initializeActionItems(tabManagerState: TabManagerState) {
//     const _collapseActiveBtn = document.querySelector('button#collapseActiveBtn');
//     const _cancelBtn = document.querySelector('button#cancelBtn');
//     const _saveBtn = document.querySelector('button#saveBtn');
//     const _newFolderBtn = document.querySelector('button#newFolderBtn')
//     if (_collapseActiveBtn) {
//         _collapseActiveBtn.addEventListener('click', () => {
//             tabManager.createFolderFromActiveTabs('New folder');
//         });
//     }
//     if (_newFolderBtn) {
//         _newFolderBtn.addEventListener('click', () => {
//             tabManager.createTabFolder('');
//         });
//     }
// }
// // Tab tree
// const _tabTree = document.querySelector('div#tabTree');
// function renderTab(tab: chrome.tabs.Tab, parent: Element | null) {
//     return `<li>${tab.title || tab.url}</li>`;
// }
// function renderFolderList(folder: TabFolder, parent: Element | null, ): string {
//     const _folderList = document.createElement('ul');
//     if (parent) {
//         for (const tab in folder.tabs) {
//             renderTab(tab, _folderList);
//         }
//         parent.appendChild(_folderList);
//     }
//     return `<ul>${folder.tabs.map((tab: any) => renderTab(tab)).join('')}</ul>`;
// }
// function renderFolders(folders: TabFolder[]) {
//     const _tabParent = document.querySelector('ul#parent');
//     for (const folder of folders) {
//         const _tabFolderTitle = document.createElement('li');
//         _tabFolderTitle.className = 'folder';
//         _tabFolderTitle.textContent = 
//         _tabParent?.appendChild(_tabFolderTitle);
//         renderFolderList(folder, _tabParent);
//     }
// }
// function renderActiveTabs(tabs: chrome.tabs.Tab[]) {
//     const _tabParent = document.querySelector('ul#parent');
//     if (_tabParent) {
//         tabs.forEach((tab: chrome.tabs.Tab) => {
//             if (tab.title) {
//                 const listItem = document.createElement('li');
//                 listItem.textContent = tab.title;
//                 _tabParent.appendChild(listItem);
//             }
//         });
//     }
// }
// function renderTabTree(tabFolders: TabFolder[]) {
//     if (_tabTree) {
//         const _tabParent = document.createElement('ul');
//         _tabParent.id = 'parent';
//         // Render folders
//         renderFolders(tabFolders);
//         // Render active tabs
//         tabManager.getActiveTabs(renderActiveTabs);
//     }
// }
// interface TabManagerState {
//     tabFolders: TabFolder[];
// }
// interface IState {
//     tabManager: TabManagerState;
// }
// // render
// function render(state: IState) {
//     const { tabManager } = state;
//     renderTabTree(tabManager.tabFolders);
//     initializeActionItems(tabManager);
// }
// chrome.storage.onChanged.addListener((changes, namespace) => {
//     if (namespace === 'sync' && changes.tabManager) {
//         const state = {
//             tabManager: changes.tabManager.newValue
//         };
//         render(state);
//     }
// });
// // Initial render
// chrome.storage.sync.get(['tabManager'], (data: any) => {
//     render(data);
// });

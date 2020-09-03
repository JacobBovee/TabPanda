import { h, render } from 'preact';
import Popup from './popup';
import { TabManager } from '../manager/tabManager';
import Folder from './folder';

// Render popup when popup element is found
const POPUP_APP_ID_ELEMENT = document.getElementById('App');

if (POPUP_APP_ID_ELEMENT) {
    const renderCb = (manager: TabManager) => {
        const state = {
            tabManager: manager
        };
        render(<Popup {...state} />, POPUP_APP_ID_ELEMENT as Element)
    }

    const manager = new TabManager();
    manager.init(renderCb);

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes[manager.currentWindowName()]) {
            manager.init(renderCb);
        }
    });
}

// Render folder if folder element is found
const FOLDER_APP_ID_ELEMENT = document.getElementById('folderApp');

if (FOLDER_APP_ID_ELEMENT) {
    const renderCb = (manager: TabManager) => {
        try {
            const folderId = parseInt(window.location.href.split('?folderId=')[1]);
            const state = {
                tabManager: manager,
                folderId
            };
            render(<Folder {...state} />, FOLDER_APP_ID_ELEMENT as Element)
        }
        catch (e) {
            throw new Error(e)
        }
    }
    const manager = new TabManager();
    manager.init(renderCb);

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes[manager.currentWindowName()]) {
            manager.init(renderCb);
        }
    });
}

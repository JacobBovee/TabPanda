import { findParentWithMatchingAttribute } from "../utils";

interface ITabManagerState {
    tabFolders: TabFolder[];
}

interface IFolderState {
    name: string;
    tabs: chrome.tabs.Tab[];
    id: number;
    editTitle: boolean;
    activeTabs: chrome.tabs.Tab[];
}

export class TabManager {
    public tabFolders: TabFolder[];
    public currentWindow?: number;
    public activeTabs: TabFolder;

    constructor() {
        this.tabFolders = [];

        this.mountExtension();
        this.activeTabs = new TabFolder('active_tabs_folder', -1);
    }

    protected setCurrentWindow(cb?: () => void) {
        try {
            chrome.windows.getCurrent((current) => {
                this.currentWindow = current.id;
                if (cb) {
                    cb();
                }
            });
        }
        catch (error) {
            throw new Error('Could not assign current window ID')
        }
    }

    public init(cb: (manager: TabManager) => void) {
        this.mountExtension(cb);
    }

    public static getActiveTabs(cb: (tabs: chrome.tabs.Tab[]) => void, ignoreFolders?: boolean) {
        chrome.windows.getCurrent({ populate: true }, function(currentWindow) {
            chrome.tabs.query({ currentWindow: true, active: true }, function(currentTabs) {
                if (currentWindow && currentWindow.tabs) {
                    const tabs = ignoreFolders ? 
                        currentWindow.tabs.filter((tab) => !tab.url?.includes('/folder.html'))
                        : currentWindow.tabs;
                    cb(tabs);
                }
            });
        });
    }

    public getFolderTabs(_cb: (tabs: chrome.tabs.Tab[]) => void) {
        const cb = (tabs: chrome.tabs.Tab[]) => {
            const folderTabs = tabs.filter((tab) => tab.url?.includes('folder.html'));
            _cb(folderTabs);
        }

        TabManager.getActiveTabs(cb);
    }

    public static collapseTabs(tabs: chrome.tabs.Tab[]) {
        for (const tab in tabs) {
           TabManager.collapseTab(tabs[tab]); 
        }
    }

    public static collapseTab(tab: chrome.tabs.Tab) {
        if (tab.id) {
            chrome.tabs.remove(tab.id);
        }
    }

    public createFolderFromActiveTabs(name: string) {
        const cb = (tabs: chrome.tabs.Tab[]) => this.createTabFolder(name, tabs);
        TabManager.getActiveTabs(cb, true);
    }

    public createTabFolder(name: string, tabs?: chrome.tabs.Tab[], editTitle?: boolean) {
        const id = this.tabFolders.length ? this.tabFolders[this.tabFolders.length-1].id + 1 : 0;
        const tabFolder = new TabFolder(name, id, tabs, editTitle);
        this.tabFolders.push(tabFolder);
    }

    public getFolderIdFromTab(tab: chrome.tabs.Tab) {
        return tab.url && parseInt(tab.url.split('folderId=')[1]);
    }

    public getFolderIdFromTabs(tabs: chrome.tabs.Tab[]) {
        return tabs
            .filter((tab) => tab.url?.includes('folderId='))
            .map((tab) => this.getFolderIdFromTab(tab));
    }

    public restoreFolder(folder: TabFolder) {
        TabFolder.restoreAllStatic(folder);
        this.deleteFolder(folder);
        this.store();
    }

    public createFolderWindows(folders: TabFolder[], activeTabs: chrome.tabs.Tab[]) {
        const folderIds = this.getFolderIdFromTabs(activeTabs);
        folders.forEach((folder) => {
            if (!folderIds.length || !folderIds.includes(folder.id)) {
                this.createFolderWindow(folder);
            }        
        });
    }

    public createFolderWindow(folder: TabFolder) {
        // Inject folder data into html
        const folderUrl = chrome.extension.getURL('./folder.html');
        const cb = (tab: chrome.tabs.Tab) => {
            folder.tabId = tab.id
        }

        chrome.tabs.create({
            url: `${folderUrl}?folderId=${folder.id}`,
            active: false
        }, cb);
    }

    public removeTabByFolderId(id: number) {
        const cb = (tabs: chrome.tabs.Tab[]) => {
            tabs.map((tab) => {
                if (this.getFolderIdFromTab(tab) === id) {
                    TabManager.collapseTab(tab);
                }
            });
        }
        this.getFolderTabs(cb);
    }

    public cleanupFolders() {
        const cb = (folderTabs: chrome.tabs.Tab[]) => {
            folderTabs.forEach((folderTab) => {
                const id = this.getFolderIdFromTab(folderTab);
                if (id && !this.getTabFolderById(id)) {
                    TabManager.collapseTab(folderTab);
                }
            });
        }

        this.getFolderTabs(cb);
    }

    public deleteFolder(folder: TabFolder) {
        const index = this.tabFolders.indexOf(folder);
        this.tabFolders.splice(index, 1);
        this.removeTabByFolderId(folder.id);
    }

    public getTabFolderById(id: number) {
        const folder = this.tabFolders.find((folder) => folder.id === id);
        if (!folder) {
            throw new Error('Folder id does not exist');
        }
        else {
            return folder;
        }
    }

    protected getTabsIds(tabs: chrome.tabs.Tab[]) {
        return tabs.map((tab) => tab.id);
    }

    protected updateActiveTabs(newActiveTabs: chrome.tabs.Tab[], prevActiveTabs: chrome.tabs.Tab[]) {
        const activeIds = this.getTabsIds(newActiveTabs);
        const collapseTabs = prevActiveTabs.filter((tab) => !activeIds.includes(tab.id));
        collapseTabs.forEach((tab) => TabManager.collapseTab(tab));
    }

    protected setActiveTabs(cb?: (manager: TabManager) => void) {
        TabManager.getActiveTabs((tabs) => {
            this.activeTabs.setTabs(tabs);
            if (cb) {
                cb(this);
            }
        }, true)

    }

    protected mapManagerStateToObject(managerState: ITabManagerState, cb?: (manager: TabManager) => void) {
        for (const propName in managerState) {
            let property = (this as any)[propName];
            if (property) {
                const statePropValue: any = (managerState as any)[propName];
                if (propName === 'tabFolders') {
                    this.tabFolders = statePropValue.map((folder: IFolderState) => new TabFolder(folder.name, folder.id, folder.tabs));
                }
                else if (propName !== 'activeTabs') {
                    (this as any)[propName] = statePropValue;
                    this.setActiveTabs(cb);
                }
            }
        }
    }

    protected mountExtension(cb?: (manager: TabManager) => void) {
        const _cb = (tabManager: ITabManagerState) => {;
            if (!tabManager) {
                this.store();
            } 
            else {
                this.mapManagerStateToObject(tabManager, cb);
            } 
        }
        const storedTabManagerCb = () => this.getStoredTabManager(_cb);
        this.setCurrentWindow(storedTabManagerCb);
    }

    protected async updateBrowser(manager?: ITabManagerState) {
        if (manager) {
            const activeTabsCb = (prevTabs: chrome.tabs.Tab[]) => {
                this.updateActiveTabs(this.activeTabs.tabs, prevTabs)
            };
            await TabManager.getActiveTabs(
                (prevTabs) => this.createFolderWindows(manager.tabFolders, prevTabs),
                false
            );
            await TabManager.getActiveTabs(activeTabsCb, true); 
            await this.cleanupFolders();
        }
    }

    public getTabFromEvent(event: MouseEvent, tabs: chrome.tabs.Tab[], attributeName: string) {
        const rootElement = (event.target as Element);
        const tabElement = (findParentWithMatchingAttribute(rootElement, attributeName) as Element);

        const tabIndexString = tabElement.getAttribute(attributeName)
        const tabId = tabIndexString ? parseInt(tabIndexString) : 0;

        return tabs.find((tab) => tab.id === tabId);
    }

    public getFolderFromEvent(event: MouseEvent) {
        const rootElement = (event.target as Element);
        const folderElement = findParentWithMatchingAttribute(rootElement, 'data-folder');

        if (folderElement) {
            const folderIndex = (folderElement as Element).getAttribute('data-folder');

            return this.getTabFolderById(folderIndex ? parseInt(folderIndex) : 0);
        }
    }

    public currentWindowName() {
        return `tm_${this.currentWindow}`;
    }

    public compareTabStateToManager(state: ITabManagerState) {
        return state.tabFolders == this.tabFolders;
    }

    protected getStoredTabManager(cb: (tabManager: ITabManagerState) => void) {
        const id = this.currentWindowName();
        chrome.storage.local.get([id], (data) => {
            if (this.currentWindow) {
                const tabManager = data[id];
                cb(tabManager);
            }
            else {
                throw new Error('Could not get stored tab manager');
            }
        })
    }

    public store(manager?: ITabManagerState) {
        if (manager) {
            if (this.tabFolders !== manager.tabFolders) {
                this.tabFolders = manager.tabFolders;
            }
        }
        this.updateBrowser(manager)
        chrome.storage.local.set({ [this.currentWindowName()]: this }, () => {})
    }
}

export class TabFolder {
    public id: number;
    public tabId?: number;
    public tabs: chrome.tabs.Tab[];
    public name: string;
    public editTitle: boolean;

    constructor(name: string, id: number, tabs?: chrome.tabs.Tab[], editTitle?: boolean) {
        this.tabs = tabs || [];
        this.name = name;
        this.editTitle = editTitle || false;
        this.id = id;
    }

    public setTab(tab: chrome.tabs.Tab) {
        this.tabs.push(tab);

        return this.tabs.length;
    }

    public setTabs(tabs: chrome.tabs.Tab[]) {
        this.tabs = [...tabs];
    }

    public deleteTab(argTab: chrome.tabs.Tab) {
        const tabs = this.tabs.filter((tab) => tab.id !== argTab.id);
        this.tabs = tabs;
    }

    public static restoreAllStatic(tabFolder: TabFolder) {
        for (const tab of tabFolder.tabs) {
            TabFolder.restoreStatic(tabFolder, tab)
        }
        TabFolder.destroyStatic(tabFolder);
    }

    public static restoreStatic(tabFolder: TabFolder, tab: chrome.tabs.Tab) {
        chrome.tabs.create({
            url: tab.url
        });
        TabFolder.deleteTabStatic(tabFolder, tab);
    }

    public static deleteTabStatic(tabFolder: TabFolder, tab: chrome.tabs.Tab) {
        const index = tabFolder.tabs.indexOf(tab);
        tabFolder.tabs.splice(index, 1);
    }

    public static destroyStatic(tabFolder: TabFolder) {
        tabFolder.tabs = [];
    }
}
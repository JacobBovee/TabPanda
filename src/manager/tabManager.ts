interface ITabManagerState {
    tabFolders: TabFolder[];
    activeTabs: chrome.tabs.Tab[];
}

export class TabManager {
    public tabFolders: TabFolder[];

    constructor() {
        this.tabFolders = [];

        this.mountExtension();
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

    public collapseTabs(tabs: chrome.tabs.Tab[]) {
        for (const tab in tabs) {
           this.collapseTab(tabs[tab]); 
        }
    }

    public collapseTab(tab: chrome.tabs.Tab) {
        debugger;
        if (tab.id) {
            chrome.tabs.remove(tab.id);
        }
    }

    public createFolderFromActiveTabs(name: string) {
        const cb = (tabs: chrome.tabs.Tab[]) => this.createTabFolder(name, tabs);
        TabManager.getActiveTabs(cb, true);
    }

    public createTabFolder(name: string, tabs?: chrome.tabs.Tab[], editTitle?: boolean) {
        const largestId = this.tabFolders[this.tabFolders.length-1].id + 1;
        const tabFolder = new TabFolder(name, largestId || 0, tabs, editTitle);
        this.tabFolders.push(tabFolder);
    }

    public createFolderWindows(folders: TabFolder[], activeTabs: chrome.tabs.Tab[]) {
        folders.forEach((folder) => this.createFolderWindow(folder, activeTabs));
    }

    public createFolderWindow(folder: TabFolder, activeTabs: chrome.tabs.Tab[]) {
        // Inject folder data into html
        const folderUrl = chrome.extension.getURL('./folder.html');
        const tabIds = activeTabs.map((tab) => tab.id);
        const cb = (tab: chrome.tabs.Tab) => {
            debugger;
            folder.tabId = tab.id
        }
        debugger;
        console.log(folder.tabId)
        console.log(tabIds);
        console.log(tabIds.indexOf(folder.tabId));
        console.log(!tabIds.indexOf(folder.tabId))
        if (!folder.tabId || !!tabIds.indexOf(folder.tabId)) {
            chrome.tabs.create({
                url: folderUrl
            }, cb);
        }
    }

    public deleteFolder(folder: TabFolder) {
        debugger;
        const index = this.tabFolders.indexOf(folder);
        this.tabFolders.splice(index, 1);
        debugger;
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

    public static getStaticTabFolder(index: number, cb: (tabFolder: TabFolder) => void) {
        chrome.storage.local.get(['tabManager'], (data) => {
            const tabManager = data.tabManager;
            cb(tabManager.tabFolders[index]);
        });
    }

    public static getStaticTabFolders(cb: (tabFolders: TabFolder[]) => void) {
        chrome.storage.local.get(['tabManager'], (data) => {
            const tabManager = data.tabManager;
            cb(tabManager.tabFolders);
        });
    }

    protected async updateActiveTabs(newActiveTabs: chrome.tabs.Tab[], prevActiveTabs: chrome.tabs.Tab[]) {
        const collapseTabs = prevActiveTabs.filter((tab) => newActiveTabs.indexOf(tab));
        debugger;
        collapseTabs.forEach((tab) => this.collapseTab(tab));
    }

    protected mapManagerStateToObject(managerState: ITabManagerState, cb?: (manager: TabManager) => void) {
        for (const propName in managerState) {
            let property = (this as any)[propName];
            if (property) {
                const statePropValue: any = (managerState as any)[propName];
                (this as any)[propName] = statePropValue;
                if (cb) {
                    cb(this);
                }
            }
        }
    }

    public mountExtension(cb?: (manager: TabManager) => void) {
        chrome.storage.local.get(['tabManager'], (data: any) => {
            if (!data.tabManager) {
                this.store();
            } else {
                this.mapManagerStateToObject(data.tabManager, cb);
            }
        });
    }

    protected async updateBrowser(manager?: ITabManagerState) {
        if (manager) {
            debugger;
            const activeTabsCb = async (prevTabs: chrome.tabs.Tab[]) => {
                debugger;
                this.updateActiveTabs(manager.activeTabs, prevTabs)
            };
            TabManager.getActiveTabs(activeTabsCb, true); 
            TabManager.getActiveTabs(
                (prevTabs) => this.createFolderWindows(manager.tabFolders, prevTabs),
                false
            );
        }
    }

    public async store(manager?: ITabManagerState) {
        if (manager) {
            if (this.tabFolders !== manager.tabFolders) {
                this.tabFolders = manager.tabFolders;
            }
        }
        this.updateBrowser(manager)
        chrome.storage.local.set({ tabManager: this }, () => {})
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
        this.tabs = [...this.tabs, ...tabs];
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
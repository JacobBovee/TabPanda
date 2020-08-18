import { render, Component, h } from 'preact';
import Header from './components/header';
import TabTree from './components/tabTree';
import ActionItems from './components/actionItems'
import { TabFolder, TabManager } from '../manager/tabManager';
import ContextMenu from './components/contextMenu';
import { findParentWithMatchingAttribute } from '../manager/utils';
import Warning from './components/warning';

interface IProps {
    tabManager: TabManager;
}

interface IState {
    tabFolders: TabFolder[];
    activeTabs: chrome.tabs.Tab[];
    warning?: boolean;
}

class Popup extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.setTabFolders = this.setTabFolders.bind(this);
        this.setActiveTabs = this.setActiveTabs.bind(this);
        this.collapseActiveAction = this.collapseActiveAction.bind(this);
        this.saveAction = this.saveAction.bind(this);
        this.cancelAction = this.cancelAction.bind(this);
        this.newFolderAction = this.newFolderAction.bind(this);
        this.getFolderFromEvent = this.getFolderFromEvent.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        const { tabManager } = this.props;

        this.setTabFolders(tabManager.tabFolders);
        TabManager.getActiveTabs(this.setActiveTabs, true);
    }

    setTabFolders(folders: TabFolder[]) {
        this.setState({ tabFolders: folders });
    }
    
    setActiveTabs(tabs: chrome.tabs.Tab[]) {
        this.setState({ activeTabs: tabs });
    }

    collapseActiveAction() {
        const { tabManager } = this.props;
        const { activeTabs } = this.state;
        tabManager.createTabFolder('New folder', activeTabs, true);

        this.setState({
            tabFolders: tabManager.tabFolders,
            activeTabs: []
        });
    }

    newFolderAction() {
        const { tabManager } = this.props;
        tabManager.createTabFolder('New folder', [], true);
        this.updateState(tabManager);
    }

    cancelAction() {
        window.close();
    }

    saveAction() {
        const { tabManager } = this.props;
        tabManager.store(this.state);
    }

    updateState(tabManager: TabManager) {
        this.setTabFolders(tabManager.tabFolders);
    }

    getTabFromEvent(event: MouseEvent) {
        const rootElement = (event.target as Element);
        const tabFolder = this.getFolderFromEvent(event);
        const tabElement = findParentWithMatchingAttribute(rootElement, 'data-tab-id');
        
        const tabIndex = (tabElement as Element).getAttribute('data-tab-id')
        
        return tabFolder.tabs[tabIndex ? parseInt(tabIndex) : 0];
    }

    getFolderFromEvent(event: MouseEvent) {
        const { tabManager } = this.props;
        const rootElement = (event.target as Element);
        const folderElement = findParentWithMatchingAttribute(rootElement, 'data-folder');
        const folderIndex = (folderElement as Element).getAttribute('data-folder');

        return tabManager.getTabFolderById(folderIndex ? parseInt(folderIndex) : 0);
    }

    render() {
        const { tabManager } = this.props;
        const { tabFolders, activeTabs, warning } = this.state;

        const actions = [
            {
                title: 'New folder',
                onClick: (_: MouseEvent) => {
                    console.log('New folder');
                    this.newFolderAction();
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
                onClick: (event: MouseEvent) => {
                    const folder = this.getFolderFromEvent(event);
                    debugger;
                    TabFolder.restoreAllStatic(folder);
                    tabManager.store();
                },
                contexts: [{
                    class: 'folder'
                }]
            },
            {
                title: 'Delete folder',
                onClick: (event: MouseEvent) => {
                    const folder = this.getFolderFromEvent(event);
                    console.log('Foldr');
                    console.dir(folder);
                    tabManager.deleteFolder(folder);
                    this.updateState(tabManager);
                },
                contexts: [{
                    class: 'folder'
                }]
            },
            {
                title: 'Restore tab',
                onClick: (event: MouseEvent) => {
                    const folder = this.getFolderFromEvent(event);
                    const tab = this.getTabFromEvent(event);
                    debugger;
                    TabFolder.restoreStatic(folder, tab);
                    tabManager.store();
                },
                contexts: [{
                    class: 'tab'
                }]
            },
            {
                title: 'Delete tab',
                onClick: (event: MouseEvent) => {
                    const folder = this.getFolderFromEvent(event);
                    const tab = this.getTabFromEvent(event);
                    TabFolder.deleteTabStatic(folder, tab);
                    this.updateState(tabManager);
                },
                contexts: [{
                    class: 'tab'
                }]
            }
        ];;

        return (
            <div id="wrapper">
                <Header collapseAction={this.collapseActiveAction} />
                <TabTree tabFolders={tabFolders} activeTabs={activeTabs} />
                <ActionItems
                    saveAction={this.saveAction}
                    cancelAction={this.cancelAction}
                    newFolderAction={this.newFolderAction}
                />
                <ContextMenu actions={actions} />
                {warning && <Warning
                    title={'You have unsaved changes'}
                    message={'Would you like to save your changes?'}
                    cancelAction={this.cancelAction}
                    saveAction={this.saveAction}
                />}
            </div>
        )
    }
}

const renderCb = (manager: TabManager) => {
    const state = {
        tabManager: manager
    };
    render(<Popup {...state} />, document.getElementById('App') as Element)
}

const manager = new TabManager();
manager.init(renderCb);

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.tabManager) {
        manager.init(renderCb);
    }
});

// Menu
chrome.contextMenus.create({ title: 'Restore folder', contexts: ['page'] });
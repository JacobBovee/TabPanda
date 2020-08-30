import { render, Component, h } from 'preact';
import Header from './components/header';
import TabTree from './components/tabTree';
import ActionItems from './components/actionItems'
import { TabFolder, TabManager } from '../manager/tabManager';
import ContextMenu from './components/contextMenu';
import { findParentWithMatchingAttribute } from '../utils';
import Warning from './components/warning';
import { DATA_TAB_ID_ATTRIBUTE_NAME, DATA_TAB_INDEX_ATTRIBUTE_NAME } from '../constants';

interface IProps {
    tabManager: TabManager;
}

interface IState {
    tabFolders: TabFolder[];
    activeTabs: chrome.tabs.Tab[];
    warning?: boolean;
}

export default class Popup extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.setTabFolders = this.setTabFolders.bind(this);
        this.setActiveTabs = this.setActiveTabs.bind(this);
        this.collapseActiveAction = this.collapseActiveAction.bind(this);
        this.saveAction = this.saveAction.bind(this);
        this.cancelAction = this.cancelAction.bind(this);
        this.newFolderAction = this.newFolderAction.bind(this);
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

    render() {
        const { tabManager } = this.props;
        const { tabFolders, activeTabs, warning } = this.state;

        const actions = [
            {
                title: 'New folder',
                onClick: (_: MouseEvent) => () => {
                    this.newFolderAction();
                    this.updateState(tabManager);
                },
                contexts: [{
                    id: 'tabTree'
                }],
            },
            {
                title: 'Restore folder',
                onClick: (event: MouseEvent) => {
                    const folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        TabFolder.restoreAllStatic(folder);
                        this.updateState(tabManager);
                        tabManager.store();
                    }
                },
                contexts: [{
                    class: 'folder'
                }]
            },
            {
                title: 'Delete folder',
                onClick: (event: MouseEvent) => {
                    const folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        tabManager.deleteFolder(folder);
                        this.updateState(tabManager);
                    }
                },
                contexts: [{
                    class: 'folder'
                }]
            },
            {
                title: 'Restore tab',
                onClick: (event: MouseEvent) => {
                    const folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        const tab = tabManager.getTabFromEvent(event, folder.tabs, DATA_TAB_ID_ATTRIBUTE_NAME);
                        if (tab) {
                            TabFolder.restoreStatic(folder, tab);
                            tabManager.store();
                        }
                    }
                },
                contexts: [{
                    class: 'tab'
                }],
                leftContext: {
                    class: 'more'
                }
            },
            {
                title: 'Delete tab',
                onClick: (event: MouseEvent) => {
                    const folder = tabManager.getFolderFromEvent(event);
                    if (folder) {
                        const folderTab = tabManager.getTabFromEvent(event, folder.tabs, DATA_TAB_ID_ATTRIBUTE_NAME);
                        if (folderTab) {
                            TabFolder.deleteTabStatic(folder, folderTab);
                        }
                    }
                    else {
                        const activeTab = tabManager.getTabFromEvent(event, activeTabs, DATA_TAB_ID_ATTRIBUTE_NAME);
                        if (activeTab) {
                            const tabs = activeTabs.filter((_tab) => activeTab.id !== _tab.id);
                            this.setActiveTabs(tabs);
                        }         
                    }
                    this.updateState(tabManager);
                },
                contexts: [{
                    class: 'tab'
                }],
                leftContext: {
                    class: 'more'
                }
            }
        ];

        return (
            <div id="wrapper">
                <Header title='Edit tabs' id={'collapseActiveBtn'} actionTitle={'Collapse Action'} actionFn={this.collapseActiveAction} />
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

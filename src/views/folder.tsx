import { h, Component } from 'preact';
import { TabFolder, TabManager } from '../manager/tabManager';
import Header from './components/header';
import TabTree from './components/tabTree';
import Icon from './components/icon';
import { DATA_TAB_ID_ATTRIBUTE_NAME } from '../constants';
import ContextMenu from './components/contextMenu';

interface IProps {
    tabManager: TabManager;
    folderId: number;
}

interface IState {
    tabManager: TabManager;
}


export default class Folder extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            tabManager: props.tabManager
        }

        this.restoreFolder = this.restoreFolder.bind(this);
    }

    getFolder() {
        const { tabManager } = this.state;
        const { folderId } = this.props;
        return tabManager.getTabFolderById(folderId);
    }
    
    componentDidMount() {
        this.setState({ tabManager: this.props.tabManager});
        const folder = this.getFolder();
        window.document.title = folder.name;
    }

    updateState(tabManager: TabManager) {
        this.setState({ tabManager });
    }

    restoreFolder() {
        const { tabManager } = this.state;
        const folder = this.getFolder();
        tabManager.restoreFolder(folder)
    }

    render() {
        const { tabManager } = this.state;
        const tabFolder = this.getFolder();

        const actions = [
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
                    const tab = tabManager.getTabFromEvent(event, tabFolder.tabs, DATA_TAB_ID_ATTRIBUTE_NAME);
                    if (tab) {
                        TabFolder.deleteTabStatic(tabFolder, tab);
                        tabManager.store();
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

        if (tabManager && tabFolder) {
            return (
                <div className='folder-wrapper'>
                    <Header
                        actionTitle='Restore folder' 
                        actionFn={this.restoreFolder} 
                        title={<div className='folder-title'><Icon type="folder" /> {tabFolder.name}</div>}
                    />
                    <TabTree activeTabs={tabFolder.tabs}></TabTree>
                    <ContextMenu actions={actions}></ContextMenu>
                </div>
            );
        }
    }
}

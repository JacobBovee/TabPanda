import { Component, h } from 'preact';
import TabList from './tabList';
import { TabFolder } from '../../manager/tabManager';
import ContextMenu from './contextMenu';

interface IProps {
    tabFolders?: TabFolder[];
    activeTabs?: TabFolder;
}

interface IState {
    contextVisible: boolean;
}

export default class TabTree extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            contextVisible: false
        };
    }

    protected contextMenuClick = (event: MouseEvent) => {
        this.setState({ contextVisible: true });
    }

    protected allTabs() {
        const { tabFolders, activeTabs } = this.props;
        const allTabs: chrome.tabs.Tab[] = [];
        const pushFolder = (folder: TabFolder[]) => folder
            .map((tabFolder) => tabFolder.tabs)
            .forEach((folderTab) => allTabs.push(...folderTab));
        if (tabFolders) {
            pushFolder(tabFolders);
        }
        if (activeTabs) {
            allTabs.push(...activeTabs.tabs);
        }
        return allTabs;
    }

    render() {
        const { tabFolders, activeTabs } = this.props;

        return (
            <div id="tabTree">
                <ul class="parent">
                    {tabFolders && tabFolders.map((folder) => {
                        return <TabList folder={folder} allTabs={this.allTabs()} />
                    })}
                    {activeTabs && <TabList folder={activeTabs} allTabs={this.allTabs()} />}
                </ul>
            </div>
        )
    }
}

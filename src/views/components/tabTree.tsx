import { Component, h } from 'preact';
import TabList from './tabList';
import { TabFolder } from '../../manager/tabManager';
import ContextMenu from './contextMenu';

interface IProps {
    tabFolders?: TabFolder[];
    activeTabs?: chrome.tabs.Tab[];
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

    contextMenuClick = (event: MouseEvent) => {
        this.setState({ contextVisible: true });
    }

    render() {
        const { tabFolders, activeTabs } = this.props;

        return (
            <div id="tabTree">
                <ul class="parent">
                    {tabFolders && tabFolders.map((folder) => {
                        return <TabList folder={folder} />
                    })}
                    {activeTabs && <TabList tabs={activeTabs} />}
                </ul>
            </div>
        )
    }
}

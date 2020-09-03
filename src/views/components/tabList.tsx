import { h, Component } from 'preact';
import { TabFolder } from '../../manager/tabManager';
import FolderItem from './folderItem';

interface IProps {
    folder: TabFolder;
    allTabs: chrome.tabs.Tab[];
}

export default class TabList extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.getTabById = this.getTabById.bind(this);
        this.updateFolder = this.updateFolder.bind(this);
    }

    getTabById(id: number) {
        const { allTabs } = this.props;
        return allTabs.find((tab) => tab.id === id);
    }

    updateFolder() {
        this.forceUpdate();
    }

    render() {
        const { folder } = this.props;

        return <FolderItem getTabById={this.getTabById} folder={folder} />        
    }
}
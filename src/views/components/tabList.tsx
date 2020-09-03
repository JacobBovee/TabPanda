import { h, Component } from 'preact';
import { TabFolder } from '../../manager/tabManager';
import FolderItem from './folderItem';

interface IProps {
    folder: TabFolder;
    allTabs: chrome.tabs.Tab[];
    hideFolder?: true;
}

export default class TabList extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.getTabById = this.getTabById.bind(this);
    }

    getTabById(id: number) {
        const { allTabs } = this.props;
        return allTabs.find((tab) => tab.id === id);
    }

    render() {
        const { folder, hideFolder } = this.props;

        return <FolderItem hideFolder={hideFolder} getTabById={this.getTabById} folder={folder} />        
    }
}
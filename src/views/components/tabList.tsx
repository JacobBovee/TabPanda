import { h, Component } from 'preact';
import { TabFolder } from '../../manager/tabManager';
import Tab from './tab';
import Icon from './icon';
import FolderItem from './folderItem';

interface IProps {
    folder?: TabFolder;
    tabs?: chrome.tabs.Tab[];
}

export default class TabList extends Component<IProps, {}> {    
    render() {
        const { tabs, folder } = this.props;

        if (folder) {
            return <FolderItem folder={folder} />
        }
        
        if (tabs) {
            return (
                <ul>
                    {tabs && tabs.map((tab) => <Tab tab={tab} />)}
                </ul>
            );
        }
    }
}
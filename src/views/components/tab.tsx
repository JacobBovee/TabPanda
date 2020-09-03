import { h, Component } from 'preact';
import Icon from './icon';
import { DATA_TAB_ID_ATTRIBUTE_NAME } from '../../constants';
import { TabFolder, TabManager } from '../../manager/tabManager';

interface IProps {
    tab: chrome.tabs.Tab;
    folder?: TabFolder;
    updateFolder: () => void;
}

export default class Tab extends Component<IProps, {}> {
    render() {
        const { tab, folder, updateFolder } = this.props;
        const ico = tab.favIconUrl ? <Icon type={'custom'} iconSrc={tab.favIconUrl} /> : <Icon type="link" />;
        const dataAttributes = { [DATA_TAB_ID_ATTRIBUTE_NAME]: tab.id };
        
        return (
                <li
                    draggable={true}
                    onDragStart={(ev: DragEvent) => tab.id && ev.dataTransfer?.setData('tabId', tab.id.toString())}
                    onDrag={(ev: DragEvent) => {}}
                    onDragEnd={(ev: DragEvent) => {
                        if (folder) {
                            folder.deleteTab(tab);
                            updateFolder();
                        }
                        else {
                            TabManager.collapseTab(tab);
                            updateFolder();
                        }
                    }}
                    class="tab" {...dataAttributes}>
                    <span>{ico}{tab.title}</span><Icon className='more' type={'more'} />
                </li>
        );
    }
}
import { h, Component } from 'preact';
import { TabFolder } from '../../manager/tabManager';
import Icon from './icon';
import Tab from './tab';

interface IProps {
    folder: TabFolder;
    updateFolder?: (folder: TabFolder) => void;
    getTabById: (id: number) => chrome.tabs.Tab | undefined;
}

interface IState {
    collapsed?: boolean;
}

export default class FolderItem extends Component<IProps, IState> {
    protected input?: HTMLInputElement | null;
    constructor(props: IProps) {
        super(props);

        this.saveFolderName = this.saveFolderName.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.inputField = this.inputField.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.onTabDrop = this.onTabDrop.bind(this);
        this.updateFolder = this.updateFolder.bind(this);
    }

    componentDidUpdate() {
        const { folder } = this.props;
        if (folder.editTitle && this.input) {
            this.input.focus();
        }
    }

    protected saveFolderName() {
        const name = this.input?.value;
        const { folder } = this.props;

        if (folder) {
            if (name && name.length) {
                folder.name = name;
            }
            else {
                folder.name = 'New folder';
            }
            folder.editTitle = false;
        }
    }

    protected handleInputKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.saveFolderName();
            this.input?.blur();
        }
    }

    protected inputField() {
        if (document.activeElement) {
            try {
                (document.activeElement as HTMLElement).blur();
                this.input?.focus();
            }
            catch(e) {
                // no autofocus available
            }
        }
        return (
            <input
                type="text"
                autoFocus
                tabIndex={1}
                onBlur={this.saveFolderName}
                onKeyPress={this.handleInputKeyDown}
                ref={(input) => this.input = input}
            />
        );
    }


    protected toggleCollapse() {
        const { collapsed } = this.state;
        this.setState({ collapsed: !collapsed });
    }

    protected onTabDrop(ev: DragEvent) {
        ev.preventDefault();
        const { getTabById, folder } = this.props;

        if (ev.target && ev.dataTransfer) {
            const tabId = parseInt(ev.dataTransfer.getData('tabId'));
            const tab = getTabById(tabId);
            ev.dataTransfer.setData('droppedFolder', folder.id.toString());
            if (tab) {
                if (!folder.tabs.includes(tab)) {
                    folder.setTab(tab);
                    this.forceUpdate();
                }
                else {
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }
        }
    }

    protected updateFolder() {
        this.forceUpdate();
    }

    render() {
        const { collapsed } = this.state;
        const { folder } = this.props;
        if (folder.id === -1) {
            return (<ul>{folder.tabs.map((tab) => <Tab updateFolder={this.updateFolder} folder={folder} tab={tab} />)}</ul>)
        }

        return (
            <div
                onDragOver={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
                onDrop={this.onTabDrop}
            >
                <li
                    className={`folder ${collapsed ? 'collapsed' : ''}`}
                    data-folder={`${folder.id}`}
                ><div onClick={this.toggleCollapse}>
                    <Icon type='triangle' />
                    <Icon type='folder' />
                    {folder.editTitle ?
                        this.inputField()
                        :
                        folder.name
                    }</div>
                    {!collapsed && 
                        <ul>
                            {folder && folder.tabs.map((tab) => <Tab updateFolder={this.updateFolder} folder={folder} tab={tab} />)}
                        </ul>}
                </li>
            </div>
        );
    }
}
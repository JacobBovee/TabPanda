import { h, Component } from 'preact';
import { TabFolder } from '../../manager/tabManager';
import Tab from './tab';
import Icon from './icon';

interface IProps {
    folder?: TabFolder;
    tabs?: chrome.tabs.Tab[];
}

interface IState {
    collapsed?: boolean;
}

export default class TabList extends Component<IProps, IState> {
    protected input?: HTMLInputElement | null;
    constructor(props: IProps) {
        super(props);

        this.saveFolderName = this.saveFolderName.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.inputField = this.inputField.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }
    
    componentDidUpdate() {
        const { folder } = this.props;
        if (folder && folder.editTitle && this.input) {
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
            this.setState({ folder });
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

    render() {
        const { tabs, folder } = this.props;
        const { collapsed } = this.state;

        if (folder) {
            return (
                <div>
                    <li
                        className={`folder ${collapsed ? 'collapsed' : ''}`}
                        data-folder={`${folder.id}`}
                        onClick={this.toggleCollapse}
                    ><div>
                        <Icon type='triangle' />
                        <Icon type='folder' />
                        {folder.editTitle ?
                            this.inputField()
                            :
                            folder.name
                        }</div>
                        {!collapsed && 
                            <ul>
                                {folder && folder.tabs.map((tab) => <Tab tab={tab} />)}
                            </ul>}
                    </li>
                </div>
            );
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
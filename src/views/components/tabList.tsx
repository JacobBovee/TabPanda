import { h, Component } from 'preact';
import { TabFolder } from '../../manager/tabManager';
import Tab from './tab';
import Icon from './icon';

interface IProps {
    folder?: TabFolder;
    tabs?: chrome.tabs.Tab[];
}

export default class TabList extends Component<IProps, {}> {
    protected input?: HTMLInputElement | null;
    constructor(props: IProps) {
        super(props);

        this.saveFolderName = this.saveFolderName.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.inputField = this.inputField.bind(this);
    }
    
    componentDidUpdate() {
        const { folder, tabs } = this.props;
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
            } catch(e) {
                // no autofocus
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

    render() {
        const { tabs, folder } = this.props;

        if (folder) {
            return (
                <div>
                    <li class="folder" data-folder={`${folder.id}`}><div>
                        <Icon type='folder' />
                        {folder.editTitle ?
                            this.inputField()
                            :
                            folder.name
                        }</div>
                        <ul>
                            {folder && folder.tabs.map((tab) => <Tab tab={tab} />)}
                        </ul>
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
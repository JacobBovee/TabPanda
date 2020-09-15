import { h, Component } from 'preact';
import { elementTreeHasAnyAttributePair, Map, elementTreeHasAttributePair } from '../../utils';

interface IAction {
    title: string;
    onClick: (event: MouseEvent) => void;
    contexts: Map<string>[];
    leftContext?: Map<string>;
}

interface IProps {
    actions: IAction[];
}

interface IState {
    x: number;
    y: number;
    visible: boolean;
    targetEvent?: MouseEvent;
    visibleActions: IAction[];
}

export default class ContextMenu extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            visible: false,
            visibleActions: []
        };

        this.filterActionsByContexts = this.filterActionsByContexts.bind(this);
    }

    resetState = () => {
        this.setState({
            visible: false,
            x: 0,
            y: 0,
            targetEvent: undefined
        });
    }

    openIfLeftContext(event: MouseEvent, leftContext: Map<string>) {
        const target = event.target as Element;
        const isContextClick = elementTreeHasAttributePair(target, leftContext);
        return isContextClick;
    }

    calculateMenuCoords(x: number, y: number) {
        const menu = document.querySelector('div#contextMenu');
        if (menu) {
            let menuWidth = menu.clientWidth;
            let menuHeight = menu.clientHeight;

            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            if ((windowWidth - x) < menuWidth) {
                x = (windowWidth - menuWidth) - 10;
            }
            if ((windowHeight - y) < menuHeight) {
                y = (windowHeight - menuHeight) - 10;
            }
        }
        this.setState({ x, y });
    }

    setContextMenu(event: MouseEvent) {
        event.preventDefault();
        const { actions } = this.props;
        const visibleActions = this.filterActionsByContexts(actions, event);
        
        this.setState({
            visible: true,
            targetEvent: event,
            visibleActions,
        }, () => this.calculateMenuCoords(event.clientX, event.clientY));
    }

    componentDidMount() {
        const { actions } = this.props;

        document.addEventListener('contextmenu', (event) => {
            this.setContextMenu(event);
        });

        document.addEventListener('click', (event: MouseEvent) => {
            const contextMenu = document.querySelector('div#contextMenuOverlay');
            if (contextMenu && !contextMenu.contains(event.target as Element)) {
                event.preventDefault();
                this.resetState();
            }
            actions.forEach((action) => {
                if (action.leftContext) {
                    if (this.openIfLeftContext(event, action.leftContext)) {
                        this.setContextMenu(event);
                    }
                }
            });
            
        });
    }

    filterActionsByContexts(actions: IAction[], targetEvent: MouseEvent) {
        const element = (targetEvent.target as Element);
        const filteredActions = actions
            .filter((action) => elementTreeHasAnyAttributePair(element, action.contexts));

        return filteredActions;
    }

    render() {
        const { actions } = this.props;
        const { x, y, visible, targetEvent, visibleActions } = this.state;

        const style = {
            position: 'absolute',
            top: `${y}px`,
            left: `${x}px`,
            zIndex: 9999
        };

        return (
            <div className='context-menu-overlay' id='contextMenuOverlay'>
                {visible && targetEvent && visibleActions.length &&
                <div className='context-menu' style={style} id="contextMenu">
                    <ul>
                        {visibleActions.map((action) =>
                            <li
                                className='conext-menu-action'
                                onClick={() => {
                                    this.resetState();
                                    action.onClick(targetEvent)
                                }}
                            >{action.title}</li>
                        )} 
                    </ul>    
                </div>}
            </div>
        );
    }
}
import { h, Component } from 'preact';
import { elementTreeHasAnyAttributePair, Map, elementTreeHasAttributePair } from '../../manager/utils';

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
}

export default class ContextMenu extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            visible: false
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

    openIfLeftContext(target: Element, leftContext: Map<string>) {
        const isContextClick = elementTreeHasAttributePair(target, leftContext);
    }

    setContextMenu(event: MouseEvent) {
        event.preventDefault();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        this.setState({
            visible: true,
            x: mouseX,
            y: mouseY,
            targetEvent: event
        });
    }

    componentDidMount() {
        // const { actions } = this.props;

        document.addEventListener('contextmenu', (event) => {
            this.setContextMenu(event);
        });

        document.addEventListener('click', (event: MouseEvent) => {
            const contextMenu = document.querySelector('div#contextMenu');
            if (contextMenu && !contextMenu.contains(event.target as Element)) {
                event.preventDefault();
                this.resetState();
            }
            // actions.forEach((action) => action.leftContext && this.openIfLeftContext((event.target as Element), action.leftContext));
            
        });
    }

    filterActionsByContexts(actions: IAction[]) {
        const { targetEvent } = this.state;
        if (targetEvent) {
            const element = (targetEvent.target as Element);
            const filteredActions = actions
                .filter((action) => elementTreeHasAnyAttributePair(element, action.contexts));

            return filteredActions;
        }
        else {
            throw new Error('Target event not set')
        }
    }

    render() {
        const { actions } = this.props;
        const { x, y, visible, targetEvent } = this.state;

        const style = {
            position: 'absolute',
            top: `${y}px`,
            left: `${x}px`
        };

        return (
            <div className='context-menu-overlay' id='contextMenu'>
                {visible && targetEvent &&
                <div className='context-menu' style={style}>
                    <ul>
                        {this.filterActionsByContexts(actions).map((action) =>
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
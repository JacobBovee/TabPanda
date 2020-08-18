import { Component, h } from 'preact';

interface IProps {
    collapseAction: () => void; 
}

export default class Header extends Component<IProps, {}> {
    render() {
        const { collapseAction } = this.props;

        return (
            <header>
                <h1>Edit tabs</h1>
                <button id="collapseActiveBtn" onClick={() => collapseAction()}>Collapse active</button>
            </header>
        )
    }
}

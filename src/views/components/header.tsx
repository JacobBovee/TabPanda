import { Component, h } from 'preact';

interface IProps {
    actionTitle?: string;
    actionFn?: () => void;
    title: preact.JSX.Element | string;
    id?: string;
}

export default class Header extends Component<IProps, {}> {
    render() {
        const { id, title, actionTitle, actionFn } = this.props;

        return (
            <header>
                <h1>{title}</h1>
                {actionTitle && actionFn &&
                <button id={id ? id : ''} onClick={actionFn}>{actionTitle}</button>}
            </header>
        )
    }
}

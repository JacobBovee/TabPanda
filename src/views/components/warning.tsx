import { h } from 'preact';

interface IProps {
    title: string;
    message: string;
    cancelAction: () => void;
    saveAction: () => void;
}

export default function Warning(props: IProps) {
    const { title, message, cancelAction, saveAction } = props;
    return (
        <div className='warning-overlay'>
            <div className='warning-message'>
                <h1>{title}</h1>
                <p>{message}</p>
                <div className='warning-actions'>
                    <button onClick={cancelAction}>Cancel</button>
                    <button onClick={saveAction}>Save</button>
                </div>
            </div>
        </div>
    );
}
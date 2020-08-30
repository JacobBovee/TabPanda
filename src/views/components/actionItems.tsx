import { Component, h } from 'preact';

interface IProps {
    cancelAction: () => void;
    saveAction: () => void;
    newFolderAction: () => void;
}

export default class ActionItems extends Component<IProps, {}> {

    render() {
        const { saveAction, cancelAction, newFolderAction } = this.props;

        return (
            <div id="actionItems">
                <div class='col left'><button id="newFolderBtn" onClick={newFolderAction}>New folder</button></div>
                <div class="col right">
                    <button id="cancelBtn" onClick={cancelAction}>Cancel</button>
                    <button id="saveBtn" class="primary" onClick={saveAction}>Save</button>
                </div>
            </div>
        )
    }
}

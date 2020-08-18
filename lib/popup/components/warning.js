"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
function Warning(props) {
    var title = props.title, message = props.message, cancelAction = props.cancelAction, saveAction = props.saveAction;
    return (preact_1.h("div", { className: 'warning-overlay' },
        preact_1.h("div", { className: 'warning-message' },
            preact_1.h("h1", null, title),
            preact_1.h("p", null, message),
            preact_1.h("div", { className: 'warning-actions' },
                preact_1.h("button", { onClick: cancelAction }, "Cancel"),
                preact_1.h("button", { onClick: saveAction }, "Save")))));
}
exports.default = Warning;

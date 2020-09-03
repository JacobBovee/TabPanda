"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
function DragContainer(props) {
    var onDrag = props.onDrag, onDragEnd = props.onDragEnd, onDragStart = props.onDragStart;
    return (preact_1.h("div", { className: 'drag-item', onDrag: onDrag, onDragEnd: onDragEnd, onDragStart: onDragStart }, props.children));
}
exports.default = DragContainer;

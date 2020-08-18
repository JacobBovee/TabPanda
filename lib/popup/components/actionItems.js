"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var ActionItems = /** @class */ (function (_super) {
    __extends(ActionItems, _super);
    function ActionItems() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionItems.prototype.render = function () {
        var _a = this.props, saveAction = _a.saveAction, cancelAction = _a.cancelAction, newFolderAction = _a.newFolderAction;
        return (preact_1.h("div", { id: "actionItems" },
            preact_1.h("div", { class: 'col left' },
                preact_1.h("button", { id: "newFolderBtn", onClick: newFolderAction }, "New folder")),
            preact_1.h("div", { class: "col right" },
                preact_1.h("button", { id: "cancelBtn", onClick: cancelAction }, "Cancel"),
                preact_1.h("button", { id: "saveBtn", class: "primary", onClick: saveAction }, "Save"))));
    };
    return ActionItems;
}(preact_1.Component));
exports.default = ActionItems;

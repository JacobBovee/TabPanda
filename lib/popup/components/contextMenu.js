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
var utils_1 = require("../../manager/utils");
var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.resetState = function () {
            _this.setState({
                visible: false,
                x: 0,
                y: 0,
                targetEvent: undefined
            });
        };
        _this.state = {
            x: 0,
            y: 0,
            visible: false
        };
        _this.filterActionsByContexts = _this.filterActionsByContexts.bind(_this);
        return _this;
    }
    ContextMenu.prototype.openIfLeftContext = function (target, leftContext) {
        var isContextClick = utils_1.elementTreeHasAttributePair(target, leftContext);
    };
    ContextMenu.prototype.setContextMenu = function (event) {
        event.preventDefault();
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        this.setState({
            visible: true,
            x: mouseX,
            y: mouseY,
            targetEvent: event
        });
    };
    ContextMenu.prototype.componentDidMount = function () {
        // const { actions } = this.props;
        var _this = this;
        document.addEventListener('contextmenu', function (event) {
            _this.setContextMenu(event);
        });
        document.addEventListener('click', function (event) {
            var contextMenu = document.querySelector('div#contextMenu');
            if (contextMenu && !contextMenu.contains(event.target)) {
                event.preventDefault();
                _this.resetState();
            }
            // actions.forEach((action) => action.leftContext && this.openIfLeftContext((event.target as Element), action.leftContext));
        });
    };
    ContextMenu.prototype.filterActionsByContexts = function (actions) {
        var targetEvent = this.state.targetEvent;
        if (targetEvent) {
            var element_1 = targetEvent.target;
            var filteredActions = actions
                .filter(function (action) { return utils_1.elementTreeHasAnyAttributePair(element_1, action.contexts); });
            return filteredActions;
        }
        else {
            throw new Error('Target event not set');
        }
    };
    ContextMenu.prototype.render = function () {
        var _this = this;
        var actions = this.props.actions;
        var _a = this.state, x = _a.x, y = _a.y, visible = _a.visible, targetEvent = _a.targetEvent;
        var style = {
            position: 'absolute',
            top: y + "px",
            left: x + "px"
        };
        return (preact_1.h("div", { className: 'context-menu-overlay', id: 'contextMenu' }, visible && targetEvent &&
            preact_1.h("div", { className: 'context-menu', style: style },
                preact_1.h("ul", null, this.filterActionsByContexts(actions).map(function (action) {
                    return preact_1.h("li", { className: 'conext-menu-action', onClick: function () {
                            _this.resetState();
                            action.onClick(targetEvent);
                        } }, action.title);
                })))));
    };
    return ContextMenu;
}(preact_1.Component));
exports.default = ContextMenu;

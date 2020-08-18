"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementTreeHasAnyAttributePair = exports.elementTreeHasAttributePair = exports.findParentWithMatchingAttribute = void 0;
function findParentWithMatchingAttribute(element, attribute) {
    var elementHasAttribute = element.hasAttribute(attribute);
    if (elementHasAttribute) {
        return element;
    }
    else {
        if (element.parentElement) {
            return findParentWithMatchingAttribute(element.parentElement, attribute);
        }
        else {
            return false;
        }
    }
}
exports.findParentWithMatchingAttribute = findParentWithMatchingAttribute;
function elementTreeHasAttributePair(element, attribute) {
    var key = Object.keys(attribute)[0];
    var elementHasAttributePair = element.getAttribute(key);
    if (elementHasAttributePair === attribute[key]) {
        return true;
    }
    else {
        if (element.parentElement) {
            return elementTreeHasAttributePair(element.parentElement, attribute);
        }
        else {
            return false;
        }
    }
}
exports.elementTreeHasAttributePair = elementTreeHasAttributePair;
function elementTreeHasAnyAttributePair(element, attributes) {
    for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
        var attribute = attributes_1[_i];
        var hasAttribute = elementTreeHasAttributePair(element, attribute);
        if (hasAttribute) {
            return true;
        }
    }
    return false;
}
exports.elementTreeHasAnyAttributePair = elementTreeHasAnyAttributePair;

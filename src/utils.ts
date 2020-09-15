export interface Map<T> {
    [key: string]: T;
}

export function findParentWithMatchingAttribute(element: Element, attribute: string): Element | false {
    const elementHasAttribute = element.hasAttribute(attribute);
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

export function elementTreeHasAttributePair(element: Element, attribute: Map<string>): boolean {
    const key = Object.keys(attribute)[0];
    const elementHasAttributePair = element.getAttribute(key);
    if (elementHasAttributePair?.split(' ').includes(attribute[key])) {
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

export function elementTreeHasAnyAttributePair(element: Element, attributes: Map<string>[]) {
    for (const attribute of attributes) {
        const hasAttribute = elementTreeHasAttributePair(element, attribute);
        if (hasAttribute) {
            return true;
        }
    }

    return false;
}
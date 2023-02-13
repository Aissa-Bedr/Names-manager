/**
 * @version 0.3
 * @Creator Aissa Bedr 2022 All Rights Reserved
 */

import { ElementType, RenderType, SelectType } from "../types/app";
import { UseEvent, UseStyle } from "../types/main";

class Library {
    public createElement<T extends keyof HTMLElementTagNameMap>(
        element: T,
        elementTextNode?: string,
        renderTo?: ElementType,
        renderType?: RenderType
    ) {
        const elementCreated = document.createElement(element);

        if (elementTextNode) elementCreated.appendChild(document.createTextNode(elementTextNode));

        if (!renderTo || !renderType) return elementCreated;

        renderType === "append" ? renderTo.appendChild(elementCreated) : renderTo.prepend(elementCreated);
        return elementCreated;
    }

    public createAttribute(element: ElementType, prop: string, value: string) {
        element.setAttribute(prop, value);
        return { element, prop, value };
    }

    public renderElement(element: ElementType, renderTo: ElementType, renderType: RenderType) {
        renderType === "append" ? renderTo.appendChild(element) : renderTo.prepend(element);
        return { element, renderTo, renderType };
    }

    public renderElements(element: ElementType[], renderTo: ElementType, renderType: RenderType) {
        renderType === "append" ? renderTo.append(...element) : renderTo.prepend(...element);
        return { element, renderTo, renderType };
    }

    public selectElement(element: string, selectType: SelectType) {
        const elementSelected =
            selectType === "class" || selectType === "name"
                ? document.querySelector(element)
                : document.getElementById(element);
        return elementSelected;
    }
}

export function useEvent<T extends keyof HTMLElementEventMap>({ element, event, callBackFunction }: UseEvent<T>) {
    element.addEventListener(event, callBackFunction);

    return { element, event, callBackFunction };
}

export function useStyle<T extends keyof CSSStyleDeclaration>({ element, prop, value }: UseStyle<T>) {
    element.style[prop as any] = value;

    return { element, prop, value };
}

const library = new Library();

export default library;

export interface UseEvent<T> {
    event: T;
    element: HTMLElement | Element;
    callBackFunction: (e?: Event) => void;
}

export interface UseStyle<T> {
    element: HTMLElement;
    prop: T;
    value: string;
}

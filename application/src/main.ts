import library, { useStyle } from "./classes/Library";

const input = library.selectElement(".names_options input", "class") as HTMLInputElement;
const button = library.selectElement(".names_options button", "class") as HTMLButtonElement;
const namesContainer = library.selectElement(".names_container", "class") as HTMLDivElement;
const pinedNamesContainer = library.selectElement(".pined_names_container", "class") as HTMLDivElement;
const select = library.selectElement("select", "name") as HTMLSelectElement;

const randomId = (): number => Math.floor(Math.random() * 9876543210);

interface NamesList {
    id: number;
    text: string;
    isThrow: boolean;
}

const namesList: NamesList[] = JSON.parse(`${localStorage.getItem("names")}`) || [];
const pinedNamesList: NamesList[] = JSON.parse(`${localStorage.getItem("pinedNames")}`) || [];

window.addEventListener("load", () => {
    updateNamesContainer();
    updatePinedNamesContainer();
    updateNamesListHTMLContent();
    updatePinedNamesListHTMLContent();
});

function updateNamesListHTMLContent(): void {
    if (namesList.length < 1) {
        namesContainer.textContent = "No names created !";
        namesContainer.classList.add("names_container_void");
        return;
    }

    namesContainer.classList.remove("names_container_void");
}

function updatePinedNamesListHTMLContent(): void {
    if (pinedNamesList.length < 1) {
        pinedNamesContainer.textContent = "No pined names saved !";
        pinedNamesContainer.classList.add("pined_names_container_void");
        return;
    }

    pinedNamesContainer.classList.remove("pined_names_container_void");
}

function updateThrowHTMLContent(
    isThrow: boolean,
    paragraph: HTMLParagraphElement,
    pinButton: HTMLButtonElement,
    throwButton: HTMLButtonElement,
    unthrowButton: HTMLButtonElement
): void {
    if (isThrow) {
        paragraph.classList.add("throw");
        useStyle({ element: pinButton, prop: "display", value: "none" });
        useStyle({ element: throwButton, prop: "display", value: "none" });
        useStyle({ element: unthrowButton, prop: "display", value: "block" });
        localStorage.setItem("names", JSON.stringify(namesList));
        return;
    }

    paragraph.classList.remove("throw");
    useStyle({ element: pinButton, prop: "display", value: "block" });
    useStyle({ element: throwButton, prop: "display", value: "block" });
    useStyle({ element: unthrowButton, prop: "display", value: "none" });
    localStorage.setItem("names", JSON.stringify(namesList));
}

function updateNamesContainer(): void {
    for (const name of namesList) {
        const { id, text } = name;

        const container = library.createElement("div");
        const btnsContainer = library.createElement("div");
        const paragraph = library.createElement("p", text);
        const deleteButton = library.createElement("button", "remove");
        const pinButton = library.createElement("button", "pin");
        const throwButton = library.createElement("button", "throw");
        const unthrowButton = library.createElement("button", "unthrow");

        btnsContainer.classList.add("btns_container");
        paragraph.classList.add("name");
        deleteButton.classList.add("remove_btn");
        pinButton.classList.add("pin_btn");
        throwButton.classList.add("throw_btn");
        unthrowButton.classList.add("unthrow_btn");

        useStyle({ element: unthrowButton, prop: "display", value: "none" });

        if (name.isThrow) updateThrowHTMLContent(true, paragraph, pinButton, throwButton, unthrowButton);

        deleteButton.addEventListener("click", () => deleteName(id));
        pinButton.addEventListener("click", () => pinName(id));
        throwButton.addEventListener("click", () => throwName(id, paragraph, pinButton, throwButton, unthrowButton));
        unthrowButton.addEventListener("click", () =>
            unthrowName(id, paragraph, pinButton, throwButton, unthrowButton)
        );

        library.renderElements([paragraph, btnsContainer], container, "append");
        library.renderElements([pinButton, throwButton, unthrowButton, deleteButton], btnsContainer, "append");
        library.renderElement(container, namesContainer, "append");
    }
}

function updatePinedNamesContainer(): void {
    for (const pinedName of pinedNamesList) {
        const { id, text } = pinedName;

        const container = library.createElement("div");
        const btnsContainer = library.createElement("div");
        const paragraph = library.createElement("p", text);
        const unpinButton = library.createElement("button", "unpin");

        btnsContainer.classList.add("btns_container");
        paragraph.classList.add("name");
        unpinButton.classList.add("unpin_btn");

        unpinButton.addEventListener("click", () => unpinName(id));

        library.renderElements([paragraph, btnsContainer], container, "append");
        library.renderElements([unpinButton], btnsContainer, "append");
        library.renderElement(container, pinedNamesContainer, "prepend");
    }
}

function createName(): void {
    const nameObject: NamesList = { id: randomId(), text: input.value, isThrow: false };
    const { text } = nameObject;

    if (!input.value) return alert("It can't be empty !");
    if (input.value.length < 3) return alert("At least three characters !");

    if (select.value === "unpinned") {
        for (const name of namesList)
            if (name.text.length === text.length && name.text.includes(text)) return alert("This name already exist !");

        namesList.push(nameObject);
        namesContainer.textContent = "";

        updateNamesContainer();

        localStorage.setItem("names", JSON.stringify(namesList));
        input.value = "";
        updateNamesListHTMLContent();
        return;
    }

    for (const pinedName of pinedNamesList)
        if (pinedName.text.length === text.length && pinedName.text.includes(text))
            return alert("This name already exist !");

    pinedNamesList.push(nameObject);
    pinedNamesContainer.textContent = "";

    updatePinedNamesContainer();

    localStorage.setItem("pinedNames", JSON.stringify(pinedNamesList));
    input.value = "";
    updatePinedNamesListHTMLContent();
}

function deleteName(id: number): void {
    namesList.forEach((name, index) => {
        const { id: nameId } = name;

        if (id === nameId) {
            namesList.splice(index, 1);
            namesContainer.textContent = "";
            updateNamesContainer();
            localStorage.setItem("names", JSON.stringify(namesList));
            updateNamesListHTMLContent();
        }
    });
}

function deletePinedName(id: number): void {
    pinedNamesList.forEach((pinedName, index) => {
        const { id: pinedNameId } = pinedName;

        if (id === pinedNameId) {
            pinedNamesList.splice(index, 1);
            pinedNamesContainer.textContent = "";
            updatePinedNamesContainer();
            localStorage.setItem("pinedNames", JSON.stringify(pinedNamesList));
        }
    });
}

function pinName(id: number): void {
    for (const name of namesList) {
        const { id: nameId } = name;

        if (id === nameId) {
            for (const pinedName of pinedNamesList)
                if (name.text.length === pinedName.text.length && name.text.includes(pinedName.text))
                    return alert("This name already exist in pined names !");

            pinedNamesList.push(name);
            namesContainer.textContent = "";
            pinedNamesContainer.textContent = "";
            deleteName(id);
            localStorage.setItem("pinedNames", JSON.stringify(pinedNamesList));

            updatePinedNamesContainer();
            updatePinedNamesListHTMLContent();
        }
    }
}

function throwName(
    id: number,
    paragraph: HTMLParagraphElement,
    pinButton: HTMLButtonElement,
    throwButton: HTMLButtonElement,
    unthrowButton: HTMLButtonElement
): void {
    for (const name of namesList) {
        const { id: nameId } = name;

        if (id === nameId) {
            name.isThrow = true;
            updateThrowHTMLContent(true, paragraph, pinButton, throwButton, unthrowButton);
        }
    }
}

function unthrowName(
    id: number,
    paragraph: HTMLParagraphElement,
    pinButton: HTMLButtonElement,
    throwButton: HTMLButtonElement,
    unthrowButton: HTMLButtonElement
): void {
    for (const name of namesList) {
        const { id: nameId } = name;

        if (id === nameId) {
            name.isThrow = false;
            updateThrowHTMLContent(false, paragraph, pinButton, throwButton, unthrowButton);
        }
    }
}

function unpinName(id: number): void {
    for (const pinedName of pinedNamesList) {
        const { text, id: pinedNameId } = pinedName;

        if (id === pinedNameId) {
            for (const name of namesList) {
                if (name.text.length === text.length && name.text.includes(text))
                    return alert("This name already exist in names !");
            }

            namesList.push(pinedName);
            pinedNamesContainer.textContent = "";
            namesContainer.textContent = "";
            deletePinedName(id);
            localStorage.setItem("names", JSON.stringify(namesList));

            updateNamesContainer();
            updatePinedNamesListHTMLContent();
        }
    }
}

button.addEventListener("click", createName);

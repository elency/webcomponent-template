// settings
const TAG_NAME = "webcomponent-template";
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
    <main contenteditable="true" inputmode="text">
        <slot></slot>
    </main>
    <style>
        :host { ... }
        :host(context) { ... }
        ::slotted(.css-selector) { ... }
    </style>
`;

// webcomponent definition
class WebcomponentTemplateElement extends HTMLElement {
    #internals: ElementInternals;

    static get tagName() {
        return TAG_NAME;
    }

    /** An instance of the element is created or upgraded.
     *  Useful for initializing state, settings up event listeners, or creating shadow dom.
     *  See the spec for restrictions on what you can do in the constructor. */
    constructor() {
        // calls the parent constructor
        super();
        // attach shadowroot to custom element
        const shadowRoot = this.attachShadow({
            mode: "open",
            delegatesFocus: true,
        });
        // attach template to shadowroot
        shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));

        // Get access to the internal form control APIs
        this.#internals = ((this as unknown) as {
            attachInternals: () => ElementInternals;
        }).attachInternals();
        // FIXME: once this issue is resolved => https://github.com/microsoft/TypeScript/issues/33218
        // this.#internals = this.attachInternals();

        this.formResetCallback();

        // other stuff go there
        window.customElements.whenDefined("embed-web-component").then(() => {
            // you can call custom properties/methods of that element
            Array.from(this.querySelectorAll("embed-web-component")).forEach(
                (element, index, array) => {
                    //
                }
            );
        });
    }

    /**
     * form associated properties and methods
     */
    get form(): HTMLFormElement {
        return this.#internals.form;
    }
    get type() {
        return this.localName;
    }
    get validity() {
        return this.#internals.validity;
    }
    get validationMessage() {
        return this.#internals.validationMessage;
    }
    get willValidate() {
        return this.#internals.willValidate;
    }
    checkValidity() {
        return this.#internals.checkValidity();
    }
    reportValidity() {
        return this.#internals.reportValidity();
    }
    setValidity(
        flags: any,
        message?: string,
        anchor?: any
    ): ReturnType<ElementInternals["setValidity"]> {
        return this.#internals.setValidity(flags, message, anchor);
    }

    /**
     * name of field
     */
    get name(): string {
        return this.getAttribute("name") || "";
    }
    set name(value: string) {
        if (value) {
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }

    /**
     * required status
     * true if field is required
     */
    get required(): boolean {
        return this.hasAttribute("required");
    }
    set required(value: boolean) {
        if (value) {
            this.setAttribute("required", "required");
        } else {
            this.removeAttribute("required");
        }
    }

    /**
     * readonly status
     * true if element can not be updated using UI
     */
    get readOnly(): boolean {
        return this.hasAttribute("readonly");
    }
    set readOnly(value: boolean) {
        if (value) {
            this.setAttribute("readonly", "readonly");
        } else {
            this.removeAttribute("readonly");
        }
    }

    /**
     * disabled status
     * true if element can not be sent
     */
    get disabled(): boolean {
        return this.hasAttribute("disabled");
    }
    set disabled(value: boolean) {
        if (value) {
            this.setAttribute("disabled", "disabled");
        } else {
            this.removeAttribute("disabled");
        }
    }

    /**
     * value of input
     */
    get value(): string {
        return this.shadowRoot!.querySelector("main")!.textContent || "";
    }
    set value(value: string) {
        this.shadowRoot!.querySelector("main")!.textContent = value;
    }

    /** tells browser to handler this element as a form control */
    static get formAssociated() {
        return true;
    }

    /** Called when the browser associates the element with a form element,
     *  or disassociates the element from a form element. */
    formAssociatedCallback(form: HTMLFormElement): void {}

    /** Called after the disabled state of the element changes, either because :
     *  - the disabled attribute of this element was added or removed;
     *  - the disabled state changed on a <fieldset> that's an ancestor of this element.
     *  The disabled parameter represents the new disabled state of the element.
     *  The element may, for example, disable elements in its shadow DOM when it is disabled. */
    formDisabledCallback(disabled: boolean): void {
        this.disabled = disabled;
    }

    /** Called after the form is reset.
     *  The element should reset itself to some kind of default state.
     *  For native inputs, this usually involves setting the value property to match
     *  the value attribute set in markup (or in the case of a checkbox,
     *  setting the checked property to match the checked attribute. */
    formResetCallback(): void {
        this.value = this.getAttribute("value") || "";
    }

    /** Called in one of two circumstances:
     *  - When the browser restores the state of the element (for example, after a navigation, or when the browser restarts). The mode argument is "restore" in this case.
     *  - When the browser's input-assist features such as form autofilling sets a value. The mode argument is "autocomplete" in this case.
     *  see https://web.dev/more-capable-form-controls/#restoring-form-state
     */
    formStateRestoreCallback(
        state: string | File | FormData,
        mode: "restore" | "autocomplete"
    ): void {
        if (mode === "restore") {
            // don't restore a previous pin
            return;
        }
        if (typeof state === "string") {
            // allow autocomplete
            this.value = state;
        }
    }

    /** Validation controls
     */
    onInput(event: Event) {
        if (this.matches(":disabled")) {
            this.#internals.setValidity({ valueMissing: true });
        } else {
            if (this.required && this.value === "") {
                this.#internals.setValidity(
                    { customError: true },
                    "Use at least 5 characters."
                );
            } else {
                this.#internals.setValidity({});
            }
        }
        // add value to formdata of parent form
        this.#internals.setFormValue(this.value);
    }

    /** Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     *  Generally, you should try to delay work until this time. */
    connectedCallback() {
        this.addEventListener("beforeinput", onBeforeInput);
        this.addEventListener("input", this.onInput.bind(this));
    }

    /** Called every time the element is removed from the DOM. Useful for running clean up code. */
    disconnectedCallback() {
        this.removeEventListener("beforeinput", onBeforeInput);
        this.removeEventListener("input", this.onInput.bind(this));
    }

    /** The custom element has been moved into a new document.
     *  e.g. someone called document.adoptNode(el)). */
    adoptedCallback() {}

    /** Called when an observed attribute has been added, removed, updated, or replaced.
     *  Also called for initial values when an element is created by the parser, or upgraded.
     *  Note: only attributes listed in the observedAttributes property will receive this callback. */
    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
        // console.log(attrName, oldVal, newVal);
        switch (attrName) {
            case "disabled":
                break;
            default:
                throw new Error(
                    `attributeChangedCallback for attribute ${attrName} in unhandled`
                );
        }
    }

    /** return list of observed attributes */
    static get observedAttributes() {
        return ["inputmode", "length", "separator"];
    }
}

// prevent input if disabled or readonly
function onBeforeInput(event: Event) {
    const customElement = event.currentTarget as WebcomponentTemplateElement;
    if (
        customElement.matches(":disabled") ||
        customElement.readOnly ||
        customElement.disabled
    ) {
        event.preventDefault();
    }
}

// define web component
window.customElements.define(TAG_NAME, WebcomponentTemplateElement);
window.customElements.whenDefined(TAG_NAME).then(() => {
    if (localStorage.getItem("42") !== null) {
        console.info(`web component <${TAG_NAME}> defined`);
    }
});

// FIXME: remove once this issue is resolved => https://github.com/microsoft/TypeScript/issues/33218
interface ElementInternals {
    form: HTMLFormElement;
    validity: ValidityState;
    validationMessage: string;
    willValidate: string;
    checkValidity(): boolean;
    reportValidity(): boolean;
    setValidity(flags: any, message?: string, anchor?: any): void;
    setFormValue(value: string | File | FormData): void;
}

export default WebcomponentTemplateElement;
export { WebcomponentTemplateElement as WebcomponentTemplateElement };

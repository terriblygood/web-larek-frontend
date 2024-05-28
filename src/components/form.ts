import { View, TViewArgs } from "./base/view";

type TFormArgs = {
    isDisabled: boolean;
    errors: string[];
}

type TFormHandlers = {
    onSubmit?: (args: { _event: SubmitEvent }) => void;
    onInput?: (args: { _event: InputEvent, field: string, value: unknown}) => void;
}

class Form<Element extends HTMLElement = HTMLFormElement, RenderArgs extends object = TFormArgs, EventHandlers extends object = TFormHandlers> extends View<Element, RenderArgs & TFormArgs, EventHandlers & TFormHandlers> {
    protected _submitBtn: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(args: TViewArgs<Element, EventHandlers>) {
        super(args);

        this._submitBtn = this._element.querySelector('button[type=submit]');
        this._errors = this._element.querySelector('.form__errors');

        if (typeof this._eventHandlers.onSubmit === 'function') {
			this._element.addEventListener('submit', this._handleSubmit.bind(this));
		}

		if (typeof this._eventHandlers.onInput === 'function') {
			this._element.addEventListener('input', this._handleInput.bind(this));
		}
    }; 

    protected _handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        this._eventHandlers.onSubmit({_event: e})
    };

    protected _handleInput(e: InputEvent) {
        const target = e.target as HTMLInputElement;
        this._eventHandlers.onInput({
            _event: e,
            field: target ? target.name : '',
            value: target ? target.value : '',
        });
    };

    set isDisabled(value: boolean) {
        this._submitBtn.disabled = Boolean(value);
    }

    set errors(value: string) {
        this._errors.textContent = value.toString();
    }
}   

export {TFormArgs, TFormHandlers, Form}
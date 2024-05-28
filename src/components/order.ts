import { Form,TFormArgs, TFormHandlers } from "./form";
import { View, TViewArgs } from "./base/view";

type TOrderArgs = TFormArgs & {
    payment: string;
    address: string;
}

class Order extends Form<HTMLFormElement, TOrderArgs> {
    protected _buttons: HTMLElement;
	protected _buttonsList: NodeListOf<HTMLButtonElement>;
	protected _address: HTMLInputElement;
    
    constructor( args: TViewArgs<HTMLFormElement, TFormHandlers> ) {
		super(args);

		this._buttons = this._element.querySelector('.order__buttons');
		this._buttonsList = this._buttons.querySelectorAll('button');

		this._address = this._element.querySelector('input[name="address"]');

		if (typeof this._eventHandlers.onInput === 'function') {
            this._buttons.addEventListener('click', this._handleClick.bind(this));
		}
	}

    protected _handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const button = target?.closest<HTMLButtonElement>('button[name]');
		if (button) {
			this._eventHandlers.onInput({
				_event: e as unknown as InputEvent,
				field: 'payment',
				value: button.name,
			});
		}
	}

    set address(value: string) {
		this._address.value = value.toString();
	}

	set payment(value: string) {
		this._buttonsList.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === value);
		});
	}
    


}

export {Order, TOrderArgs}
import { View, TViewArgs } from "./base/view";

type TOrderSuccessArgs = {
	description: string;
};

type TOrderSuccessHandlers = {
	onClick?: (args: { _event: MouseEvent }) => void;
};

class OrderSuccess extends View< HTMLElement, TOrderSuccessArgs, TOrderSuccessHandlers> {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor( args: TViewArgs<HTMLElement, TOrderSuccessHandlers>) {
		super(args);

		this._description = this._element.querySelector('.order-success__description');

		this._button = this._element.querySelector('.order-success__close');

		if (typeof this._eventHandlers.onClick === 'function') {
			this._button.addEventListener( 'click', this._handleClick.bind(this));
		}

	}

	protected _handleClick(e: MouseEvent) {
		this._eventHandlers.onClick({ _event: e });
	}

	set description(value: string) {
		this._description.textContent = value.toString();
	}
}

export { OrderSuccess, TOrderSuccessArgs, TOrderSuccessHandlers };
import { View, TViewArgs, TViewSubs } from "./base/view";

type THeaderHandlers = {
	onClick?: (args: { _event: MouseEvent }) => void;
};

type THeaderArgs = {
	counter: number;
};

class Header extends View<HTMLElement, THeaderArgs , THeaderHandlers> {
    protected _counter: HTMLElement;
	protected _button: HTMLButtonElement;
    protected _handleClick(event: MouseEvent) {
		this._eventHandlers.onClick({_event: event});
	}

    constructor(args: TViewArgs<HTMLElement,THeaderHandlers>) {
        super(args); 
        this._counter = this._element.querySelector('.header__basket-counter');
		this._button = this._element.querySelector('.header__basket');

        if (typeof this._eventHandlers.onClick === 'function') {
			this._button.addEventListener('click', this._handleClick.bind(this));
		}
    }

    set counter(value: number) {
        this._counter.textContent = value.toString();
    }
}

export {Header, THeaderArgs, THeaderHandlers}
import { View, TViewArgs, TViewSubs } from "./base/view";

type TBasketItemRender = {
    index: number;
	title: string;
	price: string;
}

type TBasketItemHandlers = {
    onClick?: (args: { _event: MouseEvent }) => void;
}

class BasketItem extends View<HTMLElement, TBasketItemRender, TBasketItemHandlers> {

    protected _index: HTMLElement;
    protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _buttonEL: HTMLButtonElement;

    
    constructor(args: TViewArgs<HTMLElement, TBasketItemHandlers>) {
        super(args);
        this._index = this._element.querySelector('.basket__item-index');
        this._title = this._element.querySelector('.card__title');
        this._price = this._element.querySelector('.card__price');
        this._buttonEL = this._element.querySelector('.card__button');
        
        if (this._eventHandlers.onClick instanceof Function) {
            this._buttonEL.addEventListener('click', this._handleClick.bind(this))
        } 
    }
    
    protected _handleClick(e: MouseEvent) {
        this._eventHandlers.onClick({ _event: e })
    }

    set price(value: string) {
		this._price.textContent = value.toString();
	}

	set title(value: string) {
		this._title.textContent = value.toString();
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}
}

export { BasketItem, TBasketItemHandlers, TBasketItemRender}
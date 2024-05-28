import { View, TViewArgs, TViewSubs } from "./base/view";
import { Items } from "./itemsRender";

type TBasketRender<T extends object> = {
    items: TViewSubs<T>[];
    price: string;
    isDisabled: boolean;
}

type TBasketHandlers = {
    onClick?: (args: { _event: MouseEvent }) => void;
}

class Basket extends View<HTMLElement, TBasketRender<object>, TBasketHandlers> {
    protected _items: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _price: HTMLElement;

    
    
    constructor(args: TViewArgs<HTMLElement, TBasketHandlers>) {
        super(args);

        this._items = this._element.querySelector('.basket__list');
        this._button = this._element.querySelector('.basket__button');
        this._price = this._element.querySelector('.basket__price');

        if (typeof this._eventHandlers.onClick === 'function') {
            this._button.addEventListener('click', this._handleClick.bind(this))
        }
    }

    protected _handleClick(e: MouseEvent) {
        this._eventHandlers.onClick({_event: e})
    }

    set items(value: TViewSubs[]) {
        this._items.replaceChildren(
            ...value.map(({ view, renderArgs }) =>
                view instanceof View ? view.render(renderArgs) : view
            )
        );
    }

    set price(value: string) {
        this._price.textContent = value.toString();
    }

    set isDisabled(value: boolean) {
        this._button.disabled = Boolean(value);
    }

    render<RenderArgs extends object = object>(args: TBasketRender<RenderArgs>) {
		super.render(args);
		return this._element;
	}

}

export {Basket, TBasketHandlers, TBasketRender}
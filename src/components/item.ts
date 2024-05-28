import { View, TViewArgs } from "./base/view";
import { IItem } from "../types";

type TItemRenderArgs = Pick<IItem, 'image' | 'title' | 'category'> & {
	price: string;
	color: string | null;
};

type TItemHandlers = {
    onCLick?: (args: { _event: MouseEvent }) => void;
}

class Item<Element extends HTMLElement = HTMLElement,
RenderArgs extends object = TItemRenderArgs,
EventHandlers extends object = TItemHandlers> extends View<Element,
RenderArgs & TItemRenderArgs,//объединил
EventHandlers & TItemHandlers> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;

    constructor(args?: TViewArgs<Element, EventHandlers>) {
        super(args)

        this._title = this._element.querySelector('.card__title');
        this._image = this._element.querySelector('.card__image');
        this._category = this._element.querySelector('.card__category');
        this._price = this._element.querySelector('.card__price');

        if (typeof this._eventHandlers.onCLick === 'function') {
            this._element.addEventListener('click', this._handleClick.bind(this));
          }
          
    }
    protected _handleClick(e: MouseEvent) {
        this._eventHandlers.onCLick({_event: e});
    }
    //main setters
    set image(value: string) {
        this._image.src = value.toString();
    }
    set category(value: string) {
        this._category.textContent = value.toString();
    }
    
    set price(value: string) {
        this._price.textContent = value.toString();
    }

    set title(value: string) {
        this._title.textContent = value.toString();
    }

    set color(value: string) {
		this._category.classList.add(`card__category_${value}`);
	}
}

export { Item, TItemRenderArgs, TItemHandlers};
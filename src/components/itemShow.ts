// для открытого состояния
import { Item, TItemRenderArgs, TItemHandlers } from "./item";
import { TViewArgs, TViewSubs } from "./base/view";


export type TItemShowArgs = TItemRenderArgs & {
	description: string;
	buttonText: string;
	isDisabled: boolean
};

export class ItemShow extends Item<HTMLElement, TItemShowArgs> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    
    constructor(args: TViewArgs<HTMLElement, TItemHandlers>) {
		super(args);

        this._description = this._element.querySelector('.card__text');
        this._button = this._element.querySelector('.card__button');
    }
    
    protected _handleClick(e: MouseEvent): void {
        if (this._button.contains(e.target as HTMLElement)) {
            this._eventHandlers.onCLick({ _event: e})
        }
    }

    set description(value: string) {
        this._description.textContent = value.toString();
    }

    set buttonText(value: string) {
        this._button.textContent = value.toString();
    }

    set isDisabled(value: boolean) {
		this._button.disabled = value ? true : false;
	}

}
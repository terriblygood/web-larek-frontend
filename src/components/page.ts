import { View, TViewArgs } from './base/view';

type TPageRenderArgs = {
	isLocked: boolean;
};

class Page extends View<HTMLElement, TPageRenderArgs> {
	protected _wrapper: HTMLElement;

	constructor(args: TViewArgs) {
		super(args);

		this._wrapper= this._element.querySelector('.page__wrapper');
	}

	set isLocked(value: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', value);
	}
}

export { Page, TPageRenderArgs };
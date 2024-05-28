import { View, TViewArgs, TViewSubs } from "./base/view";

type TModalArgs<T extends object> = {
    content: TViewSubs<T>;
}

enum ModalEvents {
    open = 'modal:open',
    close = 'modal:close'
}

class Modal extends View {
    protected _content: TViewSubs;
    protected _contentElement: HTMLElement;
    protected _buttonClose: HTMLButtonElement;

    protected _handleClick(e: MouseEvent) {
        e.stopPropagation();

        if (this._buttonClose.contains(e.target as HTMLElement) || e.target === this._element) {
			this.close();
		}
    }
    constructor(args: TViewArgs) {
        super(args);

        this._contentElement = this._element.querySelector('.modal__content');
        this._buttonClose = this._element.querySelector('.modal__close');
        this._element.addEventListener('click', this._handleClick.bind(this));
        document.addEventListener('keydown', this._handleDocumentKeydown.bind(this));
    }

    protected _handleDocumentKeydown(e: KeyboardEvent) {
		if ( e.key === 'Escape' && this._element.classList.contains('modal_active') ) {
			this.close();
		}
	}
    
    open(): void {
		this._element.classList.add('modal_active');//todo with toggle

		this._buttonClose.focus();

		this._eventEmitter.emit(ModalEvents.open);
	}

	close(): void {
		this._element.classList.remove('modal_active')//todo with toggle

		this.content = null;

		this._eventEmitter.emit(ModalEvents.close);
	}

    set content(value: TViewSubs | null) {
		if (value) {
			this._contentElement.replaceChildren(
				value.view instanceof View ? value.view.render(value.renderArgs) : (value as unknown as (string | Node)[]));
		} else {
			this._contentElement.replaceChildren();
		}
	}

    render<RenderArgs extends object = object>(args: TModalArgs<RenderArgs>) {
		super.render(args);
		this.open();
		return this._element;
	}
}

export {Modal, ModalEvents, TModalArgs}
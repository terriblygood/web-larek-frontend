import { IItem, IOrderItem, TOrderStep, TPaymentType} from "../types";
import { Model } from "./model";
interface IState {
    preview: IItem;
    products: IItem[];
    basket: Set<IItem>;
    toOrder: IOrderItem;
}

enum StateEvents {
    PRODUCTS_UPDATE = 'products:update',
	PREVIEW_UPDATE = 'preview:update',
    BASKET_INIT = 'basket:init',
	BASKET_UPDATE = 'basket:update',
	BASKET_RESET = 'basket:reset',
	ORDER_STEP = 'order:step',
	ORDER_UPDATE = 'order:update',
	ORDER_RESET = 'order:reset',
}

class AppState extends Model<IState> {
    preview: IItem;
    products: IItem[] = [];
    basket: IItem[] = [];
	order: IOrderItem = {
		items: [],
		payment: '' as TPaymentType,
		address: '',
		email: '',
		phone: '',
	}
    protected _step: TOrderStep = 'shipment';

	initOrder() {
		this.order.items = this.basket;

		this.setStep('shipment');
	}

    setCatalogItems(value: IItem[]) {
		this.products = value;

		this.emitChanges(StateEvents.PRODUCTS_UPDATE, {
			data: {
				items: this.products,
			},
		});
	}

    setPreview(value: IItem) {
		this.preview = value;

		this.emitChanges(StateEvents.PREVIEW_UPDATE, {
			data: {
				item: this.preview,
			},
		});
	}

	setStep(value: TOrderStep) {
		this._step = value;

		this.emitChanges(StateEvents.ORDER_STEP, {
			data: {
				step: this._step,
			},
		});
	}

    checkBasketItem(id: string) {
        return !!this.basket.find((item) => item.id === id);          
    }

    addItem(value: IItem) {
        if (!this.basket.some((item) => item.id === value.id)) {
			this.basket.push(value);
		}
        this.emitChanges(StateEvents.BASKET_UPDATE, {
			data: {
				items: this.basket,
			}
		});
    }

    deleteItem(id: string) {
        this.basket = this.basket.filter(item => item.id !== id)
        this.emitChanges(StateEvents.BASKET_UPDATE, {
			data: {
				items: this.basket,
			}
		});
    }

    initBasket() {
		this.emitChanges(StateEvents.BASKET_INIT, {
			data: {
				items: this.basket,
			},
		});
	}

	getPrice() {
		const totalPrice = [...this.basket].reduce((total, product) => total + product.price, 0);
		return totalPrice;
	}

	setOrder(field: keyof IOrderItem, value: unknown) {
		Object.assign(this.order, { [field]: value });

		this.emitChanges(StateEvents.ORDER_UPDATE, {
			data: { field, value,}
		});
	}

	getOrderAPI() {
		return {
			...this.order,
			items: this.order.items
				.filter((item) => item.price)
				.map((item) => item.id),
			total: this.order.items.reduce(
				(accumulator, current) => accumulator + current.price,
				0
			),
		};
	}

	getOrderErrors() {
		const errors: string[] = [];
		if (this._step === 'shipment') {
			if (this.order.address.trim().length == 0) {
				errors.push('Заполните адрес');
			}

			if (this.order.payment.trim().length == 0) {
				errors.push(' Выберите способ оплаты');
			}
			return errors;
		}
		if (this._step === 'contacts') {
			if (this.order.email.trim().length == 0) {
				errors.push('Заполните email');
			}

			if (this.order.phone.trim().length == 0) {
				errors.push(' Введите ваш номкп телефона');
			}
			return errors;
		}
		return errors;
	}

	validCheck() {
		if (this._step === 'shipment') {
			if (this.order.address.trim().length == 0 || this.order.payment.trim().length == 0) {
				return false;
			}
		}
		if (this._step === 'contacts') {
			if (this.order.email.trim().length == 0 || this.order.phone.trim().length == 0) {
				return false;
			}
		}
		return true;
	}

	resetOrder() {
		this._step = 'shipment';
		this.order.items = [];
		this.order.payment = '' as TPaymentType;
		this.order.address = '';
		this.order.email = '';
		this.order.phone = '';

		this.emitChanges(StateEvents.ORDER_RESET);
	}

	resetBasket() {
		this.basket = [];
		this.emitChanges(StateEvents.BASKET_RESET, {
			data: {items: this.basket,}
		});
	}


}

export { AppState,StateEvents, IState}
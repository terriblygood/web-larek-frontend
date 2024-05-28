import './scss/styles.scss';

import { CDN_URL, API_URL, settings } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiItems } from './components/itemsApi';
import { AppState, StateEvents } from './components/appState';
import { Page } from './components/page';
import { ensureElement } from './utils/utils';
import { Items } from './components/itemsRender';
import { cloneTemplate, formatNumber, funcPrice, getKeyByValue } from './utils/utils';
import { TViewSubs } from './components/base/view';
import { Item, TItemRenderArgs } from './components/item';
import { IItem, IOrderItem, TOrderStep } from './types';
import { ItemShow, TItemShowArgs } from './components/itemShow';
import { Header } from './components/header';
import { Modal, ModalEvents } from './components/modal';
import { BasketItem,TBasketItemRender, TBasketItemHandlers } from './components/basketItem';
import { Basket, TBasketRender } from './components/basket';
import { Order, TOrderArgs } from './components/order';
import { OrderSuccess, TOrderSuccessArgs, TOrderSuccessHandlers } from './components/orderSuccess';
import { OrderContacts, TOrderContactsArgs } from './components/orderContacts';

const eventEmitter = new EventEmitter()
const page = new Page({
	element: ensureElement('.page'),
	eventEmitter,
});
const appState = new AppState({}, eventEmitter);
const products = new Items({
	element: ensureElement('main.gallery'),
	eventEmitter
});
const api = new ApiItems(CDN_URL, API_URL);

const modal = new Modal({element: ensureElement('#modal-container'), eventEmitter})

const header = new Header({
	element: ensureElement('.header'),
	eventEmitter,
	eventHandlers: {
		onClick: () => {
			appState.initBasket();
		},
	}
});

const basketView = new Basket({ 
	element: cloneTemplate('#basket'),
	eventEmitter,
	eventHandlers: {
		onClick: () => {
			appState.initOrder();
		},
	}
});

//update or reset the basket here! 
eventEmitter.on<{
	data: { items: IItem[] };
}>(
	RegExp(
		`${StateEvents.BASKET_UPDATE}|${StateEvents.BASKET_RESET}`
	),
	({ data }) => {
		const { items } = data;

		header.render({
			counter: items.length,
		});
	}
);
//update or reset the basket here!

eventEmitter.on(ModalEvents.open, () => {
	page.isLocked = true;
});

eventEmitter.on(ModalEvents.close, () => {
	page.isLocked = false;
});
eventEmitter.on<{ data: { items: IItem[] } }>(
	StateEvents.PRODUCTS_UPDATE,
	({ data }) => {
	const { items } = data;

	  const itemsView = items.map((item) => {
		const itemView = new Item({
		  element: cloneTemplate('#card-catalog'),
		  eventEmitter,
		  eventHandlers: {
			onCLick: () => {
			 appState.setPreview(item);
			},
		  },
		});

		const productsViewRenderArgs: TItemRenderArgs = {
		 ...item,
		  color: getKeyByValue(
			item.category.toLowerCase(),
			settings.CATEGORY_COLORS_TITLES
		  ),
		  price: funcPrice(item.price, settings.CURRENCY_TITLES),
		};
		return itemView.render(productsViewRenderArgs);
	  });
	  products.items = itemsView;
	}
  );
  

eventEmitter.on<{data: {item: IItem}}>(
	StateEvents.PREVIEW_UPDATE,
	({ data }) => {
		const { item } = data;

		const isProductInBasket = appState.checkBasketItem(item.id);

		const itemPreview = new ItemShow({
			element: cloneTemplate('#card-preview'),
			eventEmitter,
			eventHandlers: {
				onCLick: () => {
					if (isProductInBasket) {
						appState.deleteItem(item.id);
					} else {
						if (item.price) {
							appState.addItem(item);
						}
					}
				},
			},
		});

		const itemPreviewRender: TItemShowArgs = {
			...item,
			color: getKeyByValue(
				item.category.toLowerCase(),
				settings.CATEGORY_COLORS_TITLES
			),
			isDisabled: !item.price,
			price: funcPrice(item.price, settings.CURRENCY_TITLES),
			buttonText: isProductInBasket ? 'Удалить из корзины' : 'Купить',
		};

		modal.render<TItemShowArgs>({
			content: {
				view: itemPreview,
				renderArgs: itemPreviewRender,
			},
		});
	}
);


eventEmitter.on<{
	data: { items: IItem[] };
}> (RegExp( `${StateEvents.BASKET_UPDATE}|${StateEvents.BASKET_INIT}`), 
	({ data }) => {
		const { items } = data;

		const basketTotalPrice = appState.getPrice();

		const basketItemsViews = items.map<TViewSubs<TBasketItemRender>>(
			(item, index) => {
				const basketItemView = new BasketItem({
					element: cloneTemplate('#card-basket'),
					eventEmitter,
					eventHandlers: {
						onClick: () => {
							appState.deleteItem(item.id);
						},
					},
				});

				const basketItemViewArgs: TBasketItemRender = {
					...item,
					index: index + 1,
					price: funcPrice(item.price, settings.CURRENCY_TITLES),
				};

				return {
					view: basketItemView,
					renderArgs: basketItemViewArgs,
				};
			}
		);
		modal.render<TBasketRender<TBasketItemRender>>({
			content: {
				view: basketView,
				renderArgs: {
					isDisabled: items.length == 0,
					price: basketTotalPrice == 0 ? '' : funcPrice(basketTotalPrice, settings.CURRENCY_TITLES),
					items: basketItemsViews,
				},
			},
		});
	}
);

eventEmitter.on<{ data: { step: TOrderStep } }>(
	StateEvents.ORDER_STEP,
	({ data }) => {
		const { step } = data;
		if (step === 'shipment') {
			const orderShipment = new Order({
				element: cloneTemplate('#order'),
				eventEmitter,
				eventHandlers: {
					onSubmit: () => {
						appState.setStep('contacts');
					},
					onInput: ({ field, value }) => {
						appState.setOrder(field as keyof IOrderItem, value);
						orderShipment.render({
							...appState.getOrderAPI(),
							errors: appState.getOrderErrors(),
							isDisabled: !appState.validCheck(),
						});
					},
				},
			});

			modal.render<TOrderArgs>({
				content: {
					view: orderShipment,
					renderArgs: {
						...appState.getOrderAPI(),
						errors: appState.getOrderErrors(),
						isDisabled: !appState.validCheck(),
					},
				},
			});
		}
		if (step === 'contacts') {
			const orderContactsView = new OrderContacts({
				element: cloneTemplate('#contacts'),
				eventEmitter,
				eventHandlers: {
					onSubmit: () => {
						api
							.createOrder(appState.getOrderAPI())
							.then((data) => {
								appState.resetOrder();
								appState.resetBasket();

								const orderSuccessView = new OrderSuccess({
									element: cloneTemplate('#success'),
									eventEmitter,
									eventHandlers: {
										onClick: () => {
											modal.close();
										},
									},
								});
								modal.render<TOrderSuccessArgs>({
									content: {
										view: orderSuccessView,
										renderArgs: {
											description: `Списано ${funcPrice(data.total, settings.CURRENCY_TITLES)}`,
										},
									},
								});
							})
							.catch((error) => {
								console.error(error);
							});
					},
					onInput: ({ field, value }) => {
						appState.setOrder(field as keyof IOrderItem, value);
						orderContactsView.render({
							...appState.getOrderAPI(),
							errors: appState.getOrderErrors(),
							isDisabled: !appState.validCheck(),
						});
					},
				},
			});
			modal.render<TOrderContactsArgs>({
				content: {
					view: orderContactsView,
					renderArgs: {
						...appState.getOrderAPI(),
						errors: appState.getOrderErrors(),
						isDisabled: !appState.validCheck(),
					},
				},
			});
		}
	}
);


api.getItems()
	.then((products) => {
		appState.setCatalogItems(products);
		console.log(products)
	})
	.catch((error) => {
		console.error(error);
	});
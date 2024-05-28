# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Концепция приложения
В данном контексте все приложение имеет общего "Presenter", который управляет взаимодействием всех View и Model через событийно-ориентированный подход, используя механизм сообщений, возникающих в результате определенных событий внутри отображений и моделей.
Ниже будут описаны типы для товара и взаимодействия с ним.
Интерфейс описания товара: 
```ts
interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```
Интерфейс описания заказа товара: 
```ts
interface IOrderItem {
    items: IItem[];
    payment: TPaymentType;
    email: string;
    phone: string;
    address: string;
}
```
Тип для работы товара с АПИ
```ts
type TOrderAPI = Omit<IOrderItem, 'items'> & {
    items: string[];
	total: number;
} 
```

Тип для определения способа оплаты товара:
```ts
type TPaymentType = 'card' | 'cash';
```
Тип для отслеживания статуса заказа(товара):
```ts
type TOrderStep = 'shipment' | 'contacts';
```

## Базовый код
### Базовый класс API:
Реализует получение и отправку данных, то есть работу с сервером. Имеет набор методов, передаваемых в качестве типа ApiPostMethods
В конструктор класса приходят следующие данные:
1. `baseUrl: string` - URL, к которому будут делаться запросы.
2. `options: RequestInit = {}` - объект типа RequestInit, который содержит дополнительные настройки для запроса.
```ts
type TApiPostMethods = 'POST' | 'PUT' | 'DELETE'
```
Имеет следующие handleResponse & get & post:
```ts
handleResponse(response: Response) {}

get(uri: string) {}

post(uri: string, data: object, method: ApiPostMethods = 'POST') {}
```
1. `handleResponse` -  метод принимает объект Response и возвращает Promise
2. `get` - метод выполняет GET-запрос к указанному URI, используя свойство baseUrl и параметры запроса из options и возвращает Promise
3. `post` - метод выполняет POST-запрос к указанному URI с переданными данными в формате объекта data и возвращает Promise
 

### Базовый класс EventEmitter:
Обрабатывает всевозможные функции событий: установка и снятие слушателя на элемент, и его вызов.
Конструктор выглядит так:
```ts
constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }
```
Реализуется через интерфейс IEvents;
```ts
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
export class EventEmitter implements IEvents {...}
```
Класс имеет такие методы:
```ts
    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {}
    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {}
    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {}
    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {}
    /**
     * Сбросить все обработчики
     */
    offAll() {}
    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {}
```
### Абстрактный класс View
Создается базовый абстрактный класс, который определяет конструктор для всех отображений в приложении. У него есть метод render для связывания с DOM элементом с определенными параметрами args. Класс также содержит список привязанных событий и брокер событий для внутренних сообщений.
Конструктор принимает объект типа TViewArgs, который содержит DOM элемент, привязанный к View, брокер и список доступных событий
```ts
type TViewArgs = {
    element: HTMLElement;
	eventEmitter: IEvents;
	eventHandlers?: object;
}

type TViewSubs<RenderArgs extends object = object> = {
	view: IView | HTMLElement;
	renderArgs?: RenderArgs;
};
```
В классе присутствует метод `render`, цель метода render - привязать экземпляр представления к HTML-элементу и предоставить точку входа для передачи аргументов, необходимых для рендеринга.

### Абстрактный класс Model 
Создается базовый абстрактный класс, который определяет конструктор для всех моделей в приложении. Он принимает часть данных, связанных с интерфейсом модели, и экземпляр брокера событий, реализующего интерфейс IEvents. Класс содержит метод emitChanges для отправки сообщений о изменениях внутренних данных с использованием EventEmitter
Конструктор принимает следующие данные:
1. `data: Partial<T>` - объект типа Partial<T>, который представляет данные модели.
2. `eventEmitter: IEvents` - параметр представляет собой механизм для генерации событий и обработки их подписчиков.   
```ts
class Model<T>{
	constructor(data: Partial<T>, eventEmitter: IEvents) {}
	emitChanges() {...}
}
```
Метод `emitChanges` сообщает об изменении модели.
## Компоненты для работы со страницей
### Класс MainPage
Отвечает непосредственно за отображение самой страницы, наследуется от класса View.
При рендеринге использует поля типа TPageRender:
```ts
type TPageRender = {
	isLocked: boolean;
};
```
### Класс Header 
В основе своей создан для отображения заголовка страницы, в частности счетчика корзины, также наследуется от класса View
При рендеринге использует следующий тип:
```ts
type THeaderRender = {
	counter: number;
};

set counter(value: number) {
    this._counter.textContent = value.toString();
    }
```
### Класс Modal 
Создается класс для отображения всплывающего модального окна, наследуется от View и имеет методы открытия/закрытия.
Все доступные события класса описаны в ивентах ModalEvents:
```ts
enum ModalEvents {
    OPEN = 'modal:open',
	CLOSE = 'modal:close'
}
```
Имеет следующие методы для открытия/закрытия модального окна:
```ts
open()
close()
```
### Класс Form
Отображение формы, прослушивание событий, ее валидация и также наследуется от класса View. События описываются определенным типом TFormHandlers
```ts
type TFormHandlers = {
    onSubmit?: (args: { _event: SubmitEvent }) => void;
    onInput?: (args: { _event: InputEvent, field: string, value: unknown}) => void;
}

type TFormRender = {
	isDisabled: boolean;
};
```
## Модели данных
### Класс AppState
Хранит данные для контролирования таких процессов как: добавление товаров в корзину, заполнение полей данными пользователя и другие. Имеет интерфейс Istate и имеет базовый набор методов для управления приложением с описанием доступных событий в `StateEvents`
```ts
interface IState {
    preview: IItem;
    products: IItem[];
    basket: set<IItem>;
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
```
Имеет следующие методы для управления веб-приложением
```ts
initOrder() {}

setCatalogItems(value: IItem[]) {}

setPreview(value: IItem) {}

setStep(value: TOrderStep) {}

checkBasketItem(id: string) {}

addItem(value: IItem) {}

deleteItem(id: string) {}

initBasket() {}

getPrice() {}

setOrder(field: keyof IOrderItem, value: unknown) {}

getOrderAPI() {}

getOrderErrors() {}

validCheck() {}

resetOrder() {}

resetBasket() {}
```
## Компоненты корзины
### Класс Basket
Отвечает за отображение корзины и наследуется от класса View. Содержит все товары корзины и их общую стоимость, все события описываются в типе. При рендеринге использует поля типа TBasketRender:
```ts
type TBasketEvents = {
	onClick: (args: { _event: MouseEvent }) => void;
};

type TBasketRender<T extends object> = {
    items: TViewSubs<T>[];
    price: string;
    isDisabled: boolean;
}
```
### Класс BasketIttem
Служит для действий в корзине с конкретным товаром, например его удалением. Наследуется от View. Отображает характеристики конкретного товара корзины. При рендеринге использует поля типа TBasketItemRender:
```ts
type TBasketItemEvents = {
	onClick?: (args: { _event: MouseEvent }) => void;
};

type TBasketItemRender = {
    index: number;
	title: string;
	price: string;
}
```
## Компоненты корзины
### Класс Item
Используется для отображения товара. Содержит почти все характеристики товара
```ts
type TItemRenderArgs = Pick<IItem, 'image' | 'title' | 'category'> & { //берем только нужные
	price: string;
	color: string | null;
};
```
Имеет сетеры `image`, `category`, `price`, `title`, `color` для полного отображения карточки
### Класс Items
Служит для отображения полного списка товаров и их рендера, наследуется от View
```ts
type TItemsRender<T extends object> = {
	items: TViewSubs<T>[];
};

render<RenderArgs extends object = object>(args: TItemsRender<RenderArgs>) {
	super.render(args)
    return this._element;
  }
```
### Класс ItemShow
Отображате полную информацию о товаре путем открытия модального окна карточки, наследуется от класса Item
```ts
type TItemShowArgs = TItemRenderArgs & {
	description: string;
	buttonText: string;
	isDisabled: boolean
};
```
Имеет сетеры `description`, `buttonText`, `isDisabled` для отображения информации карточки
## Компоненты корзины
### Класс Order
Служит для отображения пользователю формы заказа с полями способа оплаты и адреса доставки. Наследует от Form, управляет состоянием полей способа оплаты и адреса доставки
```ts
type TOrderArgs = TFormArgs & {
    payment: string;
    address: string;
}
```
Имеет сетеры для установки способа оплаты и адреса `address`, `payment`.
### Класс OrderContacts
Отображение этапа заказа с заполнением почты и телефона юзера. Также наследуется от Form
```ts
type TOrderContactsArgs = TFormArgs & {
	email: string;
	phone: string;
};

set email(value: string) {
    this._email.value = value.toString();
    }

set phone(value: string) {
    this._phone.value = value.toString();
}
```
### Класс OrderSuccess
Служит ддля отображения пользователю информации о том, что заказ был совершен успешно, выводит количество списанных синапсов
```ts
type TOrderSuccessArgs = {
	description: string;
};

set description(value: string) {
	this._description.textContent = value.toString();
}
```

## Ключевые типы и интерфейсы веб-приложения
```ts
//основные типы
type TOrderAPI = Omit<IOrderItem, 'items'> & {
    items: string[];
	total: number;
};
type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};
type EmitterEvent = {
    eventName: string,
    data: unknown
};
type TViewArgs = {
    element: HTMLElement;
	eventEmitter: IEvents;
	eventHandlers?: object;
};
type TViewSubs<RenderArgs extends object = object> = {
	view: IView | HTMLElement;
	renderArgs?: RenderArgs;
};
type THeaderRender = {
	counter: number;
};
type TBasketRender<T extends object> = {
    items: TViewSubs<T>[];
    price: string;
    isDisabled: boolean;
}
type TItemRenderArgs = Pick<IItem, 'image' | 'title' | 'category'> & {
	price: string;
	color: string | null;
};
type TOrderArgs = TFormArgs & {
    payment: string;
    address: string;
}
type TModalArgs<T extends object> = {
    content: TViewSubs<T>;
}



//основные интерфейсы
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
};
interface IState {
    preview: IItem;
    products: IItem[];
    basket: set<IItem>;
    toOrder: IOrderItem;
};
interface IView {
	render(args?: object): unknown;
};
interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
};
interface IOrderItem {
    items: IItem[];
    payment: TPaymentType;
    email: string;
    phone: string;
    address: string;
};
```
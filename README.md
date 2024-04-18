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
- src/styles/styles.scss — корневой файл стилей
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
```
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
```
interface IOrderItem {
    items: IItem[];
    payment: TPaymentType;
    email: string;
    phone: string;
    address: string;
}
```
Тип для работы товара с АПИ
```
type TOrderAPI = Omit<IOrderItem, 'items'> & {
    items: string[];
	total: number;
} 
```

Тип оплаты товара:
```
type TPaymentType = 'card' | 'cash';
```
Тип статуса заказа(товара):
```
type TOrderStep = 'dispatch' | 'contacts';
```

## Базовый код
### Базовый класс API:
Реализует получение и отправку данных, то есть работу с сервером. Имеет набор методов, передаваемых в качестве типа ApiPostMethods

### Базовый класс EventEmitter:
Обрабатывает всевозможные функции событий: установка и снятие слушателя на элемент, и его вызов.
Реализуется через интерфейс IEvents;
```
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
### Абстрактный класс View
Создается базовый абстрактный класс, который определяет конструктор для всех отображений в приложении. У него есть метод render для связывания с DOM элементом с определенными параметрами args. Класс также содержит список привязанных событий и брокер событий для внутренних сообщений.
Конструктор принимает объект типа TViewArgs, который содержит DOM элемент, привязанный к View, брокер и список доступных событий
```
type TViewArgs = {
    element: HTMLElement;
	eventEmitter: IEvents;
	eventHandlers?: object;
}

abstract class View<> {...}
```
### Абстрактный класс Model 
Создается базовый абстрактный класс, который определяет конструктор для всех моделей в приложении. Он принимает часть данных, связанных с интерфейсом модели, и экземпляр брокера событий, реализующего интерфейс IEvents. Класс содержит метод emitChanges для отправки сообщений о изменениях внутренних данных с использованием EventEmitter
```
class Model<T>{
	constructor() {...}
	emitChanges() {...}
}
```
## Компоненты для работы со страницей
### Класс MainPage
Отвечает непосредственно за отображение самой страницы, наследуется от класса View
```
type TPageRender = {
	isLocked: boolean;
};
```
### Класс HeaderPage 
В основе своей создан для отображения заголовка страницы, в частности счетчика корзины, также наследуется от класса View
```
type THeaderRender = {
	counter: number;
};
```
### Класс Modal 
Создается класс для отображения всплывающего модального окна, наследуется от View и имеет методы открытия/закрытия.
Все доступные события класса описаны в ивентах ModalEvents:
```
enum ModalEvents {
    OPEN = 'modal:open',
	CLOSE = 'modal:close'
}
```
### Класс Foorm
Отображение формы, прослушивание событий, ее валидация и также наследуется от класса View. События описываются определенным типом TFormHandlers
```
type TFormHandlers = {
    ...
};

type TFormRender = {
	isDisabled: boolean;
};
```
## Модели данных
### Класс State
Хранит данные для контролирования таких процессов как: добавление товаров в корзину, заполнение полей данными пользователя и другие. Имеет интерфейс Istate и имеет базовый набор методов для управления приложением с описанием доступных событий
```
interface IState {
    preview: IItem;
    products: IItem[];
    basket: set<IItem>;
    toOrder: IOrderItem;
}

...
```
## Компоненты корзины
### Класс Basket
Отвечает за отображение корзины и наследуется от класса View. Содержит все товары корзины и их общую стоимость, все события описываются в типе
```
type TBasketEvents = {
	onClick: (args: { _event: MouseEvent }) => void;
};
```
### Класс BasketIttem
Служит для действий в корзине с конкретным товаром, например его удалением. Наследуется от View
```
type TBasketItemEvents = {
	onClick?: (args: { _event: MouseEvent }) => void;
};
```


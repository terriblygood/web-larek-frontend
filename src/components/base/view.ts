import { IEvents } from "./events";
import { isPlainObject } from "../../utils/utils";


export interface IView {
	render(args?: object): unknown;
}

export type TViewArgs<Element extends HTMLElement = HTMLElement, EventHandlers extends object = object> = {
    element: Element;
	eventEmitter: IEvents;
	eventHandlers?: EventHandlers;
}

export type TViewSubs<RenderArgs extends object = object> = {
	view: IView | HTMLElement;
	renderArgs?: RenderArgs;
};

export abstract class View<Element extends HTMLElement = HTMLElement, RenderArgs extends object = object, EventHandlers extends object = object> implements IView {
	protected _element: Element;
	protected _eventEmitter: IEvents;
	protected _eventHandlers: EventHandlers;

	constructor({element, eventEmitter, eventHandlers}: TViewArgs<Element, EventHandlers>) {
		this._element = element;
		this._eventEmitter = eventEmitter;

		if (eventHandlers && isPlainObject(eventHandlers)) { // если простой, то передается
			this._eventHandlers = eventHandlers as EventHandlers;
		}
	}

	render(args?: Partial<RenderArgs>) {
		Object.assign(this, args ?? {});

		return this._element;
	}

}

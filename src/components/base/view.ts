import { IEvents } from "./events";

export interface IView {
	render(args?: object): unknown;
}

export type TViewArgs = {
    element: HTMLElement;
	eventEmitter: IEvents;
	eventHandlers?: object;
}

export type TViewSubs<Render extends object = object> = {
	view: IView | HTMLElement;
	renderArgs?: Render;
};

export abstract class View<> {

}
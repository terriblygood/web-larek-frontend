import { View, TViewSubs } from "./base/view";

type TItemsRender<T extends object> = {
	items: TViewSubs<T>[];
};

// class Items extends View {
//     set items(value: TViewSubs[]) {
// 		this._element.replaceChildren(
// 			...value.map(({ view, renderArgs }) =>
// 				view instanceof View ? view.render(renderArgs) : view
// 			)
// 		);
// 	}
//     render<RenderArgs extends object = object>(args: TItemsRender<RenderArgs>) {
// 		super.render(args);

// 		return this._element;
// 	}
// }
// export { Items, TItemsRender}
class Items extends View {
  set items(value: HTMLElement[]) {
    this._element.replaceChildren(...value);
  }

  render<RenderArgs extends object = object>(args: TItemsRender<RenderArgs>) {
	super.render(args)
    return this._element;
  }
}

export { Items };

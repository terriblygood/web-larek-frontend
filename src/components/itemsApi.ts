import { Api, ApiListResponse, ApiPostMethods } from "./base/api";
import { IItem, TOrderAPI, IOrderResult} from "../types";
import { Item } from "./item";

interface IApiItems {
    getItems: () => Promise<IItem[]>;
    getItem: (id: string) => Promise<IItem>;
    createOrder: (invoice: TOrderAPI) => Promise<IOrderResult>;
}

class ApiItems extends Api implements IApiItems {
    readonly hostUrl: string;

    constructor(hostUrl: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);

        this.hostUrl = hostUrl;
    }

    getItem(id: string) {
        return this.get(`/product/${id}`).then((item: IItem) => ({...item, image: this.hostUrl + item.image}))
    }

    getItems() {
        return this.get('/product').then((data: ApiListResponse<IItem>) =>
          data.items.map((item) => ({
            ...item,
            image: this.hostUrl + item.image,
          }))
          );
      }
    createOrder(invoice: TOrderAPI) {
		 return this.post('/order', invoice).then((data: IOrderResult) => data);
	  }
}

export {ApiItems, IApiItems}
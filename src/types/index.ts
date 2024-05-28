// товары
//sam item
interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

type TPaymentType = 'card' | 'cash';

//order an item with type and mass
interface IOrderItem {
    items: IItem[];
    payment: TPaymentType;
    email: string;
    phone: string;
    address: string;
}

interface IOrderResult {
	id: string;
	total: number;
}
//for work with api
type TOrderAPI = Omit<IOrderItem, 'items'> & {
    items: string[];
	total: number;
} 

type TOrderStep = 'shipment' | 'contacts';


export {IItem, IOrderItem, TOrderAPI, IOrderResult, TOrderStep, TPaymentType}
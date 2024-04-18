// товары
//sam item
interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
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
//for work with api
type TOrderAPI = Omit<IOrderItem, 'items'> & {
    items: string[];
	total: number;
} 

type TOrderStep = 'dispatch' | 'contacts';


export {IItem, IOrderItem}
import { IItem, IOrderItem} from "../../types";
interface IState {
    preview: IItem;
    products: IItem[];
    basket: set<IItem>;
    toOrder: IOrderItem;
}
import { TViewArgs, View } from "./base/view";
import { Form, TFormArgs, TFormHandlers } from "./form";

type TOrderContactsArgs = TFormArgs & {
	email: string;
	phone: string;
};

class OrderContacts extends Form<HTMLFormElement, TOrderContactsArgs> {
    protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

    constructor(args: TViewArgs<HTMLFormElement, TFormHandlers>) {
        super(args);

        this._email = this._element.querySelector('input[name="email"]');

		this._phone = this._element.querySelector('input[name="phone"]');
    }

    set email(value: string) {
        this._email.value = value.toString();
    }

    set phone(value: string) {
        this._phone.value = value.toString();
    }
}

export {OrderContacts, TOrderContactsArgs}
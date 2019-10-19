import ProductCart from "@/models/ProductCart";
import Config from "@/config/Config";
import Partenaire from "@/models/Partenaire";

export default class Cart {

    private _key: string;

    private _code: string;

    private _totalPrice?: number;

    private _created?: number;

    public _content?: ProductCart[];

    constructor(key: string, code: string, totalPrice: number = 0, content: ProductCart[] = []) {
        this._key = key;
        this._code = code;
        this._totalPrice = totalPrice;
        this._content = content;
    }

    get content(): ProductCart[] {
        return this._content;
    }

    set content(value: ProductCart[]) {
        this._content = value;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get totalPrice(): number {
        return this.content.reduce((sum: number, cur: ProductCart) => {
            return (cur.quantity * cur.product.price) + sum;
        }, 0.0)
    }

    set totalPrice(value: number) {
        this._totalPrice = value;
    }

    get partenaire(): Partenaire {
        return Config.getPartenaire(this.code);
    }

    get created(): number {
        return this._created;
    }

    set created(value: number) {
        this._created = value;
    }
}
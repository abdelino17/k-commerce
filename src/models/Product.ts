export default class Product {

    private _id!: number;

    private _name!: string;

    private _price!: number;

    private _summary!: string;

    private _description: string;

    private _images: string[] = [];

    private _isFake: boolean = false;

    constructor(id: number, name: string,  price: number, summary: string, description: string, fake: boolean, tax: any = 0) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._summary = summary;
        this._description = description;
        this._isFake = fake;

        this.normalizePrice(tax);
    }

    get images(): string[] {
        return this._images;
    }

    set images(value: string[]) {
        this._images = value;
    }

    get isFake(): boolean {
        return this._isFake;
    }

    set isFake(value: boolean) {
        this._isFake = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        this._price = value;
    }

    get summary(): string {
        return this._summary;
    }

    set summary(value: string) {
        this._summary = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    normalizePrice(tax: any) {
        let taxIncl =  (this.price * (parseFloat(tax)/100));
        this.price = Math.round(((+this.price + taxIncl)*100)/100);
    }
}
export default class Address  {

    private _id!: number;
    private _id_country!: number;
    private _alias!: string;
    private _company!: string;
    private _city!: string;
    private _postcode!: string;
    private _address1!: string

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get id_country(): number {
        return this._id_country;
    }

    set id_country(value: number) {
        this._id_country = value;
    }

    get alias(): string {
        return this._alias;
    }

    set alias(value: string) {
        this._alias = value;
    }

    get company(): string {
        return this._company;
    }

    set company(value: string) {
        this._company = value;
    }

    get city(): string {
        return this._city;
    }

    set city(value: string) {
        this._city = value;
    }

    get postcode(): string {
        return this._postcode;
    }

    set postcode(value: string) {
        this._postcode = value;
    }

    get address1(): string {
        return this._address1;
    }

    set address1(value: string) {
        this._address1 = value;
    }
}
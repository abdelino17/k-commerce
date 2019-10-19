import Address from "@/models/Address";

export default class Customer  {

    private _id!: number;

    private _firstName!: string;

    private _lastName!: string;

    private _email!: string;

    private _others!: any;

    private _otp!: string;

    private _addresses: Address[] = [];

    private _addressSelected: number;

    constructor() {
        this.addresses = [];
        this.otp = "";
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get others(): any {
        return this._others;
    }

    set others(value: any) {
        this._others = value;
    }

    get otp(): string {
        return this._otp;
    }

    set otp(value: string) {
        this._otp = value;
    }

    get addresses(): Address[] {
        return this._addresses;
    }

    set addresses(value: Address[]) {
        this._addresses = value;
    }

    get addressSelected(): number {
        return this._addressSelected;
    }

    set addressSelected(value: number) {
        this._addressSelected = value;
    }
}
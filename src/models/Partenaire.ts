export default class Partenaire {

    private _name!: string;

    private _icon!: string;

    private _description!: string;

    private _type!: string;

    private _parameters!: any;

    private _code!: string;

    constructor(name: string, icon: string, description: string, type: string, code: string, parameters: any) {
        this._name = name;
        this._icon = icon;
        this._description = description;
        this._type = type;
        this._code = code;
        this._parameters = parameters;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get parameters(): any {
        return this._parameters;
    }

    set parameters(value: any) {
        this._parameters = value;
    }

    get icon(): string {
        return this._icon;
    }

    set icon(value: string) {
        this._icon = value;
    }
}
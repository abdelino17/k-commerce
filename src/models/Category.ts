export default class Category {

    private _id!: number;

    private _name!: string;

    private _description!: string;
    
    constructor(id: number, name: string, description: string) {
        this._id = id;
        this._name = name;
        this._description = description;
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

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    update(cat: Category) {
        this.name = cat.name;
        this.description = cat.description;
    }
}
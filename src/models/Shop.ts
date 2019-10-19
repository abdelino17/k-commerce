import Partenaire from "@/models/Partenaire";
import CategoryProducts from "@/models/CategoryProducts";

interface Shop {
    code?: string,
    partenaire: Partenaire,
    categories: CategoryProducts[],
}

const instanceofShop = function instanceOfShop(object: any): object is Shop {
    return 'partenaire' in object && object.partenaire instanceof Partenaire;
}

export { Shop, instanceofShop}


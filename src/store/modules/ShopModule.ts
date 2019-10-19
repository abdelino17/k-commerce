import CategoryResponses from "@/models/CategoryResponses";
import Partenaire from "@/models/Partenaire";
import Util from "@/utils/Util";
import ShopStore from "@/models/ShopStore";
import { Shop }  from "@/models/Shop";
import ProductResponses from "@/models/ProductResponses";
import Product from "@/models/Product";
import BreadCrumb from "@/models/BreadCrumb";
import Config from "@/config/Config";

const state: ShopStore = { data: [], online: true, breadcrumbs: [] }

const getters = {

    checkShop: (state: any) => (partenaire: Partenaire) => {
        let shop: Shop = state.data.find((shop: Shop) => shop.code == partenaire.code);
        return shop;
    }

}

const mutations = {

    update  (state: any, shop: Shop) {
        const findIndex =  require('lodash/findIndex')
        state.data[findIndex(state.data, (cur:any) => cur.code == shop.code )] = shop;
    },

    addShop (state: any, payload: Shop) {
        state.data.push(payload);
    },

    breadcrumbs (state: any, payload: BreadCrumb[]) {
        state.breadcrumbs = payload;
    }

}

const actions = {

    async getCategoriesByShop({ commit, state, getters }: any, partenaire: Partenaire) {

        let shop: Shop = getters.checkShop(partenaire) ;
        if(shop == undefined) {
             shop = { partenaire, categories: [], code: partenaire.code }
             commit('addShop', shop);
        }

        let res: any = { };

        if(state.online) {
            let ws = Util.webService(shop.partenaire);
            await ws.getCategories().then(
                (data: CategoryResponses) => {
                    for(let cat of data.categories) {
                        if(shop.categories[cat.category.id])
                            shop.categories[cat.category.id].category.update(cat.category);
                        else
                            shop.categories[cat.category.id] = cat;
                    }

                    commit('update', shop);
                    res = data;
                }
            )
        }
        return res;
    },

    async getProductsByCategory({ commit, state, getters }: any, params: any) {
        let partenaire  = params.partenaire;
        let cat_id = params.cat_id;

        let shop: Shop = getters.checkShop(partenaire) ;
        if(shop == undefined) {
            shop = { partenaire, categories: [ ], code: partenaire.code };
            shop.categories[cat_id] = { category: Util.generateCategory(1, cat_id)[0], products: [] };
            commit('addShop', shop);
        }
        let res: any = { };

        if(state.online) {
            await Util.webService(shop.partenaire).getProducts(cat_id).then(
                (data: ProductResponses) => {
                    shop.categories[cat_id].products = data.products;
                    commit('update', shop);
                    res = data;
                }
            )
        }
        return res;
    },

    getProductById({ commit, state, getters }: any, params: any): any {

        let shop: Shop = getters.checkShop(params.partenaire) ;
        if(shop != undefined) {
            return shop.categories[params.cat_id].products.find((pro: Product) =>  pro.id == params.prod_id) || null;
        }else
        {
            return null;
        }
    },

    adapatBreadcrumbs({ commit, state, getters }: any, { name, params }: any): any {

        let shop = params.code;
        let category = params.cat_id;
        let cart = params.checkout;
        let localBread: BreadCrumb[] = [];

        const shopR = "shop";
        const categoryR = "category";
        const checkoutR = "checkout";
        const cartsR = "carts";

        if(shop != undefined) {
            let partenaire: Partenaire = Config.getPartenaire(shop);

            if(partenaire != null)
            {
                localBread.push({ name: partenaire.name, route: shopR, params: { code: partenaire.code }});

                if(category != undefined)
                {
                    let shop = getters.checkShop(partenaire);
                    category = shop.categories[category] || undefined;
                    if(category != undefined)
                        localBread.push({ name: category.category.name, route: categoryR, params: { code: shop.code, cat_id: category.category.id }})
                }

                if(name == checkoutR) {
                    localBread.push({ name: "Checkout", route: checkoutR, params: { code: partenaire.code }})
                }
            }
        }else if(name == cartsR) {
            localBread.push({ name: "Mes Paniers", route: cartsR });
        }
        commit('breadcrumbs', localBread);
    }

}

export default  {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
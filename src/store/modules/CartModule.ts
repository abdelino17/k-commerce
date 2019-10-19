import ShoppingCart from "@/models/ShoppingCart";
import { Shop } from "@/models/Shop";
import Cart from "@/models/Cart";
import Util from "@/utils/Util";
import ProductCart from "@/models/ProductCart";
import Config from "@/config/Config";
import {Vue} from "vue-property-decorator";

const state: ShoppingCart = { carts: [ ] };

const getters = {

    checkCart: (state: any) => (code: string) => {
        let cart: Cart = state.carts.find((cart: Cart) => cart.code == code);
        return cart;
    },

    getCount: (state: any) => (params: any) => {

        if(params.code == undefined)
        {
            return state.carts.reduce((sum: number, cur: Cart) => {
                let tmp = 0;
                cur._content.forEach((val: any, key: any) => {
                    tmp += +val.quantity;
                });
                return tmp + sum;
            }, 0)
        }else
        {
            try {
                let cart = state.carts.find((cart: any) => cart.code == params.code);
                let tmp = 0;
                cart._content.forEach((val: any, key: any) => {
                    tmp += +val.quantity;
                });
                return tmp;
            }catch (e) {
                return 0;
            }
        }
    },

};

const mutations = {

    addCart (state: any, payload: Cart) {
        state.carts.push(payload);
    },

    addProduct(state: any, { cart, product, }: any) {
        const findIndex =  require('lodash/findIndex');
        let  data: ProductCart = cart.content.find((prodCart: ProductCart) => prodCart.product.id == product.id);
        if(data == undefined) {
            data = { quantity: 1, product };
            cart.content.push(data);
        }else {
            data.quantity+=1;
        }
        let index = findIndex(state.carts, (cur: Cart) => cur.key == cart.key);
        Vue.set(state.carts, index, cart);
    },

    removeProduct(state: any, { cart, getters, product_id}: any) {
        const findIndex =  require('lodash/findIndex');
        cart.content = cart.content.filter(
            (prodCart: ProductCart) => prodCart.product.id != product_id
        );
        let index = findIndex(state.carts, (cur: Cart) => cur.key == cart.key );
        Vue.set(state.carts, index, cart);
    },

    removeCart(state: any, { cart, }: any) {
        state.carts = state.carts.filter(
            (cur: Cart) => cur.key != cart.key
        );
    }

};

const actions = {

    addToCart({ commit, state, getters, rootState, rootGetters }: any, params: any): any {

        let res: any =  { };

        let shop: Shop = rootGetters["shop/checkShop"](params.partenaire) ;
        if(shop == undefined)
        {
            res.message = "Impossible d'effectuer cette opération, cette boutique n'existe pas !";
            res.typeMsg = "error";
        }else{
            let cart = getters.checkCart(shop.code);
            if(cart == undefined)
            {
                cart = new Cart(Util.generateKey(),  shop.code);
                commit("addCart", cart)
            }
            commit("addProduct",  { cart, product: params.product });

            res.message = "Produit ajouté au panier";
            res.typeMsg = "success";
        }

        return res;
    },

    removeProduct({ commit, state, getters, rootState, rootGetters }: any,  { cart, product_id }: any,): any {

        let res: any = {};

        if(cart != undefined) {
            commit("removeProduct",  { cart, product_id });
            res.message = "Produit bien retiré du panier";
            res.typeMsg = "info";
        }else
        {
            res.message = "Impossible d'effectuer cette opération, ce panier n'existe pas !";
            res.typeMsg = "error";
        }

        return res;
    },

    removeCart({ commit, state, getters, rootState, rootGetters }: any,  { cart }: any,): any {

        let res: any = {};

        if(cart != undefined) {
            commit("removeCart",  { cart });
            res.message =  `Le panier pour le site ${cart.partenaire.name} a été bien supprimé. `;
            res.typeMsg = "info";
        }else
        {
            res.message = "Impossible d'effectuer cette opération, ce panier n'existe pas !";
            res.typeMsg = "error";
        }

        return res;
    },

    async createOrder({ commit, state, getters }: any, { cart, customer }: any) {

        let ws = Util.webService(Config.getPartenaire(cart.code));

        try {
            return await ws.createOrder(customer, cart).then(
                (data: any) => {
                    commit("removeCart",  { cart });
                    return data;
                }
            );
        }catch(e) {
            return "Salam";
        }
    }
};

export default  {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
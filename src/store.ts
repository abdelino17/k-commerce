import Vue from "vue";
import Vuex from "vuex";
import CartModule from "./store/modules/CartModule";
import ShopModule from "./store/modules/ShopModule";
import CustomerModule from "@/store/modules/CustomerModule";
import VuexClassPersistence from 'vuex-class-persist'
import { CLASSES } from "@/ioc/Types";

const vuexLocal = new VuexClassPersistence({
    storage: window.localStorage
}, CLASSES);

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
      cart :  CartModule,
      shop: ShopModule,
      customer: CustomerModule,
  },
  plugins: [vuexLocal.plugin],
  strict: false
});

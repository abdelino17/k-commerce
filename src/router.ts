import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Guard from "@/utils/Guard";

Vue.use(Router);

export default new Router({
  routes: [
      {
        path: "",
        name: "home",
        component: Home
      },
      {
        path: '/shop/:code',
        name: 'shop',
          beforeEnter: (to, from, next) => {
            Guard.checkShop(to.params.code, next)
          },
          component: () =>
              import("./views/ShopPage.vue")
      },
      {
          path: '/shop/:code/category/:cat_id',
          name: 'category',
          component: () =>
              import("./views/CategoryPage.vue")
      },
      {
          path: '/shop/:code/checkout',
          name: 'checkout',
          beforeEnter: (to, from, next) => {
              Guard.checkShop(to.params.code, next, true)
          },
          component: () =>
              import("./views/CheckoutPage.vue")
      },
      {
          path: '/carts',
          name: 'carts',
          component: () =>
              import("./views/CartPage.vue")
      },
      {
          path: '*',
          redirect: '/'
      }
  ]
});

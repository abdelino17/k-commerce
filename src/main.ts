import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
const VueInputMask = require('vue-inputmask').default
import {truncate, stripHTML, formatPrice, manageDecimals} from './utils/Filters';
import VueFormWizard from "vue-form-wizard";

Vue.config.productionTip = false;
Vue.filter('truncate', truncate);
Vue.filter('stripHTML', stripHTML);
Vue.filter('manageDecimals', manageDecimals);
Vue.filter('formatPrice', formatPrice);
Vue.use(VueInputMask);
Vue.use(VueFormWizard);

new Vue({
  router,
  store,
  render: h => h(App),
  watch: {
    '$route'(to, from) {
        this.$store.dispatch('shop/adapatBreadcrumbs', to);
    }
  }
}).$mount("#app");

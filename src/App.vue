<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper">
        <ul class="left">
          <router-link to="/" tag="li" active-class="active"><a><i class="material-icons">home</i></a></router-link>
        </ul>
        <div class="col  m6">&nbsp;&nbsp;&nbsp;&nbsp;
          <template v-for="(bc, key) in breadCrumbs">
                <router-link
                        v-if=""
                        tag="a"
                        :to="{ name: bc.route, params: bc.params }"
                        class="breadcrumb "
                        :class="{  'bread': ((breadCrumbs.length - 1) ==  key)  }"
                >
                  {{ bc.name }}
                </router-link>
          </template>

          <a href="#!" class="right " style="font-size: 1.5rem; margin-left: 30px">K-Commerce</a>
          <router-link
                  tag="a"
                  :to="{ name: 'carts' }"
                  class="right"
                  style="cursor: pointer;height: 64px;"
                  title="Voir mon panier"
          >
            <i class="material-icons" style="font-size: 2rem; ">shopping_cart</i>
            <span class="cartCount">{{ cartCount }}</span>
          </router-link>&nbsp;&nbsp;
        </div>
      </div>
    </nav>
    <transition
            name="fade"
            enter-active-class="animated fadeInRight slow"
            leave-active-class="animated fadeOutLeft fast"
    >
     <router-view></router-view>
    </transition>

  </div>
</template>

<style lang="scss">
  $animationDuration: 0.2s;
  @import "~materialize-css/sass/materialize";
  @import "~vue2-animate/src/sass/vue2-animate";
  @import "./fonts/material-icons/material-icons.css";
  @import "./fonts/roboto/roboto.css";
  @import "./fonts/themify-icons/themify-icons.css";
  @import "custom";

</style>

<script lang="ts">
    import { Vue } from "vue-property-decorator";

    export default class App extends Vue {

          mounted() {
          }

          get cartCount() {
              return this.$store.getters['cart/getCount'](this.$route.params);
          }

          get breadCrumbs() {
             return this.$store.state.shop.breadcrumbs;
          }
      }
</script>
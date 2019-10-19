<template>
    <div class="container"><br>
        <div class="row">
            <div class="col m12" v-if="carts.length > 0">
                    <cart
                        v-for="cart in carts"
                        v-if="cart.content.length > 0"
                        :cart="cart"
                        @removeCart="removeCart"
                        @removeProduct="removeProduct"
                    >
                    </cart>
                <p class="flow-text" align="center" v-else>Vous n'avez aucun panier pour l'instant !</p>
            </div>
            <div class="col m12 s12" v-else>
                <p class="flow-text" align="center">Vous n'avez aucun panier pour l'instant !</p>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import CartView from "@/components/CartView.vue";
    import Cart from "../models/Cart";
    import Util from "../utils/Util";

    @Component({
        components: {
            cart: CartView
        }
    })
    export default class CartPage extends Vue {

        created()  {

        }

        get carts(): any {
            return this.$store.state.cart.carts;
        }

        private removeProduct({ cart, product_id }: any) {

            this.$store.dispatch('cart/removeProduct', { cart,  product_id }).then((response: any) =>  {
                Util.toast(response.typeMsg, response.message);
                if(this.$store.state.cart.carts.length > 0)
                {
                   // window.location.reload();
                }
            });

        }

        private removeCart(cart: Cart) {

            this.$store.dispatch('cart/removeCart', { cart }).then((response: any) =>  {
                Util.toast(response.typeMsg, response.message);
            });

        }

    }
</script>

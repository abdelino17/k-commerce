<template>
        <div class="col m12">
            <h3>Votre panier pour le site  : <b>{{ cart.partenaire.name }}</b> </h3><br>
            <table class="highlight table  responsive-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Qté</th>
                        <th>Prix Unitaire (Tax Incl.)</th>
                        <th>Prix Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="prod in cart.content">
                        <td style="width: 50%;">{{ prod.product.name }}</td>
                        <td>
                                <input type="number" v-model="prod.quantity" style="max-width: 50px" max="100" min="1" @change="onChanged">
                        </td>
                        <td>{{ prod.product.price | manageDecimals | formatPrice }}</td>
                        <td>{{
                                (prod.quantity * prod.product.price) | manageDecimals | formatPrice
                              }}
                        </td>
                        <td>
                            <button class="btn red" title="Supprimer ce produit"  @click="removeProduct(prod.product.id)">
                                <i class="material-icons">delete</i>
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="font-size: 18px;">
                        <td colspan="1" style="text-align: right; font-weight: bold;font-size: 18px">Total : </td>
                        <td colspan="3" style="font-weight: bold; text-align: right">{{ cart.totalPrice | manageDecimals | formatPrice }}</td>
                    </tr>
                </tfoot>
            </table><br>
            <button class="btn red"title="Supprimer ce panier"  @click="removeCart">
                <i class="material-icons">delete_forever</i>
            </button>
            <router-link
                    tag="a"
                    :to="{ name: 'checkout', params: {  code: cart.code } }"
                    class="btn right"
                    title="Procéder au payment"
            >
                <i class="material-icons right">payment</i> Procéder au checkout
            </router-link>
        </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import Cart from "../models/Cart";
    import Util from "../utils/Util";

    @Component
    export default class CartView extends Vue {

            @Prop() private cart!: Cart;

            created() {

            }

            private removeProduct(product_id: number) {
                this.$emit('removeProduct', { cart: this.cart, product_id })
            }

            private removeCart() {
                this.$emit('removeCart', this.cart);
            }

            private onChanged() {
                //this.$router.push({ name: "carts" });
                this.$forceUpdate();
                //window.location.reload();
            }

    }
</script>

<style scoped lang="scss">

</style>

<template>
    <div id="modal-product" class="modal">
        <div class="modal-content">
            <h4 class="right" @click="closeModal" style="cursor: pointer;" title="Fermez la boite modale">&times;</h4><br><br>
            <div class="row">
                <div class="col m5 s6">
                    <img :src="product.images[0]"  style="max-height: 300px; max-width: 100%;">
                </div>
                <div class="col m6 s6">
                    <span style="color: #ee6e73; font-size: 18px; font-weight: bold;">{{ product.name }}</span><br><br>
                    <div style="font-size: 14px;">{{ product.summary  | stripHTML  }}</div>
                    <div style="margin-top: 20px">
                        <span style="font-weight: bold;font-size: 16px" class="left">{{ product.price | manageDecimals | formatPrice }}</span>
                        <span class="right">
                            <button class="btn waves-effect waves-light" style="background-color: #ee6e73" @click="addProduct(product.id)">Ajouter au panier</button>
                        </span>
                    </div>
                </div>
            </div>
            <hr>
            <div class="col m12 s12">
                <h6><b>Description</b></h6>
                <p class="flow-text" style="font-size: 14px">
                    {{ product.summary  | stripHTML  }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Product from "../models/Product";

    @Component
    export default class ProductView extends Vue {

            @Prop() private product!: Product;

            private closeModal() {
                this.$emit('close');
            }

            private addProduct(id: number) {
                this.$emit('addToCart', id);
            }


    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>

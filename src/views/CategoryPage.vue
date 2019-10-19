<template>
    <div><br><br>
        <div class="row">
            <div class="col m3 s6" v-if="products.length > 0" v-for="product in products" :class="{ 'skeleton': product.isFake }">
                <div class="card" v-if="!product.isFake">
                    <div class="card-image">
                        <img :src="product.images[0]" width="350px" height="200px">
                        <a class="btn-floating halfway-fab waves-effect waves-light red " @click="addToCart(product.id)" style="right: 100px"><i class="material-icons">add</i></a>
                        <a class="btn-floating halfway-fab waves-effect waves-light red " @click="viewProduct(product.id)"><i class="material-icons">visibility</i></a>
                    </div>
                    <div class="card-content ">
                        <span class="card-title" style="color: #ee6e73; font-size: 15px; height: 60px; font-weight: bold;">{{ product.name | truncate(70) }}</span>
                        <div style="font-size: 14px; text-overflow: ellipsis; height: 60px;">{{ product.summary  | stripHTML | truncate }}</div>
                    </div>
                    <div class="card-action">
                        <span style="font-weight: bold;">{{ product.price | manageDecimals | formatPrice }}</span>
                    </div>
                </div>
            </div>
            <div class="col m12 s12" v-else>
                <p class="flow-text">Désolé, cette catégorie ne contient aucun produit actuellement....</p>
            </div>
        </div>
        <product :product="currentProduct" @close="closeModal"  @addToCart="addToCart"></product>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {WebService} from "../ioc/Types";
    import Config from "../config/Config";
    import Util from "../utils/Util";
    import Product from "../models/Product";
    import ProductResponses from "../models/ProductResponses";
    import ProductView from "../components/ProductView.vue";

    @Component({
        components: {
            product: ProductView
        }
    })
    export default class CategoryPage extends Vue {

        private partenaire!: any;

        private ws!: WebService;

        private products: Product[] = [];

        private currentProduct: Product = Util.generateProducts(1)[0];

        private category_id!: number;

        private modal: any = null;

        created()  {
            this.partenaire =  Config.getPartenaire(this.$route.params.code);
            this.category_id =  parseInt(this.$route.params.cat_id);
            this.products = Util.generateProducts(4);

            this.$store.dispatch('shop/getProductsByCategory', { partenaire: this.partenaire, cat_id : this.category_id}).then((data: ProductResponses) => {
                this.products = data.products;
                Util.toast(data.typeMsg, data.message, 2500);
            });
        }

        addToCart(id: number): void {
            this.checkProduct(id).then((product: Product) => {
                    if(product != null) {
                        this.$store.dispatch('cart/addToCart', { partenaire: this.partenaire, product : product}).then((data: any) => {
                            Util.toast(data.typeMsg, data.message);
                        });
                    }
            });
        }

        viewProduct(id: number): void {
            const M = require('materialize-css');

            this.checkProduct(id).then((product: Product) => {
                let elem = document.querySelector('#modal-product');
                this.modal = M.Modal.init(elem, { dismissible: false });
                this.modal.open();
            });
        }

        closeModal(): void {
           if(this.modal != null)
               this.modal.close();
        }

       checkProduct(id: number) {
           return this.$store.dispatch('shop/getProductById', { partenaire: this.partenaire, cat_id: this.category_id, prod_id: id}).then((product: Product) => {
               if(product == null)
               {
                   Util.toast('error', "Désolé, ce produit n'existe pas...");
                   return null;
               }
               this.currentProduct = product;
               return product;
           });
       }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>

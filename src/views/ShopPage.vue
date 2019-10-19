<template>
    <div class="container">
            <loading :active.sync="isLoading"
                     :is-full-page="fullPage"></loading>
            <br><br>
            <ul class="collection" style="border: none">
                <div class="row">
                    <div class="col m4 s4" v-for="cat in categories">
                        <li class="collection-item">
                            <router-link
                                    tag="a"
                                    :to="{ name: 'category', params: { code: partenaire.code,  cat_id: cat.category.id }}"
                                    style="color:    #ff5722"
                            >
                                {{ cat.category.name }}
                                <i class="material-icons secondary-content" style="font-size: 2rem; color: #ff5722">chevron_right</i>
                            </router-link>
                        </li>
                    </div>
                    </div>
            </ul>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import Util from "../utils/Util";
    import Config from "../config/Config";
    import 'vue-loading-overlay/dist/vue-loading.min.css';
    import {WebService} from "../ioc/Types";
    import CategoryProducts from "../models/CategoryProducts";
    import CategoryResponses from "../models/CategoryResponses";
    const Loading = require('vue-loading-overlay')

    @Component({
        components: {
            Loading
        }
    })
    export default class Shop extends Vue {

        private partenaire!: any;

        private categories: CategoryProducts[] = [];

        private isLoading: boolean = false;

        private fullPage: boolean = true;

        private ws!: WebService;

        created()  {
            this.isLoading = true;
            this.partenaire =  Config.getPartenaire(this.$route.params.code);

            this.$store.dispatch('shop/getCategoriesByShop', this.partenaire).then((data: CategoryResponses) => {
                this.isLoading = false;
                this.categories = data.categories;
                Util.toast(data.typeMsg, data.message);
            });
        }

    }
</script>

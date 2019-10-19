<template>
        <div class="col m4 s6">
            <div class="card">
                <div class="card-image">
                    <img :src="`${baseUrl}${details.icon}`" style="height: 160px">
                    <router-link
                        tag="a"
                        :to="{ name: 'shop', params: { code: details.code }}"
                        class="btn-floating halfway-fab waves-effect waves-light red btn-large"
                    >
                        <i class="material-icons">play_arrow</i>
                    </router-link>
                </div>
                <div class="card-content"><br>
                    <p>{{ details.description }}.</p>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Partenaire from "../models/Partenaire";

    @Component
    export default class SitePartenaire extends Vue {

            @Prop() private details!: Partenaire;
            private baseUrl = process.env.BASE_URL;

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>

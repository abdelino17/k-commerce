<template>
  <div class="container"><br>
    <div class="row">
      <SitePartenaire
              v-for="partenaire in partenaires" :details="partenaire"
      ></SitePartenaire>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SitePartenaire from "@/components/SitePartenaire.vue"; // @ is an alias to /src
import Config from '../config/Config'
import Partenaire from "../models/Partenaire";
import Util from "../utils/Util";
import Customer from "../models/Customer";
import Cart from "../models/Cart";

@Component({
  components: {
    SitePartenaire
  }
})
export default class Home extends Vue {

   partenaires!: Partenaire[]

    constructor()
    {
        super()
        this.partenaires = Config.getPartenairesBrief()
    }

    mounted() {

  /*     let cart = new Cart("test", "odjala");
       let customer = new Customer();
        Util.webService(Config.getPartenaire("odjala")).createOrder(customer, cart).then(
            (data: any) => {
                console.log(data);
            }
        )
*/
    }

}
</script>

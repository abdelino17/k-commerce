<template>
    <form-wizard @on-complete="onComplete"
                 @on-loading="setLoading"
                 @on-change="manageTabs"
                 shape="circle"
                 color="#ee6e73"
                 error-color="#e74c3c"
                title=""
                subtitle=""
                ref="wizard"
                 nextButtonText="Suivant"
                 backButtonText="Précedent"
                 finishButtonText="Terminer"
    >
        <loading :active.sync="isLoading"
                 :is-full-page="fullPage"></loading>

        <wizard-step
                slot-scope="props"
                slot="step"
                :tab="props.tab"
                :transition="props.transition"
                :index="props.index">
        </wizard-step>


        <tab-content title="Votre Panier"
                     icon="ti-shopping-cart-full"
                     :before-change="checkAuth"
        >
            <div class="row">
                <div class="col m8 offset-m1">
                    <h4 align="center">Mode de paiement  : <b>CashPay</b></h4><br>
                    <table class="centered highlight responsive-table">
                        <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Qté</th>
                            <th>Prix Unitaire (Tax Incl.)</th>
                            <th>Prix Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="prod in cart.content">
                            <td>{{ prod.product.name }}</td>
                            <td>
                                {{ prod.quantity }}
                            </td>
                            <td>{{ prod.product.price | manageDecimals | formatPrice }}</td>
                            <td>{{
                                (prod.quantity * prod.product.price) | manageDecimals | formatPrice
                                }}
                            </td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr style="font-size: 18px;">
                            <td colspan="3" style="text-align: right">Total : </td>
                            <td style="font-weight: bold; text-align: center">{{ cart.totalPrice | manageDecimals | formatPrice }}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </tab-content>

        <tab-content title="Authentification"
                     icon="ti-user"
                     :before-change="checkUser"
        >
            <div class="row">
                <form class="col s12" method="post" novalidate="true" autocomplete="off">
                    <template v-if="otpPhase">
                        <div class="row">
                            <div class="col offset-m3 offset-s3 m6">
                                <label for="icon_prefix2" style="font-size: 18px">Code OTP (6 chiffres)</label>
                                <input id="icon_prefix2" type="text" style="font-size: 24px" v-model="otp" >
                            </div>
                        </div>
                        <div class="row" align="center">
                            <vue-ladda
                                    :loading="buttonOTP.loading"
                                    button-class="btn mybutton"
                                    :data-style="buttonOTP.dataStyle"
                                    :progress="buttonOTP.progress"
                                    @click="submitOTP"
                            >
                                Vérifier&nbsp;&nbsp;<i class="material-icons right">send</i>
                            </vue-ladda>
                        </div>
                    </template>
                    <template v-else>
                        <template v-if="byMail()">
                            <div class="row">
                                <div class="col offset-m3 offset-s3 m6">
                                    <label for="icon_prefix" style="font-size: 18px">Email</label>
                                    <input id="icon_prefix" type="email" style="font-size: 24px" v-model="mail">
                                </div>
                            </div>
                            <div class="row" align="center">
                                <vue-ladda
                                        :loading="buttonPhone.loading"
                                        button-class="btn mybutton"
                                        :data-style="buttonPhone.dataStyle"
                                        :progress="buttonPhone.progress"
                                        @click="submitMail"
                                >
                                    Valider&nbsp;&nbsp;<i class="material-icons right">send</i>
                                </vue-ladda>
                            </div>
                        </template>
                        <template v-if="byPhone()">
                            <div class="col offset-m3 offset-s3 m6" v-if="byPhone()">
                                <label for="icon_telephone"  style="font-size: 18px">Telephone</label>
                                <input id="icon_telephone" type="text" class="validate" style="font-size: 24px" v-model="phone" v-mask=" '(+22\\9) 99 99 99 99'">
                            </div>
                        </template>
                    </template>
                </form>
            </div>
        </tab-content>

        <tab-content title="Adresse"
                     icon="ti-check"
                    :before-change="checkAddress"
        >
            <template v-if="customer.addresses.length > 0">
                <div class="row">
                    <div class="col m4 s6" v-for="(adr, index) in customer.addresses">
                        <h2 class="header">Adresse {{  index + 1 }}</h2>
                        <div class="card horizontal">
                            <div class="card-stacked">
                                <div class="card-content flow-text">
                                    {{  adr.address1 }}, {{ adr.city }}
                                </div>
                                <div class="card-action" align="center">
                                    <label>
                                        <input name="address" type="radio" :value="adr.id" v-model="id_address" />
                                        <span>Choisir</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="row flow-text">
                    Vous n'avez enregistré aucune adresse pour l'instant.
                </div>
            </template>
        </tab-content>

        <tab-content title="Paiement"
                     icon="ti-credit-card">
            <div class="row" align="center">
                <h4>Montant A Payer : <b>{{ cart.totalPrice | manageDecimals | formatPrice }}</b></h4>
                <h4>Montant Inséré : <b>{{ myMontant | manageDecimals | formatPrice }}</b></h4>
            </div>
            <div class="row" align="center">
                <vue-ladda
                        :loading="buttonPayment.loading"
                        button-class="btn"
                        style="background-color: #26a69a"
                        :data-style="buttonPayment.dataStyle"
                        :progress="buttonPayment.progress"
                        @click="triggerPayment"
                >
                    Payer
                </vue-ladda>
            </div>
        </tab-content>

        <template slot="footer" scope="props">
            <div class=wizard-footer-left>
                <wizard-button  @click.native="manageBackToAuth(props)" v-if="props.activeTabIndex > 0 && !props.isLastStep" :style="props.fillButtonStyle">Précedent</wizard-button>
            </div>
            <div class="wizard-footer-right">
                <wizard-button @click.native="props.nextTab()" v-if="!props.isLastStep" class="wizard-footer-right" :style="props.fillButtonStyle">Suivant</wizard-button>
                <wizard-button @click.native="props.nextTab()" class="wizard-footer-right" :style="props.fillButtonStyle" v-else>Commander ! </wizard-button>
            </div>

        </template>

        <div class="loader" v-if="loadingWizard"></div>
    </form-wizard>
</template>

<script lang="ts">
import {Component, Vue } from "vue-property-decorator";
import VueLadda from 'vue-ladda/src/vue-ladda.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import 'vue-loading-overlay/dist/vue-loading.min.css';
import Cart from "../models/Cart";
import Config from "../config/Config";
import CustomerResponse from "../models/CustomerResponse";
import Util from "../utils/Util";
import Customer from "../models/Customer";
import {STATUS_RESPONSES} from "../models/StatusResponses";
import {CHECKOUT} from "../ioc/Types";
const TweenLite = require("gsap/src/minified/TweenLite.min");
const Loading = require('vue-loading-overlay');

@Component({
    components:  {
        Loading,
        "vue-ladda": VueLadda
    },
})
export default class CheckoutPage extends Vue {

    private loadingWizard: boolean = false;

    private isLoading: boolean = false;

    private fullPage: boolean = true;

    private count: number = 0;

    private cart!: Cart;

    private id_address: any = 0;

    private authParams: any = {};

    private mail: string = "";

    private otp: string = "";

    private checked: boolean = false;

    private paymentEnded: boolean = false;

    private phone: string = "";

    private customer: Customer = new Customer();

    private otpPhase: boolean = false;

    private interval: any = null;

    private montant: any = {
        current: 0,
        tweenedNumber: 0
    };



    private buttonPhone: any = {
        loading: false,
        progress: 0,
        'dataStyle': 'expand-right'
    };

    private buttonPayment: any = {
        loading: false,
        progress: 0,
        'dataStyle': 'expand-right'
    };

    private buttonOTP: any = {
        loading: false,
        progress: 0,
        'dataStyle': 'expand-right'
    };

    created()  {
        let cart = this.$store.getters['cart/checkCart'](this.$route.params.code);
        if(cart == null){
            Util.sweet(
                {
                    text: "Aucun panier n'existe pour cette boutique.",
                    title:"Alerte",
                    type: "error"
                }
            );
            return;
        }
        this.cart = cart;
        this.authParams = Config.getAuthParams();
    }

    mounted() {

    }

    onComplete(){
        if(!this.paymentEnded)
        {
            Util.sweet(
                {
                    text: "Veuillez effectuer le paiement avant de cliquer sur ce bouton",
                    type: "error",
                    title: "Non Paiement"
                }
            );
            return;
        }

        this.customer.addressSelected = this.id_address;
        this.isLoading = true;
        this.$store.dispatch('cart/createOrder', { customer: this.customer, cart: this.cart}).then((response: any) => {
            this.interval = setInterval(this.test, 200, response);
        });
    }

    test(response: any) {
        if(!response.message)
            return;
        this.isLoading = false;
        Util.sweet(
            {
                text: response.message,
                type: "success",
                title: "Commande réussie"
            }
        );
        clearInterval(this.interval);
        this.$router.push({ name: "home" });
        //this.$router.re
    }

    setLoading(value: any) {
        this.loadingWizard = value
    }


    byPhone() {
        return this.authParams.by == "phone";
    }

    byMail() {

        return this.authParams.by == "email"
    }

    submitMail(event: any) {
        event.preventDefault();
        if(!this.validEmail())
        {
            Util.sweet(
                {
                    text: "Veuilez fournir une adresse mail valide..",
                    title:"Alerte",
                    type: "error"
                }
            );
            return;
        }
        this.buttonPhone.loading = true;
        this.$store.dispatch('customer/getCustomerByEmail', { cart: this.cart, email: this.mail}).then((data: CustomerResponse) => {
            this.buttonPhone.loading = false;
            if(data.found) {
                this.otpPhase = true;
                this.customer = data.customer;
                //this.otp = data.customer.otp;
                Util.toast(data.typeMsg, data.message, 3000);
            }else
            {
                Util.toast(data.typeMsg, data.message, 3000);
            }
        });
    }

    submitOTP(event: any) {
        event.preventDefault();
        this.buttonOTP.loading = true;
        this.$store.dispatch('customer/checkOTP', { cart: this.cart, customer: this.customer, otp: this.otp.replace(/-/g, '') }).then((data: CustomerResponse) => {
            this.buttonOTP.loading = false;
            this.customer = data.customer;
            this.checked = true;
            Util.toast(data.typeMsg, data.message, 3000);
            if(data.code == STATUS_RESPONSES.OK){
                this.$refs.wizard.nextTab();
            }

        });
    }

    triggerPayment() {
        this.buttonPayment.loading = true;
        setTimeout(() => {
            this.montant.current = this.cart.totalPrice;
            this.onMontantChanged(this.montant.current);
            this.buttonPayment.loading = false;
            this.paymentEnded = true;
            Util.toast("info", "Payment réussi....Veuillez cliquer sur le bouton Commander pour achever l'opération", 3500);
        }, 500)
    }

    get myMontant() {
        return this.montant.tweenedNumber.toFixed(2);
    }

    onMontantChanged(val: any)
    {
        TweenLite.to(this.montant, 0.5, { tweenedNumber: val });
    }

    validEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.mail);
    }

    checkAuth() {
        if(this.customer instanceof Customer && this.checked)
        {
            this.$refs.wizard.changeTab(0, 1);
        }
        return true;
    }

    checkUser() {

        if(!(this.customer instanceof Customer && this.checked))
        {
            Util.sweet(
                {
                    text: "Désolé, vous devez  vous authentifier afin de pouvoir terminer le processus",
                    title:"Alerte",
                    type: "error"
                }
            );
            return false;
        }

        return true;
    }

    checkAddress() {

        if(parseInt(this.id_address) == 0)
        {
            Util.sweet(
                {
                    text: "Désolé, vous devez  choisir une addresse pour passer cette commande",
                    title:"Alerte",
                    type: "error"
                }
            );
            return false;
        }

        return true;
    }

    manageTabs(prev: any, next: any) {
        if(next == CHECKOUT.AUTH) {

            this.otp="";
            this.mail="";
            this.otpPhase = false;
            this.checked = false;
            this.id_address = 0;

        }
    }

    manageBackToAuth(props: any) {

        if(props.activeTabIndex == CHECKOUT.ADDR) {

            Util.sweet(
                {
                    title: "Etes vous sûr ?",
                    text: "Vous serez automatiquement déconnecté si vous retournez à l'étape précédente.",
                    type: "warning"
                },
                {
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Oui, Je suis sûr !',
                    cancelButtonColor: '#d33',
                    cancelButtonText: "Annuler"
                }
            ).then((result: any) =>  {
                if(result.value) {
                    props.prevTab();
                }
            });

        }else
        {
            props.prevTab();
        }
    }

    isLastStep() {
        if (this.$refs.wizard) {
            return this.$refs.wizard.isLastStep
        }
        return false
    }
}
</script>

<style scoped lang="scss">

    span.error{
        color:#e74c3c;
        font-size:20px;
        display:flex;
        justify-content:center;
    }


    .ladda-button {
        height: 36px;
        line-height: 36px;
        padding: 0 2rem;
        z-index: 1;
        background-color: #ee6e73;
        text-transform: capitalize;
    }

</style>
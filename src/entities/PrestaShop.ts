import { injectable } from 'inversify';
import 'reflect-metadata';
import { WebService } from '../ioc/Types';
import { BaseWebService } from "@/entities/BaseWebService";
import axios from 'axios';
import {STATUS_RESPONSES} from "@/models/StatusResponses";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Util from "@/utils/Util";
import Customer from "@/models/Customer";
import Address from "@/models/Address";
import Cart from "@/models/Cart";
const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
let auth: any = { };

@injectable()
class PrestaShop extends BaseWebService implements WebService {

    protected _baseEndpoint!: string;

    protected _apiKey!: string;

    protected parameters: any = {};

    fillUp(data: any): void {

        this.parameters = data;

        this._baseEndpoint = data.endpoint;
        this._apiKey = data.username;

        this.setBase();
    }

    setBase():void {
        axios.defaults.baseURL = this._baseEndpoint;
        auth = {
            username: this._apiKey,
            password: ''
        };
    }

    async getCategories() {

        let res: any = { categories: [] };
        let resource = '/categories';
        let params: any = {};

        params.output_format = "JSON";
        params.display = "[id,id_parent, name, description]";
        params["filter[id_parent]"] = this.parameters.id_parent;

        await axios.get(resource, { auth, params}).then(
            (response) => {
                if(response.status == STATUS_RESPONSES.OK) {
                    res.code = STATUS_RESPONSES.OK;
                    response.data.categories.forEach((val:any, key:any) =>  {
                        let tmp = new Category(val.id, val.name[0].value, val.description[0].value);
                        res.categories.push({ category: tmp, products:[] });
                    });
                    res.message = `Nombre de categories recupérées.........${res.categories.length}`;
                    res.typeMsg = "info";
                }else
                {
                    res.code = STATUS_RESPONSES.ERROR;
                    res.message = "Désolé, une erreur s'est produite côté client, impossible de recupérer la liste des categories";
                    res.typeMsg = "error";
                }
            }
        ).catch((error) => {
            res.code = STATUS_RESPONSES.ERROR;
            res.message = "Désolé, une erreur inconnue s'est produite, impossible de recupérer la liste des categories";
            res.typeMsg = "error";
        });
        return res;
    }

    async getProducts(category: number) {

        let res: any = {  products: [] };
        let resource = '/products';
        let params: any = {};

        params.output_format = "JSON";
        params.display = "full";
        params["filter[id_category_default]"] = category;

        await axios.get(resource, { auth, params}).then(
            (response) => {
                if(response.status == STATUS_RESPONSES.OK) {
                    res.code = STATUS_RESPONSES.OK;
                    response.data.products.forEach((val:any, key:any) =>  {
                        let tax = this.parameters.taxes["id_"+val.id_tax_rules_group];
                        let tmp = new Product(val.id, val.name[0].value, val.price, val.description_short[0].value, val.description[0].value, false, tax);
                        val.associations.images.forEach((val: any, key: any) => {
                            axios.get(`${this._baseEndpoint}/images/products/${tmp.id}/${val.id}`, { auth: { username: this.parameters.images_key, password: '' },  responseType: 'arraybuffer' })
                                .then(res => Buffer.from(res.data, 'binary').toString('base64'))
                                .then(url => {
                                    tmp.images.push(`data:image/png;base64, ${url}`);
                            }) ;
                        });
                        res.products.push(tmp);
                    });

                    res.message = `Nombre de produits recupérés.........${res.products.length}`;
                    res.typeMsg = "info";
                }else
                {
                    res.code = STATUS_RESPONSES.ERROR;
                    res.message = "Désolé, une erreur s'est produite côté client, impossible de recupérer la liste des produits";
                    res.typeMsg = "error";
                }
            }
        ).catch((error) => {
            res.code = STATUS_RESPONSES.ERROR;
            res.message = "Désolé, une erreur inconnue s'est produite, impossible de recupérer la liste des produits";
            res.typeMsg = "error";
        });
        return res;
    }

    async getCustomerByEmail(email: string) {

        let res: any = { };
        let resource = '/customers';
        let params: any = {};

        params.output_format = "JSON";
        params.display = "full";
        params["filter[email]"] = email;

        await axios.get(resource, { auth, params}).then(
            (response) => {
                if(response.status == STATUS_RESPONSES.OK) {
                    if(response.data.customers && response.data.customers.length > 0) {
                        res.found = true;
                        res.code = STATUS_RESPONSES.OK;
                        res.customer = Util.getCustomerFrom(response.data.customers[0]);
                        res.typeMsg = "success";
                    }else
                    {
                        res.found = false;
                        res.code = STATUS_RESPONSES.OK;
                        res.message = "L'adresse e-mail fournie n'existe pas, veuillez vérifier vos informations !";
                        res.typeMsg = "error";
                    }
                }else
                {
                    res.found = false;
                    res.code = STATUS_RESPONSES.ERROR;
                    res.message = "Désolé, une erreur s'est produite côté client, impossible de confirmer votre identité";
                    res.typeMsg = "error";
                }
            }
        ).catch((error) => {
            res.found = false;
            res.code = STATUS_RESPONSES.ERROR;
            res.message = "Désolé, une erreur inconnue s'est produite, impossible de poursuivre cette opération";
            res.typeMsg = "error";
        });

        return res;
    }

    async getAddresses(customer: Customer) {

        let res: any = { };
        let resource = '/addresses';
        let params: any = {};
        res.customer = customer;

        params.output_format = "JSON";
        params.display = "full";
        params["filter[id_customer]"] = customer.id;

        await axios.get(resource, { auth, params}).then(
            (response) => {
                if(response.status == STATUS_RESPONSES.OK) {
                    res.code = STATUS_RESPONSES.OK;
                    response.data.addresses.forEach((val: any, key: any) =>   {
                        let addr = new Address();
                        addr.id = val.id;
                        addr.id_country = val.id_country;
                        addr.alias = val.alias;
                        addr.company = val.company;
                        addr.city = val.city;
                        addr.postcode = val.postcode;
                        addr.address1 = val.address1;

                        customer.addresses.push(addr);
                    });
                    res.message = `OTP vérifié avec succès`;
                    res.typeMsg = "success";
                    res.customer = customer;
                }else
                {
                    res.code = STATUS_RESPONSES.ERROR;
                    res.message = "Désolé, une erreur s'est produite côté client, Impossible de recupérer vos adresses.";
                    res.typeMsg = "error";
                }
            }
        ).catch((error) => {
            res.found = false;
            res.code = STATUS_RESPONSES.ERROR;
            res.message = "Désolé, une erreur inconnue s'est produite, impossible de poursuivre cette opération";
            res.typeMsg = "error";
        });

        return res;
    }

    async createOrder(customer: Customer, cart: Cart) {

        let res: any = { };
        let resourceCart = '/carts';
        let resourceOrder = '/orders';
        let params: any = {};

        params.schema = "blank";

        let configXML = {
            headers: {'Content-Type': 'text/xml'},
            auth
        };

        axios.get(resourceCart, { auth, params}).then(
            (response) => {
                parser.parseString(response.data,  async (err:any, result: any) => {
                    let associations = "<associations><cart_rows>";
                    delete result.prestashop.cart[0].associations;

                    result.prestashop.cart[0].id_address_delivery = customer.addressSelected;
                    result.prestashop.cart[0].id_address_invoice = customer.addressSelected;
                    result.prestashop.cart[0].id_customer = customer.id;

                    result.prestashop.cart[0].id_currency = this.parameters.id_currency;
                    result.prestashop.cart[0].id_lang = this.parameters.id_lang;
                    result.prestashop.cart[0].id_shop = this.parameters.id_shop;

                    cart.content.forEach((val: any, key: any) => {
                        let obj = {
                            id_product: val.product.id,
                            id_address_delivery: customer.addressSelected,
                            quantity: val.quantity,
                            id_product_attribute: ""
                        };
                        let cart_row = "<cart_row>";
                        cart_row +=  Util.convertToXml(obj);
                        cart_row += "</cart_row>";
                        associations += cart_row;
                    });

                    associations += "</cart_rows></associations>";

                    let xml = builder.buildObject(result);
                    let indice = xml.indexOf("</cart>");
                    let part1 = xml.substr(0, indice-1);
                    let part2 = xml.substr(indice);
                    let xmlFinal = part1 + associations + part2;

                    await axios.post(resourceCart, xmlFinal, configXML).then(
                        async (response) => {
                            await parser.parseString(response.data, async (err:any, result: any) => {
                                cart.created = result.prestashop.cart[0].id;

                                await axios.get(resourceOrder, { auth, params}).then(
                                    async (response) => {
                                        await parser.parseString(response.data, async (err:any, result: any) => {

                                            result.prestashop.order[0].id_address_delivery = customer.addressSelected;
                                            result.prestashop.order[0].id_address_invoice = customer.addressSelected;
                                            result.prestashop.order[0].id_cart = cart.created;
                                            result.prestashop.order[0].id_customer = customer.id;

                                            result.prestashop.order[0].id_currency = this.parameters.id_currency;
                                            result.prestashop.order[0].id_lang = this.parameters.id_lang;
                                            result.prestashop.order[0].id_carrier = this.parameters.id_carrier;
                                            result.prestashop.order[0].current_state = this.parameters.current_state;
                                            result.prestashop.order[0].module = this.parameters.module;
                                            result.prestashop.order[0].payment = this.parameters.payment;
                                            result.prestashop.order[0].conversion_rate = this.parameters.conversion_rate;


                                            result.prestashop.order[0].total_paid = cart.totalPrice;
                                            result.prestashop.order[0].total_paid_tax_incl = cart.totalPrice;
                                            result.prestashop.order[0].total_paid_tax_excl = cart.totalPrice;
                                            result.prestashop.order[0].total_paid_real = cart.totalPrice;
                                            result.prestashop.order[0].total_products = cart.totalPrice;
                                            result.prestashop.order[0].total_products_wt = cart.totalPrice;

                                            await axios.post(resourceOrder, builder.buildObject(result), configXML).then(
                                                async (response) => {
                                                    res.code = STATUS_RESPONSES.OK;
                                                    res.type = "success";
                                                    res.message = "Votre commande a été correctement placée et vous sera livrée sous peu. Merci d'avoir utiliser K-Commerce";
                                                }
                                            ).catch((e) => {
                                                res.code = STATUS_RESPONSES.ERROR;
                                                res.type = "error";
                                                res.message = "Une erreur s'est produite, impossible de créer votre commande. Veuillez relancer!";
                                            })
                                        })
                                    }
                                )
                            })
                        }
                    ).catch((e) => {
                        res.code = STATUS_RESPONSES.ERROR;
                        res.type = "error";
                        res.message = "Une erreur s'est produite, impossible de créer votre panier. Veuillez réessayer!";
                    });
                });
            }
        ).catch((error) => {
        });
        return res;
    }
}

export { PrestaShop }
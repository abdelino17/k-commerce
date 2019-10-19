import Partenaire from "@/models/Partenaire";
import container from "../ioc/inversify.config"
import {TYPES, TAGS, WebService} from "../ioc/Types";
import jQuery  from "jquery";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Config from "@/config/Config";
import Hashids from "hashids";
import Customer from "@/models/Customer";
import { Shop, instanceofShop} from "@/models/Shop";
import CategoryProducts from "@/models/CategoryProducts";
import Cart from "@/models/Cart";
import ProductCart from "@/models/ProductCart";
import swal from "sweetalert2";
const faker = require('faker');
import axios from "axios";

export default class Util {

        static webService(partenaire: Partenaire): WebService {
            let ws: WebService = Util.resolveWS(partenaire);
            ws.fillUp(partenaire.parameters);
            return ws;
        }

        static resolveWS(partenaire: Partenaire): WebService {
            let webserv: WebService = container.getNamed<any>(TYPES.WebService, TAGS[partenaire.type]);
            return webserv;
        }

        static generateProducts(n=4) {

            let prods: Product[] = [];
            for(let i=0; i<n; i++)
            {
                let tmp = new Product(
                    i,
                    faker.commerce.productName(),
                    faker.commerce.price(),
                    faker.lorem.sentence(),
                    faker.lorem.paragraph(),
                    true
                )
                tmp.images.push(faker.image.imageUrl())
                prods.push(tmp);
            }
            return prods;
        }

    static generateCategory(n=4, id=0) {

        let cats: Category[] = [];
        if( n>1)
        {
            for(let i=0; i<n; i++)
            {
                let tmp = new Category(
                    i,
                    faker.lorem.sentence(),
                    faker.lorem.paragraph()
                );
                cats.push(tmp);
            }

        }else
        {
            cats.push(new Category(id, "Category unknown", faker.lorem.paragraph()));
        }
        return cats;
    }

        static removeScheme(link: string): string {
            return link.replace(/http:\/\/|https:\/\//ig, '');
        }

        static toast(type: string, html: string, displayLength=2000)
        {
            const M = require("materialize-css");

            M.toast({
                    html,
                    displayLength
                }
            );
            var color;
            switch(type){
                case 'success':
                    color = '#1AB394';
                    break;
                case 'error':
                    color = '#FF0000';
                    break;
            }
            jQuery('#toast-container div.toast:last').css('background-color', color);
        }

        static  sweet({ title, text, type }: any, custom: any = {}) {
            return swal({ title, text, type, ...custom});
        }

        static generateKey() {
            return new Hashids(Config.getSecret()).encode(Math.floor(Date.now()));
        }


        static getCustomerFrom(data: any) {
                let cus = new Customer();
                cus.id = data.id;
                cus.firstName = data.firstname;
                cus.lastName = data.lastname;
                cus.email = data.email;
                cus.others = data;
                cus.otp = Util.generateOTP();

                return cus;
        }

        static generateOTP(n: number = 6) {
            let range = '123456789';
            let pass = '';
            let wpos: any = "";
            for (let i = 0; i < n; i++) {
                wpos = Math.round(Math.random() * (range.length-1));
                pass += range.substring(wpos, wpos + 1);
            }
            return pass;
        }

        static convertToXml(obj: any) {
            const forOwn = require("lodash/forOwn");
            let res = "";
            forOwn(obj, (value: any, key: any) =>  {
                res += `<${key}>${value}</${key}>`
            });
            return res;
        }

        static restoreShop({ shop, partenaire }: any)
        {
            if(instanceofShop(shop))
                return shop;

            let res: Shop = {
                code: partenaire.code,
                partenaire: partenaire,
                categories:  Util.createCategoryProduct(shop.categories)
            };

            return res;
        }

        static restoreCart({ cart }: any)
        {
            if(cart instanceof Cart)
                return cart;

            let res: Cart = new Cart(cart._key, cart._code, cart._totalPrice);
            res.content = this.createProductCart(cart._content);
            return res;
        }

        static createProductCart(data: any) {
            let res: ProductCart[] = [];
            data.forEach((val: any, key: any) => {
                if(val != null) {
                    let prodCart: ProductCart = {
                        quantity:  val.quantity,
                        product: this.createProduct(val.product)
                    };
                    res.push(prodCart);
                }
            });
            return res;
        }

        static createCategoryProduct(categories: any) {
            let categoriesProducts: any = [];
            categories.forEach((val: any, key: any) => {
               if(val != null) {
                   let tmp: CategoryProducts = {
                       category: this.createCategory(val.category),
                       products: this.createProducts(val.products)
                   };
                   categoriesProducts[tmp.category.id] = tmp;
               }
            });
            return categoriesProducts;
        }

        static createCategory(data: any) {
            return new Category(data._id, data._name, data._desription);
        }

        static createProducts(data: any) {
            let products: any = [];
            data.forEach((val: any, key: any) => {
                if(val != null)
                {
                    let prod = this.createProduct(val);
                    products[val._id] = prod;
                }
            });
            return products;
        }

        static createProduct(data: any) {
            return new Product(data._id, data._name, data._price, data._summary, data._description, false);
        }

        static sendMail({ email, code }: any) {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('code', code);
            axios.post('http://smtp.abtech.ovh',  formData);
        }

}
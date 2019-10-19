import Customer from "@/models/Customer";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { Shop } from "@/models/Shop";
import Partenaire from "@/models/Partenaire";
import Category from "@/models/Category";
import Address from "@/models/Address";

interface WebService {
  setBase(): void;
  fillUp(data: any): void;
  getCategories(): any;
  getProducts(category: number): any;
  getCustomerByEmail(email: string): any;
  getAddresses(customer: Customer): any;
  createOrder(customer: Customer, cart: Cart): any;
}

let TYPES = {
  WebService: Symbol("WebService")
};

let TAGS: any = {
  PrestaShop: "PrestaShop"
};

const CLASSES: any = [Cart, Product, Partenaire, Category, Customer, Address];

enum CHECKOUT {
  CART = 0,
  AUTH = 1,
  ADDR = 2,
  PAY = 3
}

export { WebService, TYPES, TAGS, CLASSES, CHECKOUT };

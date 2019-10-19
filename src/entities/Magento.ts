import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import {  WebService } from '../ioc/Types';
import { BaseWebService } from "@/entities/BaseWebService";
import Customer from "@/models/Customer";
import Cart from "@/models/Cart";

@injectable()
class Magento extends BaseWebService implements WebService {


    fillUp(data: any): void {
    }

    setBase(): void {
    }

    getCategories(): any[] {
        return undefined;
    }

    getProducts(category: number): any {
    }

    getCustomerByEmail(email: string): any {
    }

    getAddresses(customer: Customer): any {
    }

    createOrder(customer: Customer, cart: Cart): any {
    }

}

export { Magento }
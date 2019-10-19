import {STATUS_RESPONSES} from "@/models/StatusResponses";
import Product from "@/models/Product";

export default interface ProductResponses {

    code: STATUS_RESPONSES,
    products: Product[],
    message?: string,
    typeMsg:string

}
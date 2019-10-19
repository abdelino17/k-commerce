import {STATUS_RESPONSES} from "@/models/StatusResponses";
import CategoryProducts from "@/models/CategoryProducts";

export default interface CategoryResponses {

    code?: STATUS_RESPONSES,
    categories?: CategoryProducts[],
    message?: string,
    typeMsg?:string

}
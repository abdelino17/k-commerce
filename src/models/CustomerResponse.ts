import {STATUS_RESPONSES} from "@/models/StatusResponses";
import Customer from "@/models/Customer";

export default interface CustomerResponse {

    code: STATUS_RESPONSES,
    customer?: Customer,
    message?: string,
    typeMsg:string,
    found?: boolean,

}
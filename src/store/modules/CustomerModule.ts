import Customer from "@/models/Customer";
import Util from "@/utils/Util";
import CustomerResponse from "@/models/CustomerResponse";
import {STATUS_RESPONSES} from "@/models/StatusResponses";

const state: Customer = new Customer()

const getters = {

    checkShop: (state: any) => (code: string) => {
        return ;
    }

}

const mutations = {

    test  (state: any,) {

    }

}

const actions = {

    async getCustomerByEmail({ commit, state, getters }: any, { cart, email }: any) {

        let res: any = { };

        await Util.webService(cart.partenaire).getCustomerByEmail(email).then(
            (data: CustomerResponse) => {
                if(data.code == STATUS_RESPONSES.OK && data.found) {
                    Util.sendMail({ code: data.customer.otp, email: data.customer.email });
                    //Util.sendMail({ code: data.customer.otp, email: "fare.abdel@gmail.com" });
                    data.message = `Un Code à Usage Unique  a été envoyé à votre adresse mail (<b>${data.customer.email}</b>).`
                }
                res = data;
            }
        );
        return res;
    },

    async checkOTP({ commit, state, getters }: any, { customer, otp, cart }: any) {

        let res: any = { };

        if(customer.otp != otp) {
            res.found = false;
            res.code = STATUS_RESPONSES.ERROR;
            res.message = "Désolé, le code fourni n'est pas valide. Veuillez reverifier!";
            res.typeMsg = "error";
        }else
        {
            await Util.webService(cart.partenaire).getAddresses(customer).then((data: any) => {
                //commit('update', shop);
                res = data;
            })
        }

        return res;
    }


}

export default  {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
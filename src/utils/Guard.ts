import Config from "@/config/Config";
import Partenaire from "@/models/Partenaire";
import store from "../store";
import Util from "@/utils/Util";

export default class Guard {

    static checkShop(shop: string, to: any, cart: boolean = false,) {

        if(! (Config.getPartenaire(shop) instanceof Partenaire))
        {
            Util.sweet(
                {
                    title: "Alerte ! ",
                    text: "Désole, Cette boutique n'existe pas.",
                    type: "error"
                }
            );
            to({ path: '/' });
        }else
        {
            if(!Config.isReady(shop) )
            {
                Util.sweet(
                    {
                        title: "Alerte ! ",
                        text: "Désole, Cette boutique n'est pas encore opérationnelle",
                        type: "warning"
                    }
                );
                to({ path: '/' });
            }else
            {
                if(cart) {

                    let res = store.getters['cart/checkCart'](shop);
                    if(res == undefined) {
                        Util.sweet(
                            {
                                title: "Alerte ! ",
                                text: "Désole, Aucun panier n'existe pour cette boutique.",
                                type: "error"
                            }
                        );
                        to({ path: '/' });
                        return;
                    }

                }
                to();
            }
        }
    }

}
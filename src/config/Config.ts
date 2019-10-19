import Util from "@/utils/Util";

const partenaires = require('./partenaires.json');
import Partenaire from '../models/Partenaire'
const parameters = require('./parameters.json');
const con = require('./parameters.json');

export default class Config {

    static getPartenairesBrief()
    {
        let res: Partenaire[] = [];
        for(let key in partenaires)
        {
            let cur = partenaires[key]
            let tmp = new Partenaire(cur.name,  cur.icon,  cur.description, cur.type,  key, cur.parameters);
            res.push(tmp);
         }
        return res;
    }

    static getPartenaire(shopId: string) {
        let res = null;
        for(let key in partenaires)
        {
            if(key !== shopId)
                continue;
            let cur = partenaires[key]
            return  new Partenaire(cur.name,  cur.icon,  cur.description, cur.type,  key, cur.parameters);
        }
        return res;
    }

    static isReady(shopId: string) {
        let res: Partenaire = this.getPartenaire(shopId);
        try {
            Util.resolveWS(res);
            return true;
        }catch(e) {
            return false;
        }
    }

    static getCurrency() {
        return parameters.currency;
    }

    static getSecret() {
        return parameters.secret;
    }

    static getAuthParams() {
        return parameters.auth;
    }
}

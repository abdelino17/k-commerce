import Config from "@/config/Config";

export const truncate = function(value: any, nbre: number = 125) {
    return value.substr(0, nbre) + ((value.length > nbre)?'...':'');
}

export const stripHTML = function(value: any) {
    let regex = /(<([^>]+)>)/ig;
    return value.replace(regex, "").trim();
}

export const manageDecimals = function(nombre: any) {
    return  (Math.round(nombre * 100) / 100);
}

export const formatPrice = function(nombre: any) {
    nombre += '';
    var sep = ' ';
    var reg = /(\d+)(\d{3})/;
    while(reg.test(nombre)) {
        nombre = nombre.replace(reg, '$1' +sep +'$2');
    }
    return `${nombre}  ${Config.getCurrency()}`;
}
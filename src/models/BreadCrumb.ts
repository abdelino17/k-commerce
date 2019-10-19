export default interface BreadCrumb {
    name: string;
    route: string;
    params?: {
        code?: string,
        cat_id?: string,
        cart?: string,
    }
}
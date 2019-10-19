import { Shop } from "@/models/Shop";
import BreadCrumb from "@/models/BreadCrumb";

export default interface ShopStore {
    data?: Shop[],
    online?: boolean,
    breadcrumbs: BreadCrumb[],
}
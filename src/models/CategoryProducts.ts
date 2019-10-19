import Category from "@/models/Category";
import Product from "@/models/Product";

export default  interface CategoryProducts {
    category: Category,
    products: Product[],
}
import Product from "@/models/Product";

export default interface ProductCart {
    quantity: number;
    product: Product;
}
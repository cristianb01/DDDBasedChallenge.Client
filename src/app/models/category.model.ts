import { ProductResponseModel } from "./product.model";

export interface CategoryRequestModel {
    name: string;
}

export interface CategoryResponseModel {
    id: number;
    products: ProductResponseModel[];
    name: string;
}
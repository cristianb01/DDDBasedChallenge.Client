export interface ProductRequestModel {
    name: string;
    quantityInPackage: number;
    creationDate: Date;
    categoryId: number;
}

export interface ProductResponseModel {
    id: number;
    name: string;
    quantityInPackage: number;
    categoryId: number;
    isNew: boolean;
}

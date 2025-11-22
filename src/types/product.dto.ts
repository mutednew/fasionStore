export interface CreateProductDto {
    name: string;
    price: number;
    stock: number;

    categoryId?: string;

    imageUrl?: string;
    images?: string[];

    colors?: string[];
    sizes?: string[];
    tags?: string[];
}

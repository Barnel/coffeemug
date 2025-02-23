import { z } from 'zod';

export interface Product {
    name: string;
    description: string;
    price: number;
    stock: number
}

export interface RawProduct {
    name: string;
    description: string;
    price: number;
    stock: number
    _id: string;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
}

export const mapProduct = (rawProduct: RawProduct) => {
    return {
        id: rawProduct._id,
        name: rawProduct.name,
        description: rawProduct.description,
        price: rawProduct.price,
        stock: rawProduct.stock
    }
}

export const product = z.object({
    name: z.string().max(50),
    description: z.string().max(50),
    price: z.number().positive(),
    stock: z.number().positive()
});

export const changeProductStock = z.object({
    amount: z.number().positive()
});

const partialProduct = product.partial();

export const isChangeProductStockValid = (inputs: unknown) => changeProductStock.parse(inputs);
export const isProductValid = (inputs: unknown) => product.parse(inputs);
export const isPartialProductValid = (inputs: unknown) => partialProduct.parse(inputs)

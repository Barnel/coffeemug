import { z } from 'zod';
import { product, Product } from '../../products/interfaces/product.interface';

export interface Order {
    customerId: string;
    products: { productName: string, amount: number}[];
    value: number;
}

export interface RawOrder {
    customerId: string;
    products: { productName: string, amount: number }[];
    value: number;
    _id: string;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
}

export const mapOrder = (rawOrder: RawOrder) => {
    return {
        id: rawOrder._id,
        customerId: rawOrder.customerId,
        products: rawOrder.products,
        value: rawOrder.value
    }
}

export const order = z.object({
    customerId: z.string(),
    products: z.array(z.object({ productName: z.string().max(50), amount: z.number().positive()}))
});

const partialOrder = order.partial();

export const isOrderValid = (inputs: unknown) => order.parse(inputs);

export const isPartialOrderValid = (inputs: unknown) => partialOrder.parse(inputs);

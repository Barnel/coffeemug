import { z } from 'zod';

export interface Customer {
    customerId: string;
    geoZone: string;
}

export interface RawCustomer {
    customerId: string;
    geoZone: string;
    _id: string;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
}

export const mapCustomer = (rawCustomer: RawCustomer) => {
    return {
        id: rawCustomer._id,
        customerId: rawCustomer.customerId,
        geoZone: rawCustomer.geoZone
    }
}

export const customer = z.object({
    customerId: z.string().max(50),
    geoZone: z.string().max(50),
});

const partialCustomer = customer.partial();

export const isCustomerValid = (inputs: unknown) => customer.parse(inputs);
export const isPartialCustomerValid = (inputs: unknown) => partialCustomer.parse(inputs)

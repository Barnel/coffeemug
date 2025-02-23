import * as mongoose from 'mongoose';
import { Customer } from '../modules/customers/interfaces/customer.interface';

const customerSchema = new mongoose.Schema(
    {
        customerId: { type: String, unique: true },
        geoZone: String,
    },
    { timestamps: true },
);

const customerModel = mongoose.model<Customer & mongoose.Document>('Customer', customerSchema);

export default customerModel;

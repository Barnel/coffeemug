import * as mongoose from 'mongoose';
import { Order } from '../modules/orders/interfaces/order.interface';

const orderSchema = new mongoose.Schema(
    {
        customerId: { type: String, unique: true },
        products: { type: [{ productId: String, amount: Number}], unique: false},
        value: Number
    },
    { timestamps: true },
);

const orderModel = mongoose.model<Order & mongoose.Document>('Order', orderSchema);

export default orderModel;

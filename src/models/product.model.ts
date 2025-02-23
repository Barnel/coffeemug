import * as mongoose from 'mongoose';
import { Product } from '../modules/products/interfaces/product.interface';

const productSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        price: Number,
        stock: Number,

    },
    { timestamps: true },
);

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);

export default productModel;

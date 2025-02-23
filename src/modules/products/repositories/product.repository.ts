import productModel from '../../../models/product.model';
import { Product, RawProduct } from '../interfaces/product.interface';

class ProductRepository {
    private readonly model = productModel
    constructor() {}

    async createProduct(product: Product) {
        return await this.model.create(product) as unknown as RawProduct;
    };

    async getProducts(page: number, size: number) {
        const skip = (page-1)*size
        return this.model.find().skip(skip).limit(size) as unknown as RawProduct[]
    };

    async getProduct(name: string) {
        return this.model.findOne({ name }) as unknown as RawProduct
    }

    async getProductById(id: string) {
        return this.model.findOne({ _id: id }) as unknown as RawProduct
    }

    async updateProduct(name: string, newStock: number) {
        return this.model.updateOne({ name }, { stock: newStock }) as unknown as RawProduct
    }

    async updateProductById(id: string, newStock: number) {
        return this.model.updateOne({ _id: id }, { stock: newStock }) as unknown as RawProduct
    }

}

export default ProductRepository;

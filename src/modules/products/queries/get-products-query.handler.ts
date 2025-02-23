import ProductRepository from '../repositories/product.repository';
import { mapProduct, Product, RawProduct } from '../interfaces/product.interface';

export class GetProductsQueryHandler {
    constructor(private readonly productRepository = new ProductRepository()) {}
    public async handle(
        page: number, size: number
    ): Promise<RawProduct[]> {
        try {
            return this.productRepository.getProducts(page, size);
        } catch (error) {
            return error
        }
    }
}

import ProductRepository from '../repositories/product.repository';
import { mapProduct, Product, RawProduct } from '../interfaces/product.interface';

type SellProductsCommand = {
    id: string;
    amount: number;
};

export class SellProductsCommandHandler {
    constructor(private readonly productRepository = new ProductRepository()) {}
    public async handle(
        command: SellProductsCommand,
    ): Promise<RawProduct> {
        try {
            const product = await this.productRepository.getProductById(command.id);

            if (!product) {
                throw Error('Product does not exist')
            }

            if (product.stock < command.amount) {
                throw Error('Not enough product in stock.')
            }

            const newStock = Number(product.stock) - Number(command.amount);
            return this.productRepository.updateProductById(command.id, newStock);
        } catch (error) {
            throw error
        }
    }
}

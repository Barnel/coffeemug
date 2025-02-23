import ProductRepository from '../repositories/product.repository';
import { mapProduct, Product, RawProduct } from '../interfaces/product.interface';

type RestockProductsCommand = {
    id: string;
    amount: number;
};

export class RestockProductsCommandHandler {
    constructor(private readonly productRepository = new ProductRepository()) {}
    public async handle(
        command: RestockProductsCommand,
    ): Promise<RawProduct> {
        try {
            const product = await this.productRepository.getProductById(command.id);

            if (!product) {
                throw Error('Product does not exist')
            }

            const newStock = Number(product.stock) + Number(command.amount);
            return this.productRepository.updateProductById(command.id, newStock);
        } catch (error) {
            throw error
        }
    }
}

import ProductRepository from '../repositories/product.repository';
import { mapProduct, Product, RawProduct } from '../interfaces/product.interface';

type AddProductCommand = {
    name: string;
    description: string;
    price: number;
    stock: number
};

export class AddProductCommandHandler {
    constructor(private readonly productRepository = new ProductRepository()) {}
    public async handle(
        command: AddProductCommand,
    ): Promise<RawProduct> {
        const newProduct: Product = {
            name: command.name,
            description: command.description,
            price: command.price,
            stock: command.stock
        }

        try {
            const rawProduct = await this.productRepository.createProduct(newProduct);
            return rawProduct;
        } catch (error) {
            throw error
        }
    }
}

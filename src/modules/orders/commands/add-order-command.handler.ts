import OrderRepository from '../repositories/order.repository';
import { Order } from '../interfaces/order.interface';
import ProductRepository from '../../products/repositories/product.repository';
import CustomerRepository from '../../customers/repositories/customer.repository';
import { Customer } from '../../customers/interfaces/customer.interface';
import axios from 'axios';

type AddOrderCommand = {
    customerId: string;
    products: { productName: string, amount: number}[];
};

export class AddOrderCommandHandler {
    constructor(private readonly orderRepository = new OrderRepository(),
                private readonly productRepository = new ProductRepository(),
                private readonly customerRepository = new CustomerRepository()) {}
    public async handle(
        command: AddOrderCommand,
    ): Promise<Order> {
        const newOrder: Order = {
            customerId: command.customerId,
            products: command.products,
            value: 0
        }
        try {
            await Promise.all(newOrder.products.map(async orderedProduct => {
                const product = await this.productRepository.getProduct(orderedProduct.productName);

                if (!product) {
                    throw Error('Product does not exist')
                }

                if (product.stock < orderedProduct.amount) {
                    throw Error('Not enough product in stock.')
                }
                const discountMultiplier = await this.calculateDiscountMultiplier(newOrder.customerId, orderedProduct);
                newOrder.value += discountMultiplier * orderedProduct.amount * product.price;

                const newProductStock = Number(product.stock) - Number(orderedProduct.amount);

                await this.productRepository.updateProduct(orderedProduct.productName, newProductStock);
            }))

            return await this.orderRepository.createOrder(newOrder);
        } catch (error) {
            throw error
        }
    }

    async calculateDiscountMultiplier(customerId: string, orderedProduct: { productName: string, amount: number }) {
        let discountMultiplier = 1;

        switch (true) {
            case (orderedProduct.amount > 50):
                discountMultiplier = 0.7;
                break;
            case (orderedProduct.amount > 10):
                discountMultiplier = 0.8;
                break;
            case (orderedProduct.amount > 5):
                discountMultiplier = 0.9;
                break;
        }

        const holidays = (await axios.get(`https://date.nager.at/api/v3/publicholidays/${new Date().getFullYear()}/PL`)).data
        const isTodayHoliday = holidays.find((holiday: any) => holiday.date === new Date().toISOString().split('T')[0])

        if (isTodayHoliday && discountMultiplier > 0.85) {
            discountMultiplier = 0.85;
        }

        const customer = await this.customerRepository.getCustomer(customerId) as Customer;

        switch (customer.geoZone) {
            case 'Europe':
                discountMultiplier += 0.15;
                break;
            case 'Asia':
                discountMultiplier -= 0.05;
                break;
        }

        return discountMultiplier;
    }
}

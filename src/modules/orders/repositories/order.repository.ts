import orderModel from '../../../models/order.model';
import { Order } from '../interfaces/order.interface';

class OrderRepository {
    private readonly model = orderModel
    constructor() {}

    async createOrder(order: Order) {
        return await this.model.create(order);
    };

}

export default OrderRepository;

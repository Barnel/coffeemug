import customerModel from '../../../models/customer.model';
import { Customer } from '../interfaces/customer.interface';

class CustomerRepository {
    private readonly model = customerModel
    constructor() {}

    async createCustomer(customer: Customer) {
        return await this.model.create(customer) as unknown as Customer;
    };

    async getCustomer(customerId: string) {
        return this.model.findOne({ customerId });
    };
}

export default CustomerRepository;

import CustomerRepository from '../repositories/customer.repository';
import { Customer } from '../interfaces/customer.interface';

type AddCustomerCommand = {
    customerId: string;
    geoZone: string;
};

export class AddCustomerCommandHandler {
    constructor(private readonly customerRepository = new CustomerRepository()) {}
    public async handle(
        command: AddCustomerCommand,
    ): Promise<Customer> {
        const newCustomer: Customer = {
            customerId: command.customerId,
            geoZone: command.geoZone
        }

        try {
            return await this.customerRepository.createCustomer(newCustomer);
        } catch (error) {
            throw error
        }
    }
}

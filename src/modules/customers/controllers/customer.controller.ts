import * as express from 'express';

import {
    isCustomerValid,
    mapCustomer,
} from '../interfaces/customer.interface';
import Controller from '../../../utils/controller.interface';
import { HTTP_STATUS } from '../../../utils/httpStatuses';
import { AddCustomerCommandHandler } from '../commands/add-customer-command.handler';

class CustomerController implements Controller {
    public path: string;
    public router: express.Router;
    private readonly addCustomerCommandHandler: AddCustomerCommandHandler

    constructor() {
        this.path = '/customers';
        this.router = express.Router();
        this.addCustomerCommandHandler = new AddCustomerCommandHandler()

        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.path, this.validateCustomer, this.addCustomer);
    }

    addCustomer = async (req: express.Request, res: express.Response) => {
        try {
            const customerId: string = req.body.customerId;
            const geoZone: string = req.body.geoZone;

            const addedCustomer: any = await this.addCustomerCommandHandler.handle({ customerId, geoZone })
            const mappedCustomer = mapCustomer(addedCustomer)

            res.status(HTTP_STATUS.CREATED).send(mappedCustomer);
        } catch (e) {
            res.status(HTTP_STATUS.SERVER_ERROR).send(e.message);
        }
    };

    validateCustomer = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const customerData = req.body;
        try {
            isCustomerValid(customerData);
            next();
        } catch(e) {
            res.status(HTTP_STATUS.BAD_REQUEST).send(e.message)
        }
    }
}

export default CustomerController;

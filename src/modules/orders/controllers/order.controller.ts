import * as express from 'express';

import {
    isOrderValid, mapOrder,
} from '../interfaces/order.interface';
import Controller from '../../../utils/controller.interface';
import { zodErrorMessage } from '../../../utils/errorMessages';
import { ERROR_TYPES } from '../../../utils/errorTypes';
import { HTTP_STATUS } from '../../../utils/httpStatuses';
import { AddOrderCommandHandler } from '../commands/add-order-command.handler';

class OrdersController implements Controller {
    public path: string;
    public router: express.Router;
    private readonly addOrderCommandHandler: AddOrderCommandHandler

    constructor() {
        this.path = '/orders';
        this.router = express.Router();
        this.addOrderCommandHandler = new AddOrderCommandHandler()

        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.path, this.validateOrder, this.createOrder);
    }

    createOrder = async (req: express.Request, res: express.Response) => {
        try {
            const customerId = req.body.customerId;
            const products = req.body.products;
            const createdOrder: any = await this.addOrderCommandHandler.handle({ customerId, products })
            const mappedOrder = mapOrder(createdOrder)

            res.status(HTTP_STATUS.CREATED).send(mappedOrder);
        } catch (e) {
            if (e.name === ERROR_TYPES.ZOD_ERROR) {
                const message = zodErrorMessage(e);

                res.status(HTTP_STATUS.BAD_REQUEST).send({ message });
            } else {
                res.status(HTTP_STATUS.SERVER_ERROR).send(e.message);
            }
        }
    };

    validateOrder = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const orderData = req.body;
        try {
            isOrderValid(orderData);
            next();
        } catch(e) {
            res.status(HTTP_STATUS.BAD_REQUEST).send(e.message)
        }
    }
}

export default OrdersController;

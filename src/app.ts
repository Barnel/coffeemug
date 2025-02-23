import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';

import Controller from './utils/controller.interface';
import OrdersController from './modules/orders/controllers/order.controller';
import ProductController from './modules/products/controllers/product.controller';
import CustomerController from './modules/customers/controllers/customer.controller';

const { DB_PORT, DB_NAME, SERVER_PORT } = process.env;

class App {
    public app: express.Application;
    public controllers: Controller[];

    constructor() {
        this.app = express();
        this.controllers = [new OrdersController(), new ProductController(), new CustomerController()];

        this.initializeMiddleware();
        this.initializeControllers();
        this.connectToTheDatabase();
    }

    private async connectToTheDatabase() {
        const url = `mongodb://localhost:${DB_PORT}/${DB_NAME}`;
        await mongoose.connect(url);
    }

    private initializeMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cors()).use(express.json()).options('*', cors());
    }

    private initializeControllers() {
        this.controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    listen() {
        this.app.listen(SERVER_PORT, () => {
            console.log(`[server]: running at http://localhost:${SERVER_PORT}`);
        });
    }
}

export default App;

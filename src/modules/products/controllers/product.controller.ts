import * as express from 'express';

import {
    isChangeProductStockValid,
    isProductValid,
    mapProduct,
    RawProduct,
} from '../interfaces/product.interface';
import Controller from '../../../utils/controller.interface';
import { zodErrorMessage } from '../../../utils/errorMessages';
import { ERROR_TYPES } from '../../../utils/errorTypes';
import { HTTP_STATUS } from '../../../utils/httpStatuses';
import { AddProductCommandHandler } from '../commands/add-product-command.handler';
import { GetProductsQueryHandler } from '../queries/get-products-query.handler';
import { RestockProductsCommandHandler } from '../commands/restock-products-command.handler';
import { SellProductsCommandHandler } from '../commands/sell-products-command.handler';

class ProductsController implements Controller {
    public path: string;
    public router: express.Router;
    private readonly addProductCommandHandler: AddProductCommandHandler
    private readonly getProductsCommandHandler: GetProductsQueryHandler
    private readonly restockProductCommandHandler: RestockProductsCommandHandler
    private readonly sellProductCommandHandler: SellProductsCommandHandler

    constructor() {
        this.path = '/products';
        this.router = express.Router();
        this.addProductCommandHandler = new AddProductCommandHandler()
        this.getProductsCommandHandler = new GetProductsQueryHandler()
        this.restockProductCommandHandler = new RestockProductsCommandHandler()
        this.sellProductCommandHandler = new SellProductsCommandHandler()

        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getProducts);
        this.router.post(this.path, this.validateProduct, this.addProduct);
        this.router.post(`${this.path}/:id/restock`, this.isChangeProductStockValid, this.restockProduct);
        this.router.post(`${this.path}/:id/sell`, this.isChangeProductStockValid, this.sellProduct);
    }

    addProduct = async (req: express.Request, res: express.Response) => {
        try {
            const productData = req.body;
            const addedProduct: RawProduct = await this.addProductCommandHandler.handle(productData)
            const mappedProduct = mapProduct(addedProduct)

            res.status(HTTP_STATUS.CREATED).send(mappedProduct);
        } catch (e) {
            if (e.name === ERROR_TYPES.ZOD_ERROR) {
                const message = zodErrorMessage(e);

                res.status(HTTP_STATUS.BAD_REQUEST).send({ message });
            } else {
                res.status(HTTP_STATUS.SERVER_ERROR).send(e.message);
            }
        }
    };

    getProducts = async (req: express.Request, res: express.Response) => {
        try {
            const page = Number(req.query.page) ?? 1;
            const size = Number(req.query.size) ?? 5;

            const products: any[] = await this.getProductsCommandHandler.handle(page, size)
            const mappedProducts = products.map(product => mapProduct(product))

            res.status(HTTP_STATUS.OK).send(mappedProducts);
        } catch (e) {
            res.send(e.message).status(HTTP_STATUS.SERVER_ERROR);
        }
    };

    restockProduct = async (req: express.Request, res: express.Response) => {
        try {
            const { amount } = req.body;
            const { id } = req.params;

            const addedProduct = await this.restockProductCommandHandler.handle({ id: id as string, amount})

            res.status(HTTP_STATUS.CREATED).send(addedProduct);
        } catch (e) {
            if (e.name === ERROR_TYPES.ZOD_ERROR) {
                const message = zodErrorMessage(e);

                res.status(HTTP_STATUS.BAD_REQUEST).send({ message });
            } else {
                res.status(HTTP_STATUS.SERVER_ERROR).send(e.message);
            }
        }
    };


    sellProduct = async (req: express.Request, res: express.Response) => {
        try {
            const { amount } = req.body;
            const { id } = req.params

            const removedProduct = await this.sellProductCommandHandler.handle({ id: id as string, amount})

            res.status(HTTP_STATUS.CREATED).send(removedProduct);
        } catch (e) {
            res.status(HTTP_STATUS.SERVER_ERROR).send(e.message);
        }
    };

    validateProduct = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const productData = req.body;
        try {
            isProductValid(productData);
            next();
        } catch(e) {
            res.status(HTTP_STATUS.BAD_REQUEST).send(e.message)
        }
    }

    isChangeProductStockValid = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const sellProductData = req.body;
        try {
            isChangeProductStockValid(sellProductData);
            next();
        } catch(e) {
            res.status(HTTP_STATUS.BAD_REQUEST).send(e.message)
        }
    }
}

export default ProductsController;

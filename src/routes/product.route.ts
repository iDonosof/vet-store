import { Router, Request, Response, NextFunction } from "express";

import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controller/product.controller";
import { private_route } from "../middlewares/jwt.middleware";
import { rights_check } from "../middlewares/role.middleware";
import { Product } from "../models";

const productRouter = Router();

productRouter.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products: Product[] = await getProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

productRouter.get("/:resource_id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { resource_id } = req.params;
        const product: Product = await getProduct(resource_id);
        res.json(product);
    } catch (err) {
        next(err);
    }
});

productRouter.post(
    "/",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const productInputData: Product = req.body;
            const product = createProduct(productInputData);
            res.status(201).json(product);
        } catch (err) {
            next(err);
        }
    }
);

productRouter.put(
    "/:resource_id",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { resource_id } = req.params;
            const productInputData: Product = req.body;
            const product = updateProduct(resource_id, productInputData);
            res.json(product);
        } catch (err) {
            next(err);
        }
    }
);
productRouter.delete(
    "/:resource_id",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { resource_id } = req.params;
            const product: Product = await deleteProduct(resource_id);
            res.json(product);
        } catch (err) {
            next(err);
        }
    }
);

export default productRouter;

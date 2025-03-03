import { NextFunction, Request, Response, Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from "../controller/category.controller";
import { private_route } from "../middlewares/jwt.middleware";
import { rights_check } from "../middlewares/role.middleware";
import { Category } from "../models";

const categoryRouter = Router();

categoryRouter.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await getCategories();
        res.json(categories);
    } catch (err) {
        next(err);
    }
});

categoryRouter.get("/:resource_id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { resource_id } = req.params;
        const category = await getCategory(resource_id);
        res.json(category);
    } catch (err) {
        next(err);
    }
});

categoryRouter.post(
    "/",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categoryInputData: Category = req.body;
            const category = await createCategory(categoryInputData);
            res.status(201).json(category);
        } catch (err) {
            next(err);
        }
    }
);

categoryRouter.put(
    "/:resource_id",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { resource_id } = req.params;
            const categoryInputDate: Category = req.body;
            const category = await updateCategory(resource_id, categoryInputDate);
            res.json(category);
        } catch (err) {
            next(err);
        }
    }
);

categoryRouter.delete(
    "/:resource_id",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { resource_id } = req.params;
            const category = await deleteCategory(resource_id);
            res.json(category);
        } catch (err) {
            next(err);
        }
    }
);

export default categoryRouter;

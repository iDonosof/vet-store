import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from "../controller/category.controller";
import { private_route } from "../middlewares/jwt.middleware";
import { rights_check } from "../middlewares/role.middleware";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:resource_id", getCategory);
categoryRouter.post("/", private_route, rights_check, createCategory);
categoryRouter.put("/:resource_id", private_route, rights_check, updateCategory);
categoryRouter.delete("/:resource_id", private_route, rights_check, deleteCategory);

export default categoryRouter;

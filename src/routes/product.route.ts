import { Router } from "express";

import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controller/product.controller";
import { private_route } from "../middlewares/jwt.middleware";
import { rights_check } from "../middlewares/role.middleware";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get(":resource_id", getProduct);
productRouter.post("/", private_route, rights_check, createProduct);
productRouter.put("/:resource_id", private_route, rights_check, updateProduct);
productRouter.delete("/:resource_id", private_route, rights_check, deleteProduct);

export default productRouter;

import express, { Express, Router } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { createServer } from "http";

import { DEFAULT_PORT } from "./config/enviroment";
import sync_database from "./models";

import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/product.route";

import error_handling from "./middlewares/error_handling.middleware";

const app: Express = express();
const rootRouter: Router = Router();
const httpServer = createServer(app);

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public"))); // TODO: Server the static files
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1", rootRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/category", categoryRouter);
rootRouter.use("product", productRouter);
// TODO: Create the routes to chat

app.use(error_handling);

httpServer.listen(DEFAULT_PORT, (): void => {
    console.log(`Server is running on port ${DEFAULT_PORT}`);
    sync_database();
});

import { NextFunction, Request, Response } from "express";
import NotFoundError from "../error/NotFoundError";
import BadRequestError from "../error/BadRequestError";

export default (err: Error, _req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof NotFoundError || err instanceof BadRequestError) {
        res.statusMessage = err.message;
        res.status(err.status).send();
        return;
    }
    res.status(500).json({ message: "Internal Server Error" });
};

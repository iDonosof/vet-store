import { Request, Response } from "express";

export default (err: Error, req: Request, res: Response): void => {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
};

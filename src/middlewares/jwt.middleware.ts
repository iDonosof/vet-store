import { Request, Response, NextFunction } from "express";
import { validate_token } from "../utils/jwt";
import { User } from "../models";
import { JwtPayload } from "jsonwebtoken";

export const private_route = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authorization: string | undefined = req.headers.authorization;

    if (!authorization) {
        res.status(401).json({ message: "No authorization token" });
        return;
    }

    const token: string = authorization.split(" ")[1];
    let decodedToken: JwtPayload | undefined;
    try {
        decodedToken = validate_token(token);
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
    
    if (!decodedToken) {
        res.status(401).json({ message: "Unauthorized - Invalid token" });
        return;
    }

    const resource_id: string | undefined = decodedToken.resource_id;
    if (!resource_id) {
        res.status(400).json({ message: "Invalid token structure: resource_id is missing" });
    }

    try {
        const user: User | null = await User.findOne({ where: { resource_id } });
        
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        req.user = user;
        
        next();
    } catch {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

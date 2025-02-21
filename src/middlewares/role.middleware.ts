import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import Role from "../types/role";
import roles from "../common/roles";

const actions: { [key: string]: string } = {
    GET: "read",
    POST: "create",
    PUT: "update",
    DELETE: "delete",
};

export const rights_check = (req: Request, res: Response, next: NextFunction) => {
    const resource: string = req.baseUrl.split("/").pop()?.replace(/\?.*/g, "") || "";
    const action: string = actions[req.method];

    const user: User | undefined = req.user;

    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const roleId: number = user.role_id;

    const userRole: Role | undefined = Object.values(roles).find((role: Role) => role.id === roleId);

    if (!userRole) {
        res.status(500).json({ error: "Role not found" });
        return;
    }

    if (userRole.rights.includes(`${action}_${resource}`)) {
        next();
    } else {
        res.status(403).json({ error: "You don't have permission to access this resource" });
    }
};

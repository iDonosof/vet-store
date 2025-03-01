import { NextFunction, Request, Response, Router } from "express";
import {
    signUp,
    signIn,
    GetRoles,
    getProfile,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getStatus,
    updateProfile,
    deleteProfile,
    getUser,
} from "../controller/user.controller";
import { private_route } from "../middlewares/jwt.middleware";
import { rights_check } from "../middlewares/role.middleware";
import { User } from "../models";
import Role from "../types/role";
import Status from "../types/Status";

const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userInputData: User = req.body;
        const user: User = await signUp(userInputData);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

userRouter.post("/signin", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userInputData: User = req.body;
        const token: string = await signIn(userInputData);
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
});

userRouter.get(
    "/roles",
    private_route,
    rights_check,
    async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roles: Role[] = await GetRoles();
            res.json(roles);
        } catch (err) {
            next(err);
        }
    }
);

userRouter.get(
    "/status",
    private_route,
    rights_check,
    async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const status: Status[] = await getStatus();
            res.json(status);
        } catch (err) {
            next(err);
        }
    }
);

userRouter.get("/profile", private_route, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.user?.resource_id;
        const user: User = await getProfile(resource_id);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

userRouter.put("/profile", private_route, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.user?.resource_id;
        const userInputData: User = req.body;
        const user: User = await updateProfile(resource_id, userInputData);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

userRouter.delete("/profile", private_route, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.user?.resource_id;
        const user: User = await deleteProfile(resource_id);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

userRouter.get(
    "/",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await getUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }
);

userRouter.get(
    "/:resource_id",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const resource_id: string | undefined = req.params?.resource_id;
            const user = await getUser(resource_id);
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
);
userRouter.post(
    "/",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userInputData: User = req.body;
            const user: User = await createUser(userInputData);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }
);

userRouter.put(
    "/:resource_id",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const resource_id: string | undefined = req.params?.resource_id;
            const userInputData: User = req.body;
            const user: User = await updateUser(resource_id, userInputData);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }
);
userRouter.delete(
    "/:resource_id",
    private_route,
    rights_check,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const resource_id: string | undefined = req.params?.resource_id;
            const user: User = await deleteUser(resource_id);
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
);

export default userRouter;

import { Router } from "express";
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

const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

userRouter.get("/roles", private_route, rights_check, GetRoles);

userRouter.get("/status", private_route, rights_check, getStatus);

userRouter.get("/profile", private_route, getProfile);
userRouter.put("/profile", private_route, updateProfile);
userRouter.delete("/profile", private_route, deleteProfile);

userRouter.get("/", private_route, rights_check, getUsers);
userRouter.get("/:resource_id", private_route, rights_check, getUser);
userRouter.post("/", private_route, rights_check, createUser);
userRouter.put("/:resource_id", private_route, rights_check, updateUser);
userRouter.delete("/:resource_id", private_route, rights_check, deleteUser);



export default userRouter;

import { NextFunction, Request, Response } from "express";

import { isValidInputs } from "../utils/validations";
import { compare } from "../utils/encrypt";
import { generate_token } from "../utils/jwt";

import { USER_STATUS } from "../common/status";
import roles from "../common/roles";

import { User } from "../models";

import BadRequestError from "../error/BadRequestError";
import NotFoundError from "../error/NotFoundError";

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password, first_name, last_name, email, phone_number }: User = req.body;
        if (!isValidInputs({ username, password, first_name, last_name, email, phone_number })) {
            throw new BadRequestError("Invalid input data");
        }

        const user = await User.create({
            username,
            password,
            first_name,
            last_name,
            email,
            phone_number,
            role_id: roles.Client.id,
            status: USER_STATUS.ENABLED.id,
        });
        user.password = "";

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password }: User = req.body;

        if (!isValidInputs({ username, password })) {
            throw new BadRequestError("Invalid input data");
        }

        const user = await User.findOne({ where: { username }, attributes: ["username", "password", "resource_id"] });

        if (!user) {
            throw new NotFoundError("Username or password invalid");
        }

        if (user.status === USER_STATUS.DISABLED.id || user.status === USER_STATUS.BLOCKED.id) {
            throw new BadRequestError("User is disabled or blocked");
        }

        if (!(await compare(password, user.password))) {
            throw new NotFoundError("Username or password invalid");
        }

        res.status(200).json({
            token: generate_token({ resource_id: user.resource_id }),
        });
    } catch (err) {
        next(err);
    }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users: User[] = await User.findAll({ attributes: { exclude: ["password"] } });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.params?.resource_id;
        if (!resource_id) {
            throw new BadRequestError("Resource id is required");
        }

        const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
        if (!user) {
            throw new NotFoundError("User not found");
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password, first_name, last_name, email, phone_number, role_id }: User = req.body;

        if (!isValidInputs({ username, password, first_name, last_name, email, phone_number, role_id })) {
            throw new BadRequestError("Invalid input data");
        }

        const newUser: User = await User.create({
            username,
            password,
            first_name,
            last_name,
            email,
            phone_number,
            role_id,
            status: USER_STATUS.ENABLED.id,
        });

        newUser.password = "";
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.params?.resource_id;
        if (!resource_id) {
            throw new BadRequestError("Resource id is required");
        }

        const { first_name, last_name, email, phone_number, role_id, status }: User = req.body;

        if (!isValidInputs({ first_name, last_name, email, phone_number, role_id, status })) {
            throw new BadRequestError("Invalid input data");
        }

        const user: User | null = await User.findOne({
            where: { resource_id },
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        user.phone_number = phone_number;
        user.role_id = role_id;
        user.status = status;

        await user.save();
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.params?.resource_id;
        if (!resource_id) {
            throw new BadRequestError("Resource id i required");
        }

        const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        user.status = USER_STATUS.DISABLED.id;
        await user.save();
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.user?.resource_id;

        const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.user?.resource_id;
        const { first_name, last_name, email, phone_number, role_id, status }: User = req.body;

        if (!isValidInputs({ first_name, last_name, email, phone_number, role_id, status })) {
            throw new BadRequestError("Invalid input data");
        }

        const user: User | null = await User.findOne({
            where: { resource_id },
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        user.phone_number = phone_number;
        user.role_id = role_id;
        user.status = status;

        await user.save();
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const deleteProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const resource_id: string | undefined = req.user?.resource_id;
        const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        user.status = USER_STATUS.DISABLED.id;
        await user.save();
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const GetRoles = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.json(Object.values(roles));
    } catch (err) {
        next(err);
    }
};

export const getStatus = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.json(Object.values(USER_STATUS));
    } catch (err) {
        next(err);
    }
};

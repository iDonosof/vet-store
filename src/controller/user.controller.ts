import { Request, Response } from "express";

import { isValidInputs } from "../utils/validations";
import { compare } from "../utils/encrypt";
import { generate_token } from "../utils/jwt";

import { USER_STATUS } from "../common/status";
import roles from "../common/roles";

import { User } from "../models";

export const signUp = async (req: Request, res: Response): Promise<void> => {
    const { username, password, first_name, last_name, email, phone_number }: User = req.body;

    if (!isValidInputs({ username, password, first_name, last_name, email, phone_number })) {
        res.status(400).json({ error: "Invalid input data" });
        return;
    }

    await User.create({
        username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        role_id: roles.Client.id,
        status: USER_STATUS.ENABLED.id,
    });

    res.status(201).json({ message: "User created successfully" });
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
    const { username, password }: User = req.body;

    if (!isValidInputs({ username, password })) {
        res.status(400).json({ error: "Invalid input data" });
        return;
    }

    const user = await User.findOne({ where: { username }, attributes: ["username", "password", "resource_id"] });

    if (!user) {
        res.status(404).json({ error: "Username doesn't exists" });
        return;
    }

    if (user.status === USER_STATUS.DISABLED.id || user.status === USER_STATUS.BLOCKED.id) {
        res.status(400).json({ error: "User is disabled or blocked" });
        return;
    }

    if (!(await compare(password, user.password))) {
        res.status(400).json({ error: "Password is incorrect" });
        return;
    }

    res.status(200).json({
        token: generate_token({ resource_id: user.resource_id }),
    });
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
    const users: User[] = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const resource_id: string | undefined = req.params?.resource_id;
    if (!resource_id) {
        res.status(400).json({ error: "Resource id is required" });
        return;
    }

    const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json(user);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password, first_name, last_name, email, phone_number, role_id }: User = req.body;

    if (!isValidInputs({ username, password, first_name, last_name, email, phone_number, role_id })) {
        res.status(400).json({ error: "Invalid input data" });
        return;
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
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const resource_id: string | undefined = req.params?.resource_id;
    if (!resource_id) {
        res.status(400).json({ error: "Resource id is required" });
        return;
    }

    const { first_name, last_name, email, phone_number, role_id, status }: User = req.body;

    if (!isValidInputs({ first_name, last_name, email, phone_number, role_id, status })) {
        res.status(400).json({ error: "Invalid input data" });
        return;
    }

    const user: User | null = await User.findOne({
        where: { resource_id },
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.phone_number = phone_number;
    user.role_id = role_id;
    user.status = status;

    await user.save();
    res.json(user);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const resource_id: string | undefined = req.params?.resource_id;
    if (!resource_id) {
        res.status(400).json({ error: "Resource id is required" });
        return;
    }

    const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    user.status = USER_STATUS.DISABLED.id;
    await user.save();
    res.json(user);
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const resource_id: string | undefined = req.user?.resource_id;

    const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json(user);
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const resource_id: string | undefined = req.user?.resource_id;
    const { first_name, last_name, email, phone_number, role_id, status }: User = req.body;

    if (!isValidInputs({ first_name, last_name, email, phone_number, role_id, status })) {
        res.status(400).json({ error: "Invalid input data" });
        return;
    }

    const user: User | null = await User.findOne({
        where: { resource_id },
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.phone_number = phone_number;
    user.role_id = role_id;
    user.status = status;

    await user.save();
    res.json(user);
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
    const resource_id: string | undefined = req.user?.resource_id;
    const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    user.status = USER_STATUS.DISABLED.id;
    await user.save();
    res.json(user);
};

export const GetRoles = async (_req: Request, res: Response): Promise<void> => {
    res.json(Object.values(roles));
};

export const getStatus = async (_req: Request, res: Response): Promise<void> => {
    res.json(Object.values(USER_STATUS));
};

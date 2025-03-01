import { isValidInputs } from "../utils/validations";
import { compare } from "../utils/encrypt";
import { generate_token } from "../utils/jwt";

import { USER_STATUS } from "../common/status";
import roles from "../common/roles";

import { User } from "../models";

import BadRequestError from "../error/BadRequestError";
import NotFoundError from "../error/NotFoundError";
import Role from "../types/role";
import Status from "../types/Status";

export const signUp = async ({
    username,
    password,
    first_name,
    last_name,
    email,
    phone_number,
}: User): Promise<User> => {
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

    return user;
};

export const signIn = async ({ username, password }: User): Promise<string> => {
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

    return generate_token({ resource_id: user.resource_id });
};

export const getUsers = async (): Promise<User[]> => {
    const users: User[] = await User.findAll({ attributes: { exclude: ["password"] } });
    return users;
};

export const getUser = async (resource_id: string | undefined): Promise<User> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id is required");
    }

    const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
};

export const createUser = async ({
    username,
    password,
    first_name,
    last_name,
    email,
    phone_number,
    role_id,
}: User): Promise<User> => {
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
    return newUser;
};

export const updateUser = async (
    resource_id: string | undefined,
    { first_name, last_name, email, phone_number, role_id, status }: User
): Promise<User> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id is required");
    }
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
    return user;
};

export const deleteUser = async (resource_id: string | undefined): Promise<User> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id i required");
    }

    const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
    if (!user) {
        throw new NotFoundError("User not found");
    }
    user.status = USER_STATUS.DISABLED.id;
    await user.save();
    return user;
};

export const getProfile = async (resource_id: string | undefined): Promise<User> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id is required");
    }
    const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return user;
};

export const updateProfile = async (
    resource_id: string | undefined,
    { first_name, last_name, email, phone_number, role_id, status }: User
): Promise<User> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id is required");
    }
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
    return user;
};

export const deleteProfile = async (resource_id: string | undefined): Promise<User> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id is required");
    }
    const user: User | null = await User.findOne({ where: { resource_id }, attributes: { exclude: ["password"] } });
    if (!user) {
        throw new NotFoundError("User not found");
    }
    user.status = USER_STATUS.DISABLED.id;
    await user.save();
    return user;
};

export const GetRoles = async (): Promise<Role[]> => {
    return Object.values(roles);
};

export const getStatus = async (): Promise<Status[]> => {
    return Object.values(USER_STATUS);
};

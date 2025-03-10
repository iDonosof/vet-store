import { signUp, signIn, getUsers, getUser } from "../../controller/user.controller";

import User from "../../models/user.model";

import { USER_STATUS } from "../../common/status";
import roles from "../../common/roles";

import { compare } from "../../utils/encrypt";
import { isValidInputs } from "../../utils/validations";
import { generate_token } from "../../utils/jwt";

import BadRequestError from "../../error/BadRequestError";
import NotFoundError from "../../error/NotFoundError";
import UnauthorizedError from "../../error/UnauthorizedError";

jest.mock("../../utils/validations");
jest.mock("../../models/user.model");
jest.mock("../../utils/encrypt");
jest.mock("../../utils/jwt");

describe("UserController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("signUp function", () => {
        const userMock: User = new User({
            id: 1,
            resource_id: "123",
            username: "username",
            password: "asd123asd",
            first_name: "firstname",
            last_name: "lastname",
            email: "email@email.com",
            phone_number: "+56912345678",
            status: USER_STATUS.ENABLED.id,
            role_id: roles.Client.id,
        });

        it("should create a new client user", async () => {
            (isValidInputs as jest.Mock).mockReturnValue(true);
            (User.create as jest.Mock).mockResolvedValue(userMock);

            const user = await signUp(userMock);

            userMock.password = "";

            expect(User.create).toHaveBeenCalledTimes(1);
            expect(user).toEqual(userMock);
        });

        it("should throw a BadRequestError if the inputs are invalid", async () => {
            (isValidInputs as jest.Mock).mockReturnValue(false);
            await expect(signUp(userMock)).rejects.toThrow(BadRequestError);
        });
    });

    describe("signIn function", () => {
        const userMock: User = new User({
            id: 1,
            resource_id: "123",
            username: "username",
            password: "asd123asd",
            first_name: "firstname",
            last_name: "lastname",
            email: "email@email.com",
            phone_number: "+56912345678",
            status: USER_STATUS.ENABLED.id,
            role_id: roles.Client.id,
        });

        it("should generate the token", async () => {
            const username: string = "username";
            const password: string = "asd123asd";
            (isValidInputs as jest.Mock).mockReturnValue(true);
            (User.findOne as jest.Mock).mockResolvedValue(userMock);
            (compare as jest.Mock).mockResolvedValue(true);
            (generate_token as jest.Mock).mockReturnValue("token");

            expect(await signIn(username, password)).toEqual("token");
        });

        it("should throw a BadRequestError if the inputs are invalid", async () => {
            const username: string = "username";
            const password: string = "";
            (isValidInputs as jest.Mock).mockReturnValue(false);
            await expect(signIn(username, password)).rejects.toThrow(BadRequestError);
        });

        it("should throw a NotFoundError if the user does not exist", async () => {
            const username: string = "username";
            const password: string = "";
            (isValidInputs as jest.Mock).mockReturnValue(true);
            (User.findOne as jest.Mock).mockResolvedValue(null);
            await expect(signIn(username, password)).rejects.toThrow(NotFoundError);
        });

        it("should throw an UnauthorizedError if the password is incorrect", async () => {
            const username: string = "username";
            const password: string = "123";
            (isValidInputs as jest.Mock).mockReturnValue(true);
            (User.findOne as jest.Mock).mockResolvedValue(userMock);
            (compare as jest.Mock).mockResolvedValue(false);
            await expect(signIn(username, password)).rejects.toThrow(UnauthorizedError);
        });
    });

    describe("getUsers function", () => {
        it("should return all users", async () => {
            const usersMock: User[] = [
                new User({
                    id: 1,
                    resource_id: "123",
                    username: "username",
                    password: "asd123asd",
                    first_name: "firstname",
                    last_name: "lastname",
                    email: "email@email.com",
                    phone_number: "+56912345678",
                    status: USER_STATUS.ENABLED.id,
                    role_id: roles.Client.id,
                }),
                new User({
                    id: 2,
                    resource_id: "1234",
                    username: "username2",
                    password: "asd123asd",
                    first_name: "firstname2",
                    last_name: "lastname2",
                    email: "email@email.com",
                    phone_number: "+56912345678",
                    status: USER_STATUS.ENABLED.id,
                    role_id: roles.Client.id,
                }),
            ];
            (User.findAll as jest.Mock).mockResolvedValue(usersMock);
            expect(await getUsers()).toEqual(usersMock);
        });
    });

    describe("getUser function", () => {
        const userMock: User = new User({
            id: 1,
            resource_id: "123",
            username: "username",
            password: "asd123asd",
            first_name: "firstname",
            last_name: "lastname",
            email: "email@email.com",
            phone_number: "+56912345678",
            status: USER_STATUS.ENABLED.id,
            role_id: roles.Client.id,
        });

        it("should return a user", async () => {
            const resource_id: string = "123";
            (User.findOne as jest.Mock).mockResolvedValue(userMock);
            expect(await getUser(resource_id)).toEqual(userMock);
        });

        it("should throw a BadRequestError if the resource_id is not provided", async() => {
            const resource_id: string  = "";
            await expect(getUser(resource_id)).rejects.toThrow(BadRequestError);
        });

        it("should throw a NotFoundError if the user is not found", async () => {
            const resource_id: string = "123";
            (User.findOne as jest.Mock).mockResolvedValue(null);
            await expect(getUser(resource_id)).rejects.toThrow(NotFoundError);
        });
    })
});

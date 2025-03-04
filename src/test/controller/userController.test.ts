import { signUp } from "../../controller/user.controller";
import User from "../../models/user.model";
import BadRequestError from "../../error/BadRequestError";
import { isValidInputs } from "../../utils/validations";

jest.mock("../../utils/validations", () => ({
    isValidInputs: jest.fn(),
}));

describe("UserController", () => {
    describe("signUp function", () => {
        let mockCreateUser: Partial<User>;

        beforeEach(() => {
            mockCreateUser = {
                id: 1,
                resource_id: "res-123",
                username: "testuser",
                password: "hashedpassword",
                first_name: "John",
                last_name: "Doe",
                email: "test@example.com",
                phone_number: "1234567890",
                status: 1,
                role_id: 5,
            };

            jest.spyOn(User, "create");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe("when input data is valid", () => {
            beforeEach(() => {
                (isValidInputs as jest.Mock).mockReturnValue(true);
            });

            it("should create a user", async () => {
                (User.create as jest.Mock).mockResolvedValue(mockCreateUser);

                const result = await signUp(mockCreateUser as User);

                expect(result).toStrictEqual({
                    ...mockCreateUser,
                    password: "",
                });

                expect(User.create).toHaveBeenCalledWith(mockCreateUser);
            });

            it("should throw an error if User.create fails", async () => {
                (User.create as jest.Mock).mockRejectedValue(new Error("Database error"));

                await expect(signUp(mockCreateUser as User)).rejects.toThrow("Database error");
                expect(User.create).toHaveBeenCalledTimes(1);
            });
        });

        describe("when input data is invalid", () => {
            beforeEach(() => {
                (isValidInputs as jest.Mock).mockReturnValue(false);
            });

            it("should throw BadRequestError when input validation fails", async () => {
                await expect(signUp(mockCreateUser as User)).rejects.toThrow(BadRequestError);
                expect(User.create).not.toHaveBeenCalled();
            });
        });
    });

    describe("signIn function", () => {
        // TODO: Implement tests for signIn...
    });
});

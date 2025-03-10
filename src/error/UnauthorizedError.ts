export default class UnauthorizedError extends Error {
    declare status: number;
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
        this.status = 401;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    toJson() {
        return {
            message: this.message,
        };
    }
}

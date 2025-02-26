export default class NotFoundError extends Error {
    declare status: number;
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        this.status = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    toJson() {
        return {
            message: this.message,
        };
    }
}

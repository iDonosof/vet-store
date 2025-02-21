import dotenv from "dotenv";
dotenv.config();

const { DEFAULT_PORT = "", DB_PASSWORD = "", DB_USER = "", DB_HOST = "", DB_NAME = "", JWT_SECRET = "" } = process.env;

export { DEFAULT_PORT, DB_PASSWORD, DB_USER, DB_HOST, DB_NAME, JWT_SECRET };

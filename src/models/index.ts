import connection from "../database/connection";

import User from "./user.model";
import Product from "./product.model";
import Category from "./category.model";

const sync_database = async (force: boolean = false) => {
    try {
        await connection.sync({ force });
        console.log("Tables created");
    } catch (err: unknown) {
        throw new Error("Failed to sync database. " + String(err));
    }
};

Product.belongsTo(Category, {
    foreignKey: "category_id",
    targetKey: "id",
    as: "category",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

export default sync_database;
export { User, Product, Category };

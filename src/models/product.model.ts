import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import connection from "../database/connection";
import { MINIMUM_PRICE_ALLOWED, MINIMUM_STOCK_ALLOWED } from "../common/constants";

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: CreationOptional<number>;
    declare resource_id: CreationOptional<string>;
    declare product_name: string;
    declare product_description: string;
    declare product_price: number;
    declare category_id: number;
    declare stock: number;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        resource_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: MINIMUM_PRICE_ALLOWED,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: MINIMUM_STOCK_ALLOWED,
        },
    },
    {
        sequelize: connection,
        modelName: "product",
        timestamps: false,
    }
);

export default Product;

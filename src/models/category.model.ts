import connection from "../database/connection";
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from "sequelize";
import { generateUUID } from "../utils/uuid";

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    declare id: CreationOptional<number>;
    declare resource_id: CreationOptional<string>;
    declare name: string;
    declare description: string;
    declare status: number;
}

Category.init(
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize: connection,
        modelName: "category",
        timestamps: false,
    }
);

Category.beforeCreate(async (category: Category) => {
    category.resource_id = generateUUID();
});

export default Category;

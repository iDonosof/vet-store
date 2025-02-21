import connection from "../database/connection";
import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional } from "sequelize";
import { generateUUID } from "../utils/uuid";
import { encrypt } from "../utils/encrypt";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare resource_id: CreationOptional<string>;
    declare username: string;
    declare password: string;
    declare first_name: string;
    declare last_name: string;
    declare email: string;
    declare phone_number: string;
    declare status: number;
    declare role_id: number;
}

User.init(
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
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: "user",
        timestamps: false,
    }
);

User.beforeCreate(async (user: User) => {
    user.resource_id = generateUUID();
    user.password = await encrypt(user.password);
});

export default User;

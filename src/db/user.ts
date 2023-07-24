import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { db } from './init';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id?: number;
    declare name: string;
    declare openID?: string;
    declare tenant?: string;
    declare unionID?: string;
    declare password?: string;
    declare permission?: number;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    openID: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    tenant: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    unionID: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    permission: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
}, {
    sequelize: db,
})

User.sync({force: true});
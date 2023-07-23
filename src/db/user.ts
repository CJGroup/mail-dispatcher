import { DataTypes, Model } from "sequelize";
import { db } from './init';

export class User extends Model {
    declare id: number;
    declare name: string;
    declare openID: string;
    declare tenant: string;
    declare unionID: string;
    declare admin: boolean;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    openID: DataTypes.STRING,
    tenant: DataTypes.STRING,
    unionID: DataTypes.STRING,
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize: db,
})

User.sync();
import { DataTypes, Model } from "sequelize";

import { db } from '.';

export class User extends Model {
    declare id: number;
    declare name: string;
    declare openID: string;
    declare tenant: string;
    declare unionID: string;
    declare permission: number;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }
}, {
    sequelize: db,
})

User.sync();
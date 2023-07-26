import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
} from 'sequelize';
import { db } from './init'

export class Record extends Model<InferAttributes<Record>,InferCreationAttributes<Record>> {
    declare id?: number;
    declare nickname: string;
    declare mail: string;
    declare time: Date;
}

Record.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize: db,
});

Record.sync({alter: true})
import { DataTypes, Model } from "sequelize";
import { db } from "./init";

export class Player extends Model {
  declare id: number;
  declare nickname: string;
  declare mail: string;
  declare serverID?: string;
  declare isValidated?: boolean;
}

Player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    serverID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isValidated: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  { sequelize: db }
);

Player.sync({ alter: true });

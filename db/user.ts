import { Model, DataTypes } from "sequelize";
import { sequelize } from ".";

export class User extends Model {}
User.init(
  {
    email: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    birthdate: { type: DataTypes.DATE },
  },
  { sequelize, modelName: "User" }
);

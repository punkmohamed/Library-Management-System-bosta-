import { DataTypes, Model } from 'sequelize';
import { getSequelize } from './sequelize-helper';
import { UserAttributes, UserCreationAttributes } from '../interfaces/user.interface';

const sequelize = getSequelize();

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public full_name!: string;
  public password?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['email'],
        unique: true,
      },
      {
        fields: ['full_name'],
      },
    ],
  }
);

export default User;

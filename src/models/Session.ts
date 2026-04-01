import { DataTypes, Model } from 'sequelize';
import { getSequelize } from './sequelize-helper';
import { SessionAttributes, SessionCreationAttributes } from '../interfaces/session.interface';

const sequelize = getSequelize()

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: string;
  public user_id!: string;
  public refresh_token?: string | null;
  public expires_at?: Date | null;
  public ip_address?: string | null;
  public user_agent?: string | null;
  public readonly created_at!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['refresh_token'],
      },
    ],
  }
);

export default Session;

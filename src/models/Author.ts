import { DataTypes, Model } from 'sequelize';
import { getSequelize } from './sequelize-helper';
import { AuthorAttributes, AuthorCreationAttributes } from '../interfaces/author.interface';

const sequelize = getSequelize();

class Author extends Model<AuthorAttributes, AuthorCreationAttributes> implements AuthorAttributes {
  public id!: string;
  public name!: string;
  public bio?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Author.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'authors',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['name'],
      },
    ],
  }
);

export default Author;

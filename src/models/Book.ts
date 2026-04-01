import { DataTypes, Model } from 'sequelize';
import { getSequelize } from './sequelize-helper';
import { BookAttributes, BookCreationAttributes } from '../interfaces/book.interface';

const sequelize = getSequelize();

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: string;
  public title!: string;
  public isbn!: string;
  public author_id!: string;
  public total_copies!: number;
  public available_copies!: number;
  public shelf_location!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total_copies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    available_copies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    shelf_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['title'],
      },
      {
        fields: ['author_id'],
      },
      {
        fields: ['isbn'],
        unique: true,
      },
    ],
  }
);

export default Book;

import { DataTypes, Model } from 'sequelize';
import { getSequelize } from './sequelize-helper';
import { BorrowRecordAttributes, BorrowRecordCreationAttributes } from '../interfaces/borrow-record.interface';

const sequelize = getSequelize();

class BorrowRecord extends Model<BorrowRecordAttributes, BorrowRecordCreationAttributes> implements BorrowRecordAttributes {
  public id!: string;
  public user_id!: string;
  public book_id!: string;
  public borrow_date!: Date;
  public return_date?: Date | null;
  public due_date!: Date;
  public status!: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BorrowRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    borrow_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('BORROWED', 'RETURNED', 'OVERDUE'),
      allowNull: false,
      defaultValue: 'BORROWED',
    },
  },
  {
    sequelize,
    tableName: 'borrow_records',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['book_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['due_date'],
      },
    ],
  }
);

export default BorrowRecord;

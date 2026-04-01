import { Optional } from 'sequelize';

export interface BorrowRecordAttributes {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: Date;
  return_date?: Date | null;
  due_date: Date;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  created_at?: Date;
  updated_at?: Date;
}

export interface BorrowRecordCreationAttributes extends Optional<BorrowRecordAttributes, 'id' | 'borrow_date' | 'return_date' | 'status' | 'created_at' | 'updated_at'> {}

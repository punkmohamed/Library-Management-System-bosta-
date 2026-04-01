import { getSequelize } from "./sequelize-helper";
import Session from "./Session";
import User from "./User";
import Author from "./Author";
import Book from "./Book";
import BorrowRecord from "./BorrowRecord";

const sequelize = getSequelize();

User.hasMany(Session, { foreignKey: 'user_id', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Author.hasMany(Book, { foreignKey: 'author_id', as: 'books' });
Book.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });

User.hasMany(BorrowRecord, { foreignKey: 'user_id', as: 'borrowRecords' });
BorrowRecord.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Book.hasMany(BorrowRecord, { foreignKey: 'book_id', as: 'borrowRecords' });
BorrowRecord.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

export {
  sequelize,
  Session,
  User,
  Author,
  Book,
  BorrowRecord,
};

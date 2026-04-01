import { Parser } from 'json2csv';
import { BorrowRecord, User, Book, Author } from '../models';
import { Op } from 'sequelize';

export class ReportService {
  /**
   * Export all overdue borrows of the last month as CSV
   */
  static async exportOverdueLastMonth(): Promise<string> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const records = await BorrowRecord.findAll({
      where: {
        status: ['OVERDUE', 'RETURNED'],
        due_date: {
          [Op.gte]: lastMonth,
        },
      },
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email'] },
        { 
          model: Book, 
          as: 'book', 
          attributes: ['title', 'isbn'],
          include: [{ model: Author, as: 'author', attributes: ['name'] }]
        },
      ],
    });

    return this.convertToCSV(records);
  }

  /**
   * Export all borrowing processes of the last month as CSV
   */
  static async exportBorrowingsLastMonth(): Promise<string> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const records = await BorrowRecord.findAll({
      where: {
        borrow_date: {
          [Op.gte]: lastMonth,
        },
      },
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email'] },
        { 
          model: Book, 
          as: 'book', 
          attributes: ['title', 'isbn'],
          include: [{ model: Author, as: 'author', attributes: ['name'] }]
        },
      ],
    });

    return this.convertToCSV(records);
  }

  /**
   * Helper to convert records to CSV
   */
  private static convertToCSV(records: any[]): string {
    const fields = [
      { label: 'Borrow ID', value: 'id' },
      { label: 'Borrower Name', value: 'user.full_name' },
      { label: 'Borrower Email', value: 'user.email' },
      { label: 'Book Title', value: 'book.title' },
      { label: 'Book ISBN', value: 'book.isbn' },
      { label: 'Author', value: 'book.author.name' },
      { label: 'Borrow Date', value: 'borrow_date' },
      { label: 'Due Date', value: 'due_date' },
      { label: 'Return Date', value: 'return_date' },
      { label: 'Status', value: 'status' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(records);
  }
}

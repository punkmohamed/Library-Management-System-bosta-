import { Optional } from 'sequelize';

export interface BookAttributes {
  id: string;
  title: string;
  isbn: string;
  author_id: string;
  total_copies: number;
  available_copies: number;
  shelf_location: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BookCreationAttributes extends Optional<BookAttributes, 'id' | 'created_at' | 'updated_at'> {}

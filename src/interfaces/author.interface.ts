import { Optional } from 'sequelize';

export interface AuthorAttributes {
  id: string;
  name: string;
  bio?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthorCreationAttributes extends Optional<AuthorAttributes, 'id' | 'created_at' | 'updated_at'> {}

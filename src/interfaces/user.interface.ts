import { Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  full_name: string;
  password?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> { }

import { Optional } from 'sequelize';

export interface SessionAttributes {
  id: string;
  user_id: string;
  refresh_token?: string | null;
  expires_at?: Date | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: Date;
}

export interface SessionCreationAttributes extends Optional<SessionAttributes, 'id' | 'created_at'> {}

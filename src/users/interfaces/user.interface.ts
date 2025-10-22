import { UserRole } from '../../entities/user.entities';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  balance: number;
  role: UserRole;
  created_at: Date;
}

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IUpdateUser {
  username?: string;
  email?: string;
  password?: string;
  balance?: number;
  role?: UserRole;
}

export interface IUserResponse {
  id: number;
  username: string;
  email: string;
  balance: number;
  role: UserRole;
  created_at: Date;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUserProfile {
  id: number;
  username: string;
  role: UserRole;
  created_at: Date;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface IChangeEmail {
  newEmail: string;
  password: string;
}

export interface IUpdateBalance {
  amount: number;
  operation: 'add' | 'subtract' | 'set';
  reason?: string;
}

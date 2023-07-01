import { Request } from 'express';
import { User } from '../../../interfaces/users/user/users.interface';

export interface DataStoredInToken {
  id: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface ForgetPassword {
  email: string;
}

export interface ResetPassword {
  id: string;
  password: string;
  confirmPassword?: string;
}

import { TokenData } from '../../../interfaces/users/common.interface';
export interface UserExcludePassword {
  id: String;
  username: string;
  name: string;
  email?: string;
  coverPicture?: string;
  profilePicture?: string;
  bio?: string;
}

export interface User extends UserExcludePassword {
  password: string;
}

export interface UserWithToken extends UserExcludePassword, TokenData {}

export interface UserLogin {
  username: string;
  password: string;
}

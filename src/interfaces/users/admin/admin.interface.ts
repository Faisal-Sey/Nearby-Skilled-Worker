import { TokenData } from '../../../interfaces/users/common.interface';
export interface AdminExcludePassword {
  id: String;
  username: string;
}

export interface Admin extends AdminExcludePassword {
  password: string;
}

export interface AdminWithToken extends AdminExcludePassword, TokenData {}

export interface AdminLogin {
  username: string;
  password: string;
}

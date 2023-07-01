import { TokenData } from '../../../interfaces/users/common.interface';
import jwt from 'jsonwebtoken';
import { AdminExcludePassword } from './../../../interfaces/users/admin/admin.interface';
import { Service } from 'typedi';

@Service()
export class AdminAuthHelpers {
  // Exclude field from data
  public exclude<Admin, Key extends keyof Admin>(admin: Admin, keys: Key[]): Omit<Admin, Key> {
    for (const key of keys) {
      delete admin[key];
    }
    return admin;
  }

  // Generate token for admin
  public generateTokens(admin: AdminExcludePassword): TokenData {
    if (admin) {
      const accessToken = jwt.sign({ ...admin }, process.env.ADMIN_TOKEN_KEY, { expiresIn: '2d' });
      return { token: accessToken, expiresIn: 2 };
    }
    return { token: '', expiresIn: 0 };
  }
}

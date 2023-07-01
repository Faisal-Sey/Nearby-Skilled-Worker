import { TokenData } from '../../../interfaces/users/common.interface';
import jwt from 'jsonwebtoken';
import { UserExcludePassword } from '../../../interfaces/users/user/users.interface';
import { Service } from 'typedi';

@Service()
export class SeekerAuthHelpers {
  // Exclude a field from user data
  public exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  // Generate a token for user
  public generateTokens(user: UserExcludePassword): TokenData {
    if (user) {
      const accessToken = jwt.sign({ ...user }, process.env.TOKEN_KEY, { expiresIn: '2d' });
      return { token: accessToken, expiresIn: 2 };
    }
    return { token: '', expiresIn: 0 };
  }
}
